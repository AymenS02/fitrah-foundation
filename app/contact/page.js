// app/contact/page.jsx
"use client";
import React from "react";
import {
  Mail, MapPin, Globe,
  Facebook, Twitter, Instagram, Send, Youtube
} from "lucide-react";

export default function ContactPage() {
  const onSubmit = (e) => e.preventDefault();

  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <section className="container mx-auto max-w-5xl px-4 py-16 md:py-24">
        <h1 className="text-4xl font-extrabold text-center text-primary md:text-5xl">
          Contact Us
        </h1>
        <p className="mt-4 text-center text-muted-foreground max-w-2xl mx-auto">
          We’d love to hear from you — reach out with any questions, feedback, or collaboration ideas.
        </p>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {/* LEFT: Form */}
          <form
            onSubmit={onSubmit}
            className="rounded-2xl border bg-card p-6 shadow-sm space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1">Message</label>
              <textarea
                rows={4}
                placeholder="Write your message here..."
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-4 py-2 text-white font-semibold hover:bg-primary/90 transition"
            >
              Send Message
            </button>
          </form>

          {/* RIGHT: Info card with rows like the example */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-primary">Contact Information</h3>

            <ul className="mt-4 space-y-4 text-sm">
              {/* Email */}
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Mail size={18} />
                </span>
                <div>
                  <p className="font-medium">Email Us</p>
                  <a
                    href="mailto:info@fitrahfoundation.org"
                    className="text-muted-foreground hover:underline"
                  >
                    info@fitrahfoundation.org
                  </a>
                </div>
              </li>

              {/* Location */}
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MapPin size={18} />
                </span>
                <div>
                  <p className="font-medium">Location</p>
                  <span className="text-muted-foreground">Toronto, Canada</span>
                </div>
              </li>


              <hr className="my-2 border-border" />

              {/* Socials */}
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Facebook size={18} />
                </span>
                <div>
                  <p className="font-medium">Facebook</p>
                  <a
                    href="https://www.facebook.com/FitrahFoundation/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:underline"
                  >
                    facebook.com/FitrahFoundation
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Twitter size={18} />
                </span>
                <div>
                  <p className="font-medium">Twitter</p>
                  <a
                    href="https://www.twitter.com/fitrah1441"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:underline"
                  >
                    @fitrah1441
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Instagram size={18} />
                </span>
                <div>
                  <p className="font-medium">Instagram</p>
                  <a
                    href="https://www.instagram.com/fitrahfoundation1/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:underline"
                  >
                    @fitrahfoundation1
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Send size={18} />
                </span>
                <div>
                  <p className="font-medium">Telegram</p>
                  <a
                    href="https://t.me/FitrahFoundation/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:underline"
                  >
                    t.me/FitrahFoundation
                  </a>
                </div>
              </li>

              {/* If you want YouTube too */}
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Youtube size={18} />
                </span>
                <div>
                  <p className="font-medium">YouTube</p>
                  <a
                    href="https://www.youtube.com/@FitrahFoundation" // update if needed
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:underline"
                  >
                    @FitrahFoundation
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
