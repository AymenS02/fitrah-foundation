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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
            <Link
              href="/admin"
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Back to Dashboard
            </Link>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {students.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No students found.
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {students.map((student) => (
                  <li key={student._id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{student.email}</p>
                        <p className="text-sm text-gray-500">
                          Joined: {new Date(student.createdAt).toLocaleDateString()}
                        </p>

                        {student.enrollments && student.enrollments.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-medium text-gray-900 mb-2">Enrolled Courses:</h4>
                            <div className="space-y-2">
                              {student.enrollments.map((enrollment) => (
                                <div
                                  key={enrollment._id}
                                  className="flex justify-between items-center bg-gray-50 p-3 rounded-md"
                                >
                                  <div>
                                    <p className="font-medium">{enrollment.course?.title}</p>
                                    <p className="text-sm text-gray-600">
                                      Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveFromCourse(
                                      student._id,
                                      enrollment.course._id,
                                      enrollment.course.title
                                    )}
                                    className="bg-red-100 text-red-600 px-3 py-1 rounded-md text-sm hover:bg-red-200"
                                  >
                                    Remove from Course
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <Link
                          href={`/admin/students/${student._id}`}
                          className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-md text-sm hover:bg-indigo-200"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteStudent(student._id)}
                          disabled={deleteLoading === student._id}
                          className="bg-red-100 text-red-600 px-3 py-1 rounded-md text-sm hover:bg-red-200 disabled:opacity-50"
                        >
                          {deleteLoading === student._id ? 'Deleting...' : 'Delete'}
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
    </div>
  );
}