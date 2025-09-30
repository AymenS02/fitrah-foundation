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

  // Fetch course (includes students)
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

      // Refresh course info (students list updates automatically)
      fetchCourse();
    } catch (error) {
      setError(error.message);
    } finally {
      setRemoveLoading(null);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading course students...</div>;
  if (!course) return <div className="text-center mt-10">Course not found</div>;

  const students = course.enrollments || [];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => router.push(`/admin/courses/${courseId}`)}
            className="text-primary hover:text-primary-hover mb-2 p-2 rounded-lg"
          >
            ← Back to Course
          </button>
          <h1 className="text-3xl font-bold">{course.title} - Students</h1>
          <p className="text-gray-600">Manage course enrollments and student progress</p>
        </div>
      </div>

      {error && (
        <div className="bg-error border border-border text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {students.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No students enrolled in this course yet.
          </div>
        ) : (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">
              Enrolled Students ({students.length})
            </h3>
            <div className="space-y-2">
              {students.map((enrollment) => (
                <div key={enrollment._id} className="bg-card shadow-md rounded-xl p-6 border">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">
                        {enrollment.user.firstName} {enrollment.user.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">{enrollment.user.email}</p>
                      <p className="text-sm text-gray-500">
                        Enrolled: {new Date(enrollment.createdAt).toLocaleDateString()}
                      </p>

                      <div className="mt-3 space-y-2">
                        <span className="text-sm text-gray-600">
                          Progress: <span className="font-medium">{enrollment.progress || 0}%</span>
                        </span>
                        {enrollment.finalGrade !== null && (
                          <span className="ml-4 text-sm text-gray-600">
                            Final Grade: <span className="font-medium">{enrollment.finalGrade}%</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/admin/courses/${courseId}/students/${enrollment.user._id}/standings`)}
                        className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded text-sm"
                      >
                        View Standings
                      </button>
                      <button
                        onClick={() => router.push(`/admin/students/${enrollment.user._id}`)}
                        className="text-green-600 hover:text-green-800 px-3 py-1 rounded text-sm"
                      >
                        Edit Student
                      </button>
                      <button
                        onClick={() =>
                          handleRemoveFromCourse(
                            enrollment._id, // enrollmentId
                            `${enrollment.user.firstName} ${enrollment.user.lastName}`
                          )
                        }
                        disabled={removeLoading === enrollment._id}
                        className="text-red-600 hover:text-red-800 px-3 py-1 rounded text-sm disabled:opacity-50"
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
  );
}
