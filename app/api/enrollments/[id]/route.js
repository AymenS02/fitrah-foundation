// ./app/api/enrollments/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from '../../../../lib/config/db';
import Course from '../../../../lib/models/courseSchema';
import Enrollment from "../../../../lib/models/enrollmentSchema";
import User from '../../../../lib/models/userSchema';

export async function GET(req, context) {
  try {
    await connectDB();
    const { id } = await context.params;

    const enrollment = await Enrollment.findById(id)
      .populate({
        path: "user",
        model: User,
        select: "firstName lastName email"
      })
      .populate({
        path: "course",
        model: Course,
        select: "title code instructor"
      });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(enrollment, { status: 200 });
  } catch (err) {
    console.error("Error fetching enrollment:", err);
    return NextResponse.json(
      { error: "Failed to fetch enrollment" },
      { status: 500 }
    );
  }
}
