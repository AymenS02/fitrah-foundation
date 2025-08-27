import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  orderIndex: { type: Number, required: true },
  isUnlocked: { type: Boolean, default: true },
  course: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  }
}, { timestamps: true });

export default mongoose.models.Module || mongoose.model("Module", moduleSchema);