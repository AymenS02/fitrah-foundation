"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, AlertCircle, ArrowLeft, Clock } from "lucide-react";

export default function QuizPage() {
  const { id: courseId, quizId } = useParams();
  const router = useRouter();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!courseId || !quizId) return;

    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/courses/${courseId}/modules/${quizId}`);
        const data = await res.json();
        setQuizData(data.data);

        // Initialize answers
        const initialAnswers = {};
        data.data.quiz.questions.forEach((_, idx) => {
          initialAnswers[idx] = "";
        });
        setAnswers(initialAnswers);
      } catch (err) {
        setError("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

  const fetchEnrollment = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/enrollments/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setEnrollmentId(data.data._id); // store it in state
      } else {
        setError("You are not enrolled in this course.");
      }
    } catch (err) {
      setError("Failed to validate enrollment");
    }
  };

    fetchEnrollment();

    fetchQuiz();
  }, [courseId, quizId]);

  const handleSelect = (questionIdx, option) => {
    setAnswers((prev) => ({ ...prev, [questionIdx]: option }));
  };

  const allQuestionsAnswered = () => {
    return quizData?.quiz?.questions?.every((_, idx) => 
      answers[idx] && answers[idx].trim() !== ''
    );
  };

  const handleSubmit = async () => {
    if (!allQuestionsAnswered()) {
      setError('Please answer all questions before submitting');
      return;
    }

    if (!enrollmentId) {
      setError("Enrollment ID missing!");
      return;
    }

    setSubmitting(true);
    setError('');

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/enrollments/${enrollmentId}/grades`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          moduleId: quizId,
          answers
        })
      });

      const result = await res.json();
      if (result.success) {
        setScore(result.data.percentage);
        setSubmitted(true);
      } else {
        setError(result.error || 'Failed to submit quiz');
      }
    } catch (err) {
      setError("Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error && !quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
    );
  }

  const questions = quizData.quiz?.questions || [];
  const passingScore = 70;

  // Results view after submission
  if (submitted && score !== null) {
    const passed = score >= passingScore;

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Result Header */}
            <div className="text-center mb-8">
              {passed ? (
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              ) : (
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {passed ? 'Congratulations! 🎉' : 'Quiz Not Passed'}
              </h1>
              <p className="text-gray-600 mb-4">
                {passed 
                  ? 'You have successfully completed this quiz.' 
                  : `You need to score at least ${passingScore}% to pass.`}
              </p>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  {score.toFixed(0)}%
                </div>
                <div className="text-gray-600 text-lg">
                  Your Score
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => router.push(`/courses/${courseId}`)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
              >
                Return to Course
              </button>
              {!passed && (
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold transition-colors"
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <button
            onClick={() => router.push(`/courses/${courseId}`)}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{quizData.title}</h1>
          {quizData.description && (
            <p className="text-gray-600 mb-4">{quizData.description}</p>
          )}
          
          <div className="flex items-center space-x-6 text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-blue-600" />
              <span><span className="font-semibold">{questions.length}</span> questions</span>
            </div>
            <div>
              Passing score: <span className="font-semibold text-blue-600">{passingScore}%</span>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-6 mb-6">
          {questions.map((q, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:border-blue-300 transition-colors">
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
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${idx}`}
                      value={opt}
                      checked={answers[idx] === opt}
                      onChange={() => handleSelect(idx, opt)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className={`ml-3 ${answers[idx] === opt ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit button */}
        <div className="bg-white rounded-lg shadow-sm p-6 sticky bottom-4">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-gray-600">Progress: </span>
              <span className={`font-semibold ${allQuestionsAnswered() ? 'text-green-600' : 'text-blue-600'}`}>
                {Object.values(answers).filter(a => a).length} / {questions.length} answered
              </span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting || !allQuestionsAnswered()}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all shadow-md hover:shadow-lg disabled:shadow-none"
            >
              {submitting ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </span>
              ) : (
                'Submit Quiz'
              )}
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