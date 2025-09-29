"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function QuizPage() {
  const { id: courseId, quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});

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
        data.data.quiz.questions.forEach((q, idx) => {
          initialAnswers[idx] = "";
        });
        setAnswers(initialAnswers);
      } catch (err) {
        setError("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [courseId, quizId]);

  const handleSelect = (questionIdx, option) => {
    setAnswers((prev) => ({ ...prev, [questionIdx]: option }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/courses/${courseId}/modules/${quizId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      alert(`Quiz submitted! Your grade: ${data.grade}%`);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading quiz...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!quizData) return <p>No quiz found</p>;

  return (
    <div>
      <h1>{quizData.title}</h1>
      {quizData.quiz.questions.map((q, idx) => (
        <div key={idx} className="mb-4">
          <p>{q.question}</p>
          {q.options.map((opt) => (
            <label key={opt} className="block">
              <input
                type="radio"
                name={`question-${idx}`}
                value={opt}
                checked={answers[idx] === opt}
                onChange={() => handleSelect(idx, opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
        Submit Quiz
      </button>
    </div>
  );
}
