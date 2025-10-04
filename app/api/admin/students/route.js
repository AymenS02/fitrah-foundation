import { NextResponse } from 'next/server';
import User from '../../../../lib/models/userSchema';  
import Course from '@/lib/models/courseSchema';
import Enrollment from '@/lib/models/enrollmentSchema';
import { connectDB } from '../../../../lib/config/db';

export async function GET(req) {
  try {
    await connectDB();

    const students = await User.find({ role: 'STUDENT' }).select('-password');

    return NextResponse.json(students, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}


export async function DELETE(request) {
  try {
    console.log('Delete student request received');

    await connectDB();
    console.log('DB connected');

    // Verify admin token
    const user = await verifyToken(request);
    console.log('User verified:', user.email, 'Role:', user.role);

    if (user.role !== 'ADMIN') {
      console.log('Access denied. Not admin:', user.role);
      return NextResponse.json(
        { message: 'Access denied. Admin only.' },
        { status: 403 }
      );
    }

    // Get student ID from query
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('id');
    console.log('Student ID to delete:', studentId);

    if (!studentId) {
      return NextResponse.json(
        { message: 'Student ID is required' },
        { status: 400 }
      );
    }

    // Delete student and related enrollments
    await User.findByIdAndDelete(studentId);
    await Enrollment.deleteMany({ user: studentId });
    console.log('Student deleted:', studentId);

    return NextResponse.json({ message: 'Student deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}