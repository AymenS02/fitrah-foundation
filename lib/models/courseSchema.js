import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  syllabus: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  teacher: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Reference to User with role TEACHER
  status: { 
    type: String, 
    enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], 
    default: 'DRAFT' 
  },
  level: { 
    type: String, 
    enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], 
    required: true 
  },
  thumbnail: { type: String }, // URL to image
  learningObjectives: { type: String },
  categories: [{ type: String }] // e.g., ['Quran', 'Fiqh', 'Arabic']
}, { timestamps: true });

export default mongoose.models.Course || mongoose.model("Course", courseSchema);