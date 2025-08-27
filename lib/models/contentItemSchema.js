import mongoose from "mongoose";

const contentItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  contentType: { 
    type: String, 
    enum: ['VIDEO', 'PDF', 'ARTICLE', 'AUDIO'], 
    required: true 
  },
  contentUrl: { type: String, required: true }, // URL to S3/Cloudinary
  duration: { type: Number }, // in seconds
  readingTime: { type: Number }, // in minutes
  orderIndex: { type: Number, required: true },
  isPreview: { type: Boolean, default: false },
  module: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Module', 
    required: true 
  }
}, { timestamps: true });

export default mongoose.models.ContentItem || mongoose.model("ContentItem", contentItemSchema);