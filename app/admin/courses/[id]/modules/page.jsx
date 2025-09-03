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
    pdf: { fileUrl: '' },
    text: { body: '' }
  };

  const [formData, setFormData] = useState(initialFormData);

  // Fetch course + modules
  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/courses/${courseId}`);
      if (!res.ok) throw new Error("Failed to fetch course");
      const data = await res.json();
      setCourse(data); // API returns course object directly
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

      if (formData.type === 'text') basePayload.text = { body: formData.text.body };
      if (formData.type === 'pdf') basePayload.pdf = { fileUrl: formData.pdf.fileUrl };
      if (formData.type === 'assignment') basePayload.assignment = {
        instructions: formData.assignment.instructions,
        dueDate: formData.assignment.dueDate || null,
        maxScore: Number(formData.assignment.maxScore) || 100
      };
      if (formData.type === 'quiz') basePayload.quiz = formData.quiz;

      const url = `/api/courses/${courseId}/modules${editingModule ? `/${editingModule._id}` : ''}`;
      const method = editingModule ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(basePayload),
      });

      if (response.ok) {
        resetForm();
        fetchCourse();
      } else {
        const err = await response.json();
        console.error("Error saving module:", err);
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
      pdf: module.pdf || { fileUrl: '' },
      text: module.text || { body: '' }
    });
    setShowForm(true);
  };

  // Delete module
  const handleDelete = async (moduleId) => {
    if (!confirm("Are you sure you want to delete this module?")) return;
    try {
      const response = await fetch(`/api/courses/${courseId}/modules/${moduleId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchCourse();
      } else {
        const err = await response.json();
        console.error("Error deleting module:", err);
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
          {/* ...form fields same as before */}
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
