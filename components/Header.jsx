'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAuth } from "../components/authContext";

// Dynamically import to avoid SSR mismatches
const DarkModeToggle = dynamic(() => import('@/darkMode'), { ssr: false });

const Header = () => {
  const { user } = useAuth();
  const [hydrated, setHydrated] = useState(false);

  // Ensure component only renders after hydration
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null; // Prevent SSR/client mismatch rendering

  return (
    <header 
      className="max-md:hidden px-6 py-4 shadow-2xl bg-background"
      style={{ boxShadow: '0 4px 25px var(--color-shadow)' }}
    >
      <div className="max-w-[90%] mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-20 h-20 mr-3 cursor-pointer"
               onClick={() => window.location.href='/'} >
            <Image
              src="/images/icon.png"
              alt="Fitrah Foundation Logo"
              className="w-full h-full object-contain"
              width={80}
              height={80}
              priority
            />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex items-center space-x-4">
          <Link 
            href="/" 
            className="hover:scale-105 transition-transform font-medium"
            style={{ color: 'var(--color-foreground)' }}
          >
            Home
          </Link>

          <Link 
            href="/about" 
            className="hover:scale-105 transition-transform font-medium"
            style={{ color: 'var(--color-foreground)' }}
          >
            About Us
          </Link>

          <Link 
            href="/articles" 
            className="hover:scale-105 transition-transform font-medium"
            style={{ color: 'var(--color-foreground)' }}
          >
            Articles
          </Link>

          {/* Show 'Courses' in the main nav only if user not logged in */}
          {!user && (
            <Link 
              href="/courses" 
              className="hover:scale-105 transition-transform font-medium"
              style={{ color: 'var(--color-foreground)' }}
            >
              Courses
            </Link>
          )}

          <Link 
            href="/contact" 
            className="hover:scale-105 transition-transform font-medium"
            style={{ color: 'var(--color-foreground)' }}
          >
            Contact Us
          </Link>

          {user ? (
            <>
              {/* Courses button */}
              <Link
                href="/courses"
                className="px-4 py-2 rounded-full font-medium border-2 hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  borderColor: 'var(--color-primary)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--color-primary-hover)';
                  e.target.style.borderColor = 'var(--color-primary-hover)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--color-primary)';
                  e.target.style.borderColor = 'var(--color-primary)';
                }}
              >
                Courses
              </Link>
              
              {/* Account button */}
              <Link
                href="/account"
                className="px-4 py-2 rounded-full font-medium border-2 hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{ 
                  backgroundColor: 'var(--color-accent)',
                  color: 'white',
                  borderColor: 'var(--color-accent)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--color-accent-hover)';
                  e.target.style.borderColor = 'var(--color-accent-hover)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--color-accent)';
                  e.target.style.borderColor = 'var(--color-accent)';
                }}
              >
                Account
              </Link>

              {/* Admin button if role is ADMIN */}
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="px-4 py-2 rounded-full font-medium border-2 hover:scale-105 transition-all duration-300 cursor-pointer"
                  style={{ 
                    backgroundColor: 'var(--color-secondary)',
                    color: 'white',
                    borderColor: 'var(--color-border)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--color-secondary-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'var(--color-secondary)';
                  }}
                >
                  Admin
                </Link>
              )}
            </>
          ) : (
            <Link
              href="/register"
              className="px-4 py-2 rounded-full font-medium border-2 hover:scale-105 transition-all duration-300 cursor-pointer"
              style={{ 
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                borderColor: 'var(--color-primary)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-primary-hover)';
                e.target.style.borderColor = 'var(--color-primary-hover)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--color-primary)';
                e.target.style.borderColor = 'var(--color-primary)';
              }}
            >
              Sign Up
            </Link>
          )}

          <DarkModeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;
