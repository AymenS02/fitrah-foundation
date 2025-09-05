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

    // update the module by _id
    const updatedModule = await Module.findByIdAndUpdate(body._id, body, { new: true });

    if (!updatedModule) {
      return NextResponse.json({ success: false, error: "Module not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedModule });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE a single module
export async function DELETE(request, context) {
  try {
    await connectDB();

    const params = await context.params;
    const { id: courseId } = params;
    const { _id: moduleId } = await request.json();

    if (!moduleId) {
      return NextResponse.json(
        { success: false, error: "_id is required" },
        { status: 400 }
      );
    }

    // Delete the module
    const deletedModule = await Module.findByIdAndDelete(moduleId);

    if (!deletedModule) {
      return NextResponse.json(
        { success: false, error: "Module not found" },
        { status: 404 }
      );
    }

    // Remove module from the course
    await Course.findByIdAndUpdate(courseId, { $pull: { modules: moduleId } });

    return NextResponse.json({ success: true, data: deletedModule });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

