"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/authContext"; // ✅ get logged-in user
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Clock,
} from "lucide-react";

export default function QuizPage() {
  const { id: courseId, quizId } = useParams();
  const router = useRouter();
  const { user } = useAuth(); // ✅ comes from context
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState(null);

  useEffect(() => {
    if (!courseId || !quizId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. ✅ Fetch quiz
        const res = await fetch(`/api/courses/${courseId}/modules/${quizId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch quiz");
        setQuizData(data.data);

        // Initialize answers
        const initialAnswers = {};
        data.data.quiz.questions.forEach((_, idx) => {
          initialAnswers[idx] = "";
        });
        setAnswers(initialAnswers);

        // 2. ✅ Fetch enrollment
        if (!user?.id) {
          setError("You must be logged in to take this quiz.");
          return;
        }

        const token = localStorage.getItem("token");
        const enrollRes = await fetch(
          `/api/enrollments?studentId=${user.id}&courseId=${courseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const enrollData = await enrollRes.json();

        if (enrollRes.ok && enrollData.length > 0) {
          setEnrollmentId(enrollData[0]._id); // DB enrollment document id
        } else {
          setError("You are not enrolled in this course.");
        }
      } catch (err) {
        setError(err.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, quizId, user]);

  const handleSelect = (questionIdx, option) => {
    setAnswers((prev) => ({ ...prev, [questionIdx]: option }));
  };

  const allQuestionsAnswered = () => {
    return quizData?.quiz?.questions?.every(
      (_, idx) => answers[idx] && answers[idx].trim() !== ""
    );
  };

 const handleSubmit = async () => {
  if (!allQuestionsAnswered()) {
    setError("Please answer all questions before submitting");
    return;
  }

  if (!user?.id) {
    setError("You must be logged in to submit the quiz");
    return;
  }

  setSubmitting(true);
  setError("");

  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`/api/enrollments/grades`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        studentId: user.id,
        courseId: courseId,
        moduleId: quizId,
        answers,
      }),
    });

    const result = await res.json();

    if (result.success) {
      setScore(result.data.percentage);
      setSubmitted(true);
    } else {
      setError(result.error || "Failed to submit quiz");
    }
  } catch (err) {
    setError("Failed to submit quiz");
  } finally {
    setSubmitting(false);
  }
};

  // === UI logic ===

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-border mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error && !quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push(`/courses/${courseId}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Return to Course
          </button>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Quiz Found</h2>
          <p className="text-gray-600 mb-4">
            The quiz you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push(`/courses/${courseId}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Return to Course
          </button>
        </div>
      </div>
    );
  }

  const questions = quizData.quiz?.questions || [];
  const passingScore = 70;

  // Results view
  if (submitted && score !== null) {
    const passed = score >= passingScore;

    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            {passed ? (
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {passed ? "Congratulations! 🎉" : "Quiz Not Passed"}
            </h1>
            <p className="text-gray-600 mb-4">
              {passed
                ? "You have successfully completed this quiz."
                : `You need to score at least ${passingScore}% to pass.`}
            </p>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
              <div className="text-5xl font-bold text-blue-600 mb-2">
                {score.toFixed(0)}%
              </div>
              <div className="text-gray-600 text-lg">Your Score</div>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => router.push(`/courses/${courseId}`)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Return to Course
              </button>
              {!passed && (
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Retake Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz taking view
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
          <button
            onClick={() => router.push(`/courses/${courseId}`)}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {quizData.title}
          </h1>
          {quizData.description && (
            <p className="text-gray-600 mb-4">{quizData.description}</p>
          )}
          <div className="flex items-center space-x-6 text-sm text-gray-600 bg-foreground rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-blue-600" />
              <span>
                <span className="font-semibold">{questions.length}</span>{" "}
                questions
              </span>
            </div>
            <div>
              Passing score:{" "}
              <span className="font-semibold text-blue-600">
                {passingScore}%
              </span>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-error border border-border rounded-lg p-4 mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-6 mb-6">
          {questions.map((q, idx) => (
            <div
              key={idx}
              className="bg-card rounded-lg shadow-sm p-6 border border-border hover:border-blue-300"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <span className="inline-block w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-center leading-8 mr-3 text-sm font-bold">
                  {idx + 1}
                </span>
                {q.question}
              </h3>
              <div className="space-y-3 ml-11">
                {q.options.map((opt, optIdx) => (
                  <label
                    key={optIdx}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      answers[idx] === opt
                        ? "border-blue-500 bg-blue-50"
                        : "border-border hover:border-blue-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${idx}`}
                      value={opt}
                      checked={answers[idx] === opt}
                      onChange={() => handleSelect(idx, opt)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span
                      className={`ml-3 ${
                        answers[idx] === opt
                          ? "text-gray-900 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="bg-card rounded-lg shadow-sm p-6 sticky bottom-4">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-gray-600">Progress: </span>
              <span
                className={`font-semibold ${
                  allQuestionsAnswered()
                    ? "text-green-600"
                    : "text-secondary"
                }`}
              >
                {Object.values(answers).filter((a) => a).length} /{" "}
                {questions.length} answered
              </span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting || !allQuestionsAnswered()}
              className="px-8 py-3 bg-accent text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold shadow-md"
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
          </div>
          {!allQuestionsAnswered() && (
            <p className="text-sm text-amber-600 mt-3 text-right flex items-center justify-end">
              <AlertCircle className="h-4 w-4 mr-1" />
              Please answer all questions before submitting
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
