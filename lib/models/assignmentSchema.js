import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructions: { type: String, required: true },
  dueDate: { type: Date },
  maxGrade: { type: Number, required: true },
  module: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Module', 
    required: true 
  }
}, { timestamps: true });

export default mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);