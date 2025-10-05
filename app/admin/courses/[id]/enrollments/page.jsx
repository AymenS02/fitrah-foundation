'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function CourseStudents() {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removeLoading, setRemoveLoading] = useState(null);
  const params = useParams();
  const router = useRouter();
  const courseId = params.id;

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/courses/${courseId}`);
      if (!res.ok) throw new Error("Failed to fetch course");

      const data = await res.json();
      setCourse(data);
      console.log('Fetched course:', data);
    } catch (error) {
      console.error("Error fetching course:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const handleRemoveFromCourse = async (enrollmentId, studentName) => {
    if (!confirm(`Are you sure you want to remove "${studentName}" from this course?`)) {
      return;
    }

    setRemoveLoading(enrollmentId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/enrollments/${enrollmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove student from course');
      }

      fetchCourse();
    } catch (error) {
      setError(error.message);
    } finally {
      setRemoveLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-muted-foreground">Loading course students...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-muted-foreground">Course not found</div>
      </div>
    );
  }

  const students = course.enrollments || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => router.push(`/admin/courses/${courseId}`)}
              className="text-primary hover:text-primary-hover mb-2 transition-colors"
            >
              ← Back to Course
            </button>
            <h1 className="text-3xl font-bold text-foreground font-palanquin-dark">
              {course.title} - Students
            </h1>
            <p className="text-muted-foreground">Manage course enrollments and student progress</p>
          </div>
        </div>

        {error && (
          <div className="bg-error/10 border border-error text-error px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {students.length === 0 ? (
            <div className="text-center py-8 bg-card border border-border rounded-lg">
              <p className="text-muted-foreground">No students enrolled in this course yet.</p>
            </div>
          ) : (
            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-foreground">
                Enrolled Students ({students.length})
              </h3>
              <div className="space-y-2">
                {students.map((enrollment) => (
                  <div key={enrollment._id} className="bg-card shadow-md rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-foreground">
                          {enrollment.user.firstName} {enrollment.user.lastName}
                        </h4>
                        <p className="text-sm text-muted-foreground">{enrollment.user.email}</p>
                        <p className="text-sm text-muted-foreground">
                          Enrolled: {new Date(enrollment.createdAt).toLocaleDateString()}
                        </p>

                        <div className="mt-3 space-y-2">
                          <span className="text-sm text-muted-foreground">
                            Progress: <span className="font-medium text-foreground">{enrollment.progress || 0}%</span>
                          </span>
                          {enrollment.finalGrade !== null && (
                            <span className="ml-4 text-sm text-muted-foreground">
                              Final Grade: <span className="font-medium text-foreground">{enrollment.finalGrade}%</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => router.push(`/admin/courses/${courseId}/students/${enrollment.user._id}/standings`)}
                          className="text-primary hover:text-primary-hover px-3 py-1 rounded text-sm transition-colors"
                        >
                          View Standings
                        </button>
                        <button
                          onClick={() => router.push(`/admin/students/${enrollment.user._id}`)}
                          className="text-success hover:opacity-80 px-3 py-1 rounded text-sm transition-opacity"
                        >
                          Edit Student
                        </button>
                        <button
                          onClick={() =>
                            handleRemoveFromCourse(
                              enrollment._id,
                              `${enrollment.user.firstName} ${enrollment.user.lastName}`
                            )
                          }
                          disabled={removeLoading === enrollment._id}
                          className="text-error hover:opacity-80 px-3 py-1 rounded text-sm disabled:opacity-50 transition-opacity"
                        >
                          {removeLoading === enrollment._id ? 'Removing...' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}