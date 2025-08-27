import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  timeLimit: { type: Number }, // in minutes
  maxAttempts: { type: Number, default: 1 },
  requiredScore: { type: Number, default: 80 }, // percentage to pass
  module: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Module', 
    required: true 
  }
}, { timestamps: true });

export default mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);