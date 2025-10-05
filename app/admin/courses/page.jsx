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
        setCourses(data.data || data);
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
        const newCourse = response.data || response;
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-8 max-md:flex-col max-md:gap-6 max-md:text-center">
              <h1 className="text-3xl text-foreground font-bold font-palanquin-dark">
                Course Management
              </h1>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-hover transition-colors font-medium"
              >
                {showForm ? '✕ Cancel' : '+ Create Course'}
              </button>
            </div>

            {/* Form Modal Overlay */}
            {showForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-card shadow-2xl rounded-2xl w-full max-w-4xl my-8 border border-border">
                  {/* Form Header */}
                  <div className="bg-primary text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Create New Course</h2>
                    <button 
                      onClick={() => setShowForm(false)}
                      className="text-white hover:text-gray-200 text-2xl font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Form Content */}
                  <form onSubmit={handleSubmit} className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {/* Basic Information Section */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">
                        Basic Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">
                            Course Title <span className="text-red-500">*</span>
                          </label>
                          <input 
                            name="title" 
                            value={formData.title} 
                            onChange={handleChange} 
                            placeholder="e.g., Introduction to Web Development" 
                            required 
                            className="border border-border bg-background text-foreground p-3 rounded-lg w-full focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">
                            Course Code <span className="text-red-500">*</span>
                          </label>
                          <input 
                            name="code" 
                            value={formData.code} 
                            onChange={handleChange} 
                            placeholder="e.g., WEB101" 
                            required 
                            className="border border-border bg-background text-foreground p-3 rounded-lg w-full focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">
                            Instructor Name <span className="text-red-500">*</span>
                          </label>
                          <input 
                            name="instructor" 
                            value={formData.instructor} 
                            onChange={handleChange} 
                            placeholder="e.g., John Doe" 
                            required 
                            className="border border-border bg-background text-foreground p-3 rounded-lg w-full focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">
                            Category
                          </label>
                          <input 
                            name="category" 
                            value={formData.category} 
                            onChange={handleChange} 
                            placeholder="e.g., Programming, Design" 
                            className="border border-border bg-background text-foreground p-3 rounded-lg w-full focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Course Details Section */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">
                        Course Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">
                            Difficulty Level
                          </label>
                          <select 
                            name="difficultyLevel" 
                            value={formData.difficultyLevel} 
                            onChange={handleChange} 
                            className="border border-border bg-background text-foreground p-3 rounded-lg w-full focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20"
                          >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">
                            Price ($)
                          </label>
                          <input 
                            type="number" 
                            name="price" 
                            value={formData.price} 
                            onChange={handleChange} 
                            placeholder="0" 
                            className="border border-border bg-background text-foreground p-3 rounded-lg w-full focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">
                            Max Students
                          </label>
                          <input 
                            type="number" 
                            name="maxStudents" 
                            value={formData.maxStudents} 
                            onChange={handleChange} 
                            placeholder="0 for unlimited" 
                            className="border border-border bg-background text-foreground p-3 rounded-lg w-full focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">
                            Duration (Weeks)
                          </label>
                          <input 
                            type="number" 
                            name="durationWeeks" 
                            value={formData.durationWeeks} 
                            onChange={handleChange} 
                            placeholder="e.g., 8" 
                            className="border border-border bg-background text-foreground p-3 rounded-lg w-full focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">
                            Start Date
                          </label>
                          <input 
                            type="date" 
                            name="startDate" 
                            value={formData.startDate} 
                            onChange={handleChange} 
                            className="border border-border bg-background text-foreground p-3 rounded-lg w-full focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">
                            End Date
                          </label>
                          <input 
                            type="date" 
                            name="endDate" 
                            value={formData.endDate} 
                            onChange={handleChange} 
                            className="border border-border bg-background text-foreground p-3 rounded-lg w-full focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Media Section */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">
                        Media
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Thumbnail URL
                        </label>
                        <input 
                          name="thumbnailUrl" 
                          value={formData.thumbnailUrl} 
                          onChange={handleChange} 
                          placeholder="https://example.com/image.jpg" 
                          className="border border-border bg-background text-foreground p-3 rounded-lg w-full focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20" 
                        />
                      </div>
                    </div>

                    {/* Description Section */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">
                        Description & Outcomes
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">
                            Course Description
                          </label>
                          <textarea 
                            name="description" 
                            value={formData.description} 
                            onChange={handleChange} 
                            placeholder="Describe what students will learn in this course..." 
                            rows="4"
                            className="border border-border bg-background text-foreground p-3 rounded-lg w-full focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">
                            Requirements
                          </label>
                          <textarea 
                            name="requirements" 
                            value={formData.requirements} 
                            onChange={handleChange} 
                            placeholder="List any prerequisites or requirements..." 
                            rows="3"
                            className="border border-border bg-background text-foreground p-3 rounded-lg w-full focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">
                            Learning Outcomes
                          </label>
                          <textarea 
                            name="learningOutcomes" 
                            value={formData.learningOutcomes} 
                            onChange={handleChange} 
                            placeholder="What will students achieve after completing this course..." 
                            rows="3"
                            className="border border-border bg-background text-foreground p-3 rounded-lg w-full focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-border">
                      <button 
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="px-6 py-2.5 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="bg-success text-white px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity font-medium"
                      >
                        Create Course
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Courses List */}
            {courses.length === 0 ? (
              <div className="text-center py-20 max-md:flex max-md:flex-col max-md:gap-6">
                <div className="text-muted-foreground text-lg mb-4">No courses available yet.</div>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-hover transition-colors font-medium"
                >
                  Create Your First Course
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div 
                    key={course._id} 
                    className="bg-card shadow-md rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow"
                  >
                    {course.thumbnailUrl && (
                      <img 
                        src={course.thumbnailUrl} 
                        alt={course.title} 
                        className="w-full h-48 object-cover" 
                      />
                    )}
                    <div className="p-5">
                      <h2 className="text-xl font-semibold text-foreground mb-2">{course.title}</h2>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{course.description}</p>
                      <div className="space-y-1 mb-4">
                        <p className="text-sm text-primary">Category: {course.category || 'Uncategorized'}</p>
                        <p className="text-sm text-muted-foreground">Level: {course.difficultyLevel}</p>
                        <p className="text-sm text-foreground font-medium">Price: ${course.price}</p>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleViewDashboard(course._id)}
                          className="bg-accent text-white px-4 py-2 rounded-lg text-sm hover:bg-accent-hover transition-colors font-medium"
                        >
                          View Dashboard
                        </button>
                        <button
                          onClick={() => handleManageModules(course._id)}
                          className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-hover transition-colors font-medium"
                        >
                          Manage Modules
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}