"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/authContext";
import { CheckCircle, XCircle, AlertCircle, ArrowLeft, Clock } from "lucide-react";

export default function QuizPage() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useParams();
  const courseId = params?.id;
  const quizId = params?.quizId;

  // --- Hooks declared at top ---
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState(null);

  // --- Fetch quiz and enrollment ---
  useEffect(() => {
    if (!user || !courseId || !quizId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch quiz module
        const res = await fetch(`/api/courses/${courseId}/modules/${quizId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch quiz");
        setQuizData(data.data);

        // Initialize answers
        const initialAnswers = {};
        data.data.quiz.questions.forEach((_, idx) => (initialAnswers[idx] = ""));
        setAnswers(initialAnswers);

        // Fetch enrollment
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User token not found");

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
        setError(err.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, courseId, quizId]);

  // --- Helper functions ---
  const handleSelect = (questionIdx, option) => {
    setAnswers((prev) => ({ ...prev, [questionIdx]: option }));
  };

  const allQuestionsAnswered = () =>
    quizData?.quiz?.questions?.every((_, idx) => answers[idx] && answers[idx].trim() !== "");

  const handleSubmit = async () => {
    if (!allQuestionsAnswered()) {
      setError("Please answer all questions before submitting");
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
      const res = await fetch(`/api/enrollments/grades`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          enrollmentId,
          itemType: "QUIZ",
          itemId: quizId,
          title: quizData?.title,
          answers,
        }),
      });

      const result = await res.json();

      if (result.success) {
        const latestGrade = result.data[result.data.length - 1];
        setScore(latestGrade.percentage);
        setSubmitted(true);
      } else {
        setError(result.error || "Failed to submit quiz");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Conditional JSX Rendering ---
  const questions = quizData?.quiz?.questions || [];
  const passingScore = 70;

  return (
    <div className="min-h-screen bg-background py-8">
      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-border mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading quiz...</p>
          </div>
        </div>
      )}

      {/* Not logged in */}
      {!loading && !user && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Not Logged In</h2>
            <p className="text-gray-600 mb-4">You must be logged in to take this quiz.</p>
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && !quizData && (
        <div className="flex items-center justify-center min-h-screen">
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
      )}

      {/* Quiz not found */}
      {!loading && !quizData && !error && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Quiz Found</h2>
            <p className="text-gray-600 mb-4">The quiz you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push(`/courses/${courseId}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Return to Course
            </button>
          </div>
        </div>
      )}

      {/* Quiz results */}
      {!loading && submitted && score !== null && quizData && (
        <div className="container mx-auto max-w-4xl px-4">
          <div className="bg-card rounded-lg shadow-lg p-8 text-center">
            {score >= passingScore ? (
              <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
            ) : (
              <XCircle className="h-16 w-16 text-error mx-auto mb-4" />
            )}
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {score >= passingScore ? "Congratulations!" : "Quiz Not Passed"}
            </h1>
            <p className="text-muted-foreground mb-4">
              {score >= passingScore
                ? "You have successfully completed this quiz."
                : `You need to score at least ${passingScore}% to pass.`}
            </p>
            <div className="bg-gradient-to-br from-muted to-background rounded-lg p-6 mb-6 border border-border">
              <div className="text-5xl font-bold text-accent mb-2">{score.toFixed(0)}%</div>
              <div className="text-muted-foreground text-lg">Your Score</div>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => router.push(`/courses/${courseId}/dashboard`)}
                className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-hover transition-all active:scale-95 shadow-md"
              >
                Return to Dashboard
              </button>
              {score < passingScore && (
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all active:scale-95 shadow-md"
                >
                  Retake Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quiz taking view */}
      {!loading && !submitted && quizData && (
        <div className="container mx-auto max-w-4xl px-4">
          {/* Header */}
          <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
          <button
            onClick={() => router.push(`/courses/${id}/dashboard`)}
            className="text-primary hover:text-primary-hover mb-2 text-sm"
          >
            ← Back to Dashboard
          </button>
            <h1 className="text-3xl font-bold text-primary mb-2">{quizData.title}</h1>
            {quizData.description && <p className="text-secondary mb-4">{quizData.description}</p>}
            <div className="flex items-center space-x-6 text-sm text-secondary bg-background rounded-lg p-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-primary" />
                <span>
                  <span className="font-semibold ">{questions.length}</span> questions
                </span>
              </div>
              <div>
                Passing score: <span className="font-semibold">{passingScore}%</span>
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
              <div key={idx} className="bg-card rounded-lg shadow-sm p-6 border border-border hover:border-blue-300">
                <h3 className="text-lg font-semibold text-primary mb-4">
                  <span className="inline-block w-8 h-8 bg-background text-accent rounded-full text-center leading-8 mr-3 text-sm font-bold">
                    {idx + 1}
                  </span>
                  {q.question}
                </h3>
                <div className="space-y-3 ml-11">
                  {q.options.map((opt, optIdx) => (
                  <label
                    key={optIdx}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all active:scale-95 ${
                      answers[idx] === opt
                        ? "bg-accent text-white border-accent"
                        : "border-border hover:border-accent hover:bg-muted"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${idx}`}
                      value={opt}
                      checked={answers[idx] === opt}
                      onChange={() => handleSelect(idx, opt)}
                      className="hidden"
                    />
                    <span
                      className={`${answers[idx] === opt ? "font-medium" : "text-foreground"}`}
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
                <span className="text-muted-foreground">Progress: </span>
                <span className={`font-semibold ${allQuestionsAnswered() ? "text-success" : "text-accent"}`}>
                  {Object.values(answers).filter((a) => a).length} / {questions.length} answered
                </span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting || !allQuestionsAnswered()}
                className="px-8 py-3 bg-accent text-white rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md transition-all active:scale-95"
              >
                {submitting ? "Submitting..." : "Submit Quiz"}
              </button>
            </div>
            {!allQuestionsAnswered() && (
              <p className="text-sm text-warning mt-3 text-right flex items-center justify-end">
                <AlertCircle className="h-4 w-4 mr-1" />
                Please answer all questions before submitting
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
