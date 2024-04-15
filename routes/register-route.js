const router = require("express").Router();
const knex = require("knex")(require("../knexfile"));
const bcrypt = require("bcryptjs");

router.route("/").post(async (req, res) => {
  const {
    username,
    password,
    confirm_password,
    first_name,
    last_name,
    street_address,
    city,
    country,
    phone_number,
    email_address,
  } = req.body;

  if (
    !username ||
    !password ||
    !confirm_password ||
    !first_name ||
    !last_name ||
    !street_address ||
    !city ||
    !country ||
    !phone_number ||
    !email_address ||
    !password
  ) {
    return res.status(400).send("Please enter the required fields.");
  }

  if (password !== confirm_password) {
    return res.status(400).send("Passwords don't match");
  }
  // Create a hashed Password using brcrypt.hashSync(password)
  const hashedPassword = bcrypt.hashSync(password);
  // Create the new user
  const newUser = {
    username,
    password: hashedPassword, //update password to use hashed password
    first_name,
    last_name,
    street_address,
    city,
    country,
    phone_number,
    email_address,
  };
  // Insert it into our database
  try {
    await knex("users").insert(newUser);
    res.status(201).send("Registered successfully");
  } catch (error) {
    console.log(error);
    res.status(400).send("Failed registration");
  }
});

module.exports = router;
