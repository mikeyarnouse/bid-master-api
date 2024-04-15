require("dotenv").config();
const knex = require("knex")(require("../knexfile"));
const crypto = require("crypto");
const jwt = require("jsonwebtoken"); // Import the JWT library
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { log } = require("console");

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.BUCKET_ACCESS_KEY;
const secretAccessKey = process.env.BUCKET_SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

const randomImageKey = () => crypto.randomBytes(32).toString("hex");

const getItems = async (req, res) => {
  try {
    const items = await knex("items").select(
      "item_id",
      "name",
      "description",
      "image_url",
      "category",
      "start_bid",
      "highest_bid",
      "expiration_date",
      "expiration_time",
      "user_id"
    );
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: "Unable to retrieve user list data" });
  }
};

const getItemById = async (req, res) => {
  try {
    const item = await knex("items")
      .join("users", "users.user_id", "items.user_id")
      .where("item_id", req.params.itemId)
      .select(
        "items.item_id",
        "items.name",
        "items.description",
        "items.image_url",
        "items.category",
        "items.start_bid",
        "items.highest_bid",
        "items.expiration_date",
        "items.expiration_time",
        "items.user_id",
        "users.username"
      );
    if (!item) {
      res
        .status(404)
        .json({ message: `Item with ID ${req.params.itemId} not found` });
    }
    res.json(item);
  } catch (e) {
    res.status(500).json({ message: "Unable to retrieve item data" });
  }
};

const getItemBids = async (req, res) => {
  try {
    const itemBids = await knex("bids")
      .join("users", "users.user_id", "bids.user_id")
      .select(
        "bids.bid_id",
        "bids.amount",
        "bids.timestamp",
        "users.username",
        "bids.user_id",
        "bids.item_id"
      )
      .where("item_id", req.params.itemId);
    res.json(itemBids);
  } catch (e) {
    res.status(500).json({ message: "Unable to retrieve item bids data" });
  }
};

const getItemBidById = async (req, res) => {
  try {
    const itemBid = await knex("bids")
      .where({ item_id: req.params.itemId, bid_id: req.params.bidId })
      .select("bid_id", "amount", "timestamp", "user_id", "item_id");
    if (!itemBid.length) {
      return res.status(404).json({
        message: `Bid with ID ${req.params.bidId} for Item with ID ${req.params.itemId} not found`,
      });
    }
    res.json(itemBid);
  } catch (e) {
    res.status(500).json({ message: "Unable to retrieve item bid data" });
  }
};

const postItem = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.description ||
    !req.body.category ||
    !req.body.start_bid ||
    !req.body.expiration_date ||
    !req.body.expiration_time
  ) {
    return res.status(400).send("Please enter the required fields.");
  }
  console.log(req.body);
  console.log(req.file);

  // const buffer = await sharp(req.file.buffer)
  //   .resize({ height: 1080, width: 1080, fit: "contain" })
  //   .toBuffer();

  // CODE FOR UPLOADING IMAGE TO BID-MASTER S3 BUCKET AND RETRIEVING URL FOR IMAGE
  // -----------------------------------------------------------------------------
  const image = randomImageKey();
  const params = {
    Bucket: bucketName,
    Key: image,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };
  const command = new PutObjectCommand(params);
  await s3.send(command);

  const getObjectParams = {
    Bucket: bucketName,
    Key: image,
  };
  const command2 = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3, command2, { expiresIn: 604800 });
  // -----------------------------------------------------------------------------

  const newItem = {
    name: req.body.name,
    description: req.body.description,
    image_key: image,
    image_url: url,
    category: req.body.category,
    start_bid: req.body.start_bid,
    highest_bid: req.body.start_bid,
    expiration_date: req.body.expiration_date,
    expiration_time: req.body.expiration_time,
    user_id: req.user.user_id,
  };

  try {
    const new_item = await knex("items").insert(newItem);
    console.log(new_item);
    res.status(201).send({ message: "Item Created Successfully" });
  } catch (e) {
    console.error(`Failed to create item: ${e}`);
  }
};

