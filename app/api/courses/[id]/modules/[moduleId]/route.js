// app/api/courses/[id]/modules/[moduleId]/route.js


import { NextResponse } from "next/server";
import { connectDB } from "../../../../../../lib/config/db";
import Module from "../../../../../../lib/models/moduleSchema";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { moduleId } = await params;

    const foundModule = await Module.findById(moduleId);
    if (!foundModule) {
      return NextResponse.json({ success: false, error: "Module not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: foundModule });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
