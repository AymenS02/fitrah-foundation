import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Course from "../../../lib/models/courseSchema";

// --- DB Connection ---
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  return mongoose.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
  });
};

// --- GET: Fetch all courses ---
export async function GET() {
  try {
    await connectDB();
    const courses = await Course.find().sort({ createdAt: -1 });
    
    // Ensure we always return an array, even if it's empty
    return NextResponse.json(Array.isArray(courses) ? courses : [], { status: 200 });
  } catch (error) {
    console.error("Error fetching courses:", error);
    // Return empty array on error instead of error object
    return NextResponse.json([], { status: 200 });
  }
}

// --- POST: Create a new course ---
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const course = new Course(body);
    await course.save();
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- PUT: Update a course ---
export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, ...updateData } = body;

    const course = await Course.findByIdAndUpdate(id, updateData, { new: true });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- DELETE: Remove a course ---
export async function DELETE(req) {
  try {
    await connectDB();
    const { id } = await req.json();
    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Course deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
