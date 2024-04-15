const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const userController = require("../controllers/user-controller");
const authorize = require("../middleware/authorize");

// router.use(express.json());
// router.use(bodyParser.json());
// router.use(express.urlencoded({ extended: false }));
// router.use(bodyParser.urlencoded({ extended: false }));

router.route("/").get(authorize, userController.getUsers);

router
  .route("/current")
  .get(authorize, userController.getCurrentUser)
  .put(authorize, userController.updateCurrentUser);

router.route("/:userId").get(userController.getUserById);

router.route("/:userId/items").get(userController.getUserItems);

router.route("/:userId/items/:itemId").get(userController.getUserItemById);

module.exports = router;
