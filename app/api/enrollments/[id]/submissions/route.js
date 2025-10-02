import { NextResponse } from "next/server";
import { connectDB } from '../../../../../lib/config/db';
import Enrollment from "../../../../../lib/models/enrollmentSchema";

export async function POST(req, context) {
  try {
    await connectDB();
    const { id } = await context.params; // enrollmentId
    const formData = await req.formData();
    const moduleId = formData.get("module");
    const text = formData.get("text");
    const files = formData.getAll("files"); // array of File objects

    // Example: you might upload files to S3/Cloudinary here
    const fileUrls = files.map((file) => `/uploads/${file.name}`); 

    const enrollment = await Enrollment.findById(id);
    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    enrollment.submissions.push({
      module: moduleId,
      type: "ASSIGNMENT",
      text: text,
      fileUrl: fileUrls.join(", "), // or store array if you prefer
      submittedAt: new Date(),
    });

    await enrollment.save();

    return NextResponse.json({ message: "Submission added successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error adding submission:", err);
    return NextResponse.json({ error: "Failed to add submission" }, { status: 500 });
  }
}
