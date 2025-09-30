'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    instructor: '',
    thumbnailUrl: '',
    category: '',
    difficultyLevel: 'beginner',
    price: 0,
    maxStudents: 0,
    startDate: '',
    endDate: '',
    durationWeeks: 0,
    requirements: '',
    learningOutcomes: ''
  });

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        setCourses(data.data || data); // Handle both response formats
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const response = await res.json();
        const newCourse = response.data || response; // Handle both response formats
        setCourses([...courses, newCourse]);
        setShowForm(false);
        // Reset form
        setFormData({
          title: '',
          description: '',
          code: '',
          instructor: '',
          thumbnailUrl: '',
          category: '',
          difficultyLevel: 'beginner',
          price: 0,
          maxStudents: 0,
          startDate: '',
          endDate: '',
          durationWeeks: 0,
          requirements: '',
          learningOutcomes: ''
        });
      } else {
        const err = await res.json();
        console.error('Failed to create course:', err.error);
      }
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  // Navigate to course dashboard
  const handleViewDashboard = (courseId) => {
    router.push(`/admin/courses/${courseId}`);
  };

  // Navigate to course modules management
  const handleManageModules = (courseId) => {
    router.push(`/admin/courses/${courseId}/modules`);
  };

  if (loading) {
    return <p className="text-center mt-10">Loading courses...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl text-primary font-bold mb-6 text-center">Available Courses</h1>

      {/* Create Course Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-hover transition"
        >
          {showForm ? 'Cancel' : 'Create Course'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6 mb-6 border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="title" value={formData.title} onChange={handleChange} placeholder="Course Title" required className="border p-2 rounded" />
            <input name="code" value={formData.code} onChange={handleChange} placeholder="Unique Code" required className="border p-2 rounded" />
            <input name="instructor" value={formData.instructor} onChange={handleChange} placeholder="Instructor Name" required className="border p-2 rounded" />
            <input name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} placeholder="Thumbnail URL" className="border p-2 rounded" />
            <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="border p-2 rounded" />
            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="border p-2 rounded" />
            <input type="number" name="maxStudents" value={formData.maxStudents} onChange={handleChange} placeholder="Max Students" className="border p-2 rounded" />
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="border p-2 rounded" />
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="border p-2 rounded" />
            <input type="number" name="durationWeeks" value={formData.durationWeeks} onChange={handleChange} placeholder="Duration in Weeks" className="border p-2 rounded" />

            <select name="difficultyLevel" value={formData.difficultyLevel} onChange={handleChange} className="border p-2 rounded">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Course Description" className="border p-2 rounded w-full mt-4" />
          <textarea name="requirements" value={formData.requirements} onChange={handleChange} placeholder="Course Requirements" className="border p-2 rounded w-full mt-4" />
          <textarea name="learningOutcomes" value={formData.learningOutcomes} onChange={handleChange} placeholder="Learning Outcomes" className="border p-2 rounded w-full mt-4" />

          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg mt-4 hover:bg-green-700 transition">
            Save Course
          </button>
        </form>
      )}

      {/* Courses List */}
      {courses.length === 0 ? (
        <p className="text-center mt-10">No courses available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-white shadow-md rounded-xl p-5 border hover:shadow-lg transition">
              {course.thumbnailUrl && (
                <img src={course.thumbnailUrl} alt={course.title} className="w-full h-40 object-cover rounded-lg mb-3" />
              )}
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{course.description}</p>
              <p className="text-sm text-accent mt-2">Category: {course.category || 'Uncategorized'}</p>
              <p className="text-sm text-primary">Level: {course.difficultyLevel}</p>
              <p className="text-sm mt-1">Price: ${course.price}</p>
              
              {/* Action Buttons */}
              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={() => handleViewDashboard(course._id)}
                  className="bg-accent text-white px-3 py-1.5 rounded text-sm hover:bg-accent-hover transition"
                >
                  View Dashboard
                </button>
                <button
                  onClick={() => handleManageModules(course._id)}
                  className="bg-primary text-white px-3 py-1.5 rounded text-sm hover:bg-primary-hover transition"
                >
                  Manage Modules
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}