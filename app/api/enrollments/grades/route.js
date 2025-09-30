// ./app/api/enrollments/grades/route.js
import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/config/db";
import Enrollment from "../../../../lib/models/enrollmentSchema";

export async function POST(req) {
  try {
    await connectDB();

    // Read body
    const { studentId, courseId, moduleId, answers } = await req.json();

    if (!studentId || !courseId || !moduleId || !answers) {
      return NextResponse.json(
        { success: false, error: "Missing studentId, courseId, moduleId or answers" },
        { status: 400 }
      );
    }

    // Find enrollment by studentId + courseId
    const enrollment = await Enrollment.findOne({ student: studentId, course: courseId }).populate("course");

    if (!enrollment) {
      return NextResponse.json(
        { success: false, error: "Enrollment not found" },
        { status: 404 }
      );
    }

    const course = enrollment.course;

    if (!course || !course.modules) {
      return NextResponse.json(
        { success: false, error: "Course or modules not found" },
        { status: 404 }
      );
    }

    // Find the module in the course
    const courseModule = course.modules.find(
      (m) => m._id.toString() === moduleId
    );

    if (!courseModule || !courseModule.quiz) {
      return NextResponse.json(
        { success: false, error: "Quiz not found in this module" },
        { status: 404 }
      );
    }

    // Calculate score
    const quizQuestions = courseModule.quiz.questions;
    let correctCount = 0;

    quizQuestions.forEach((q, idx) => {
      if (answers[idx] && answers[idx] === q.answer) {
        correctCount += 1;
      }
    });

    const percentage = (correctCount / quizQuestions.length) * 100;

    // Save grades in enrollment
    if (!enrollment.grades) enrollment.grades = [];
    const existingGradeIndex = enrollment.grades.findIndex(
      (g) => g.module.toString() === moduleId
    );

    if (existingGradeIndex >= 0) {
      enrollment.grades[existingGradeIndex].score = percentage;
    } else {
      enrollment.grades.push({
        module: moduleId,
        score: percentage,
      });
    }

    await enrollment.save();

    return NextResponse.json({ success: true, data: { percentage } }, { status: 200 });
  } catch (err) {
    console.error("Error submitting quiz:", err);
    return NextResponse.json(
      { success: false, error: "Failed to submit quiz" },
      { status: 500 }
    );
  }
}
