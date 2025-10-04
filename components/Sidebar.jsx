'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAuth } from '../components/authContext';
import { X, Menu } from 'lucide-react';

// Dynamically import to avoid SSR mismatch
const DarkModeToggle = dynamic(() => import('@/darkMode'), { ssr: false });

const Sidebar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Wait for client hydration
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null; // Prevent hydration mismatch

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-full"
        style={{ 
          backgroundColor: 'var(--color-primary)',
          color: 'white'
        }}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <aside
        className={`md:hidden fixed top-0 right-0 h-full w-80 z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ 
          backgroundColor: 'var(--color-background)',
          boxShadow: '0 4px 25px var(--color-shadow)'
        }}
      >
        <div 
          className="flex items-center justify-between px-6 py-4 border-b" 
          style={{ borderColor: 'var(--color-border)' }}
        >
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>Menu</h2>
          <button onClick={toggleSidebar} style={{ color: 'var(--color-foreground)' }}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col mt-6 space-y-6 px-6">
          {/* Navigation Links */}
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="hover:scale-105 transition-transform font-medium"
            style={{ color: 'var(--color-foreground)' }}
          >
            Home
          </Link>

          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="hover:scale-105 transition-transform font-medium"
            style={{ color: 'var(--color-foreground)' }}
          >
            About Us
          </Link>

          <Link
            href="/articles"
            onClick={() => setIsOpen(false)}
            className="hover:scale-105 transition-transform font-medium"
            style={{ color: 'var(--color-foreground)' }}
          >
            Articles
          </Link>
          
          {/* Courses link for non-authenticated users */}
          {!user && (
            <Link
              href="/courses"
              onClick={() => setIsOpen(false)}
              className="hover:scale-105 transition-transform font-medium"
              style={{ color: 'var(--color-foreground)' }}
            >
              Courses
            </Link>
          )}

          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="hover:scale-105 transition-transform font-medium"
            style={{ color: 'var(--color-foreground)' }}
          >
            Contact Us
          </Link>

          {/* Auth-dependent buttons */}
          {user ? (
            <>
              {/* Courses button */}
              <Link
                href="/courses"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-full font-medium border-2 hover:scale-105 transition-all duration-300 cursor-pointer text-center"
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
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-full font-medium border-2 hover:scale-105 transition-all duration-300 cursor-pointer text-center"
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

              {/* Admin button */}
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-full font-medium border-2 hover:scale-105 transition-all duration-300 cursor-pointer text-center"
                  style={{ 
                    backgroundColor: 'var(--color-secondary)',
                    color: 'var(--color-foreground)',
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
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-full font-medium border-2 hover:scale-105 transition-all duration-300 cursor-pointer text-center"
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

          {/* Dark Mode Toggle */}
          <div className="mt-4">
            <DarkModeToggle />
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
