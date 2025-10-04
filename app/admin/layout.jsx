'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  ChevronsLeft,
  LayoutDashboard,
  NotebookPen,
  CircleUser,
  FileText,
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Admin token check
  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('/api/auth/isAdmin', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 403) {
          router.push('/login');
          return;
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        router.push('/login');
      }
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return <div className="p-8 bg-background min-h-screen text-primary">Loading...</div>;
  }

  const navLinks = [
    { icon: <LayoutDashboard />, name: 'Dashboard', href: '/admin' },
    { icon: <NotebookPen />, name: 'Courses', href: '/admin/courses' },
    { icon: <CircleUser />, name: 'Students', href: '/admin/students' },
    { icon: <FileText />, name: 'Articles', href: '/admin/articles' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-primary mt-10">
      {/* Sidebar (Desktop only) */}
      <aside
        className={`hidden md:flex flex-col space-y-4 shadow p-6 bg-background transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Toggle button */}
        <div
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 mb-6 p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors duration-200"
        >
          <div
            className={`transition-transform duration-300 ease-in-out ${
              collapsed ? 'rotate-180' : 'rotate-0'
            }`}
          >
            <ChevronsLeft size={20} />
          </div>
        </div>

        {/* Nav Links */}
        {navLinks.map((link) => (
          <div key={link.href}>
            <Link
              href={link.href}
              className={`flex items-center my-2 px-4 py-2 gap-3 rounded-md hover:bg-gray-200 transition-all duration-200 ${
                pathname === link.href ? 'bg-gray-300 font-semibold' : ''
              }`}
            >
              <div className="flex-shrink-0 transition-transform duration-200 hover:scale-110">
                {link.icon}
              </div>
              <span
                className={`whitespace-nowrap transition-all duration-300 ease-in-out ${
                  collapsed
                    ? 'opacity-0 translate-x-4 w-0 overflow-hidden'
                    : 'opacity-100 translate-x-0 w-auto'
                }`}
              >
                {link.name}
              </span>
            </Link>
            <hr
              className={`text-gray-300 transition-all duration-300 ease-in-out ${
                collapsed ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
              }`}
            />
          </div>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:pb-8 pb-20 transition-all duration-300 ease-in-out">
        {children}
      </main>

      {/* Bottom Nav (Mobile only) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-gray-200 shadow-inner flex justify-around items-center py-4 md:hidden z-50">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center justify-center text-sm ${
              pathname === link.href
                ? 'text-accent font-semibold'
                : 'text-gray-600 hover:text-accent'
            }`}
          >
            <div>{link.icon}</div>
            <span className="text-xs mt-1">{link.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
