"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, User, BookOpen, Percent, GraduationCap } from "lucide-react";

export default function ManageEnrollmentPage() {
  const { id } = useParams(); // enrollment id from route
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/enrollments/${id}`);
        if (!res.ok) throw new Error("Failed to fetch enrollment");

        const data = await res.json();
        setEnrollment(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEnrollment();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin h-6 w-6 text-gray-600" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center">Error: {error}</div>;
  }

  if (!enrollment) {
    return <div className="text-gray-600 text-center">Enrollment not found</div>;
  }

  const { user, course, progress, finalGrade, grades } = enrollment;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Student & Course Info */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <User className="h-5 w-5" /> Student Information
        </h2>
        <p><span className="font-medium">Name:</span> {user?.firstName} {user?.lastName}</p>
        <p><span className="font-medium">Email:</span> {user?.email}</p>
      </div>

      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5" /> Course Information
        </h2>
        <p><span className="font-medium">Course:</span> {course?.title}</p>
        <p><span className="font-medium">Code:</span> {course?.code}</p>
        <p><span className="font-medium">Instructor:</span> {course?.instructor}</p>
      </div>

      {/* Progress */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Percent className="h-5 w-5" /> Progress
        </h2>
        <p><span className="font-medium">Completion:</span> {progress}%</p>
      </div>

      {/* Grades */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <GraduationCap className="h-5 w-5" /> Grades
        </h2>
        <p><span className="font-medium">Final Grade:</span> {finalGrade ?? "Not graded yet"}</p>

        <div className="mt-4">
          {grades?.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Item</th>
                  <th className="border p-2 text-left">Score</th>
                  <th className="border p-2 text-left">Max</th>
                  <th className="border p-2 text-left">%</th>
                  <th className="border p-2 text-left">Feedback</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((g, idx) => (
                  <tr key={idx}>
                    <td className="border p-2">{g.title}</td>
                    <td className="border p-2">{g.score}</td>
                    <td className="border p-2">{g.maxScore}</td>
                    <td className="border p-2">{g.percentage}%</td>
                    <td className="border p-2">{g.feedback}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No graded items yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
