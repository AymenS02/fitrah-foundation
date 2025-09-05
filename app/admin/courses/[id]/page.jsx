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
        setCourse(data); // Use data directly if API returns the course object
      } catch (err) {
        console.error(err);
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) return <div className="text-center mt-10">Loading course...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!course) return <div className="text-center mt-10">Course not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => router.push(`/admin/courses`)}
        className="mb-4 text-blue-600 hover:text-blue-800 p-2 rounded-lg"
      >
        ← Back to Courses
      </button>

      <div className="bg-white shadow-md rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
        <p className="text-gray-600 mb-4">{course.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="font-semibold">Course Details</h3>
            <p>Instructor: {course.instructor}</p>
            <p>Code: {course.code}</p>
            <p>Level: {course.difficultyLevel}</p>
            <p>Price: {course.price || "Free"}</p>
          </div>
          <div>
            <h3 className="font-semibold">Schedule</h3>
            <p>Duration: {course.durationWeeks || "N/A"} weeks</p>
            <p>Start: {course.startDate ? new Date(course.startDate).toLocaleDateString() : "N/A"}</p>
            <p>End: {course.endDate ? new Date(course.endDate).toLocaleDateString() : "N/A"}</p>
            <p>Max Students: {course.maxStudents || "Unlimited"}</p>
          </div>
        </div>

        {/* Modules */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Modules ({course.modules?.length || 0})</h3>
          <div className="space-y-2">
            {course.modules?.map((module) => (
              <div key={module._id} className="border p-3 rounded">
                <h4 className="font-medium">{module.title}</h4>
                <p className="text-sm text-gray-600">{module.type}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => router.push(`/admin/courses/${courseId}/modules`)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Manage Modules
          </button>
          <button
            onClick={() => router.push(`/dashboard/courses/${courseId}/edit`)}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Edit Course
          </button>
        </div>
      </div>
    </div>
  );
}
