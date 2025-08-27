import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  questionType: { 
    type: String, 
    enum: ['MCQ', 'TRUE_FALSE', 'SHORT_ANSWER'], 
    required: true 
  },
  options: [{ type: String }], // For MCQ: ['Option A', 'Option B', ...]
  correctAnswer: { type: String, required: true },
  points: { type: Number, default: 1 },
  orderIndex: { type: Number, required: true },
  quiz: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Quiz', 
    required: true 
  }
}, { timestamps: true });

export default mongoose.models.Question || mongoose.model("Question", questionSchema);