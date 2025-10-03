'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FileText, Award, Clock, CheckCircle, TrendingUp, BookOpen } from "lucide-react";
import { useAuth } from "@/components/authContext";

export default function StudentGradesPage() {
  const { id } = useParams(); // courseId only
  const router = useRouter();
  const [enrollment, setEnrollment] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  // Fetch student's enrollment and grades
  useEffect(() => {
    const fetchGradesData = async () => {
      if (!user?._id || !id) {
        console.log('hello' + user?._id + ' ' + id  );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        console.log('Fetching grades for user:', user._id, 'course:', id);

        // Fetch enrollment data with grades
        const enrollmentRes = await fetch(`/api/courses/${id}/enrollments?userId=${user._id}`);
        const enrollmentJson = await enrollmentRes.json();

        console.log('Enrollment response:', enrollmentJson);

        if (!enrollmentRes.ok) {
          throw new Error(enrollmentJson.error || "Failed to fetch enrollment data");
        }

        setEnrollment(enrollmentJson.data || enrollmentJson);
        // Fetch course info
        const courseRes = await fetch(`/api/courses/${id}`);
        if (!courseRes.ok) throw new Error("Failed to fetch course");
        const courseData = await courseRes.json();
        setCourse(courseData);

      } catch (error) {
        console.error("Error fetching grades:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGradesData();
  }, [id, user?._id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (grade >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (grade >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getLetterGrade = (grade) => {
    if (grade >= 90) return 'A';
    if (grade >= 80) return 'B';
    if (grade >= 70) return 'C';
    if (grade >= 60) return 'D';
    return 'F';
  };

  const calculateAverageGrade = () => {
    if (!enrollment?.grades || enrollment.grades.length === 0) return null;
    const total = enrollment.grades.reduce((sum, grade) => sum + grade.percentage, 0);
    return (total / enrollment.grades.length).toFixed(1);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">You are not logged in</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-error mb-2">Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!enrollment || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">No Enrollment Found</h2>
          <p className="text-muted-foreground">You are not enrolled in this course.</p>
        </div>
      </div>
    );
  }

  const submissions = enrollment.submissions || [];
  const grades = enrollment.grades || [];
  const averageGrade = calculateAverageGrade();

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push(`/courses/${id}/dashboard`)}
            className="text-primary hover:text-primary-hover mb-2 text-sm transition-colors"
          >
            ← Back to Course Dashboard
          </button>
          <h1 className="text-3xl font-bold text-foreground font-palanquin-dark">My Grades</h1>
          <p className="text-muted-foreground mt-1">{course.title}</p>
        </div>

        {/* Grade Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Final Grade */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Final Grade</h3>
              <Award className="h-5 w-5 text-primary" />
            </div>
            {enrollment.finalGrade !== null && enrollment.finalGrade !== undefined ? (
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-foreground">{enrollment.finalGrade}%</span>
                <span className="ml-2 text-lg text-muted-foreground">{getLetterGrade(enrollment.finalGrade)}</span>
              </div>
            ) : (
              <p className="text-2xl text-muted-foreground">Not graded yet</p>
            )}
          </div>

          {/* Average Grade */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Average Grade</h3>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            {averageGrade ? (
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-foreground">{averageGrade}%</span>
                <span className="ml-2 text-lg text-muted-foreground">{getLetterGrade(parseFloat(averageGrade))}</span>
              </div>
            ) : (
              <p className="text-2xl text-muted-foreground">No grades yet</p>
            )}
          </div>

          {/* Progress */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Course Progress</h3>
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-foreground">{enrollment.progress || 0}%</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${enrollment.progress || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Assignments & Submissions */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-6 mb-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-primary" />
            Assignment Submissions
          </h2>

          {submissions.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No submissions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((submission) => (
                <div key={submission._id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {submission.module?.title || 'Assignment'}
                        </h3>
                        {submission.grade !== null && submission.grade !== undefined ? (
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getGradeColor(submission.grade)}`}>
                            {submission.grade}%
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 border border-gray-300">
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Submitted on {formatDate(submission.submittedAt)}
                      </p>
                      {submission.feedback && (
                        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <p className="text-sm text-foreground">
                            <span className="font-medium">Feedback: </span>
                            {submission.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      {submission.grade !== null && submission.grade !== undefined && (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quizzes & Other Grades */}
        {grades.length > 0 && (
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-primary" />
              Quiz & Assessment Grades
            </h2>

            <div className="space-y-3">
              {grades.map((grade, index) => (
                <div key={index} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {grade.title || `${grade.itemType} ${index + 1}`}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getGradeColor(grade.percentage)}`}>
                          {grade.percentage}%
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Score: {grade.score} / {grade.maxScore} • Graded on {formatDate(grade.gradedAt)}
                      </p>
                      {grade.feedback && (
                        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <p className="text-sm text-foreground">
                            <span className="font-medium">Feedback: </span>
                            {grade.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      grade.itemType === 'QUIZ' ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning'
                    }`}>
                      {grade.itemType}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {grades.length === 0 && submissions.length === 0 && (
          <div className="bg-card rounded-lg shadow-sm border border-border p-12 text-center">
            <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Grades Yet</h3>
            <p className="text-muted-foreground">Complete assignments and quizzes to see your grades here.</p>
          </div>
        )}
      </div>
    </main>
  );
}
