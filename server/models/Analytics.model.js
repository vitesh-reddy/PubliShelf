import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true,
  },
  totalViews: {
    type: Number,
    default: 0,
  },
  uniqueUsers: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});

analyticsSchema.index({ date: 1 });

const Analytics = mongoose.model("Analytics", analyticsSchema);

export default Analytics;
