'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from "../components/authContext";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="max-md:hidden bg-background px-6 py-4 shadow-2xl">
      <div className="max-w-[90%] mx-auto flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center">
          <div className="w-20 h-20 mr-3">
            <Image
              src="/images/logo.png"
              alt="Fitrah Foundation Logo"
              className="w-full h-full object-contain"
              width={80}
              height={80}
            />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex items-center space-x-4">
          <Link href="/" className="text-primary hover:scale-105 transition-transform font-medium">
            Home
          </Link>
          <Link href="/about" className="text-primary hover:scale-105 transition-transform font-medium">
            About Us
          </Link>
          <Link href="/articles" className="text-primary hover:scale-105 transition-transform font-medium">
            Articles
          </Link>
          {!user ? (
            <Link href="/courses" className="text-primary hover:scale-105 transition-transform font-medium">
              Courses
            </Link>
          ) : null}

          <Link href="/contact" className="text-primary hover:scale-105 transition-transform font-medium">
            Contact Us
          </Link>

          {user ? (
            <>
              {/* Account button */}
              <Link
                href="/courses"
                className="bg-accent text-secondary px-4 py-2 rounded-4xl font-medium border-2 border-secondary hover:scale-105 transition-transform cursor-pointer"
              >
                Courses
              </Link>
              <Link
                href="/account"
                className="bg-accent text-secondary px-4 py-2 rounded-4xl font-medium border-2 border-secondary hover:scale-105 transition-transform cursor-pointer"
              >
                Account
              </Link>

              {/* Admin button if role is ADMIN */}
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="bg-secondary text-primary px-4 py-2 rounded-4xl font-medium border-2 border-primary hover:bg-secondary-dark hover:scale-105 transition-transform cursor-pointer"
                >
                  Admin
                </Link>
              )}
            </>
          ) : (
            <Link
              href="/register"
              className="bg-accent text-secondary px-4 py-2 rounded-4xl font-medium border-2 border-secondary hover:scale-105 transition-transform cursor-pointer"
            >
              Sign Up
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
