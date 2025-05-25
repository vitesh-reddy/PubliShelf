import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  visitCount: { type: Number, default: 1 },
  visitDates: { type: [Date], default: [Date.now()] },
});
const Visitor = mongoose.model("Visitor", visitorSchema);
export default Visitor;