const router = require("express").Router();
const bidController = require("../controllers/bid-controller");

router.route("/").get(bidController.getBids);

router.route("/:bidId").get(bidController.getBidById);

module.exports = router;
