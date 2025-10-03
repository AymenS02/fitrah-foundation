"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Heart, Users, Target, Compass, Lightbulb } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section - Full Width with Overlay */}
      <div className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent"></div>
        
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-palanquin-dark text-white mb-6 leading-tight">
            Returning to the Fitrah
          </h1>
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
            Guiding hearts back to their natural state of recognizing Allah
          </p>
        </div>
      </div>

      {/* What is Fitrah - Story Section */}
      <div className="w-full bg-card">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-bold text-primary uppercase tracking-wider">The Foundation</span>
              <h2 className="text-3xl md:text-4xl font-palanquin-dark text-foreground mt-3 mb-6">
                What is the Fitrah?
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  The <span className="text-foreground font-semibold">Fitrah</span> is the natural position and innate nature of human beings. We were all created with one natural disposition to recognize Allah, our Creator, and His sole right to be worshiped.
                </p>
                <p>
                  It&apos;s the ability to distinguish between truth and falsehood, right and wrong, in all aspects of life.
                </p>
              </div>
            </div>
            <div className="relative h-80 md:h-96">
              <Image
                src="/images/fitrah-head.jpg"
                alt="Fitrah"
                fill
                className="object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quranic Foundation */}
      <div className="w-full py-20 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-br from-primary to-accent rounded-3xl p-10 md:p-16 shadow-2xl">
            <div className="text-center text-white">
              <div className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-8">
                Qur&apos;an 30:30
              </div>
              
              <p dir="rtl" className="text-3xl md:text-4xl leading-loose font-[600] mb-8">
                فَأَقِمْ وَجْهَكَ لِلدِّينِ حَنِيفًا ۚ فِطْرَتَ اللَّهِ الَّتِي فَطَرَ النَّاسَ عَلَيْهَا
              </p>

              <p className="text-lg md:text-xl leading-relaxed opacity-95 max-w-3xl mx-auto">
                &quot;So direct your face toward the religion, inclining to truth. [Adhere to] the Fitrah of Allah upon which He has created all people.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* The Problem & Solution */}
      <div className="w-full bg-muted/20 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* The Challenge */}
            <div className="bg-card border-2 border-border rounded-2xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-error/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-error" />
              </div>
              <h3 className="text-2xl font-palanquin-dark text-foreground mb-4">
                Today&apos;s Reality
              </h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">The Prophet ﷺ said:</span> &quot;Every child is born in a state of Fitrah. His parents then make him a Jew, a Christian or a Magian.&quot; <span className="text-primary text-sm">[Muslim]</span>
                </p>
                <p>
                  The Fitrah of many people has become derailed. A layer of fog obscures the truth, shaping beliefs and actions. Never has mankind been so distant from the Fitrah — in beliefs, morals, and ethics.
                </p>
              </div>
            </div>

            {/* Our Mission */}
            <div className="bg-primary text-white rounded-2xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-palanquin-dark mb-4">
                Our Mission
              </h3>
              <div className="space-y-4">
                <p>
                  Our mission is to help people — including Muslims — return to the Fitrah that Allah created them upon.
                </p>
                <p>
                  Just as rainfall nourishes only when pure, the laws of Allah are truly understood by a rectified Fitrah.
                </p>
                <p className="font-semibold text-lg pt-2">
                  We invite people to awaken the Fitrah within, to understand and live by the laws of Allah.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Approach - Three Pillars */}
      <div className="w-full py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-bold text-primary uppercase tracking-wider">Our Approach</span>
            <h2 className="text-4xl md:text-5xl font-palanquin-dark text-foreground mt-3">
              How We Guide You Back
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 transform hover:scale-110 transition-transform">
                <BookOpen className="w-10 h-10 text-secondary" />
              </div>
              <h3 className="text-xl font-palanquin-dark text-foreground mb-3">
                Traditional Scholarship
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Learning rooted in Qur&apos;an and Sunnah, guided by scholars linked to authentic chains.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 transform hover:scale-110 transition-transform">
                <Lightbulb className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-xl font-palanquin-dark text-foreground mb-3">
                Clarity & Relevance
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Explaining timeless principles with language and examples that make sense today.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-6 transform hover:scale-110 transition-transform">
                <Heart className="w-10 h-10 text-success" />
              </div>
              <h3 className="text-xl font-palanquin-dark text-foreground mb-3">
                Character & Practice
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Knowledge that transforms hearts and habits, not information for its own sake.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Who, What, How - Timeline Style */}
      <div className="w-full bg-card py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="space-y-12">
            
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">
                  Who it&apos;s for
                </h3>
                <p className="text-2xl font-palanquin-dark text-foreground">
                  Muslims seeking authentic, structured learning.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-accent uppercase tracking-wider mb-2">
                  What you&apos;ll gain
                </h3>
                <p className="text-2xl font-palanquin-dark text-foreground">
                  Clarity, practice, and character rooted in the Sunnah.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-2">
                  How we teach
                </h3>
                <p className="text-2xl font-palanquin-dark text-foreground">
                  Traditional scholarship explained with today&apos;s language.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full py-20 bg-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-palanquin-dark text-foreground mb-6">
            Begin Your Journey Back to the Fitrah
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Explore our courses and articles, attend upcoming programs, and be part of a community learning for the sake of Allah.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="px-8 py-4 bg-primary text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Browse Courses
            </Link>
            <Link
              href="/register"
              className="px-8 py-4 bg-card border-2 border-primary text-primary rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Sign Up Today
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}