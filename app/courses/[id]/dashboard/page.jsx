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
      console.log("Course data :", courseData);
      console.log("User data :", user);
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
    if (!course || !user) return;

    // Find the current student's enrollment
    const enrollment = course.enrollments.find(e => e.user._id === user.id);
    if (!enrollment) return; // user not enrolled

    // Check if there's already a grade for this module
    const hasGrade = enrollment.grades.some(g => g.itemId === module._id);

    // Check if there's already a submission for this module
    const hasSubmission = enrollment.submissions.some(s => s.module === module._id);

    if (hasGrade || hasSubmission) {
      // Optionally show a message to the user
      alert("You have already submitted or received a grade for this module.");
      return; // Prevent navigation
    }

    // Navigate to module view based on type
    if (module.type === 'text' || module.type === 'pdf') {
      router.push(`/courses/${id}/text/${module._id}`);
    } else if (module.type === 'quiz') {
      router.push(`/courses/${id}/quiz/${module._id}`);
    } else if (module.type === 'assignment') {
      router.push(`/courses/${id}/assignment/${module._id}`);
    }
  };


  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground">You are not logged in</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-error mb-2">Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <button 
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Course Not Found</h2>
          <p className="text-muted-foreground">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const modules = course.modules || [];

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-6 mb-6">
          <button
            onClick={() => router.push(`/courses/${id}`)}
            className="text-primary hover:text-primary-hover mb-2 text-sm transition-colors"
          >
            ← Back to Course Overview
          </button>
          <h1 className="text-3xl font-bold text-foreground font-palanquin-dark">{course.title}</h1>
          <div className="flex justify-between">
            <div>
              <p className="text-muted-foreground mt-1">{course.description}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Instructor: <span className="text-foreground font-medium">{course.instructor}</span>
              </p>
            </div>
            <button
              onClick={() => router.push(`/courses/${id}/grades`)}
              className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors"
            >
              See Grades
            </button>
          </div>

        </div>

        {/* Course Content */}
        <div className="space-y-4">
          {modules.length === 0 ? (
            <div className="bg-card rounded-lg shadow-sm border border-border p-8 text-center">
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No modules available</h3>
              <p className="text-muted-foreground">Course content is being prepared. Check back soon!</p>
            </div>
          ) : (
            modules.map((module, index) => {
              // Find current user's enrollment
              const enrollment = course.enrollments.find(e => e.user._id === user.id);
              const hasGrade = enrollment?.grades.some(g => g.itemId === module._id);
              const hasSubmission = enrollment?.submissions.some(s => s.module === module._id);
              const isCompleted = hasGrade || hasSubmission;

              return (
                <div
                  key={module._id}
                  className={`
                    bg-card rounded-lg shadow-sm border border-border border-l-4 border-l-accent
                    transition-all duration-200
                    ${isCompleted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg hover:scale-[1.02]'}
                  `}
                  onClick={() => !isCompleted && handleModuleClick(module)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-lg bg-muted text-primary">
                          {getModuleIcon(module.type)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {module.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {module.description || `${module.type.charAt(0).toUpperCase() + module.type.slice(1)} Module`}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              module.type === 'quiz' ? 'bg-info/10 text-info' :
                              module.type === 'assignment' ? 'bg-warning/10 text-warning' :
                              module.type === 'pdf' ? 'bg-error/10 text-error' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {module.type.toUpperCase()}
                            </span>
                            <span className="text-xs text-muted-foreground">
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