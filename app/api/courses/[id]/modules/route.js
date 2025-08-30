// app/api/courses/[id]/modules/route.js
import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/config/db";
import Course from "../../../../../lib/models/courseSchema";
import Module from "../../../../../lib/models/moduleSchema";

export async function POST(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await request.json();

    // make a new module
    const newModule = new Module({
      ...body,
      course: id,
    });
    await newModule.save();

    // push into course
    await Course.findByIdAndUpdate(id, {
      $push: { modules: newModule._id },
    });

    return NextResponse.json({ success: true, data: newModule });
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

    const modules = await Module.find({ course: id }).sort({ order: 1 });
    return NextResponse.json({ success: true, data: modules });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
