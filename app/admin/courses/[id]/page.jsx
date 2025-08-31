// app/dashboard/courses/[id]/page.js
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function CourseDashboard() {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const courseId = params.id;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        const data = await res.json();
        if (data.success) {
          setCourse(data.data);
          console.log('Fetched course data:', data.data);
        } else {
          console.error('Error fetching course:', data.error);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  if (loading) {
    return <div className="text-center mt-10">Loading course...</div>;
  }

  if (!course) {
    return <div className="text-center mt-10">Course not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-600 hover:text-blue-800"
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
            <p>Price: ${course.price}</p>
          </div>
          <div>
            <h3 className="font-semibold">Schedule</h3>
            <p>Duration: {course.durationWeeks} weeks</p>
            <p>Start: {new Date(course.startDate).toLocaleDateString()}</p>
            <p>End: {new Date(course.endDate).toLocaleDateString()}</p>
            <p>Max Students: {course.maxStudents}</p>
          </div>
        </div>

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