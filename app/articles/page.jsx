'use client';

import { useState } from 'react';
import Link from 'next/link';

const articles = [
  {
    id: 'importance-of-charity',
    title: 'The Importance of Charity in Daily Life',
    description: 'How small acts of kindness create lasting impact in communities.',
    date: 'August 25, 2025',
    author: 'Fitrah Foundation',
    tags: ['Charity', 'Community', 'Faith'],
  },
  {
    id: 'spiritual-growth',
    title: 'Spiritual Growth Through Knowledge',
    description: 'Understanding how learning deepens faith and practice.',
    date: 'August 20, 2025',
    author: 'Fitrah Foundation',
    tags: ['Spirituality', 'Knowledge', 'Faith'],
  },
  {
    id: 'community-support',
    title: 'Building Strong Communities',
    description: 'The role of collaboration and support in building unity.',
    date: 'August 10, 2025',
    author: 'Fitrah Foundation',
    tags: ['Community', 'Unity', 'Support'],
  },
];

export default function ArticlesPage() {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);

  // Collect unique tags
  const allTags = [...new Set(articles.flatMap(article => article.tags))];

  // Filtered articles
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.description.toLowerCase().includes(search.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));

    const matchesTag = selectedTag ? article.tags.includes(selectedTag) : true;

    return matchesSearch && matchesTag;
  });

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-primary mb-6">Articles</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search articles..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mb-6 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {/* Tag Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-3 py-1 rounded-full text-sm border transition ${
            !selectedTag ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-primary hover:text-white'
          }`}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1 rounded-full text-sm border transition ${
              selectedTag === tag ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-primary hover:text-white'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Articles List */}
      {filteredArticles.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-6"
            >
              <h2 className="text-xl font-semibold text-primary mb-2">{article.title}</h2>
              <p className="text-gray-600 mb-3">{article.description}</p>
              <p className="text-sm text-gray-400 mb-3">
                {article.date} • {article.author}
              </p>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No articles found.</p>
      )}
    </main>
  );
}
