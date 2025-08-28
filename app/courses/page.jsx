'use client';

import Link from 'next/link';

const courses = [
  {
    id: 'intro-islam',
    title: 'Introduction to Islam',
    description: 'Learn the basics of Islam, including beliefs, practices, and history.',
    price: '$49',
    purchaseLink: 'https://your-purchase-link.com/intro-islam',
    tags: ['Beginner', 'Faith'],
  },
  {
    id: 'quran-studies',
    title: 'Quranic Studies',
    description: 'A deeper look into the Quran with tafsir, themes, and applications.',
    price: '$99',
    purchaseLink: 'https://your-purchase-link.com/quran-studies',
    tags: ['Intermediate', 'Quran'],
  },
  {
    id: 'islamic-history',
    title: 'Islamic History',
    description: 'Explore key events and figures in Islamic history.',
    price: '$79',
    purchaseLink: 'https://your-purchase-link.com/islamic-history',
    tags: ['History', 'Advanced'],
  },
];

export default function CoursesPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-primary mb-8">Courses</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-6 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold text-primary mb-2">{course.title}</h2>
              <p className="text-gray-600 mb-3">{course.description}</p>
              <p className="flex text-lg font-bold text-secondary bg-accent p-2 mb-4">{course.price}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href={course.purchaseLink}
              target="_blank"
              className="mt-auto inline-block bg-primary text-white text-center px-4 py-2 rounded-xl font-medium hover:scale-105 transition-transform"
            >
              Purchase
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
