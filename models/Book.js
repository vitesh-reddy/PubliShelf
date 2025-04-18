import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  genre: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 0 },
  image: { type: String },
  rating: { type: Number, default: 0 }, // Average rating
  publisher: { type: mongoose.Schema.Types.ObjectId, ref: "Publisher" }, // Reference to Publisher
  reviews: [reviewSchema], // Array of reviews
});

const Book = mongoose.model("Book", bookSchema);
export default Book;
