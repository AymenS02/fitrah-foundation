import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: /.+\@.+\..+/ 
  },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['STUDENT', 'TEACHER', 'ADMIN'], 
    default: 'STUDENT' 
  },
  bio: { type: String },
  profilePicture: { type: String },
  isEmailVerified: { type: Boolean, default: false }
}, { timestamps: true });

// Add virtual for enrollments
userSchema.virtual('enrollments', {
  ref: 'Enrollment',
  localField: '_id',
  foreignField: 'user'
});

// Enable virtuals in JSON output
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

export default mongoose.models.User || mongoose.model("User", userSchema);