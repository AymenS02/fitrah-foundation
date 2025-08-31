// app/courses/page.jsx
"use client";

import React from "react";
import Image from "next/image";
import {
  Search,
  SlidersHorizontal,
  Clock,
  Layers,
  User,
  Tag,
} from "lucide-react";

// ----- Example mock data that matches your schema (replace with fetch) -----
const COURSES = [
  {
    _id: "1",
    title: "Foundations of Fiqh",
    description:
      "Learn the essentials of worship and daily practice with clarity and proofs.",
    instructor: "Shaykh Ahmad",
    thumbnailUrl: "/images/fitrah-head.jpg",
    category: "Fiqh",
    difficultyLevel: "beginner",
    price: 0,
    maxStudents: 120,
    startDate: new Date("2025-09-01"),
    endDate: new Date("2025-10-15"),
    durationWeeks: 6,
    requirements: "None",
    learningOutcomes:
      "Understanding of taharah, salah, fasting, zakah basics, and proofs.",
  },
  {
    _id: "2",
    title: "Foundations of Fiqh",
    description:
      "Learn the essentials of worship and daily practice with clarity and proofs.",
    instructor: "Shaykh Ahmad",
    thumbnailUrl: "/images/fitrah-head.jpg",
    category: "Fiqh",
    difficultyLevel: "beginner",
    price: 599,
    maxStudents: 120,
    startDate: new Date("2025-09-01"),
    endDate: new Date("2025-10-15"),
    durationWeeks: 6,
    requirements: "None",
    learningOutcomes:
      "Understanding of taharah, salah, fasting, zakah basics, and proofs.",
  },
  {
    _id: "3",
    title: "Foundations of Fiqh",
    description:
      "Learn the essentials of worship and daily practice with clarity and proofs.",
    instructor: "Shaykh Ahmad",
    thumbnailUrl: "/images/fitrah-head.jpg",
    category: "Fiqh",
    difficultyLevel: "Advanced",
    price: 9999,
    maxStudents: 300,
    startDate: new Date("2025-09-01"),
    endDate: new Date("2025-10-15"),
    durationWeeks: 20,
    requirements: "None",
    learningOutcomes:
      "Understanding of taharah, salah, fasting, zakah basics, and proofs.",
  },
];

const DIFFICULTY_LABEL = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const CATEGORIES = ["All", ...Array.from(new Set(COURSES.map(c => c.category).filter(Boolean)))];
const LEVELS = ["All", ...Array.from(new Set(COURSES.map(c => c.difficultyLevel).filter(Boolean)))];

export default function CoursesPage() {
  const [q, setQ] = React.useState("");
  const [category, setCategory] = React.useState("All");
  const [level, setLevel] = React.useState("All");
  const [sort, setSort] = React.useState("title"); // 'title' | 'price'

  const filtered = React.useMemo(() => {
    let list = COURSES.slice();

    // Search (title, description, category, instructor)
    if (q.trim()) {
      const term = q.toLowerCase();
      list = list.filter((c) =>
        [c.title, c.description, c.category, c.instructor]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(term))
      );
    }

    if (category !== "All") list = list.filter((c) => c.category === category);
    if (level !== "All") list = list.filter((c) => c.difficultyLevel === level);

    if (sort === "title") list.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "price") list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));

    return list;
  }, [q, category, level, sort]);

  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container mx-auto max-w-6xl px-4 py-14 md:py-20">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
            Courses
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            Authentic Islamic learning—rooted in tradition, explained for today.
            Browse, filter, and find the right starting point.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto max-w-6xl px-4">
        <div className="rounded-2xl border bg-card p-4 md:p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-5">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-primary/70">
                Search
              </label>
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
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-primary/70">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Level */}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-primary/70">
                Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l === "All" ? "All" : DIFFICULTY_LABEL[l] ?? l}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-primary/70">
                Sort by
              </label>
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
            No courses match your filters. Try clearing your search or changing
            category/level.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <CourseCard key={c._id ?? c.title} course={c} />
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
function CourseCard({ course }) {
  const {
    title,
    description,
    instructor,
    thumbnailUrl,
    category,
    difficultyLevel,
    price,
    durationWeeks,
  } = course;

  const levelLabel = DIFFICULTY_LABEL[difficultyLevel] ?? difficultyLevel;

  // Replace with your real enroll action/route
  const onEnroll = () => {
    alert(`Enroll clicked for: ${title}`);
  };

  return (
    <article className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:shadow-md">
      <div className="relative h-40 w-full bg-muted">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : null}
        {price === 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-white">
            Free
          </span>
        )}
      </div>

      <div className="p-4">
        {/* Meta row */}
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
          {durationWeeks ? (
            <>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {durationLabel(durationWeeks)}
              </span>
            </>
          ) : null}
        </div>

        <h3 className="mt-2 text-lg font-semibold text-primary group-hover:underline">
          {title}
        </h3>

        {instructor && (
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            <span>{instructor}</span>
          </div>
        )}

        {description && (
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
            {description}
          </p>
        )}

        {/* PRICE • ENROLL • DETAILS */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm font-semibold text-primary">
            {formatPrice(price ?? 0)}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onEnroll}
              aria-label={`Enroll in ${title}`}
              className="rounded-xl bg-primary px-3 py-1 text-xs font-semibold text-white
                         shadow-sm transition hover:bg-primary/90"
            >
              Enroll
            </button>

            <a
              href="#"
              className="rounded-xl border px-3 py-1 text-xs font-semibold text-primary
                         hover:bg-primary/5 transition"
            >
              View details
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
