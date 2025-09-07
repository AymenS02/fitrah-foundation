'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronsLeft, ChevronsRight, LayoutDashboard, NotebookPen, CircleUser, FileText } from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navLinks = [
    { icon: <LayoutDashboard />, name: 'Dashboard', href: '/admin' },
    { icon: <NotebookPen  />, name: 'Courses', href: '/admin/courses' },
    { icon: <CircleUser />, name: 'Students', href: '/admin/students' },
    { icon: <FileText />, name: 'Articles', href: '/admin/articles' },
  ];

  return (
    <div className="flex min-h-screen bg-background text-primary">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? 'w-20' : 'w-64'
        } bg-background shadow p-6 flex flex-col space-y-4 transition-all duration-300 ease-in-out overflow-hidden`}
      >

        {/* Toggle button */}
        <div
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 mb-6 p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors duration-200"
        >
          <div
            className={`transition-transform duration-300 ease-in-out ${
              collapsed ? "rotate-180" : "rotate-0"
            }`}
          >
            <ChevronsLeft size={20} />
          </div>
        </div>
        
        {/* Nav Links */}
        {navLinks.map((link, index) => (
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
                collapsed 
                  ? 'opacity-0 scale-x-0' 
                  : 'opacity-100 scale-x-100'
              }`} 
            />
          </div>
        ))}
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 transition-all duration-300 ease-in-out">{children}</main>
    </div>
  );
}