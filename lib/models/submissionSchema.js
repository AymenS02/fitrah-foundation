import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  submissionUrl: { type: String, required: true }, // URL to uploaded file
  notes: { type: String },
  grade: { type: Number },
  feedback: { type: String },
  status: { 
    type: String, 
    enum: ['SUBMITTED', 'GRADED', 'LATE'], 
    default: 'SUBMITTED' 
  },
  assignment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Assignment', 
    required: true 
  },
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

export default mongoose.models.Submission || mongoose.model("Submission", submissionSchema);