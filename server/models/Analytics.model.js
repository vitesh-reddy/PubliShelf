import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true,
  },
  viewsToday: {
    type: Number,
    default: 0,
  },
  usersToday: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

analyticsSchema.index({ date: 1 });

const Analytics = mongoose.model("Analytics", analyticsSchema);

export default Analytics;
