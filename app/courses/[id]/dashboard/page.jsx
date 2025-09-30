'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, FileText, ClipboardList, Play } from "lucide-react";
import { useAuth } from "@/components/authContext";

export default function CourseDashboardPage() {
  const { id } = useParams(); 
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  // Fetch course data with modules
  const fetchCourseData = async () => {
    try {
      setLoading(true);
      
      // Fetch course with modules
      const courseRes = await fetch(`/api/courses/${id}`);
      if (!courseRes.ok) throw new Error("Failed to fetch course");
      const courseData = await courseRes.json();
      setCourse(courseData);
    } catch (error) {
      console.error("Error fetching course data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCourseData();
  }, [id]);

  // Get module type icon
  const getModuleIcon = (type) => {
    switch (type) {
      case 'text':
        return <FileText className="h-5 w-5" />;
      case 'pdf':
        return <BookOpen className="h-5 w-5" />;
      case 'quiz':
        return <ClipboardList className="h-5 w-5" />;
      case 'assignment':
        return <Play className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  // Handle module click
  const handleModuleClick = (module) => {
    // Navigate to module view based on type
    if (module.type === 'text' || module.type === 'pdf') {
      router.push(`/courses/${id}/modules/${module._id}`);
    } else if (module.type === 'quiz') {
      router.push(`/courses/${id}/quiz/${module._id}`);
    } else if (module.type === 'assignment') {
      router.push(`/courses/${id}/assignment/${module._id}`);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>You are not logged in</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Course Not Found</h2>
          <p className="text-gray-600">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const modules = course.modules || [];

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
          <button
            onClick={() => router.push(`/courses/${id}`)}
            className="text-primary hover:text-primary-hover mb-2 text-sm"
          >
            ← Back to Course Overview
          </button>
          <h1 className="text-3xl font-bold text-primary">{course.title}</h1>
          <p className="text-primary mt-1">{course.description}</p>
          <p className="text-sm text-primary mt-2">
            Instructor: {course.instructor}
          </p>
        </div>

        {/* Course Content */}
        <div className="space-y-4">
          {modules.length === 0 ? (
            <div className="bg-card rounded-lg shadow-sm p-8 text-center">
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">No modules available</h3>
              <p className="text-primary">Course content is being prepared. Check back soon!</p>
            </div>
          ) : (
            modules.map((module, index) => {
              return (
                <div
                  key={module._id}
                  className="bg-card rounded-lg shadow-sm border-l-4 border-accent transition-all duration-200 cursor-pointer transform transition-transform duration-300 hover:scale-105"
                  onClick={() => handleModuleClick(module)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-lg bg-background text-primary">
                          {getModuleIcon(module.type)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-primary">
                            {module.title}
                          </h3>
                          <p className="text-sm text-secondary">
                            {module.description || `${module.type.charAt(0).toUpperCase() + module.type.slice(1)} Module`}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              module.type === 'quiz' ? 'bg-purple-100 text-purple-700' :
                              module.type === 'assignment' ? 'bg-orange-100 text-orange-700' :
                              module.type === 'pdf' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {module.type.toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-500">
                              Module {index + 1}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}