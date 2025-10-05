'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function CourseModules() {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const params = useParams();
  const router = useRouter();
  const courseId = params.id;

  const initialFormData = {
    title: '',
    description: '',
    type: 'text',
    order: '',
    quiz: { questions: [{ question: '', options: [''], correctAnswer: '' }] },
    assignment: { instructions: '', dueDate: '', maxScore: 100 },
    text: { body: '', fileUrl: '' },
  };

  const [formData, setFormData] = useState(initialFormData);

  // Fetch course + modules
  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/courses/${courseId}`);

      if (!res.ok) throw new Error("Failed to fetch course");

      const data = await res.json();
      
      setCourse(data);
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) fetchCourse();
  }, [courseId]);

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingModule(null);
    setShowForm(false);
  };

  const handleQuizQuestionChange = (index, field, value) => {
    const updatedQuestions = formData.quiz.questions.map((q, i) =>
      i === index ? { ...q, [field]: value } : q
    );
    handleContentChange('quiz', { ...formData.quiz, questions: updatedQuestions });
  };

  const handleQuizOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = formData.quiz.questions.map((q, i) =>
      i === qIndex
        ? { ...q, options: q.options.map((opt, j) => (j === oIndex ? value : opt)) }
        : q
    );
    handleContentChange('quiz', { ...formData.quiz, questions: updatedQuestions });
  };

  const addQuizQuestion = () => {
    handleContentChange('quiz', {
      ...formData.quiz,
      questions: [...formData.quiz.questions, { question: '', options: [''], correctAnswer: '' }]
    });
  };

  const removeQuizQuestion = (index) => {
    const updatedQuestions = formData.quiz.questions.filter((_, i) => i !== index);
    handleContentChange('quiz', { ...formData.quiz, questions: updatedQuestions });
  };

  const addQuizOption = (qIndex) => {
    const updatedQuestions = formData.quiz.questions.map((q, i) =>
      i === qIndex ? { ...q, options: [...q.options, ''] } : q
    );
    handleContentChange('quiz', { ...formData.quiz, questions: updatedQuestions });
  };

  const removeQuizOption = (qIndex, oIndex) => {
    const updatedQuestions = formData.quiz.questions.map((q, i) =>
      i === qIndex ? { ...q, options: q.options.filter((_, j) => j !== oIndex) } : q
    );
    handleContentChange('quiz', { ...formData.quiz, questions: updatedQuestions });
  };
  
  // Submit module (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const basePayload = {
        courseId,
        title: formData.title,
        description: formData.description,
        order: Number(formData.order) || 0,
        type: formData.type,
      };

    switch (formData.type) {
      case 'text':
        basePayload.text = { body: formData.text.body, fileUrl: formData.text.fileUrl };
        break;
      case 'assignment':
        basePayload.assignment = {
          instructions: formData.assignment.instructions,
          dueDate: formData.assignment.dueDate || null,
          maxScore: Number(formData.assignment.maxScore) || 100
        };
        break;
      case 'quiz':
        basePayload.quiz = formData.quiz;
        break;
    }

    const payload = editingModule
      ? { ...basePayload, _id: editingModule._id }
      : basePayload;

    const url = `/api/courses/${courseId}/modules`;
      const method = editingModule ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      resetForm();
      fetchCourse();
    } else {
      const error = await response.json();
      console.error("Error saving module:", error);
    }
    } catch (error) {
      console.error("Error saving module:", error);
    }
  };

  // Edit module
  const handleEdit = (module) => {
    setEditingModule(module);
    setFormData({
      title: module.title,
      description: module.description,
      type: module.type,
      order: module.order,
      quiz: module.quiz || { questions: [{ question: '', options: [''], correctAnswer: '' }] },
      assignment: module.assignment || { instructions: '', dueDate: '', maxScore: 100 },
      text: module.text || { body: '', fileUrl: '' }
    });
    setShowForm(true);
  };

  // Delete module
  const handleDelete = async (moduleId) => {
    if (!confirm("Are you sure you want to delete this module?")) return;

    try {
      const res = await fetch(`/api/courses/${courseId}/modules`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: moduleId }),
      });

      if (!res.ok) throw new Error("Failed to delete module");

      const data = await res.json();
      console.log("Deleted:", data);

      fetchCourse();
    } catch (error) {
      console.error("Error deleting module:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-muted-foreground">Loading modules...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-muted-foreground">Course not found</div>
      </div>
    );
  }

  const modules = course.modules || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
          <div className="min-w-0 flex-1">
            <button
              onClick={() => router.push(`/admin/courses/${courseId}`)}
              className="text-primary hover:text-primary-hover mb-2 transition-colors text-sm sm:text-base"
            >
              ← Back to Course
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-palanquin-dark break-words">
              {course.title} - Modules
            </h1>
            <p className="text-sm text-muted-foreground">Manage course modules and content</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors text-sm sm:text-base whitespace-nowrap self-start sm:self-auto"
          >
            {showForm ? "Cancel" : "Add Module"}
          </button>
        </div>

        {/* Module Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-card shadow-md rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-border">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-foreground">
              {editingModule ? "Edit Module" : "Create New Module"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Module Title"
                required
                className="border border-border bg-background text-foreground p-2 sm:p-3 rounded focus:border-primary focus:outline-none text-sm sm:text-base"
              />
              <input
                name="order"
                type="number"
                value={formData.order}
                onChange={handleChange}
                placeholder="Order"
                className="border border-border bg-background text-foreground p-2 sm:p-3 rounded focus:border-primary focus:outline-none text-sm sm:text-base"
              />
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="border border-border bg-background text-foreground p-2 sm:p-3 rounded focus:border-primary focus:outline-none text-sm sm:text-base"
              >
                <option value="text">Text</option>
                <option value="quiz">Quiz</option>
                <option value="assignment">Assignment</option>
              </select>
            </div>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Module Description"
              className="border border-border bg-background text-foreground p-2 sm:p-3 rounded w-full mb-4 focus:border-primary focus:outline-none text-sm sm:text-base min-h-[60px]"
            />

            {/* Content fields */}
            {formData.type === 'text' && (
              <div className="space-y-3">
                <textarea
                  value={formData.text.body}
                  onChange={(e) => handleContentChange('text', { body: e.target.value, fileUrl: formData.text.fileUrl })}
                  placeholder="Enter text content..."
                  className="border border-border bg-background text-foreground p-2 sm:p-3 rounded w-full h-32 sm:h-40 focus:border-primary focus:outline-none text-sm sm:text-base"
                  required
                />
                <input
                  value={formData.text.fileUrl}
                  onChange={(e) => handleContentChange('text', { body: formData.text.body, fileUrl: e.target.value })}
                  placeholder="Text File URL (optional)"
                  className="border border-border bg-background text-foreground p-2 sm:p-3 rounded w-full focus:border-primary focus:outline-none text-sm sm:text-base"
                />
              </div>
            )}

            {formData.type === 'assignment' && (
              <div className="space-y-3">
                <textarea
                  value={formData.assignment.instructions}
                  onChange={(e) => handleContentChange('assignment', {
                    ...formData.assignment,
                    instructions: e.target.value
                  })}
                  placeholder="Assignment instructions..."
                  className="border border-border bg-background text-foreground p-2 sm:p-3 rounded w-full h-24 sm:h-32 focus:border-primary focus:outline-none text-sm sm:text-base"
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <input
                    type="date"
                    value={formData.assignment.dueDate}
                    onChange={(e) => handleContentChange('assignment', {
                      ...formData.assignment,
                      dueDate: e.target.value
                    })}
                    className="border border-border bg-background text-foreground p-2 sm:p-3 rounded focus:border-primary focus:outline-none text-sm sm:text-base"
                  />
                  <input
                    type="number"
                    value={formData.assignment.maxScore}
                    onChange={(e) => handleContentChange('assignment', {
                      ...formData.assignment,
                      maxScore: parseInt(e.target.value)
                    })}
                    placeholder="Max Score"
                    className="border border-border bg-background text-foreground p-2 sm:p-3 rounded focus:border-primary focus:outline-none text-sm sm:text-base"
                  />
                </div>
              </div>
            )}

            {formData.type === 'quiz' && (
              <div className="space-y-4">
                {formData.quiz.questions.map((question, qIndex) => (
                  <div key={qIndex} className="border border-border bg-muted/20 p-3 sm:p-4 rounded">
                    <div className="flex items-start justify-between mb-2">
                      <label className="text-sm font-medium text-foreground">Question {qIndex + 1}</label>
                      <button
                        type="button"
                        onClick={() => removeQuizQuestion(qIndex)}
                        className="text-error hover:opacity-80 text-sm sm:text-base"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      value={question.question}
                      onChange={(e) => handleQuizQuestionChange(qIndex, 'question', e.target.value)}
                      placeholder="Question text"
                      className="border border-border bg-background text-foreground p-2 rounded w-full mb-3 focus:border-primary focus:outline-none text-sm sm:text-base"
                      required
                    />
                    <div className="space-y-2 mb-3">
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-2">
                          <input
                            value={option}
                            onChange={(e) => handleQuizOptionChange(qIndex, oIndex, e.target.value)}
                            placeholder={`Option ${oIndex + 1}`}
                            className="border border-border bg-background text-foreground p-2 rounded flex-1 focus:border-primary focus:outline-none text-sm sm:text-base"
                            required
                          />
                          {question.options.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeQuizOption(qIndex, oIndex)}
                              className="text-error hover:opacity-80 text-lg sm:text-xl flex-shrink-0 w-8 h-8 flex items-center justify-center"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => addQuizOption(qIndex)}
                      className="text-primary hover:text-primary-hover text-xs sm:text-sm mb-3 block"
                    >
                      + Add Option
                    </button>

                    <select
                      value={question.correctAnswer}
                      onChange={(e) => handleQuizQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                      className="border border-border bg-background text-foreground p-2 rounded w-full focus:border-primary focus:outline-none text-sm sm:text-base"
                      required
                    >
                      <option value="">Select correct answer</option>
                      {question.options.map((option, oIndex) => (
                        <option key={oIndex} value={option}>{option || `Option ${oIndex + 1}`}</option>
                      ))}
                    </select>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addQuizQuestion}
                  className="bg-success text-white px-3 py-2 rounded text-xs sm:text-sm hover:opacity-90 w-full sm:w-auto"
                >
                  + Add Question
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
              <button
                type="submit"
                className="bg-success text-white px-4 py-2 rounded hover:opacity-90 transition-opacity text-sm sm:text-base order-1 sm:order-1"
              >
                {editingModule ? "Update Module" : "Create Module"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-muted text-foreground px-4 py-2 rounded hover:bg-muted/80 transition-colors text-sm sm:text-base order-2 sm:order-2"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Modules List */}
        <div className="space-y-4 pb-6">
          {modules.length === 0 ? (
            <div className="text-center py-8 text-sm sm:text-base text-muted-foreground bg-card border border-border rounded-lg">
              No modules created yet. Click "Add Module" to get started.
            </div>
          ) : (
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-foreground text-base sm:text-lg">
                Modules ({modules.length})
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {modules.map((module) => (
                  <div 
                    key={module._id} 
                    className="border border-border bg-card p-3 sm:p-4 rounded flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 hover:bg-muted/20 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-foreground text-sm sm:text-base break-words">
                        {module.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground capitalize mt-0.5">
                        {module.type} • Order: {module.order}
                      </p>
                    </div>
                    <div className="flex gap-2 sm:gap-3 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(module)}
                        className="text-primary hover:text-primary-hover transition-colors text-sm sm:text-base px-2 py-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(module._id)}
                        className="text-error hover:opacity-80 transition-opacity text-sm sm:text-base px-2 py-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}