// models/Course.js
import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  code: { type: String, required: true, unique: true },
  instructor: { type: String, required: true },
  thumbnailUrl: { type: String },
  category: { type: String },
  difficultyLevel: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'], 
    default: 'beginner' 
  },
  price: { type: Number, default: 0 },
  maxStudents: { type: Number },
  startDate: { type: Date },
  endDate: { type: Date },
  durationWeeks: { type: Number },
  requirements: { type: String },
  learningOutcomes: { type: String }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for modules
courseSchema.virtual('modules', {
  ref: 'CourseModule',
  localField: '_id',
  foreignField: 'courseId',
  justOne: false
});

// Add pre-remove middleware to delete associated modules
courseSchema.pre('remove', async function(next) {
  try {
    await mongoose.model('CourseModule').deleteMany({ courseId: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.models.Course || mongoose.model('Course', courseSchema);