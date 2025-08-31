// app/api/enrollments/route.js
import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/config/db";
import Enrollment from "../../../lib/models/enrollmentSchema";

export async function POST(request) {
  try {
    await connectDB();

    const { courseId, studentId } = await request.json();

    if (!courseId || !studentId) {
      return NextResponse.json({ error: "Missing courseId or studentId" }, { status: 400 });
    }

    // Check if the enrollment already exists
    const existing = await Enrollment.findOne({ user: studentId, course: courseId });
    if (existing) {
      return NextResponse.json({ error: "You are already enrolled in this course" }, { status: 400 });
    }

    const enrollment = new Enrollment({
      user: studentId,
      course: courseId,
      progress: 0,
    });

    await enrollment.save();

    return NextResponse.json({ message: "Enrollment successful", enrollment }, { status: 201 });
  } catch (err) {
    console.error("Enrollments POST error:", err);
    return NextResponse.json({ error: "Failed to enroll" }, { status: 500 });
  }
}

// Optional: GET all enrollments for a user
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const enrollments = await Enrollment.find({ user: userId })
      .populate("course")
      .populate("lastAccessedModule");

    return NextResponse.json(enrollments, { status: 200 });
  } catch (err) {
    console.error("Enrollments GET error:", err);
    return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 });
  }
}