const updateItem = async (req, res) => {
  const { name, description, category } = req.body;

  if (!name || !description || !category) {
    return res.status(400).send("Please enter the required fields.");
  }

  const item = await knex("items")
    .where({ item_id: req.params.itemId })
    .first();

  if (!item) {
    return res.status(400).send("Invalid Item ID");
  }

  let updateItem = {};

  if (req.file) {
    const image = randomImageKey();
    const params = {
      Bucket: bucketName,
      Key: image,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };
    const command = new PutObjectCommand(params);
    await s3.send(command);

    const getObjectParams = {
      Bucket: bucketName,
      Key: image,
    };
    const command2 = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command2, { expiresIn: 604800 });
    // -----------------------------------------------------------------------------
    updateItem = {
      name,
      description,
      category,
      image_key: image,
      image_url: url,
    };
  } else if (req.body.start_bid) {
    updateItem = {
      name,
      description,
      category,
      start_bid: req.body.start_bid,
      highest_bid: req.body.start_bid,
    };
  } else {
    updateItem = {
      name,
      description,
      category,
    };
  }

  try {
    const updatedRows = await knex("items")
      .where({ item_id: req.params.itemId })
      .update(updateItem);

    if (!updatedRows) {
      return res.status(404).json({
        message: `Item with ID ${req.params.itemId} not found`,
      });
    }

    const updatedItem = await knex("items")
      .where({
        item_id: req.params.itemId,
      })
      .first()
      .select("*");

    res
      .status(201)
      .send({ message: "Updated successfully", updatedItem: updatedItem });
  } catch (error) {
    console.log(error);
    res.status(400).send("Failed to update user");
  }
};

const deleteItem = async (req, res) => {
  try {
    const deletedItem = await knex("items")
      .where({ item_id: req.params.itemId })
      .del();
    if (!deletedItem) {
      return res.status(404).json({
        message: `Item with ID ${req.params.itemId} not found`,
      });
    }
    res
      .status(200)
      .json({ message: `Item with ID ${req.params.itemId} has been deleted.` });
  } catch (e) {
    res
      .status(500)
      .json({ message: `Unable to delete item with ID: ${req.params.itemId}` });
  }
};

const postBid = async (req, res) => {
  const amount = Number(req.body.amount);
  console.log(amount);
  let item = await knex("items").where({ item_id: req.params.itemId }).first();
  console.log("item: ", item);
  if (!amount) {
    return res.status(400).send("Please enter the amount for your bid.");
  } else if (isNaN(amount)) {
    return res.status(400).send("Amount must be a number.");
  }

  if (!(amount > Number(item.highest_bid))) {
    return res
      .status(400)
      .send("Please enter an amount greater than the item's highest bid.");
  }

  let user = await knex("users").where({ user_id: req.user.user_id }).first();

  if (user.balance - amount < 0) {
    return res.status(400).send("Not enough balance");
  }

  const newBid = {
    amount: amount,
    user_id: req.user.user_id,
    item_id: req.params.itemId,
  };

  try {
    await knex("bids").insert(newBid);

    await knex("items")
      .where({ item_id: req.params.itemId })
      .update({ highest_bid: newBid.amount });

    let userWithNewBalance = await knex("users")
      .where({ user_id: req.user.user_id })
      .first()
      .update({ balance: user.balance - amount });

    console.log(userWithNewBalance.balance);

    res.json(newBid);
  } catch (e) {
    res.status(500).json({ message: "Unable to create bid.", e });
  }
};

const deleteBid = async (req, res) => {
  try {
    const deletedBid = await knex("bids")
      .where({ bid_id: req.params.bidId })
      .del();
    if (!deletedBid) {
      return res.status(404).json({
        message: `Bid with ID ${req.params.bidId} for Item with ID ${req.params.itemId} not found`,
      });
    }
    res
      .status(200)
      .json({ message: `Bid with ID ${req.params.bidId} has been deleted.` });
  } catch (e) {
    res
      .status(500)
      .json({ message: `Unable to delete bid with ID: ${req.params.bidId}` });
  }
};

const updateItemsHighestBid = async (req, res) => {
  try {
    let items = await knex("items").select("*");
    let updatedItems = items.forEach(async (item) => {
      let itemBids = await knex("bids").where({ item_id: item.item_id });
      for (let i of itemBids) {
        if (i.amount > item.highest_bid) {
          await knex("items")
            .where({ item_id: item.item_id })
            .update({ highest_bid: i.amount });
        }
      }
    });
    res.send(updatedItems);
  } catch (e) {
    res.send({ message: `Error, ${e}` });
  }
};

const deleteBidsLowerThanStartBid = async (req, res) => {
  try {
    let items = await knex("items").select("*");
    let updatedItems = items.forEach(async (item) => {
      let itemBids = await knex("bids").where({ item_id: item.item_id });
      for (let i of itemBids) {
        if (i.amount < item.start_bid) {
          await knex("bids").where({ bid_id: i.bid_id }).del();
        }
      }
    });
    res.send(updatedItems);
  } catch (e) {
    res.send({ message: `Error, ${e}` });
  }
};

module.exports = {
  getItems,
  getItemById,
  getItemBids,
  getItemBidById,
  postItem,
  postBid,
  deleteBid,
  updateItemsHighestBid,
  deleteBidsLowerThanStartBid,
  deleteItem,
  updateItem,
};
