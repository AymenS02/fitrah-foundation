'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function CourseDashboard() {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const params = useParams();
  const router = useRouter();
  const courseId = params.id;

  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        if (!res.ok) throw new Error("Failed to fetch course");
        const data = await res.json();
        console.log('Fetched course:', data);
        setCourse(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleDeleteCourse = async (id) => {
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/courses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to delete course');
      }

      router.push(`/admin/courses`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-muted-foreground">Loading course...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-error">{error}</div>
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => router.push(`/admin/courses`)}
          className="mb-4 text-primary hover:text-primary-hover transition-colors"
        >
          ← Back to Courses
        </button>

        <div className="bg-card shadow-md rounded-xl p-6 border border-border">
          <h1 className="text-3xl font-bold mb-4 text-foreground font-palanquin-dark">
            {course.title}
          </h1>
          <p className="text-muted-foreground mb-4">{course.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-muted/30 p-4 rounded-lg border border-border">
              <h3 className="font-semibold text-foreground mb-3">Course Details</h3>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Instructor:</span> {course.instructor}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Code:</span> {course.code}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Level:</span> {course.difficultyLevel}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Price:</span> ${course.price || "Free"}
                </p>
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg border border-border">
              <h3 className="font-semibold text-foreground mb-3">Schedule</h3>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Duration:</span> {course.durationWeeks || "N/A"} weeks
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Start:</span> {course.startDate ? new Date(course.startDate).toLocaleDateString() : "N/A"}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">End:</span> {course.endDate ? new Date(course.endDate).toLocaleDateString() : "N/A"}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Max Students:</span> {course.maxStudents || "Unlimited"}
                </p>
              </div>
            </div>
          </div>

          {/* Modules */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3">
              Modules ({course.modules?.length || 0})
            </h3>
            {course.modules?.length > 0 ? (
              <div className="space-y-2">
                {course.modules.map((module) => (
                  <div 
                    key={module._id} 
                    className="border border-border bg-muted/20 p-3 rounded-lg hover:bg-muted/40 transition-colors"
                  >
                    <h4 className="font-medium text-foreground">{module.title}</h4>
                    <p className="text-sm text-muted-foreground capitalize">{module.type}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No modules added yet</p>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => router.push(`/admin/courses/${courseId}/modules`)}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover transition-colors"
            >
              Manage Modules
            </button>
            <button
              onClick={() => router.push(`/admin/courses/${courseId}/grades`)}
              className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary-hover transition-colors"
            >
              Manage Grades
            </button>
            <button
              onClick={() => router.push(`/admin/courses/${courseId}/enrollments`)}
              className="bg-accent text-white px-4 py-2 rounded hover:bg-accent-hover transition-colors"
            >
              Manage Students
            </button>
            <button
              onClick={() => handleDeleteCourse(course._id)}
              className="bg-destructive text-white px-4 py-2 rounded hover:opacity-90 transition-opacity"
            >
              Delete Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}