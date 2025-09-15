'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, ArrowLeft, ArrowRight, Play, Upload, FileText, Calendar, Clock, AlertCircle } from "lucide-react";

export default function AssignmentModulePage() {
  const { id: courseId, moduleId } = useParams();
  const router = useRouter();
  const [module, setModule] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Assignment state
  const [submission, setSubmission] = useState({
    text: '',
    files: []
  });
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchModuleData();
  }, [moduleId]);

  const fetchModuleData = async () => {
    try {
      setLoading(true);
      
      // Fetch module details
      const moduleRes = await fetch(`/api/modules/${moduleId}`);
      if (!moduleRes.ok) throw new Error("Failed to fetch module");
      const moduleData = await moduleRes.json();
      setModule(moduleData.data);

      // Fetch user's enrollment
      const token = localStorage.getItem('token');
      const enrollmentRes = await fetch(`/api/user/enrollments/${courseId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (enrollmentRes.ok) {
        const enrollmentData = await enrollmentRes.json();
        setEnrollment(enrollmentData);
      }

      // Fetch existing submission
      const submissionRes = await fetch(`/api/user/assignments/${moduleId}/submission`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (submissionRes.ok) {
        const submissionData = await submissionRes.json();
        setExistingSubmission(submissionData);
        if (submissionData.text) {
          setSubmission(prev => ({ ...prev, text: submissionData.text }));
        }
      }
    } catch (error) {
      console.error("Error fetching module:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const isCompleted = () => {
    return enrollment?.completedModules?.includes(moduleId) || false;
  };

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

  const handleSubmitAssignment = async () => {
    if (submitting) return;
    
    if (!submission.text.trim() && submission.files.length === 0) {
      setError('Please provide either text submission or upload files');
      return;
    }

    setSubmitting(true);
    setUploadProgress(0);
    
    try {
      const token = localStorage.getItem('token');
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('courseId', courseId);
      formData.append('text', submission.text);
      
      submission.files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch(`/api/user/assignments/${moduleId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to submit assignment');

      // Mark module as completed
      await fetch(`/api/user/modules/${moduleId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courseId })
      });

      // Refresh data
      await fetchModuleData();
      
      setError('');
      alert('Assignment submitted successfully!');
    } catch (error) {
      console.error('Error submitting assignment:', error);
      setError('Failed to submit assignment');
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = () => {
    if (isCompleted()) return 'text-green-600 bg-green-50 border-green-200';
    if (isOverdue()) return 'text-red-600 bg-red-50 border-red-200';
    if (existingSubmission) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  };

  const getStatusText = () => {
    if (isCompleted()) return 'Completed';
    if (isOverdue()) return 'Overdue';
    if (existingSubmission) return 'Submitted - Pending Review';
    return 'Not Submitted';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => router.push(`/courses/${courseId}`)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  if (!module || module.type !== 'assignment') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Module Not Found</h2>
          <p className="text-gray-600">The assignment module you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const daysUntilDue = getDaysUntilDue();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push(`/courses/${courseId}`)}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Course
            </button>
            
            <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </div>
          </div>

          <div className="flex items-center mb-4">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg mr-4">
              <Play className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{module.title}</h1>
              {module.description && (
                <p className="text-gray-600 mt-1">{module.description}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
              ASSIGNMENT MODULE
            </span>
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Max Score: {module.assignment?.maxScore || 100} points
            </span>
            {module.assignment?.dueDate && (
              <span className={`flex items-center ${isOverdue() ? 'text-red-600' : daysUntilDue <= 3 ? 'text-yellow-600' : 'text-gray-500'}`}>
                <Clock className="h-4 w-4 mr-1" />
                Due: {new Date(module.assignment.dueDate).toLocaleDateString()}
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
          {/* Instructions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h2>
              <div className="prose prose-gray max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {module.assignment?.instructions || 'No instructions provided.'}
                </div>
              </div>
            </div>

            {/* Submission Form */}
            {!isCompleted() && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Submission</h2>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                      <span className="text-red-800 text-sm">{error}</span>
                    </div>
                  </div>
                )}

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
                        <div className="text-xs text-gray-500">
                          PDF, DOC, DOCX, TXT files up to 10MB each
                        </div>
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                          onChange={handleFileChange}
                          className="mt-2"
                          disabled={submitting}
                        />
                      </div>
                    </div>

                    {/* File List */}
                    {submission.files.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {submission.files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <span className="text-xs text-gray-500 ml-2">
                                ({formatFileSize(file.size)})
                              </span>
                            </div>
                            <button
                              onClick={() => removeFile(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                              disabled={submitting}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleSubmitAssignment}
                      disabled={submitting || (!submission.text.trim() && submission.files.length === 0)}
                      className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  </div>
                </div>
              </div>
            )}

            {/* Existing Submission Display */}
            {existingSubmission && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Previous Submission</h2>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="text-xs text-gray-500 mb-2">
                    Submitted on: {new Date(existingSubmission.submittedAt).toLocaleString()}
                  </div>
                  
                  {existingSubmission.text && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Text Response:</h4>
                      <div className="bg-white p-3 rounded border">
                        <p className="text-gray-800 whitespace-pre-wrap">{existingSubmission.text}</p>
                      </div>
                    </div>
                  )}

                  {existingSubmission.files && existingSubmission.files.length > 0 && (
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
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-blue-900">Grade:</span>
                        <span className="text-xl font-bold text-blue-900">
                          {existingSubmission.grade}/{module.assignment?.maxScore || 100}
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
                {/* Status */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Status</div>
                  <div className={`px-3 py-2 rounded-lg text-sm font-medium ${getStatusColor()}`}>
                    {getStatusText()}
                  </div>
                </div>

                {/* Due Date */}
                {module.assignment?.dueDate && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Due Date</div>
                    <div className="text-sm text-gray-900">
                      {new Date(module.assignment.dueDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(module.assignment.dueDate).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                )}

                {/* Time Remaining */}
                {daysUntilDue !== null && !isCompleted() && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Time Remaining</div>
                    <div className={`text-sm ${daysUntilDue < 0 ? 'text-red-600' : daysUntilDue <= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {daysUntilDue > 0 ? `${daysUntilDue} days` : daysUntilDue === 0 ? 'Due today' : `${Math.abs(daysUntilDue)} days overdue`}
                    </div>
                  </div>
                )}

                {/* Max Score */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Maximum Points</div>
                  <div className="text-sm text-gray-900">{module.assignment?.maxScore || 100} points</div>
                </div>

                {/* Attempts */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Attempts Allowed</div>
                  <div className="text-sm text-gray-900">
                    {module.assignment?.attemptsAllowed === -1 ? 'Unlimited' : module.assignment?.attemptsAllowed || 1}
                  </div>
                </div>

                {/* Current Grade */}
                {existingSubmission?.grade !== null && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Current Grade</div>
                    <div className="text-lg font-bold text-blue-600">
                      {existingSubmission.grade}/{module.assignment?.maxScore || 100}
                    </div>
                    <div className="text-sm text-gray-500">
                      {((existingSubmission.grade / (module.assignment?.maxScore || 100)) * 100).toFixed(1)}%
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-4 border-t">
                <button
                  onClick={() => router.push(`/courses/${courseId}`)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Course
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}