import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/config/db';
import Course from "../../../../lib/models/courseSchema";
import CourseModule from '../../../../lib/models/moduleSchema';

export async function GET(request, context) {
  try {
    await connectDB();
    const { id } = await context.params; // ✅ await params

    const course = await Course.findById(id)
      .populate({
        path: 'modules',
        options: { sort: { order: 1 } }
      });

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: course });
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
    const { id } = await context.params; // ✅ await params
    const body = await request.json();

    const course = await Course.findById(courseId)
      .populate({
        path: "modules",
        options: { sort: { order: 1 } }   // ✅ sorted modules
      })
      .populate({
        path: "enrollments",
        populate: {
          path: "user",                   // ✅ also populate the student info
          select: "name email"            // only pull what you need
        }
      });

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: course });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    await connectDB();
    const { id } = await context.params; // ✅ await params

    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    // This will trigger the pre-remove middleware to delete associated modules
    await course.deleteOne();

    return NextResponse.json({ 
      success: true, 
      message: 'Course and associated modules deleted successfully' 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
