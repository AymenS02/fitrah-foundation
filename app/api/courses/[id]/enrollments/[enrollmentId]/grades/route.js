// app/api/courses/[id]/enrollments/[enrollmentId]/grades/route.js


import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/config/db";
import Enrollment from "../../../../../lib/models/enrollment";
import CourseModule from "../../../../../lib/models/moduleSchema";
import { getUserFromToken } from "../../../../../lib/auth"; // 🔑 helper to decode JWT

// POST -> submit quiz results
export async function POST(request, { params }) {
  try {
    await connectDB();
    const { enrollmentId } = params;

    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { moduleId, answers } = body;

    // 1. Find enrollment
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return NextResponse.json({ success: false, error: "Enrollment not found" }, { status: 404 });
    }

    // 2. Ensure this enrollment belongs to the logged in user
    if (enrollment.user.toString() !== user._id.toString()) {
      return NextResponse.json({ success: false, error: "Not your enrollment" }, { status: 403 });
    }

    // 3. Get the module (quiz)
    const courseModule = await CourseModule.findById(moduleId);
    if (!courseModule || courseModule.type !== "quiz") {
      return NextResponse.json({ success: false, error: "Quiz module not found" }, { status: 404 });
    }

    // 4. Prevent duplicate submissions
    const already = enrollment.grades.find(
      g => g.itemType === "QUIZ" && g.itemId.toString() === moduleId
    );
    if (already) {
      return NextResponse.json({ success: false, error: "Quiz already submitted" }, { status: 400 });
    }

    // 5. Grade the quiz
    const questions = courseModule.quiz.questions;
    let score = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) score++;
    });
    const maxScore = questions.length;
    const percentage = Math.round((score / maxScore) * 100);

    // 6. Push grade into enrollment
    enrollment.grades.push({
      itemType: "QUIZ",
      itemId: moduleId,
      title: courseModule.title,
      score,
      maxScore,
      percentage,
      gradedAt: new Date()
    });

    // 7. Update final grade (simple average of all percentages)
    const avg = enrollment.grades.reduce((sum, g) => sum + g.percentage, 0) / enrollment.grades.length;
    enrollment.finalGrade = Math.round(avg);

    await enrollment.save();

    return NextResponse.json({
      success: true,
      data: {
        score,
        maxScore,
        percentage,
        finalGrade: enrollment.finalGrade
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
