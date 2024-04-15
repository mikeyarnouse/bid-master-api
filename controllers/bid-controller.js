const knex = require("knex")(require("../knexfile"));

const getBids = async (req, res) => {
  try {
    const bids = await knex("bids").select(
      "bid_id",
      "amount",
      "timestamp",
      "user_id",
      "item_id"
    );
    res.json(bids);
  } catch (e) {
    res.status(500).json({ message: "Unable to retrieve item bids data" });
  }
};

const getBidById = async (req, res) => {
  try {
    const bid = await knex("bids")
      .where("bid_id", req.params.bidId)
      .select("bid_id", "amount", "timestamp", "user_id", "item_id");

    if (!bid.length) {
      return res.status(404).send({
        message: `Bid with ID #${req.params.bidId} not found`,
      });
    }

    res.json(bid);
  } catch (e) {
    res.status(500).json({ message: "Unable to retrieve bids data" });
  }
};

module.exports = {
  getBids,
  getBidById,
};
