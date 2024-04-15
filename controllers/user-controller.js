const authorize = require("../middleware/authorize");

const knex = require("knex")(require("../knexfile"));
const bcrypt = require("bcryptjs");

const getUsers = async (req, res) => {
  try {
    const users = await knex("users").select(
      "user_id",
      "username",
      "avatar_url",
      "balance",
      "first_name",
      "last_name",
      "street_address",
      "city",
      "country",
      "phone_number",
      "email_address"
    );
    res.json(users);
  } catch (e) {
    res.status(500).json({ message: "Unable to retrieve user list data", e });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await knex("users")
      .where("user_id", req.params.userId)
      .select(
        "user_id",
        "username",
        "avatar_url",
        "balance",
        "first_name",
        "last_name",
        "street_address",
        "city",
        "country",
        "phone_number",
        "email_address"
      );
    if (!user.length) {
      return res
        .status(404)
        .json({ message: `User with ID ${req.params.userId} not found` });
    }
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: "Unable to retrieve user data" });
  }
};

const getUserItems = async (req, res) => {
  try {
    const items = await knex("items")
      .where("user_id", req.params.userId)
      .select(
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
    res.status(500).json({ message: "Unable to retrieve user item data" });
  }
};

const getUserItemById = async (req, res) => {
  try {
    const items = await knex("items")
      .where({ user_id: req.params.userId, item_id: req.params.itemId })
      .select(
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

    if (!items.length) {
      return res.status(404).send({
        message: `Item with ID ${req.params.itemId} for User with ID ${req.params.userId} not found`,
      });
    }
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: "Unable to retrieve user item data" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await knex("users")
      .where({ user_id: req.user.user_id })
      .first();
    delete user.password;
    console.log(user);
    res.json(user);
  } catch (e) {
    return res.status(401).send(e);
  }
};

const updateCurrentUser = async (req, res) => {
  console.log("REQ BODY:", req.body);
  const {
    username,
    current_password,
    new_password,
    balance,
    first_name,
    last_name,
    street_address,
    city,
    country,
    phone_number,
    email_address,
  } = req.body;

  console.log(username);
  console.log(current_password);
  console.log(new_password);
  console.log(balance);
  console.log(first_name);
  console.log(last_name);
  console.log(street_address);
  console.log(city);
  console.log(country);
  console.log(email_address);
  console.log(phone_number);

  if (
    !username ||
    !current_password ||
    // !new_password ||
    !first_name ||
    !last_name ||
    !street_address ||
    !city ||
    !country ||
    !phone_number ||
    !email_address ||
    !balance
  ) {
    return res.status(400).send("Please enter the required fields.");
  }

  console.log(req.user);
  const user = await knex("users").where({ user_id: req.user.user_id }).first();

  if (!user) {
    return res.status(400).send("Invalid Username");
  }
  console.log("user password:", user.password);
  if (user.password.length <= 11) {
    if (current_password !== user.password) {
      return res.status(400).send("Current password doesn't match");
    }
  } else {
    if (!bcrypt.compareSync(current_password, user.password)) {
      return res.status(400).send("Current password doesn't match");
    }
  }

  // Create the new user
  let updatedUser = {};
  if (new_password) {
    const hashedPassword = bcrypt.hashSync(new_password);

    updateUser = {
      username,
      password: hashedPassword, //update password to use new hashed password
      first_name,
      last_name,
      street_address,
      city,
      country,
      phone_number,
      email_address,
      balance,
    };
  } else {
    updateUser = {
      username,
      first_name,
      last_name,
      street_address,
      city,
      country,
      phone_number,
      email_address,
      balance,
    };
  }

  // Insert it into our database
  try {
    const updatedRows = await knex("users")
      .where({ user_id: req.user.user_id })
      .update(updateUser);

    if (!updatedRows) {
      return res.status(404).json({
        message: `User with ID ${req.user.user_id} not found`,
      });
    }

    const updatedUser = await knex("users")
      .where({
        user_id: req.user.user_id,
      })
      .first()
      .select("*");

    res
      .status(201)
      .send({ message: "Updated successfully", updatedUser: updatedUser });
  } catch (error) {
    console.log(error);
    res.status(400).send("Failed to update user");
  }
};

module.exports = {
  getUsers,
  getUserById,
  getUserItems,
  getUserItemById,
  getCurrentUser,
  updateCurrentUser,
};
