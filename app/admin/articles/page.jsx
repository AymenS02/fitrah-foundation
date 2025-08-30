// app/admin/articles/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Plus, Trash2, Search, Filter, Tag } from 'lucide-react';

export default function ArticlesManagement() {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTags, setFilterTags] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [availableTags, setAvailableTags] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/pages/login');
      return;
    }

    fetchArticles();
  }, [router]);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/articles');
      const data = await response.json();

      if (response.ok) {
        setArticles(data.articles);
        // Extract unique tags from all articles
        const allTags = data.articles.flatMap(article => article.tags || []);
        const uniqueTags = [...new Set(allTags)];
        setAvailableTags(uniqueTags);
      } else {
        console.error('Failed to fetch articles:', data.error);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (articleId) => {
    if (confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/articles/${articleId}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (response.ok) {
          setArticles(articles.filter(article => article._id !== articleId));
          // Update available tags after deletion
          const remainingArticles = articles.filter(article => article._id !== articleId);
          const allTags = remainingArticles.flatMap(article => article.tags || []);
          const uniqueTags = [...new Set(allTags)];
          setAvailableTags(uniqueTags);
        } else {
          alert('Failed to delete article: ' + data.error);
        }
      } catch (error) {
        console.error('Error deleting article:', error);
        alert('Failed to delete article. Please try again.');
      }
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterTags === 'all' || 
                         (article.tags && article.tags.includes(filterTags));
    return matchesSearch && matchesFilter;
  });

  const truncateContent = (content, maxLength = 120) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-600">Loading articles...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">      
      <div className="pt-[200px] min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8 flex-col md:flex-row space-y-4 md:space-y-0">
          <div className="flex items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center max-md:hidden">
                <FileText className="w-8 h-8 mr-3 text-blue-600" />
                Articles Management
              </h1>
              <p className="text-gray-600">Manage your article collection</p>
            </div>
          </div>
          
          <button
            onClick={() => router.push('/admin/articles/add')}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200 font-medium flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Article
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles by title, author, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Filter className="w-5 h-5 text-gray-400 mr-2" />
                <select
                  value={filterTags}
                  onChange={(e) => setFilterTags(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Tags</option>
                  {availableTags.map((tag) => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div key={article._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200">
              {/* Article Image */}
              {article.imageUrl && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">by {article.author}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(article.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {article.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                    {article.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{article.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {truncateContent(article.content)}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>
                    {article.createdBy?.name || 'Unknown Author'}
                  </span>
                  <span>Added: {new Date(article.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDelete(article._id)}
                    className="bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 transition duration-200 text-sm font-medium flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterTags !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Get started by adding your first article.'}
            </p>
            <button
              onClick={() => router.push('/admin/articles/add')}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200 font-medium"
            >
              Add Your First Article
            </button>
          </div>
        )}
      </div>
    </div>
  );
}