'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, Clock, BookOpen, FileText, ClipboardList, Play } from "lucide-react";

export default function CourseDashboardPage() {
  const { id } = useParams(); 
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completingModule, setCompletingModule] = useState(null);

  // Fetch course data with modules and user's enrollment
  const fetchCourseData = async () => {
    try {
      setLoading(true);
      
      // Fetch course with modules
      const courseRes = await fetch(`/api/courses/${id}`);
      if (!courseRes.ok) throw new Error("Failed to fetch course");
      const courseData = await courseRes.json();
      setCourse(courseData);

      // Fetch user's enrollment for this course
      const token = localStorage.getItem('token');
      const enrollmentRes = await fetch(`/api/user/enrollments/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (enrollmentRes.ok) {
        const enrollmentData = await enrollmentRes.json();
        setEnrollment(enrollmentData);
      }
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

  // Check if module is completed
  const isModuleCompleted = (moduleId) => {
    return enrollment?.completedModules?.includes(moduleId) || false;
  };

  // Mark module as completed
  const completeModule = async (moduleId) => {
    if (completingModule || isModuleCompleted(moduleId)) return;

    setCompletingModule(moduleId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/user/modules/${moduleId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courseId: id })
      });

      if (!response.ok) {
        throw new Error('Failed to complete module');
      }

      // Refresh enrollment data
      await fetchCourseData();
    } catch (error) {
      console.error('Error completing module:', error);
      setError('Failed to complete module');
    } finally {
      setCompletingModule(null);
    }
  };

  // Calculate progress
  const calculateProgress = () => {
    if (!course?.modules || !enrollment) return 0;
    const totalModules = course.modules.length;
    const completedCount = enrollment.completedModules?.length || 0;
    return totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;
  };

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
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
  const progress = calculateProgress();

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <button
                onClick={() => router.push('/dashboard')}
                className="text-primary hover:text-primary-hover mb-2 text-sm"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold text-primary">{course.title}</h1>
              <p className="text-primary mt-1">{course.description}</p>
              <p className="text-sm text-primary mt-2">
                Instructor: {course.instructor}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{progress}%</div>
              <div className="text-sm text-primary">Complete</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-foreground rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-primary mt-2">
            <span>{enrollment?.completedModules?.length || 0} completed</span>
            <span>{modules.length} total modules</span>
          </div>
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
              const isCompleted = isModuleCompleted(module._id);
              const isCurrentlyCompleting = completingModule === module._id;

              return (
                <div
                  key={module._id}
                  className={`bg-card rounded-lg shadow-sm border-l-4 transition-all duration-200 cursor-pointer ${
                    isCompleted
                      ? 'border-green-500 bg-green-50'
                      : 'border-blue-500 hover:shadow-md'
                  }`}
                >
                  <div
                    className="p-6"
                    onClick={() => handleModuleClick(module)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          isCompleted 
                            ? 'bg-green-100 text-green-600'
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {getModuleIcon(module.type)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {module.title}
                          </h3>
                          <p className="text-sm text-gray-600">
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

                      <div className="flex items-center space-x-2">
                        {!isCompleted && (
                          <div className="flex items-center text-primary">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="text-xs">Available</span>
                          </div>
                        )}
                        {isCompleted && (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-5 w-5 mr-1" />
                            <span className="text-sm font-medium">Completed</span>
                          </div>
                        )}
                        {isCurrentlyCompleting && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        )}
                      </div>
                    </div>

                    {/* Module completion button for simple content */}
                    {!isCompleted && (module.type === 'text' || module.type === 'pdf') && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            completeModule(module._id);
                          }}
                          disabled={isCurrentlyCompleting}
                          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isCurrentlyCompleting ? 'Completing...' : 'Mark as Complete'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Course completion message */}
        {progress === 100 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-green-900">Congratulations!</h3>
                <p className="text-green-700">You have completed all modules in this course.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}