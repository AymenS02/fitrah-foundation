import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String }, // optional thumbnail/cover
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin/teacher who created it
  modules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Module" }], // linked modules
}, { timestamps: true });

export default mongoose.models.Course || mongoose.model("Course", courseSchema);
