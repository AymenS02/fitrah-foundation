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
} from "lucide-react";

export default function CourseDetailPage() {
  const { id } = useParams(); // Route: /courses/[id]
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${id}`);
        if (!res.ok) throw new Error("Failed to fetch course");

        const data = await res.json();
        setCourse(data);
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading course...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!course) return <div className="p-8 text-center">Course not found</div>;

  return (
    <main className="bg-background text-foreground">
      {/* Top Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container mx-auto max-w-5xl px-4 py-10 md:py-16">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Courses
          </Link>

          <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary">
              {course.title}
            </h1>
            <button
              type="button"
              className="rounded-xl border px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5"
            >
              Enroll
            </button>
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
                {course.difficultyLevel.charAt(0).toUpperCase() + course.difficultyLevel.slice(1)}
              </span>
            )}
            {course.durationWeeks && (
              <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-primary">
                <Clock className="h-4 w-4" />
                {course.durationWeeks} weeks
              </span>
            )}
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-primary">
              <DollarSign className="h-4 w-4" />
              {course.price === 0 ? "Free" : `$${course.price}`}
            </span>
            {course.startDate && course.endDate && (
              <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-primary">
                <Calendar className="h-4 w-4" />
                {new Date(course.startDate).toLocaleDateString()} –{" "}
                {new Date(course.endDate).toLocaleDateString()}
              </span>
            )}
            {course.code && (
              <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-primary">
                Code: {course.code}
              </span>
            )}
            {course.maxStudents && (
              <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-primary">
                Max Students: {course.maxStudents}
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
              {course.thumbnailUrl && (
                <Image
                  src={course.thumbnailUrl}
                  alt={course.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              )}
            </div>

            <div className="rounded-2xl border bg-card p-4">
              <div className="flex items-center gap-3 text-primary">
                <User className="h-5 w-5" />
                <div className="text-sm">
                  <div className="font-semibold">Instructor</div>
                  <div className="text-muted-foreground">{course.instructor}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Info */}
          <div className="space-y-8">
            <div className="prose prose-slate max-w-none">
              <h2 className="text-xl font-bold text-primary">About this course</h2>
              <p className="mt-2">{course.description}</p>
            </div>

            <div className="prose prose-slate max-w-none">
              <h3 className="text-lg font-bold text-primary">Requirements</h3>
              <p className="mt-2">{course.requirements}</p>
            </div>

            <div className="prose prose-slate max-w-none">
              <h3 className="text-lg font-bold text-primary">What you’ll learn</h3>
              <p className="mt-2">{course.learningOutcomes}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
