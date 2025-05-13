import mongoose from "mongoose";

const buyerSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  cart: [
    {
      book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
      quantity: { type: Number, default: 1 },
    },
  ],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  orders: [
    {
      book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true,
      },
      quantity: { type: Number, default: 1 },
      delivered: { type: Boolean, default: false },
      orderDate: { type: Date, default: Date.now },
    },
  ],
});

const Buyer = mongoose.model("Buyer", buyerSchema);
export default Buyer;
