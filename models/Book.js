import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "Buyer", required: true }, // Reference to Buyer
  rating: { type: Number, required: true, min: 1, max: 5 }, // Rating out of 5
  comment: { type: String, required: true }, // Review comment
  createdAt: { type: Date, default: Date.now }, // Timestamp for the review
});

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  genre: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 0 },
  image: { type: String },
  rating: { type: Number, default: 0 }, // Average rating
  publisher: { type: mongoose.Schema.Types.ObjectId, ref: "Publisher" },
<<<<<<< HEAD
  publishedAt: { type: Date, default: Date.now },  
=======
>>>>>>> d3cc9eae2fce0ee8716ec4b262dbc227a5a0ac94
  reviews: [reviewSchema], // Embedded reviews
});

const Book = mongoose.model("Book", bookSchema);
export default Book;