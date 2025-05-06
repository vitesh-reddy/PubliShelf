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

const antiqueBookSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Book Title
  author: { type: String, required: true }, // Author
  description: { type: String, required: true }, // Description
  genre: { type: String, required: true }, // Genre
  condition: {
    type: String,
    required: true,
    enum: ["Mint", "Near Mint", "Excellent", "Very Good", "Good", "Fair"],
  }, // Condition
  basePrice: { type: Number, required: true }, // Starting Bid
  currentPrice: { type: Number, default: 0 }, // Current Price (updated with each bid)
  biddingHistory: [biddingHistorySchema], // Embedded Bidding History
  auctionStart: { type: Date, required: true }, // Auction Start Date
  auctionEnd: { type: Date, required: true }, // Auction End Date
  images: [{ type: String }], // Array of image URLs
  authenticationDocuments: [{ type: String }], // Array of document URLs
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Publisher",
    required: true,
  }, // Reference to Publisher
});

const AntiqueBook = mongoose.model("AntiqueBook", antiqueBookSchema);
export default AntiqueBook;
