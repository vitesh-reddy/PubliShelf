import mongoose from "mongoose";

const biddingHistorySchema = new mongoose.Schema({
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Buyer",
    required: true,
  }, // Reference to Buyer
  bidAmount: { type: Number, required: true },
  bidTime: { type: Date, default: Date.now },
});

const BiddingHistory = mongoose.model("BiddingHistory", biddingHistorySchema);
export default BiddingHistory;
