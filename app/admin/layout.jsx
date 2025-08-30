'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Courses', href: '/admin/courses' },
    { name: 'Students', href: '/admin/students' },
    { name: 'Articles', href: '/admin/articles' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow p-6 flex flex-col space-y-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 rounded-md hover:bg-gray-200 ${
              pathname === link.href ? 'bg-gray-300 font-semibold' : ''
            }`}
          >
            {link.name}
          </Link>
        ))}
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
