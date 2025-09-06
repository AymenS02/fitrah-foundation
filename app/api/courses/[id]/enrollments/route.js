// app/api/courses/[id]/enrollments/route.js
import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/config/db";
import Course from "../../../../../lib/models/courseSchema";
import Enrollment from "../../../../../lib/models/enrollmentSchema";
import User from "../../../../../lib/models/userSchema";

export async function POST(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await request.json();

    // Check if user exists
    const user = await User.findById(body.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Check if enrollment already exists
    const existingEnrollment = await Enrollment.findOne({
      course: id,
      user: body.userId
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { success: false, error: "User is already enrolled in this course" },
        { status: 400 }
      );
    }

    // Create new enrollment
    const newEnrollment = new Enrollment({
      course: id,
      user: body.userId,
      enrolledAt: new Date(),
      progress: 0,
      status: 'active',
      ...body
    });
    await newEnrollment.save();

    // Populate the user data for response
    await newEnrollment.populate('user', 'firstName lastName email');

    return NextResponse.json({ success: true, data: newEnrollment });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function GET(request, context) {
  try {
    await connectDB();

    // await the params object
    const params = await context.params;
    const id = params.id;

    const enrollments = await Enrollment.find({ course: id })
      .populate('user', 'firstName lastName email')
      .sort({ enrolledAt: -1 });
      
    return NextResponse.json({ success: true, data: enrollments });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function PUT(request, context) {
  try {
    await connectDB();

    // ✅ await context.params first
    const params = await context.params;
    const id = params.id; // course ID

    const body = await request.json();

    if (!body._id) {
      return NextResponse.json({ success: false, error: "_id is required" }, { status: 400 });
    }

    // update the enrollment by _id
    const updatedEnrollment = await Enrollment.findByIdAndUpdate(
      body._id, 
      body, 
      { new: true }
    ).populate('user', 'firstName lastName email');

    if (!updatedEnrollment) {
      return NextResponse.json({ success: false, error: "Enrollment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedEnrollment });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE a single enrollment
export async function DELETE(request, context) {
  try {
    await connectDB();

    const params = await context.params;
    const { id: courseId } = params;
    const { _id: enrollmentId } = await request.json();

    if (!enrollmentId) {
      return NextResponse.json(
        { success: false, error: "_id is required" },
        { status: 400 }
      );
    }

    // Delete the enrollment
    const deletedEnrollment = await Enrollment.findByIdAndDelete(enrollmentId);

    if (!deletedEnrollment) {
      return NextResponse.json(
        { success: false, error: "Enrollment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: deletedEnrollment });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}