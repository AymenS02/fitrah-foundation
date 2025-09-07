'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronLeft,
  Calendar,
  Clock,
  Layers,
  Tag,
  User,
  DollarSign,
  Users,
  BookOpen,
  Target,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../../components/authContext";

const DIFFICULTY_LABEL = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function CourseDetailPage() {
  const { id } = useParams(); // Route: /courses/[id]
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch course details
        const courseRes = await fetch(`/api/courses/${id}`);
        if (!courseRes.ok) throw new Error("Failed to fetch course");
        const courseData = await courseRes.json();
        setCourse(courseData);

        // Check if user is enrolled (if logged in)
        if (user?.id) {
          const enrollmentRes = await fetch(`/api/enrollments?studentId=${user.id}&courseId=${id}`);
          if (enrollmentRes.ok) {
            const enrollmentData = await enrollmentRes.json();
            setIsEnrolled(enrollmentData.length > 0);
          }
        }
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user?.id) return alert("You must be logged in to enroll.");
    if (isEnrolled) return;

    setEnrolling(true);
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: id, studentId: user.id }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to enroll");
      }

      setIsEnrolled(true);
      alert(`Successfully enrolled in "${course.title}"!`);
    } catch (err) {
      alert(err.message);
    } finally {
      setEnrolling(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price) => {
    if (price === 0 || price == null) return "Free";
    return `$${price}`;
  };

  if (loading) return <div className="p-8 text-center">Loading course...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!course) return <div className="p-8 text-center">Course not found</div>;

  const difficultyLabel = DIFFICULTY_LABEL[course.difficultyLevel] || course.difficultyLevel;

  return (
    <main className="bg-background text-foreground">
      {/* Top Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" />
        <div className="container mx-auto max-w-5xl px-4 py-10 md:py-16">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm font-semibold text-background hover:underline bg-accent p-2 rounded-lg"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Courses
          </Link>

          <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary">
                {course.title}
              </h1>
              {course.code && (
                <p className="text-sm text-muted-foreground font-mono">
                  Course Code: {course.code}
                </p>
              )}
            </div>
            
            <div className="flex gap-3">
              {isEnrolled ? (
                <div className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-white">
                  <CheckCircle className="h-4 w-4" />
                  Enrolled
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-50"
                >
                  {enrolling ? "Enrolling..." : "Enroll Now"}
                </button>
              )}
              <div className="rounded-xl border bg-card px-4 py-2 text-sm font-semibold text-primary">
                {formatPrice(course.price)}
              </div>
            </div>
          </div>

          {/* Meta Info */}
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            {course.category && (
              <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-primary">
                <Layers className="h-4 w-4" />
                {course.category}
              </span>
            )}
            {course.difficultyLevel && (
              <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-primary">
                <Tag className="h-4 w-4" />
                {difficultyLabel}
              </span>
            )}
            {course.durationWeeks && (
              <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-primary">
                <Clock className="h-4 w-4" />
                {course.durationWeeks} week{course.durationWeeks !== 1 ? "s" : ""}
              </span>
            )}
            {course.maxStudents && (
              <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-primary">
                <Users className="h-4 w-4" />
                Max: {course.maxStudents} students
              </span>
            )}
            {course.startDate && (
              <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-primary">
                <Calendar className="h-4 w-4" />
                Starts: {formatDate(course.startDate)}
              </span>
            )}
            {course.endDate && (
              <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-primary">
                <Calendar className="h-4 w-4" />
                Ends: {formatDate(course.endDate)}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Body Content */}
      <section className="container mx-auto max-w-5xl px-4 pb-16">
        <div className="grid gap-8 md:grid-cols-[2fr,3fr]">
          {/* Image + Instructor */}
          <div className="space-y-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border bg-muted">
              {course.thumbnailUrl ? (
                <Image
                  src={course.thumbnailUrl}
                  alt={course.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <BookOpen className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>

            {course.instructor && (
              <div className="rounded-2xl border bg-card p-4">
                <div className="flex items-center gap-3 text-primary">
                  <User className="h-5 w-5" />
                  <div className="text-sm">
                    <div className="font-semibold">Instructor</div>
                    <div className="text-muted-foreground">{course.instructor}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Course Info */}
          <div className="space-y-8">
            {course.description && (
              <div className="prose prose-slate max-w-none">
                <h2 className="flex items-center gap-2 text-xl font-bold text-primary">
                  <BookOpen className="h-5 w-5" />
                  About this course
                </h2>
                <div className="mt-4 rounded-xl border bg-card p-4">
                  <p className="text-foreground leading-relaxed">{course.description}</p>
                </div>
              </div>
            )}

            {course.requirements && (
              <div className="prose prose-slate max-w-none">
                <h3 className="flex items-center gap-2 text-lg font-bold text-primary">
                  <CheckCircle className="h-5 w-5" />
                  Requirements
                </h3>
                <div className="mt-4 rounded-xl border bg-card p-4">
                  <p className="text-foreground leading-relaxed">{course.requirements}</p>
                </div>
              </div>
            )}

            {course.learningOutcomes && (
              <div className="prose prose-slate max-w-none">
                <h3 className="flex items-center gap-2 text-lg font-bold text-primary">
                  <Target className="h-5 w-5" />
                  What you'll learn
                </h3>
                <div className="mt-4 rounded-xl border bg-card p-4">
                  <p className="text-foreground leading-relaxed">{course.learningOutcomes}</p>
                </div>
              </div>
            )}

            {/* Course Stats */}
            <div className="rounded-2xl border bg-card p-6">
              <h3 className="text-lg font-bold text-primary mb-4">Course Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="text-muted-foreground">Duration</div>
                  <div className="font-medium">
                    {course.durationWeeks ? `${course.durationWeeks} weeks` : "Not specified"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Level</div>
                  <div className="font-medium">{difficultyLabel}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Price</div>
                  <div className="font-medium">{formatPrice(course.price)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Max Students</div>
                  <div className="font-medium">
                    {course.maxStudents || "Unlimited"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}