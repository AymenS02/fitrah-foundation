'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, ArrowLeft, Upload, FileText, Calendar, Clock, AlertCircle } from "lucide-react";

export default function AssignmentModulePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id;
  const moduleId = params?.moduleId;

  // State management
  const [loading, setLoading] = useState(true);
  const [module, setModule] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState(null);
  
  // Assignment state
  const [submission, setSubmission] = useState({
    text: '',
    files: []
  });
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Fetch module and enrollment data
  useEffect(() => {
    if (!courseId || !moduleId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const token = localStorage.getItem('token');
        if (!token) throw new Error("User token not found");

        // Fetch module details - the module is a CourseModule document
        const moduleRes = await fetch(`/api/modules/${moduleId}`);
        const moduleData = await moduleRes.json();
        
        if (!moduleRes.ok) throw new Error(moduleData.error || "Failed to fetch module");
        
        // Check if it's an assignment type module
        if (moduleData.data?.type !== 'assignment') {
          throw new Error("This module is not an assignment");
        }
        
        // Validate assignment content exists
        if (!moduleData.data?.assignment) {
          throw new Error("Assignment content not found");
        }
        
        setModule(moduleData.data);

        // Fetch enrollment
        const enrollRes = await fetch(
          `/api/enrollments?courseId=${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const enrollData = await enrollRes.json();

        if (enrollRes.ok && enrollData.length > 0) {
          setEnrollmentId(enrollData[0]._id);
          
          // Check if module is completed
          if (enrollData[0].completedModules?.includes(moduleId)) {
            setSubmitted(true);
          }
        } else {
          setError("You are not enrolled in this course.");
        }

        // Fetch existing submission
        const submissionRes = await fetch(
          `/api/assignments/${moduleId}/submission`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (submissionRes.ok) {
          const submissionData = await submissionRes.json();
          if (submissionData.data) {
            setExistingSubmission(submissionData.data);
            if (submissionData.data.text) {
              setSubmission(prev => ({ ...prev, text: submissionData.data.text }));
            }
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load assignment");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, moduleId]);

  // Helper functions
  const isOverdue = () => {
    if (!module?.assignment?.dueDate) return false;
    return new Date() > new Date(module.assignment.dueDate);
  };

  const getDaysUntilDue = () => {
    if (!module?.assignment?.dueDate) return null;
    const dueDate = new Date(module.assignment.dueDate);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleTextChange = (e) => {
    setSubmission(prev => ({ ...prev, text: e.target.value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSubmission(prev => ({ ...prev, files: [...prev.files, ...files] }));
  };

  const removeFile = (index) => {
    setSubmission(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const canSubmit = () => {
    return (submission.text.trim() || submission.files.length > 0) && !submitting;
  };

  const handleSubmitAssignment = async () => {
    if (!canSubmit()) {
      setError('Please provide either text submission or upload files');
      return;
    }

    if (!enrollmentId) {
      setError("Enrollment ID missing!");
      return;
    }

    setSubmitting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('enrollmentId', enrollmentId);
      formData.append('courseId', courseId);
      formData.append('moduleId', moduleId);
      formData.append('text', submission.text);
      formData.append('title', module.title);
      
      submission.files.forEach(file => {
        formData.append('files', file);
      });

      // Submit assignment
      const response = await fetch(`/api/assignments/${moduleId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Failed to submit assignment');

      // Mark module as completed
      const completeRes = await fetch(`/api/enrollments/${enrollmentId}/complete-module`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ moduleId })
      });

      if (!completeRes.ok) {
        console.warn("Failed to mark module as complete");
      }

      setSubmitted(true);
      setExistingSubmission(result.data);
      
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = () => {
    if (submitted) return 'text-green-600 bg-green-50 border-green-200';
    if (isOverdue()) return 'text-red-600 bg-red-50 border-red-200';
    if (existingSubmission) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  };

  const getStatusText = () => {
    if (submitted) return 'Completed';
    if (isOverdue()) return 'Overdue';
    if (existingSubmission) return 'Submitted - Pending Review';
    return 'Not Submitted';
  };

  const daysUntilDue = getDaysUntilDue();
  const assignmentData = module?.assignment || {};

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assignment...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !module) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => router.push(`/courses/${courseId}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Course
          </button>
        </div>
      </div>
    );
  }

  // Module not found
  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Assignment Not Found</h2>
          <p className="text-gray-600 mb-4">The assignment you're looking for doesn't exist.</p>
          <button 
            onClick={() => router.push(`/courses/${courseId}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Course
          </button>
        </div>
      </div>
    );
  }

  // Success state - after submission
  if (submitted && existingSubmission) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Assignment Submitted Successfully!
            </h1>
            <p className="text-gray-600 mb-4">
              Your assignment has been submitted and is pending review.
            </p>
            
            {existingSubmission.grade !== null && (
              <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  {existingSubmission.grade}/{assignmentData.maxScore || 100}
                </div>
                <div className="text-gray-600 text-lg">Your Grade</div>
                {existingSubmission.feedback && (
                  <div className="mt-4 text-left">
                    <h3 className="font-semibold text-gray-900 mb-2">Instructor Feedback:</h3>
                    <p className="text-gray-700">{existingSubmission.feedback}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => router.push(`/courses/${courseId}`)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                Return to Course
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main assignment view
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <button
            onClick={() => router.push(`/courses/${courseId}`)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Course
          </button>

          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{module.title}</h1>
            <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </div>
          </div>

          {module.description && (
            <p className="text-gray-600 mb-4">{module.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">
              ASSIGNMENT
            </span>
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Max Score: {assignmentData.maxScore || 100} points
            </span>
            {assignmentData.dueDate && (
              <span className={`flex items-center ${isOverdue() ? 'text-red-600' : daysUntilDue <= 3 ? 'text-yellow-600' : 'text-gray-600'}`}>
                <Clock className="h-4 w-4 mr-1" />
                Due: {new Date(assignmentData.dueDate).toLocaleDateString()}
                {daysUntilDue !== null && (
                  <span className="ml-1">
                    ({daysUntilDue > 0 ? `${daysUntilDue} days left` : daysUntilDue === 0 ? 'Due today' : `${Math.abs(daysUntilDue)} days overdue`})
                  </span>
                )}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Instructions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h2>
              <div className="prose prose-gray max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {assignmentData.instructions || 'No instructions provided.'}
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Submission Form */}
            {!submitted && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Submission</h2>
                
                <div className="space-y-6">
                  {/* Text Submission */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Written Response
                    </label>
                    <textarea
                      value={submission.text}
                      onChange={handleTextChange}
                      placeholder="Enter your assignment response here..."
                      className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={submitting}
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      File Attachments (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <div className="text-sm text-gray-600 mb-2">
                          Click to upload files or drag and drop
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          PDF, DOC, DOCX, TXT files up to 10MB each
                        </div>
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                          onChange={handleFileChange}
                          className="text-sm"
                          disabled={submitting}
                        />
                      </div>
                    </div>

                    {/* File List */}
                    {submission.files.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {submission.files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded border">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <span className="text-xs text-gray-500 ml-2">
                                ({formatFileSize(file.size)})
                              </span>
                            </div>
                            <button
                              onClick={() => removeFile(index)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                              disabled={submitting}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Existing Submission Display */}
            {existingSubmission && !submitted && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Previous Submission</h2>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-3">
                    Submitted: {new Date(existingSubmission.submittedAt).toLocaleString()}
                  </div>
                  
                  {existingSubmission.text && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Text Response:</h4>
                      <div className="bg-white p-3 rounded border">
                        <p className="text-gray-800 whitespace-pre-wrap">{existingSubmission.text}</p>
                      </div>
                    </div>
                  )}

                  {existingSubmission.files?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Submitted Files:</h4>
                      <div className="space-y-1">
                        {existingSubmission.files.map((file, index) => (
                          <div key={index} className="flex items-center bg-white p-2 rounded border">
                            <FileText className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm text-gray-700">{file.originalName}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {existingSubmission.grade !== null && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-blue-900">Grade:</span>
                        <span className="text-2xl font-bold text-blue-900">
                          {existingSubmission.grade}/{assignmentData.maxScore || 100}
                        </span>
                      </div>
                      {existingSubmission.feedback && (
                        <div className="mt-2">
                          <span className="font-medium text-blue-900">Feedback:</span>
                          <p className="text-blue-800 mt-1">{existingSubmission.feedback}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Details</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Status</div>
                  <div className={`px-3 py-2 rounded-lg text-sm font-medium ${getStatusColor()}`}>
                    {getStatusText()}
                  </div>
                </div>

                {assignmentData.dueDate && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Due Date</div>
                    <div className="text-sm text-gray-900">
                      {new Date(assignmentData.dueDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                )}

                {daysUntilDue !== null && !submitted && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Time Remaining</div>
                    <div className={`text-sm font-medium ${daysUntilDue < 0 ? 'text-red-600' : daysUntilDue <= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {daysUntilDue > 0 ? `${daysUntilDue} days` : daysUntilDue === 0 ? 'Due today' : `${Math.abs(daysUntilDue)} days overdue`}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Maximum Points</div>
                  <div className="text-sm text-gray-900">{assignmentData.maxScore || 100} points</div>
                </div>

                {existingSubmission?.grade !== null && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Current Grade</div>
                    <div className="text-lg font-bold text-blue-600">
                      {existingSubmission.grade}/{assignmentData.maxScore || 100}
                    </div>
                    <div className="text-sm text-gray-500">
                      {((existingSubmission.grade / (assignmentData.maxScore || 100)) * 100).toFixed(1)}%
                    </div>
                  </div>
                )}
              </div>

              {!submitted && (
                <div className="mt-6 pt-4 border-t space-y-3">
                  <button
                    onClick={handleSubmitAssignment}
                    disabled={!canSubmit()}
                    className="w-full flex items-center justify-center px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Submit Assignment
                      </>
                    )}
                  </button>
                  
                  {!canSubmit() && !submitting && (
                    <p className="text-xs text-yellow-600 text-center flex items-center justify-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Add text or files to submit
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}