'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../components/authContext';
import { X, Menu } from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/articles', label: 'Articles' },
    { href: '/contact', label: 'Contact Us' },
  ];

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 right-4 z-50 p-2 bg-primary text-white rounded-full md:hidden"
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
        className={`fixed top-0 right-0 h-full w-64 bg-background shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-2xl font-bold text-primary">Menu</h2>
          <button onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col mt-6 space-y-4 px-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-primary font-medium hover:scale-105 transition-transform"
            >
              {link.label}
            </Link>
          ))}

          {!user && (
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="mt-4 bg-accent text-secondary px-4 py-2 rounded-4xl font-medium border-2 border-secondary hover:scale-105 transition-transform text-center"
            >
              Sign Up
            </Link>
          )}

          {user && (
            <>
              <Link
                href="/courses"
                onClick={() => setIsOpen(false)}
                className="bg-accent text-secondary px-4 py-2 rounded-4xl font-medium border-2 border-secondary hover:scale-105 transition-transform text-center"
              >
                Courses
              </Link>
              <Link
                href="/account"
                onClick={() => setIsOpen(false)}
                className="bg-accent text-secondary px-4 py-2 rounded-4xl font-medium border-2 border-secondary hover:scale-105 transition-transform text-center"
              >
                Account
              </Link>
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="bg-secondary text-primary px-4 py-2 rounded-4xl font-medium border-2 border-primary hover:bg-secondary-dark hover:scale-105 transition-transform text-center"
                >
                  Admin
                </Link>
              )}
            </>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
