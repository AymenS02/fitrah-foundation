import { NextResponse } from 'next/server';
import User from '../../../../../lib/models/userSchema';
import Enrollment from '../../../../../lib/models/enrollmentSchema';
import { connectDB } from '../../../../../lib/config/db';
import { verifyToken } from '../../../../../lib/middleware/auth';

export async function GET(req, context) {
  try {
    await connectDB();

    const user = await verifyToken(req);
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Access denied. Admin only.' }, { status: 403 });
    }

    // ✅ Await params
    const { id } = await context.params;
    const studentId = id;

    const student = await User.findById(studentId)
      .select('-password')
      .populate({
        path: 'enrollments',
        populate: {
          path: 'course',
          select: 'title teacher price',
        },
      });

    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    await connectDB();

    const user = await verifyToken(req);
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Access denied. Admin only.' }, { status: 403 });
    }

    // ✅ Await params
    const { id } = await context.params;
    const studentId = id;

    const updates = await req.json();

    const updatedStudent = await User.findByIdAndUpdate(studentId, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!updatedStudent) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json(updatedStudent, { status: 200 });
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
