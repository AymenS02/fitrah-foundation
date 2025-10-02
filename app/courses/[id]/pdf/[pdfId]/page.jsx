'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, ArrowLeft, ArrowRight, FileText, Download, ExternalLink } from "lucide-react";

export default function PdfModulePage() {
  const { id: courseId, moduleId } = useParams();
  const router = useRouter();
  const [module, setModule] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState('');
  const [pdfLoaded, setPdfLoaded] = useState(false);

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

  const completeModule = async () => {
    if (completing || isCompleted()) return;

    setCompleting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/user/modules/${moduleId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courseId })
      });

      if (!response.ok) throw new Error('Failed to complete module');

      // Refresh enrollment data
      await fetchModuleData();
      
      // Show success message
      setTimeout(() => {
        router.push(`/courses/${courseId}`);
      }, 1500);
    } catch (error) {
      console.error('Error completing module:', error);
      setError('Failed to complete module');
    } finally {
      setCompleting(false);
    }
  };

  const handleDownload = () => {
    if (module?.pdf?.fileUrl) {
      const link = document.createElement('a');
      link.href = module.pdf.fileUrl;
      link.download = `${module.title}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const openInNewTab = () => {
    if (module?.pdf?.fileUrl) {
      window.open(module.pdf.fileUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
            onClick={() => router.push(`/courses/${courseId}`)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  if (!module || module.type !== 'pdf') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Module Not Found</h2>
          <p className="text-gray-600">The PDF module you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
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
            
            {isCompleted() && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">Completed</span>
              </div>
            )}
          </div>

          <div className="flex items-center mb-4">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg mr-4">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{module.title}</h1>
              {module.description && (
                <p className="text-gray-600 mt-1">{module.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">
                PDF MODULE
              </span>
              <span>Module {module.order || 1}</span>
            </div>

            {/* PDF Controls */}
            <div className="flex space-x-2">
              <button
                onClick={handleDownload}
                className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </button>
              <button
                onClick={openInNewTab}
                className="flex items-center px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Open in New Tab
              </button>
            </div>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          {module.pdf?.fileUrl ? (
            <div className="relative">
              {!pdfLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading PDF...</p>
                  </div>
                </div>
              )}
              <iframe
                src={`${module.pdf.fileUrl}#view=FitH`}
                className={`w-full rounded-lg transition-opacity ${pdfLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{ height: '80vh' }}
                onLoad={() => setPdfLoaded(true)}
                onError={() => {
                  setPdfLoaded(true);
                  setError('Failed to load PDF. Please try downloading it instead.');
                }}
                title={module.title}
              />
            </div>
          ) : (
            <div className="p-12 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No PDF Available</h3>
              <p className="text-gray-600">The PDF file is not available for this module.</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {isCompleted() ? (
                <span className="text-green-600 font-medium">
                  ✓ You've completed this module
                </span>
              ) : (
                <span>Review the PDF document above to complete this module.</span>
              )}
            </div>

            <div className="flex space-x-3">
              {!isCompleted() && (
                <button
                  onClick={completeModule}
                  disabled={completing}
                  className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                onClick={() => router.push(`/courses/${courseId}`)}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Module Completed!
                </h3>
                <p className="text-gray-600">
                  Great job! You've successfully completed this PDF module.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}