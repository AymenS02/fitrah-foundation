// models/CourseModule.js
import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  questions: [
    {
      question: { type: String, required: true },
      options: [{ type: String }],
      correctAnswer: { type: String, required: true }
    }
  ]
}, { _id: false });

const assignmentSchema = new mongoose.Schema({
  instructions: { type: String, required: true },
  dueDate: { type: Date },
  maxScore: { type: Number, default: 100 }
}, { _id: false });

const pdfSchema = new mongoose.Schema({
  fileUrl: { type: String, required: true },
}, { _id: false });

const textSchema = new mongoose.Schema({
  body: { type: String, required: true },
}, { _id: false });

const courseModuleSchema = new mongoose.Schema({
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Course", 
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String },
  order: { type: Number, default: 0 }, // Add order field for sequencing

  type: { 
    type: String, 
    enum: ["quiz", "assignment", "pdf", "text"], 
    required: true 
  },

  // Flexible content - only one should be populated based on type
  quiz: quizSchema,
  assignment: assignmentSchema,
  pdf: pdfSchema,
  text: textSchema

}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for course
courseModuleSchema.virtual('course', {
  ref: 'Course',
  localField: 'courseId',
  foreignField: '_id',
  justOne: true
});

// Validation to ensure only the correct content field is populated based on type
courseModuleSchema.pre('save', function(next) {
  const moduleType = this.type;
  
  // Reset all content fields except the one matching the type
  if (moduleType !== 'quiz') this.quiz = undefined;
  if (moduleType !== 'assignment') this.assignment = undefined;
  if (moduleType !== 'pdf') this.pdf = undefined;
  if (moduleType !== 'text') this.text = undefined;

  // Validate that the correct content field is provided
  if (moduleType === 'quiz' && !this.quiz) {
    return next(new Error('Quiz content is required for quiz type'));
  }
  if (moduleType === 'assignment' && !this.assignment) {
    return next(new Error('Assignment content is required for assignment type'));
  }
  if (moduleType === 'pdf' && !this.pdf) {
    return next(new Error('PDF content is required for pdf type'));
  }
  if (moduleType === 'text' && !this.text) {
    return next(new Error('Text content is required for text type'));
  }

  next();
});

// Add index for better query performance
courseModuleSchema.index({ courseId: 1, order: 1 });

export default mongoose.models.CourseModule || mongoose.model("CourseModule", courseModuleSchema);