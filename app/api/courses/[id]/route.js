import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/config/db';
import Course from "../../../../lib/models/courseSchema";
import CourseModule from '../../../../lib/models/moduleSchema';
import Enrollment from "../../../../lib/models/enrollmentSchema";
import User from '../../../../lib/models/userSchema';

export async function GET(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;

    const course = await Course.findById(id)
      .populate({
        path: "modules",
        options: { sort: { order: 1 } }
      })
      .populate({
        path: "enrollments",
        populate: {
          path: "user",
          select: "firstName lastName email" // only grab what you need
        }
      });

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    // Return the course data directly (not wrapped in success/data)
    // This matches what your frontend expects
    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await request.json();

    // Fix: Use 'id' instead of undefined 'courseId'
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    )
    .populate({
      path: "modules",
      options: { sort: { order: 1 } }
    })
    .populate({
      path: "enrollments",
      populate: {
        path: "user",
        select: "name email firstName lastName"
      }
    });

    if (!updatedCourse) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedCourse });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;

    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    // Delete associated modules first (if not handled by middleware)
    await CourseModule.deleteMany({ courseId: id });

    // Delete the course
    await Course.findByIdAndDelete(id);

    return NextResponse.json({ 
      success: true, 
      message: 'Course and associated modules deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}