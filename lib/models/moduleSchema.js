import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["ASSIGNMENT", "QUIZ", "PDF", "VIDEO"],
  },
  content: { 
    type: String, 
    required: true,
    // For PDF/Video: store URL
    // For Quiz/Assignment: could be JSON or text
  },
  section: { type: String }, // e.g., "Week 1", "Introduction"
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }, // link back to course
}, { timestamps: true });

export default mongoose.models.Module || mongoose.model("Module", moduleSchema);
