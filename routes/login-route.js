const router = require("express").Router();
const knex = require("knex")(require("../knexfile"));
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.route("/").post(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Please enter the required fields");
  }
  const user = await knex("users").where({ username: username }).first();

  // If theres no user return a status of 400 and send text "Invalid email"
  if (!user) {
    return res.status(400).send("Invalid Email");
  }

  if (user.password.length > 11) {
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    // If the password is not correct then send send status of 400 with a message "Invalid Password"
    if (!isPasswordCorrect) {
      return res.status(400).send("Invalid Password");
    }
  } else {
    const isPasswordCorrect = password === user.password;
    if (!isPasswordCorrect) {
      return res.status(400).send("Invalid Password");
    }
  }

  const token = jwt.sign(
    { user_id: user.user_id, username: user.username },
    process.env.SECRET_KEY,
    {
      expiresIn: "24h",
    }
  );
  // Issue the user their token
  res.json({ token: token });
});

module.exports = router;
