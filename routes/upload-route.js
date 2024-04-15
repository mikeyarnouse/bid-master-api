require("dotenv").config();
const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile"));
const authorize = require("../middleware/authorize");
const crypto = require("crypto");
const sharp = require("sharp");

const multer = require("multer");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

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

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const randomImageKey = () => crypto.randomBytes(32).toString("hex");

router
  .route("/avatar")
  .post(authorize, upload.single("avatar"), async (req, res) => {
    console.log("req.body", req.body);
    console.log("req.file", req.file);
    console.log("req.user.user_id", req.user.user_id);

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

    await knex("users")
      .where({ user_id: req.user.user_id })
      .update({ avatar_key: image, avatar_url: url });

    const updatedUser = await knex("users")
      .where({ user_id: req.user.user_id })
      .first();

    res.status(201).send({
      message: "Uploaded user avatar successfully!",
      newUserData: updatedUser,
    });
  });

router
  .route("/items/:itemId/image")
  .post(authorize, upload.single("image"), async (req, res) => {
    console.log("req.body", req.body);
    console.log("req.file", req.file);
    console.log("req.user.user_id", req.user.user_id);
    try {
      const image = randomImageKey();

      // const buffer = await sharp(req.file.buffer)
      //   .resize({ height: 680, width: 480, fit: "contain" })
      //   .toBuffer();

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

      await knex("items")
        .where({ item_id: req.params.itemId })
        .update({ image_key: image, image_url: url });

      const updatedItem = await knex("items")
        .where({ item_id: req.params.itemId })
        .first();

      res.status(201).send({
        message: "Uploaded item image successfully!",
        newItemData: updatedItem,
      });
    } catch (e) {
      res.status(400).send({ message: e });
    }
  });
// .get(authorize, async (req, res) => {
//   const item = await knex("items")
//     .where({ item_id: req.parmas.itemId })
//     .first();

//   console.log(item);
//   console.log(item.image_key);

//   const getObjectParams = {
//     Bucket: bucketName,
//     Key: item.image_key,
//   };

//   const command = new GetObjectCommand(getObjectParams);
//   const url = await getSignedUrl(s3, command, { expiresIn: 604800 });

//   await knex("items")
//     .where({ item_id: req.params.itemId })
//     .update({ image_url: url });

//   res.status(201).send({
//     message: "Here is the url link for your uploaded user image!",
//     url: url,
//   });
// });

module.exports = router;
