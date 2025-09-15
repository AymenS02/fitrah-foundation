'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, ArrowLeft, ArrowRight, ClipboardList, Clock, AlertCircle } from "lucide-react";

export default function QuizModulePage() {
  const { id: courseId, moduleId } = useParams();
  const router = useRouter();
  const [module, setModule] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    fetchModuleData();
  }, [moduleId]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0 && !showResults) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && quizStarted && !showResults) {
      // Auto submit when time runs out
      handleSubmitQuiz();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, showResults]);

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

  const startQuiz = () => {
    setQuizStarted(true);
    // Set timer for 30 minutes (1800 seconds) - adjust as needed
    setTimeLeft(1800);
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const calculateScore = () => {
    if (!module?.quiz?.questions) return 0;
    
    let correct = 0;
    module.quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++;
      }
    });
    
    return Math.round((correct / module.quiz.questions.length) * 100);
  };

  const handleSubmitQuiz = async () => {
    if (submitting) return;
    
    setSubmitting(true);
    try {
      const calculatedScore = calculateScore();
      setScore(calculatedScore);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/user/quiz/${moduleId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          courseId,
          answers,
          score: calculatedScore,
          timeTaken: timeLeft ? 1800 - timeLeft : 1800
        })
      });

      if (!response.ok) throw new Error('Failed to submit quiz');

      setShowResults(true);
      
      // If passed (70% or higher), mark as completed
      if (calculatedScore >= 70) {
        await fetch(`/api/user/modules/${moduleId}/complete`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ courseId })
        });
        
        await fetchModuleData();
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setError('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const nextQuestion = () => {
    if (currentQuestion < (module?.quiz?.questions?.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const getResultColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getResultMessage = (score) => {
    if (score >= 90) return 'Excellent work!';
    if (score >= 70) return 'Well done! You passed.';
    if (score >= 60) return 'Good effort, but you need 70% to pass.';
    return 'Keep studying and try again.';
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

  if (!module || module.type !== 'quiz') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Module Not Found</h2>
          <p className="text-gray-600">The quiz module you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const questions = module.quiz?.questions || [];
  const currentQuestionData = questions[currentQuestion];

  // Show results screen
  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center">
              <div className={`text-6xl font-bold mb-4 ${getResultColor(score)}`}>
                {score}%
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Quiz Complete!
              </h1>
              <p className={`text-xl mb-6 ${getResultColor(score)}`}>
                {getResultMessage(score)}
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {questions.filter((_, index) => answers[index] === questions[index].correctAnswer).length}
                    </div>
                    <div className="text-gray-600">Correct</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {questions.length - questions.filter((_, index) => answers[index] === questions[index].correctAnswer).length}
                    </div>
                    <div className="text-gray-600">Incorrect</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {questions.length}
                    </div>
                    <div className="text-gray-600">Total Questions</div>
                  </div>
                </div>
              </div>

              {score >= 70 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">
                      Module completed successfully!
                    </span>
                  </div>
                </div>
              )}

              {score < 70 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-yellow-800 font-medium">
                      You need 70% or higher to pass. Review the material and try again.
                    </span>
                  </div>
                </div>
              )}

              <div className="space-x-4">
                <button
                  onClick={() => router.push(`/courses/${courseId}`)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {score >= 70 ? 'Continue Course' : 'Back to Course'}
                </button>
                
                {score < 70 && (
                  <button
                    onClick={() => {
                      setShowResults(false);
                      setQuizStarted(false);
                      setCurrentQuestion(0);
                      setAnswers({});
                      setTimeLeft(null);
                    }}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Retake Quiz
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push(`/courses/${courseId}`)}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              disabled={quizStarted && !showResults}
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

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg mr-4">
                <ClipboardList className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{module.title}</h1>
                {module.description && (
                  <p className="text-gray-600 mt-1">{module.description}</p>
                )}
                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    QUIZ MODULE
                  </span>
                  <span>{questions.length} Questions</span>
                  <span>Passing Score: 70%</span>
                </div>
              </div>
            </div>

            {quizStarted && timeLeft !== null && (
              <div className="text-right">
                <div className="flex items-center text-red-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-lg font-mono font-bold">
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <div className="text-xs text-gray-500">Time Remaining</div>
              </div>
            )}
          </div>
        </div>

        {!quizStarted ? (
          /* Quiz Start Screen */
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center">
              <ClipboardList className="h-16 w-16 text-purple-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start the Quiz?</h2>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{questions.length}</div>
                    <div className="text-gray-600">Questions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">30</div>
                    <div className="text-gray-600">Minutes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">70%</div>
                    <div className="text-gray-600">Passing Score</div>
                  </div>
                </div>
              </div>

              <div className="text-left bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">Quiz Instructions:</h3>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• You have 30 minutes to complete the quiz</li>
                  <li>• You must score 70% or higher to pass</li>
                  <li>• You can navigate between questions using the Next/Previous buttons</li>
                  <li>• Your progress is saved automatically</li>
                  <li>• The quiz will auto-submit when time runs out</li>
                </ul>
              </div>

              <button
                onClick={startQuiz}
                className="px-8 py-3 bg-purple-600 text-white text-lg font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                Start Quiz
              </button>
            </div>
          </div>
        ) : (
          /* Quiz Question Screen */
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="text-sm text-gray-600">
                  {Object.keys(answers).length} answered
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Current Question */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              {currentQuestionData && (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    {currentQuestionData.question}
                  </h2>

                  <div className="space-y-3">
                    {currentQuestionData.options.map((option, index) => (
                      <label
                        key={index}
                        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          answers[currentQuestion] === option
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${currentQuestion}`}
                          value={option}
                          checked={answers[currentQuestion] === option}
                          onChange={() => handleAnswerChange(currentQuestion, option)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                          answers[currentQuestion] === option
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-gray-300'
                        }`}>
                          {answers[currentQuestion] === option && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span className="text-gray-900">{option}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center">
                <button
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                  className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>

                <div className="flex space-x-3">
                  {currentQuestion === questions.length - 1 ? (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={submitting || Object.keys(answers).length === 0}
                      className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Submit Quiz
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={nextQuestion}
                      disabled={currentQuestion === questions.length - 1}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}