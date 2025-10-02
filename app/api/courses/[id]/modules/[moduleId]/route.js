// app/api/enrollments/submissions/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/config/db";
import Enrollment from "@/lib/models/enrollmentSchema";
import Module from "@/lib/models/moduleSchema";

// POST /api/enrollments/submissions
export async function POST(req) {
  try {
    await connectDB();

    // Parse JSON or FormData depending on client
    let body;
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      body = await req.json();
    } else if (contentType.includes("form-data") || contentType.includes("multipart/form-data")) {
      // For FormData, use `formidable` or similar if needed
      body = {};
      const formData = await req.formData();
      body.enrollmentId = formData.get("enrollmentId");
      body.module = formData.get("module");
      body.type = formData.get("type");
      body.text = formData.get("text");
      // You can handle uploaded files here if needed
      body.files = formData.getAll("files");
    }

    const { enrollmentId, module: moduleId, type, text, files } = body;

    if (!enrollmentId || !moduleId || !type) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Find enrollment
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return NextResponse.json({ success: false, error: "Enrollment not found" }, { status: 404 });
    }

    // Add submission to enrollment
    enrollment.submissions.push({
      module: moduleId,
      type,
      fileUrl: files && files.length > 0 ? files[0].name : "text-only", // you can replace with actual URL logic
      submittedAt: new Date(),
      text, // store text if needed
    });

    await enrollment.save();

    return NextResponse.json({ success: true, data: enrollment.submissions }, { status: 200 });
  } catch (err) {
    console.error("Error saving submission:", err);
    return NextResponse.json(
      { success: false, error: "Failed to submit assignment", details: err.message },
      { status: 500 }
    );
  }
}
