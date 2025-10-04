'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, ArrowLeft, ArrowRight, BookOpen, AlertCircle } from "lucide-react";
import { useAuth } from "@/components/authContext";

export default function TextModulePage() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useParams();
  const courseId = params?.id;
  const moduleId = params?.moduleId;

  const [loading, setLoading] = useState(true);
  const [module, setModule] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [enrollmentId, setEnrollmentId] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !courseId || !moduleId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch module details
        const moduleRes = await fetch(`/api/courses/${courseId}/modules/${moduleId}`);
        const moduleData = await moduleRes.json();
        if (!moduleRes.ok) throw new Error(moduleData.error || "Failed to fetch module");
        setModule(moduleData.data);

        // Fetch enrollment
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User token not found");

        const enrollRes = await fetch(
          `/api/enrollments?studentId=${user.id}&courseId=${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const enrollData = await enrollRes.json();

        if (enrollRes.ok && enrollData.length > 0) {
          setEnrollment(enrollData[0]);
          setEnrollmentId(enrollData[0]._id);
        } else {
          setError("You are not enrolled in this course.");
        }
      } catch (err) {
        console.error("Error fetching module:", err);
        setError(err.message || "Failed to load module");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, courseId, moduleId]);

  const isCompleted = () => {
    return enrollment?.completedModules?.includes(moduleId) || false;
  };

  const completeModule = async () => {
    if (completing || isCompleted()) return;

    if (!enrollmentId) {
      setError("Enrollment ID missing!");
      return;
    }

    setCompleting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/enrollments/${enrollmentId}/complete-module`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          moduleId,
          courseId 
        })
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Failed to complete module');

      // Update local enrollment state
      setEnrollment(prev => ({
        ...prev,
        completedModules: [...(prev?.completedModules || []), moduleId]
      }));

      // Navigate after short delay
      setTimeout(() => {
        router.push(`/courses/${courseId}/dashboard`);
      }, 1500);
    } catch (err) {
      console.error('Error completing module:', err);
      setError(err.message || 'Failed to complete module');
    } finally {
      setCompleting(false);
    }
  };

  // --- Conditional JSX Rendering ---

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading module...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-warning mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Not Logged In</h2>
          <p className="text-muted-foreground mb-4">You must be logged in to view this module.</p>
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Error
  if (error && !module) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-error mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => router.push(`/courses/${courseId}/dashboard`)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          >
            Return to Course
          </button>
        </div>
      </div>
    );
  }

  // Module not found or wrong type
  if (!module || module.type !== 'text') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Module Not Found</h2>
          <p className="text-muted-foreground mb-4">The text module you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push(`/courses/${courseId}/dashboard`)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          >
            Return to Course
          </button>
        </div>
      </div>
    );
  }

  // Main content view
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push(`/courses/${courseId}/dashboard`)}
              className="flex items-center text-primary hover:text-primary-hover transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </button>
            
            {isCompleted() && (
              <div className="flex items-center text-success">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">Completed</span>
              </div>
            )}
          </div>

          <div className="flex items-center mb-2">
            <div className="p-2 bg-primary/10 text-primary rounded-lg mr-4">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground font-palanquin-dark">{module.title}</h1>
              {module.description && (
                <p className="text-muted-foreground mt-1">{module.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
              TEXT MODULE
            </span>
            <span>Module {module.order || 1}</span>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-error/10 border border-error rounded-lg p-4 mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 text-error mr-3" />
            <p className="text-error">{error}</p>
          </div>
        )}

        {/* Content */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-8 mb-6">
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed text-foreground">
              {module.text?.body || 'No content available.'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {isCompleted() ? (
                <span className="text-success font-medium flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  You've completed this module
                </span>
              ) : (
                <span>Read through the content above to complete this module.</span>
              )}
            </div>

            <div className="flex space-x-3">
              {!isCompleted() && (
                <button
                  onClick={completeModule}
                  disabled={completing}
                  className="flex items-center px-6 py-3 bg-success text-white rounded-lg hover:bg-success/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {completing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Completing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Complete
                    </>
                  )}
                </button>
              )}

              <button
                onClick={() => router.push(`/courses/${courseId}/dashboard`)}
                className="flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors shadow-sm"
              >
                {isCompleted() ? (
                  <>
                    Continue Course
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  'Back to Course'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Completion Success Message */}
        {completing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-card rounded-lg p-6 max-w-md mx-4 border border-border shadow-xl">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Module Completed!
                </h3>
                <p className="text-muted-foreground">
                  Great job! You've successfully completed this module.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}