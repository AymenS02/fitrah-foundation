"use client";

import React from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "framer-motion";

export default function AboutPage() {
  // Scroll → motion values
  const { scrollY } = useScroll();

  // How far clouds fly out from the center
  const cloudDistance = 280; // tweak 240–360 as you like

  // Clouds start near center then move apart (clear quicker for readability)
  const cloudLeftX = useTransform(scrollY, [0, 220], [0, -cloudDistance]);
  const cloudRightX = useTransform(scrollY, [0, 220], [0, cloudDistance]);
  const cloudOpacity = useTransform(scrollY, [0, 180], [0.6, 0.12]);

  // Noor (sun) brightens, grows, sharpens (behind the clouds)
  const sunOpacity = useTransform(scrollY, [0, 200], [0.35, 1]);
  const sunScale = useTransform(scrollY, [0, 280], [0.92, 1.12]);
  const sunBlur = useTransform(scrollY, [0, 280], [8, 0]); // px
  const sunFilter = useMotionTemplate`blur(${sunBlur}px)`;

  return (
    <main className="bg-background text-foreground">
      {/* ===== Hero with animated background (centered, fast reveal) ===== */}
      <section className="relative isolate overflow-visible bg-background">
        {/* Animated background layer */}
        <div className="pointer-events-none absolute inset-0 flex items-start justify-center">
          {/* Sun (behind clouds) */}
          <motion.div
            style={{ opacity: sunOpacity, scale: sunScale, filter: sunFilter }}
            className="absolute top-10 text-amber-300 drop-shadow-[0_0_60px_rgba(250,204,21,0.4)] z-10"
            aria-hidden
          >
            <SunWithRays className="h-44 w-44 md:h-56 md:w-56" />
          </motion.div>

          {/* Clouds (staggered around heading, overlapping sun) */}
          <motion.div
            style={{ x: cloudLeftX, opacity: cloudOpacity }}
            className="absolute left-1/2 top-4 -translate-x-[70%] text-primary/80 z-20"
            aria-hidden
          >
            <Cloud className="h-32 w-[480px] md:h-36 md:w-[540px]" />
          </motion.div>

          <motion.div
            style={{ x: cloudRightX, opacity: cloudOpacity }}
            className="absolute left-1/2 top-20 -translate-x-[30%] text-primary/80 z-20"
            aria-hidden
          >
            <Cloud className="h-32 w-[480px] md:h-36 md:w-[540px]" />
          </motion.div>
        </div>

        {/* Foreground content (ALWAYS above animation) */}
        <div className="relative z-40 container mx-auto max-w-5xl px-4 py-16 md:py-24 text-center">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-primary md:text-5xl drop-shadow">
            About Fitrah Foundation
          </h1>
          <p className="mt-5 mx-auto max-w-3xl text-lg text-muted-foreground backdrop-blur-[1px]">
            Authentic Islamic learning—rooted in tradition, explained for today.
          </p>

          {/* Primary actions (convert fast) */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <a
              href="/courses"
              className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
            >
              Browse Courses
            </a>
            <a
              href="/articles"
              className="rounded-xl border border-primary/30 px-5 py-2 text-sm font-semibold text-primary hover:bg-primary/5"
            >
              Read Articles
            </a>
          </div>
        </div>
      </section>

      
      {/* ======= Values / What we do ======= */}
<section className="bg-muted/40">
  <div className="container mx-auto max-w-5xl px-4 py-12 md:py-16">
    <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
      What We Focus On
    </h2>
    <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      {[
        {
          title: "Traditional Scholarship",
          body:
            "Learning rooted in Qur'an and Sunnah, guided by scholars linked to authentic chains.",
        },
        {
          title: "Clarity & Relevance",
          body:
            "Explaining timeless principles with language and examples that make sense today.",
        },
        {
          title: "Character & Practice",
          body:
            "Knowledge that transforms hearts and habits, not information for its own sake.",
        },
      ].map((card, index) => (
        <motion.div
          key={card.title}
          className="rounded-2xl border bg-card p-6 shadow-sm cursor-default transition-none"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-semibold text-primary">
            {card.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {card.body}
          </p>
        </motion.div>
      ))}
    </div>
  </div>
</section>


      {/* Cloud / wave top edge */}
<div className="relative h-14 overflow-hidden">
  <svg
    className="absolute inset-0 h-full w-full text-muted/40"
    viewBox="0 0 1440 100"
    preserveAspectRatio="none"
  >
    <path
      d="M0,40 C160,80 320,0 480,20 C640,40 800,100 960,60 C1120,20 1280,40 1440,20 L1440,100 L0,100 Z"
      fill="currentColor"
    />
  </svg>
</div>

{/* Inverse bottom edge */}
<div className="relative h-14 overflow-hidden rotate-180">
  <svg
    className="absolute inset-0 h-full w-full text-muted/40"
    viewBox="0 0 1440 100"
    preserveAspectRatio="none"
  >
    <path
      d="M0,40 C160,80 320,0 480,20 C640,40 800,100 960,60 C1120,20 1280,40 1440,20 L1440,100 L0,100 Z"
      fill="currentColor"
    />
  </svg>
</div>


{/* WHO, WHAT, HOW */}
      <section className="bg-background">
  <div className="container mx-auto max-w-5xl px-4 py-8">
    <div className="rounded-2xl border bg-card/60 shadow-sm p-6 md:p-8">
      <div className="grid gap-6 sm:grid-cols-3">
        {/* Who it's for */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary/70">
            Who it’s for
          </p>
          <p className="mt-2 text-lg font-medium text-foreground">
            Muslims seeking authentic, structured learning.
          </p>
        </div>

        {/* What you'll gain */}
        <div className="sm:border-l sm:border-border sm:pl-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary/70">
            What you’ll gain
          </p>
          <p className="mt-2 text-lg font-medium text-foreground">
            Clarity, practice, and character rooted in the Sunnah.
          </p>
        </div>

        {/* How we teach */}
        <div className="sm:border-l sm:border-border sm:pl-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary/70">
            How we teach
          </p>
          <p className="mt-2 text-lg font-medium text-foreground">
            Traditional scholarship explained with today’s language.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>



      {/* ===== Mission / Intro ===== */}
      <section id="mission" className="container mx-auto max-w-5xl px-4 py-12 md:py-16">
        {/* two-column: image + intro text */}
        <div className="grid items-center gap-8 md:grid-cols-2">
          {/* Image on the left */}
          <div className="relative mx-auto aspect-square w-full max-w-[420px]">
            <Image
              src="/images/fitrah-head.jpg"
              alt="Illustration of Fitrah"
              fill
              className="object-contain drop-shadow-sm"
              priority
            />
          </div>

          {/* Text on the right */}
          <div className="prose prose-slate max-w-none leading-relaxed">
            <p>
              The <em>Fitrah</em> is the natural position and innate nature of
              human beings. We were all created with one natural disposition to
              recognize Allah, our Creator, and His sole right to be worshiped,
              as well as to distinguish between truth and falsehood, and right
              and wrong, in all aspects of life.
            </p>
          </div>
        </div>

        {/* Qur'an ayah (clean, centered, more breathing room) */}
        <div className="mt-10 rounded-2xl bg-primary px-6 py-10 text-white md:px-10 md:py-12 text-center shadow-md">
          <p className="text-sm font-semibold mb-4">Allah says:</p>

          <p dir="rtl" className="text-2xl md:text-3xl leading-relaxed font-[600]">
            فَأَقِمْ وَجْهَكَ لِلدِّينِ حَنِيفًا ۚ فِطْرَتَ اللَّهِ الَّتِي فَطَرَ النَّاسَ
            عَلَيْهَا
          </p>

          <p className="mt-4 text-base/7 opacity-90">
            “So direct your face toward the religion, inclining to truth. [Adhere to] the
            Fitrah of Allah upon which He has created all people.”
          </p>

          <p className="mt-2 text-sm font-medium opacity-80">[Al-Rūm 30:30]</p>
        </div>

        {/* Narrative — broken into scannable chunks */}
        <div className="prose prose-slate max-w-3xl mx-auto mt-10 space-y-6 leading-relaxed">
          <p>
            <strong>The Prophet ﷺ said:</strong> “Every child is born in a state of
            Fitrah. His parents then make him a Jew, a Christian or a Magian.”{" "}
            <span>[Muslim]</span>
          </p>

          <div className="rounded-xl bg-muted/30 p-5">
            <p>
              <strong>Today’s reality:</strong> The Fitrah of many people has become
              derailed and needs to be brought back on track. A layer of fog obscures the
              truth for most, shaping their beliefs and actions. Never has mankind been so
              distant from the Fitrah — in beliefs, morals, and ethics.
            </p>
          </div>

          <p>
            <strong>Why Fitrah Foundation exists:</strong> Our mission is to help people —
            including Muslims — return to the Fitrah that Allah created them upon. Some are
            not affected by Allah’s rulings because their Fitrah has changed; just as
            rainfall nourishes only when pure, the laws of Allah are truly understood by a
            rectified Fitrah.
          </p>

          <p className="font-semibold">
             We invite people to awaken the Fitrah
            within, in order to understand and live by the laws of Allah.
          </p>
        </div>
      </section>

      {/* ===== Closing CTA ===== */}
      <motion.section
        id="get-involved"
        className="container mx-auto max-w-5xl px-4 py-12 md:py-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="rounded-2xl bg-primary px-6 py-8 text-white md:px-10 md:py-12">
          <h3 className="text-2xl font-bold tracking-tight">
            Join us in awakening the Fitrah.
          </h3>
          <p className="mt-2 max-w-2xl text-sm/6 opacity-90">
            Explore our courses and articles, attend upcoming programs, and be part of a
            community learning for the sake of Allah.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <motion.a
              href="/courses"
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Courses
            </motion.a>
            <motion.a
              href="/contact"
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.a>
          </div>
        </div>
      </motion.section>
    </main>
  );
}

/* ---------- Inline SVG components ---------- */
function Cloud(props) {
  return (
    <svg viewBox="0 0 240 120" {...props}>
      <path
        d="M60 90h110a35 35 0 0 0 0-70 45 45 0 0 0-82-10 30 30 0 0 0-48 26C16 36 0 49 0 66s14 24 33 24h27z"
        fill="currentColor"
      />
    </svg>
  );
}

function SunWithRays(props) {
  return (
    <svg viewBox="0 0 260 260" {...props}>
      <circle cx="130" cy="130" r="80" fill="url(#g)" />
      <circle cx="130" cy="130" r="55" fill="currentColor" />
      <defs>
        <radialGradient id="g">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="60%" stopColor="currentColor" stopOpacity="0.08" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ray" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
        <mask id="rayMask">
          <rect width="260" height="260" fill="black" />
          <circle cx="130" cy="130" r="120" fill="white" />
        </mask>
      </defs>
      {Array.from({ length: 18 }).map((_, i) => (
        <rect
          key={i}
          x="129"
          y="6"
          width="2"
          height="118"
          fill="url(#ray)"
          mask="url(#rayMask)"
          transform={`rotate(${(360 / 18) * i} 130 130)`}
        />
      ))}
    </svg>
  );
}
