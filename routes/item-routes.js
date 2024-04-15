const router = require("express").Router();
const itemController = require("../controllers/item-controller");
const authorize = require("../middleware/authorize");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
  .route("/")
  .get(itemController.getItems)
  .post(authorize, upload.single("image"), itemController.postItem)
  .patch(itemController.updateItemsHighestBid);
// .patch(itemController.deleteBidsLowerThanStartBid);

router
  .route("/:itemId")
  .get(itemController.getItemById)
  .delete(itemController.deleteItem)
  .put(authorize, upload.single("image"), itemController.updateItem);

router
  .route("/:itemId/bids")
  .get(itemController.getItemBids)
  .post(authorize, itemController.postBid);

router
  .route("/:itemId/bids/:bidId")
  .get(itemController.getItemBidById)
  .delete(itemController.deleteBid);

module.exports = router;
