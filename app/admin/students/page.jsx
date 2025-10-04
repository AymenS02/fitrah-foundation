// app\admin\students\page.jsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/students', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 403) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(studentId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/students?id=${studentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete student');
      }

      setStudents(students.filter(student => student._id !== studentId));
    } catch (error) {
      setError(error.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleRemoveFromCourse = async (studentId, courseId, courseTitle) => {
    if (!confirm(`Are you sure you want to remove this student from "${courseTitle}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/students/${studentId}/enrollments?courseId=${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove student from course');
      }

      // Refresh the student list
      fetchStudents();
    } catch (error) {
      setError(error.message);
    }
  };

if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-border"></div>
    </div>
  );
}

return (
  <div className="min-h-screen bg-background">
    <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Student Management</h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive border border-border text-destructive-foreground px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Student List */}
      <div className="bg-background shadow-sm border border-border rounded-lg">
        {students.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            <p className="text-lg">No students found.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {students.map((student) => (
              <li key={student._id} className="p-6 hover:bg-muted transition">
                <div className="flex justify-between items-start max-md:flex-col max-md:gap-4">
                  {/* Student Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined: {new Date(student.createdAt).toLocaleDateString()}
                    </p>

                    {/* Enrollments */}
                    {student.enrollments?.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-foreground mb-2">
                          Enrolled Courses:
                        </h4>
                        <div className="space-y-2">
                          {student.enrollments.map((enrollment) => (
                            <div
                              key={enrollment._id}
                              className="flex justify-between items-center bg-background p-3 rounded-md"
                            >
                              <div>
                                <p className="font-medium text-foreground">
                                  {enrollment.course?.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Enrolled:{" "}
                                  {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                </p>
                              </div>
                              <button
                                onClick={() =>
                                  handleRemoveFromCourse(
                                    student._id,
                                    enrollment.course._id,
                                    enrollment.course.title
                                  )
                                }
                                className="text-sm px-3 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 md:ml-4">
                    <Link
                      href={`/admin/students/${student._id}`}
                      className="px-3 py-1 rounded-md text-sm bg-info text-white hover:bg-info/90 transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteStudent(student._id)}
                      disabled={deleteLoading === student._id}
                      className="px-3 py-1 rounded-md text-sm bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
                    >
                      {deleteLoading === student._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </div>
);

}