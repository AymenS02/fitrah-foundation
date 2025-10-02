"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/authContext";
import { CheckCircle, ArrowLeft } from "lucide-react";

export default function AssignmentModulePage() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useParams();
  const courseId = params?.id;
  const assignmentId = params?.assignmentId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [module, setModule] = useState(null);
  const [enrollmentId, setEnrollmentId] = useState(null);
  const [submission, setSubmission] = useState({ text: "", files: [] });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!user || !courseId || !assignmentId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Get module
        const res = await fetch(`/api/courses/${courseId}/modules/${assignmentId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch assignment");
        setModule(data.data);

        // Get enrollment
        const token = localStorage.getItem("token");
        const enrollRes = await fetch(
          `/api/enrollments?studentId=${user.id}&courseId=${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const enrollData = await enrollRes.json();
        if (enrollRes.ok && enrollData.length > 0) {
          setEnrollmentId(enrollData[0]._id);
        } else {
          setError("You are not enrolled in this course.");
        }
      } catch (err) {
        setError(err.message || "Failed to load assignment");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, courseId, assignmentId]);

  const handleTextChange = (e) =>
    setSubmission((prev) => ({ ...prev, text: e.target.value }));

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSubmission((prev) => ({ ...prev, files: [...prev.files, ...files] }));
  };

  const handleSubmit = async () => {
    if (!submission.text.trim() && submission.files.length === 0) {
      setError("Please add text or upload a file.");
      return;
    }
    if (!enrollmentId) {
      setError("Enrollment ID missing!");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("module", assignmentId);
      formData.append("text", submission.text);
      submission.files.forEach((file) => formData.append("files", file));

      const res = await fetch(`/api/courses/${courseId}/modules/${assignmentId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to submit");

      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><p>Loading assignment...</p></div>;
  if (error && !module) return <div className="flex items-center justify-center min-h-screen"><p>{error}</p></div>;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <button
          onClick={() => router.push(`/courses/${courseId}`)}
          className="flex items-center text-blue-600 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Course
        </button>

        <h1 className="text-2xl font-bold mb-4">{module?.title}</h1>

        {/* Reading assignment */}
        {module?.assignment?.readingContent && (
          <div className="mb-6 p-4 bg-gray-50 rounded">
            <h2 className="font-semibold mb-2">Reading</h2>
            <p className="whitespace-pre-wrap">{module.assignment.readingContent}</p>
          </div>
        )}
        {module?.assignment?.readingUrl && (
          <div className="mb-6">
            <a
              href={module.assignment.readingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Open Reading Material
            </a>
          </div>
        )}

        {/* Submission */}
        {!submitted ? (
          <div className="space-y-4">
            <textarea
              value={submission.text}
              onChange={handleTextChange}
              placeholder="Write your answer..."
              className="w-full h-32 border rounded p-2"
            />
            <input type="file" multiple onChange={handleFileChange} />
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {submitting ? "Submitting..." : "Submit Assignment"}
            </button>
            {error && <p className="text-red-600">{error}</p>}
          </div>
        ) : (
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
            <p className="text-green-700 font-semibold">Submitted!</p>
          </div>
        )}
      </div>
    </div>
  );
}
