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
  lastAccessedAt: { type: Date },
  lastAccessedModule: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'CourseModule' 
  },
  progress: { type: Number, default: 0 }, // Percentage completed

  // ✅ Grades
  finalGrade: {
    type: Number, 
    min: 0, 
    max: 100,
    default: null // null means not graded yet
  },
  grades: [
    {
      itemType: { type: String, enum: ['QUIZ', 'ASSIGNMENT', 'EXAM', 'PROJECT'] },
      itemId: { type: mongoose.Schema.Types.ObjectId }, // can link to Quiz/Assignment schema
      title: { type: String }, // e.g. "Quiz 1" (helps readability)
      score: { type: Number, min: 0 },
      maxScore: { type: Number, min: 1 },
      percentage: { type: Number, min: 0, max: 100 }, // optional computed value
      gradedAt: { type: Date, default: Date.now },
      feedback: { type: String } // optional feedback
    }
  ]

}, { timestamps: true });

// Compound index to ensure unique enrollments
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.models.Enrollment || mongoose.model("Enrollment", enrollmentSchema);
