import { NextResponse } from 'next/server';
import { connectDB } from "../../../../../lib/config/db";
import Enrollment from "../../../../../lib/models/enrollmentSchema";

export async function GET(request, { params }) {

  try {
    await connectDB();
    const { id: courseId } = await params;

    // Find all enrollments for this course that have submissions
    const enrollments = await Enrollment.find({
      course: courseId,
      'submissions.0': { $exists: true } // Only enrollments with at least one submission
    })
      .populate('user', 'firstName lastName email') // Populate user info
      .populate('submissions.module', 'title') // Populate module title
      .populate('course', 'title') // Populate course title
      .lean();

    // Flatten submissions into a single array with additional context
    const allSubmissions = [];
    
    enrollments.forEach(enrollment => {
      enrollment.submissions.forEach(submission => {
        allSubmissions.push({
          _id: submission._id,
          enrollmentId: enrollment._id, // Important for grading endpoint
          user: enrollment.user,
          module: submission.module,
          course: enrollment.course,
          type: submission.type,
          fileUrl: submission.fileUrl,
          submittedAt: submission.submittedAt,
          grade: submission.grade,
          feedback: submission.feedback
        });
      });
    });

    // Sort by submission date (newest first)
    allSubmissions.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    return NextResponse.json(allSubmissions);

  } catch (error) {
    console.error('Error fetching course submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}