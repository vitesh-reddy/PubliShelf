import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "Buyer", required: true }, // Reference to Buyer
  rating: { type: Number, required: true, min: 1, max: 5 }, // Rating out of 5
  comment: { type: String, required: true }, // Review comment
  createdAt: { type: Date, default: Date.now }, // Timestamp for the review
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;