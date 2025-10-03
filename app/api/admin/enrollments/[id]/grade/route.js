import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../../lib/config/db';
import Enrollment from '../../../../../..//lib/models/enrollmentSchema';

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id: enrollmentId } = await params;
    const body = await request.json();
    const { submissionId, grade, feedback } = body;

    // Validate input
    if (!submissionId) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    if (grade === undefined || grade === null) {
      return NextResponse.json(
        { error: 'Grade is required' },
        { status: 400 }
      );
    }

    if (grade < 0 || grade > 100) {
      return NextResponse.json(
        { error: 'Grade must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Find the enrollment and update the specific submission
    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      );
    }

    // Find the submission within the enrollment
    const submission = enrollment.submissions.id(submissionId);

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Update the submission
    submission.grade = grade;
    if (feedback) {
      submission.feedback = feedback;
    }

    // Save the enrollment
    await enrollment.save();

    // Return the updated submission
    return NextResponse.json({
      message: 'Grade submitted successfully',
      submission: {
        _id: submission._id,
        grade: submission.grade,
        feedback: submission.feedback
      }
    });

  } catch (error) {
    console.error('Error grading submission:', error);
    return NextResponse.json(
      { error: 'Failed to submit grade' },
      { status: 500 }
    );
  }
}