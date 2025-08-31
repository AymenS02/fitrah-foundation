"use client";

import React, { useState, useEffect, useMemo, useContext } from "react";
import Image from "next/image";
import { Search, SlidersHorizontal, Clock, Layers, User, Tag } from "lucide-react";
import { useAuth } from "../../components/authContext"; 

const DIFFICULTY_LABEL = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [sort, setSort] = useState("title"); // 'title' | 'price'

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        if (res.ok) setCourses(data);
        else setError(data.error || "Failed to fetch courses");
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const CATEGORIES = ["All", ...Array.from(new Set(courses.map(c => c.category).filter(Boolean)))];
  const LEVELS = ["All", ...Array.from(new Set(courses.map(c => c.difficultyLevel).filter(Boolean)))];

  const filtered = useMemo(() => {
    let list = courses.slice();
    if (q.trim()) {
      const term = q.toLowerCase();
      list = list.filter(c =>
        [c.title, c.description, c.category, c.instructor]
          .filter(Boolean)
          .some(v => v.toLowerCase().includes(term))
      );
    }
    if (category !== "All") list = list.filter(c => c.category === category);
    if (level !== "All") list = list.filter(c => c.difficultyLevel === level);
    if (sort === "title") list.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "price") list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    return list;
  }, [courses, q, category, level, sort]);

  if (loading) return <div className="text-center py-20">Loading courses...</div>;
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;

  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" />
        <div className="container mx-auto max-w-6xl px-4 py-6 mt-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">Courses</h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            Authentic Islamic learning—rooted in tradition, explained for today. Browse, filter, and find the right starting point.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto max-w-6xl px-4">
        <div className="rounded-2xl border bg-card p-4 md:p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-5">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-primary/70">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Course, topic, or instructor…"
                  className="w-full rounded-xl border pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-primary/70">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Level */}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-primary/70">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>{l === "All" ? "All" : DIFFICULTY_LABEL[l] ?? l}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-primary/70">Sort by</label>
              <div className="relative">
                <SlidersHorizontal className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full rounded-xl border pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="title">Title (A–Z)</option>
                  <option value="price">Price (Low → High)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="container mx-auto max-w-6xl px-4 py-10 md:py-14">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border bg-card p-8 text-center text-muted-foreground">
            No courses match your filters. Try clearing your search or changing category/level.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <CourseCard key={c._id ?? c.title} course={c} user={user} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

// ---------- Helpers ----------
function formatPrice(n) {
  if (n == null) return "";
  if (n === 0) return "Free";
  return `$${n.toFixed(0)}`;
}
function durationLabel(weeks) {
  if (!weeks) return null;
  return `${weeks} week${weeks > 1 ? "s" : ""}`;
}

// ---------- Card ----------
function CourseCard({ course, user }) {
  const { _id, title, description, instructor, thumbnailUrl, category, difficultyLevel, price, durationWeeks } = course;
  const levelLabel = DIFFICULTY_LABEL[difficultyLevel] ?? difficultyLevel;

  const onEnroll = async () => {
    console.log(user);
    if (!user?._id) return alert("You must be logged in to enroll.");

    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: _id, studentId: user._id }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to enroll");
      }

      alert(`Successfully enrolled in "${title}"!`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <article className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:shadow-md">
      <div className="relative h-40 w-full bg-muted">
        {thumbnailUrl && (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        )}
        {price === 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-white">
            Free
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {category && (
            <span className="inline-flex items-center gap-1">
              <Layers className="h-3.5 w-3.5" />
              {category}
            </span>
          )}
          {difficultyLevel && (
            <>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Tag className="h-3.5 w-3.5" />
                {levelLabel}
              </span>
            </>
          )}
          {durationWeeks && (
            <>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {durationLabel(durationWeeks)}
              </span>
            </>
          )}
        </div>

        <h3 className="mt-2 text-lg font-semibold text-primary group-hover:underline">{title}</h3>

        {instructor && (
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            <span>{instructor}</span>
          </div>
        )}

        {description && (
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{description}</p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm font-semibold text-primary">{formatPrice(price ?? 0)}</div>
          <div className="flex gap-2">
            <button
              onClick={onEnroll}
              className="rounded-xl bg-primary px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-primary/90"
            >
              Enroll
            </button>
            <a
              href={`/courses/${_id}`}
              className="rounded-xl border px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/5 transition"
            >
              View details
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
