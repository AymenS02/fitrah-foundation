// app/admin/courses/[id]/modules/page.js
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

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'text',
    order: '',
    quiz: { questions: [{ question: '', options: [''], correctAnswer: '' }] },
    assignment: { instructions: '', dueDate: '', maxScore: 100 },
    pdf: { fileUrl: '' },
    text: { body: '' }
  });

  // ✅ Fetch course (with modules inside)
  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/courses/${courseId}`);
      const data = await res.json();

      if (data.success) {
        setCourse(data.data);
      } else {
        console.error("Error fetching course:", data.error);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) fetchCourse();
  }, [courseId]);

  // ✅ Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'text',
      order: '',
      quiz: { questions: [{ question: '', options: [''], correctAnswer: '' }] },
      assignment: { instructions: '', dueDate: '', maxScore: 100 },
      pdf: { fileUrl: '' },
      text: { body: '' }
    });
    setEditingModule(null);
    setShowForm(false);
  };

  // ✅ Save module (create or update)
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
        basePayload.text = { body: formData.text.body };
        break;
      case 'pdf':
        basePayload.pdf = { fileUrl: formData.pdf.fileUrl };
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

    // ✅ Use the correct API endpoint for both create & update
    const url = `/api/courses/${courseId}/modules`;
    const method = editingModule ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      resetForm();
      fetchCourse(); // reload course + modules
    } else {
      const error = await response.json();
      console.error("Error saving module:", error);
    }
  } catch (error) {
    console.error("Error saving module:", error);
  }
};


  // ✅ Edit module
  const handleEdit = (module) => {
    setEditingModule(module);
    setFormData({
      title: module.title,
      description: module.description,
      type: module.type,
      order: module.order,
      quiz: module.quiz || { questions: [{ question: '', options: [''], correctAnswer: '' }] },
      assignment: module.assignment || { instructions: '', dueDate: '', maxScore: 100 },
      pdf: module.pdf || { fileUrl: '' },
      text: module.text || { body: '' }
    });
    setShowForm(true);
  };

  const handleDelete = async (moduleId) => {
    if (!confirm("Are you sure you want to delete this module?")) return;
    try {
      const response = await fetch(
        `/api/courses/${courseId}/modules`,
        { method: "DELETE" }
      );

      if (response.ok) {
        fetchCourse(); // refresh modules
      } else {
        const error = await response.json();
        console.error("Error deleting module:", error);
      }
    } catch (error) {
      console.error("Error deleting module:", error);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading modules...</div>;
  if (!course) return <div className="text-center mt-10">Course not found</div>;

  const modules = course.modules || [];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => router.push(`/admin/courses/${courseId}`)}
            className="text-blue-600 hover:text-blue-800 mb-2"
          >
            ← Back to Course
          </button>
          <h1 className="text-3xl font-bold">{course.title} - Modules</h1>
          <p className="text-gray-600">Manage course modules and content</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? "Cancel" : "Add Module"}
        </button>
      </div>

      {/* Module Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6 mb-6 border">
          <h2 className="text-xl font-semibold mb-4">
            {editingModule ? "Edit Module" : "Create New Module"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Module Title"
              required
              className="border p-2 rounded"
            />
            <input
              name="order"
              type="number"
              value={formData.order}
              onChange={handleChange}
              placeholder="Order"
              className="border p-2 rounded"
            />
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="text">Text</option>
              <option value="pdf">PDF</option>
              <option value="quiz">Quiz</option>
              <option value="assignment">Assignment</option>
            </select>
          </div>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Module Description"
            className="border p-2 rounded w-full mb-4"
          />

          {/* Content fields */}
          {formData.type === 'text' && (
            <textarea
              value={formData.text.body}
              onChange={(e) => handleContentChange('text', { body: e.target.value })}
              placeholder="Enter text content..."
              className="border p-2 rounded w-full h-32"
              required
            />
          )}

          {formData.type === 'pdf' && (
            <input
              value={formData.pdf.fileUrl}
              onChange={(e) => handleContentChange('pdf', { fileUrl: e.target.value })}
              placeholder="PDF File URL"
              className="border p-2 rounded w-full"
              required
            />
          )}

          {formData.type === 'assignment' && (
            <div>
              <textarea
                value={formData.assignment.instructions}
                onChange={(e) => handleContentChange('assignment', {
                  ...formData.assignment,
                  instructions: e.target.value
                })}
                placeholder="Assignment instructions..."
                className="border p-2 rounded w-full h-24 mb-2"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={formData.assignment.dueDate}
                  onChange={(e) => handleContentChange('assignment', {
                    ...formData.assignment,
                    dueDate: e.target.value
                  })}
                  className="border p-2 rounded"
                />
                <input
                  type="number"
                  value={formData.assignment.maxScore}
                  onChange={(e) => handleContentChange('assignment', {
                    ...formData.assignment,
                    maxScore: parseInt(e.target.value)
                  })}
                  placeholder="Max Score"
                  className="border p-2 rounded"
                />
              </div>
            </div>
          )}

          {formData.type === 'quiz' && (
            <div>
              {formData.quiz.questions.map((question, qIndex) => (
                <div key={qIndex} className="border p-4 rounded mb-4">
                  <input
                    value={question.question}
                    onChange={(e) => handleQuizQuestionChange(qIndex, 'question', e.target.value)}
                    placeholder="Question text"
                    className="border p-2 rounded w-full mb-2"
                    required
                  />
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center mb-1">
                      <input
                        value={option}
                        onChange={(e) => handleQuizOptionChange(qIndex, oIndex, e.target.value)}
                        placeholder={`Option ${oIndex + 1}`}
                        className="border p-2 rounded flex-1 mr-2"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeQuizOption(qIndex, oIndex)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addQuizOption(qIndex)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Option
                  </button>

                  <select
                    value={question.correctAnswer}
                    onChange={(e) => handleQuizQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                    className="border p-2 rounded w-full mt-2"
                    required
                  >
                    <option value="">Select correct answer</option>
                    {question.options.map((option, oIndex) => (
                      <option key={oIndex} value={option}>{option || `Option ${oIndex + 1}`}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeQuizQuestion(qIndex)}
                    className="text-red-600 hover:text-red-800 mt-2"
                  >
                    Remove Question
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addQuizQuestion}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                + Add Question
              </button>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {editingModule ? "Update Module" : "Create Module"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Modules List */}
      <div className="space-y-4">
        {modules.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No modules created yet. Click "Add Module" to get started.
          </div>
        ) : (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Modules ({modules.length})</h3>
            <div className="space-y-2">
              {modules.map((module) => (
                <div key={module._id} className="border p-3 rounded flex justify-between">
                  <div>
                    <h4 className="font-medium">{module.title}</h4>
                    <p className="text-sm text-gray-600">{module.type}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(module)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(module._id)}
                      className="text-red-600 hover:text-red-800"
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
  );
}
