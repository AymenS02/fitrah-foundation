// app/api/enrollments/route.js
import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/config/db";
import Enrollment from "../../../lib/models/enrollmentSchema";
import Course from "../../../lib/models/courseSchema";

export async function POST(request) {
  try {
    await connectDB();

    const { courseId, studentId } = await request.json();

    if (!courseId || !studentId) {
      return NextResponse.json({ error: "Missing courseId or studentId" }, { status: 400 });
    }

    // Verify the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if the enrollment already exists
    const existing = await Enrollment.findOne({ user: studentId, course: courseId });
    if (existing) {
      return NextResponse.json({ error: "You are already enrolled in this course" }, { status: 400 });
    }

    // Check if course has reached max capacity
    if (course.maxStudents) {
      const currentEnrollments = await Enrollment.countDocuments({ course: courseId });
      if (currentEnrollments >= course.maxStudents) {
        return NextResponse.json({ error: "Course is full" }, { status: 400 });
      }
    }

    const enrollment = new Enrollment({
      user: studentId,
      course: courseId,
      progress: 0,
      enrolledAt: new Date(),
    });

    await enrollment.save();

    return NextResponse.json({ message: "Enrollment successful", enrollment }, { status: 201 });
  } catch (err) {
    console.error("Enrollments POST error:", err);
    return NextResponse.json({ error: "Failed to enroll" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const courseId = searchParams.get("courseId");

    // If both studentId and courseId are provided, check specific enrollment
    if (studentId && courseId) {
      const enrollment = await Enrollment.find({ 
        user: studentId, 
        course: courseId 
      })
      .populate({
        path: "course",
        select: "title description instructor category difficultyLevel price thumbnailUrl"
      })
      .populate("lastAccessedModule");

      return NextResponse.json(enrollment, { status: 200 });
    }

    // If only studentId is provided, get all enrollments for that student
    if (studentId) {
      const enrollments = await Enrollment.find({ user: studentId })
        .populate({
          path: "course",
          select: "title description instructor category difficultyLevel price thumbnailUrl durationWeeks"
        })
        .populate("lastAccessedModule")
        .sort({ enrolledAt: -1 }); // Most recent enrollments first

      // Return just the courseIds for easier filtering in frontend
      const courseIds = enrollments.map(e => e.course._id.toString());
      
      return NextResponse.json(enrollments, { 
        status: 200,
        headers: {
          'X-Course-IDs': JSON.stringify(courseIds)
        }
      });
    }

    // If courseId is provided, get all enrollments for that course
    if (courseId) {
      const enrollments = await Enrollment.find({ course: courseId })
        .populate({
          path: "user",
          select: "firstName lastName email"
        })
        .populate("lastAccessedModule")
        .sort({ enrolledAt: -1 });

      return NextResponse.json(enrollments, { status: 200 });
    }

    // If no parameters provided, return error
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });

  } catch (err) {
    console.error("Enrollments GET error:", err);
    return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const courseId = searchParams.get("courseId");

    if (!studentId || !courseId) {
      return NextResponse.json({ error: "Missing studentId or courseId" }, { status: 400 });
    }

    const enrollment = await Enrollment.findOneAndDelete({ 
      user: studentId, 
      course: courseId 
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Successfully unenrolled from course" }, { status: 200 });

  } catch (err) {
    console.error("Enrollments DELETE error:", err);
    return NextResponse.json({ error: "Failed to unenroll" }, { status: 500 });
  }
}