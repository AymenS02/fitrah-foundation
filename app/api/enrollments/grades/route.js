import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/config/db";
import Enrollment from "../../../../lib/models/enrollmentSchema";
import Course from "../../../../lib/models/courseSchema"; // Make sure this path is correct!
import Module from "../../../../lib/models/moduleSchema";

// POST /api/enrollments/grades
export async function POST(req) {
  try {
    await connectDB();
    const { enrollmentId, itemType, itemId, title, answers } = await req.json();

    console.log("Received:", { enrollmentId, itemType, itemId, title, hasAnswers: !!answers });

    if (!enrollmentId || !itemType || !itemId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find enrollment
    const enrollment = await Enrollment.findById(enrollmentId).populate("course");
    if (!enrollment) {
      return NextResponse.json(
        { success: false, error: "Enrollment not found" },
        { status: 404 }
      );
    }

    // For quizzes, we need to calculate the score from answers
    let score, maxScore;

    if (itemType === "QUIZ" && answers) {
      // Find the course and quiz to get correct answers
      const course = await Course.findById(enrollment.course._id);
      if (!course) {
        return NextResponse.json(
          { success: false, error: "Course not found" },
          { status: 404 }
        );
      }

      const quizModule = await Module.findById(itemId);
      if (!quizModule || !quizModule.quiz) {
        return NextResponse.json(
          { success: false, error: "Quiz not found" },
          { status: 404 }
        );
      }

      // Calculate score
      const questions = quizModule.quiz.questions;
      let correctCount = 0;

      questions.forEach((question, idx) => {
        const userAnswer = answers[idx];
        const correctAnswer = question.correctAnswer; // <-- use correctAnswer
        if (userAnswer === correctAnswer) {
          correctCount++;
        }
      });


      score = correctCount;
      maxScore = questions.length;
      
    } else {
      // For non-quiz items or if score is pre-calculated
      return NextResponse.json(
        { success: false, error: "Invalid submission data" },
        { status: 400 }
      );
    }

    // Calculate percentage
    const percentage = (score / maxScore) * 100;

    // Check if grade for this item already exists
    const existingGradeIndex = enrollment.grades.findIndex(
      (g) => g.itemId.toString() === itemId && g.itemType === itemType
    );

    if (existingGradeIndex >= 0) {
      // Update existing grade
      enrollment.grades[existingGradeIndex] = {
        itemType,
        itemId,
        title,
        score,
        maxScore,
        percentage,
        gradedAt: new Date(),
      };
    } else {
      // Push new grade
      enrollment.grades.push({
        itemType,
        itemId,
        title,
        score,
        maxScore,
        percentage,
      });
    }

    await enrollment.save();

    return NextResponse.json(
      { success: true, data: enrollment.grades },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating grade:", err);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to update grade",
        details: process.env.NODE_ENV === "development" ? err.message : undefined
      },
      { status: 500 }
    );
  }
}