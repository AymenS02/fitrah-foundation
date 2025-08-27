import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  course: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'], 
    default: 'PENDING' 
  },
  amountPaid: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  completionDate: { type: Date },
  lastAccessedAt: { type: Date },
  lastAccessedModule: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Module' 
  },
  progress: { type: Number, default: 0 } // Percentage completed
}, { timestamps: true });

// Compound index to ensure unique enrollments
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.models.Enrollment || mongoose.model("Enrollment", enrollmentSchema);