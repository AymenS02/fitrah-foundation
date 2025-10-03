'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FileText, Download, CheckCircle, Clock, User, Calendar, ExternalLink } from 'lucide-react';

const AdminGradingPage = () => {
  const [activeTab, setActiveTab] = useState('ungraded');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  
  const params = useParams();
  const router = useRouter();
  const courseId = params.id;

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/courses/${courseId}/submissions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Failed to fetch submissions");

      const data = await res.json();
      setSubmissions(data);
      console.log('Fetched submissions:', data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchSubmissions();
    }
  }, [courseId]);

  const ungradedSubmissions = submissions.filter(sub => sub.grade === null || sub.grade === undefined);
  const gradedSubmissions = submissions.filter(sub => sub.grade !== null && sub.grade !== undefined);

  const currentSubmissions = activeTab === 'ungraded' ? ungradedSubmissions : gradedSubmissions;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleGradeSubmit = async () => {
    if (!gradeInput || gradeInput < 0 || gradeInput > 100) {
      return;
    }

    setSubmitLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('Submitting grade:', {
        submissionId: selectedSubmission._id,
        grade: parseFloat(gradeInput),
        feedback: feedbackInput
      });
      const response = await fetch(`/api/admin/enrollments/${selectedSubmission.enrollmentId}/grade`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          submissionId: selectedSubmission._id,
          grade: parseFloat(gradeInput),
          feedback: feedbackInput || undefined
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit grade');
      }

      await fetchSubmissions();
      
      setSelectedSubmission(null);
      setGradeInput('');
      setFeedbackInput('');
    } catch (error) {
      console.error('Error submitting grade:', error);
      setError(error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border rounded-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.push(`/admin/courses/${courseId}`)}
            className="text-primary hover:text-primary-hover mb-2 flex items-center gap-1 transition-colors"
          >
            ← Back to Course
          </button>
          <h1 className="text-3xl font-bold text-foreground font-palanquin-dark">Assignment Grading</h1>
          <p className="mt-1 text-sm text-muted-foreground">Review and grade student submissions</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center mt-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Loading submissions...</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          {/* Tabs */}
          <div className="border-b border-border">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('ungraded')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'ungraded'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Needs Grading
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    activeTab === 'ungraded' 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {ungradedSubmissions.length}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('graded')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'graded'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Graded
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    activeTab === 'graded' 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {gradedSubmissions.length}
                  </span>
                </div>
              </button>
            </nav>
          </div>

          {/* Submissions List */}
          <div className="mt-6 space-y-4">
            {currentSubmissions.length === 0 ? (
              <div className="bg-card rounded-lg shadow-sm border border-border p-12 text-center">
                <div className="flex flex-col items-center">
                  {activeTab === 'ungraded' ? (
                    <>
                      <CheckCircle className="w-12 h-12 text-muted-foreground mb-3" />
                      <h3 className="text-lg font-medium text-foreground">All caught up!</h3>
                      <p className="mt-1 text-sm text-muted-foreground">No submissions need grading at the moment.</p>
                    </>
                  ) : (
                    <>
                      <FileText className="w-12 h-12 text-muted-foreground mb-3" />
                      <h3 className="text-lg font-medium text-foreground">No graded submissions</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Graded submissions will appear here.</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              currentSubmissions.map((submission) => (
                <div key={submission._id} className="bg-card rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{submission.module?.title || 'Untitled Assignment'}</h3>
                        {submission.grade !== null && submission.grade !== undefined && (
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            submission.grade >= 90 ? 'bg-success/10 text-success' :
                            submission.grade >= 80 ? 'bg-info/10 text-info' :
                            submission.grade >= 70 ? 'bg-warning/10 text-warning' :
                            'bg-error/10 text-error'
                          }`}>
                            {submission.grade}%
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{submission.course?.title || 'Course'}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span className="text-foreground">{submission.user?.firstName} {submission.user?.lastName}</span>
                          <span className="text-muted-foreground">({submission.user?.email})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Submitted {formatDate(submission.submittedAt)}</span>
                        </div>
                      </div>

                      {submission.feedback && (
                        <div className="mt-3 p-3 bg-muted rounded-md">
                          <p className="text-sm text-foreground"><span className="font-medium">Feedback:</span> {submission.feedback}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      {/* <a
                        href={submission.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </a> */}
                      <a
                        href={submission.fileUrl}
                        download
                        className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                      {activeTab === 'ungraded' && (
                        <button
                          onClick={() => setSelectedSubmission(submission)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                        >
                          Grade
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Grading Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-2xl font-bold text-foreground font-palanquin-dark">Grade Submission</h2>
              <p className="mt-1 text-sm text-muted-foreground">{selectedSubmission.module?.title || 'Assignment'}</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Student: <span className="font-medium text-foreground">{selectedSubmission.user?.firstName} {selectedSubmission.user?.lastName}</span></p>
                <p className="text-sm text-muted-foreground">Submitted: <span className="font-medium text-foreground">{formatDate(selectedSubmission.submittedAt)}</span></p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Grade (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={gradeInput}
                  onChange={(e) => setGradeInput(e.target.value)}
                  className="w-full px-4 py-2 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
                  placeholder="Enter grade"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Feedback (Optional)
                </label>
                <textarea
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
                  placeholder="Provide feedback for the student..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-border flex gap-3 justify-end">
              <button
                onClick={() => {
                  setSelectedSubmission(null);
                  setGradeInput('');
                  setFeedbackInput('');
                }}
                className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGradeSubmit}
                disabled={!gradeInput || gradeInput < 0 || gradeInput > 100 || submitLoading}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading ? 'Submitting...' : 'Submit Grade'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGradingPage;