'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from "gsap";
import { FileText, Eye, Search, Filter, Tag, User, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const headerRef = useRef(null);
  const articlesGridRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [availableTags, setAvailableTags] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Check if refs are available before animating
    if (headerRef.current && articlesGridRef.current) {
      const tl = gsap.timeline({ delay: 0.3 });
      gsap.set([headerRef.current, articlesGridRef.current], { opacity: 0, y: 50 });

      tl.to(headerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }).to(articlesGridRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.4");

      return () => tl.kill();
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, []);

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
        setAvailableTags(['all', ...uniqueTags]);
      } else {
        console.error('Failed to fetch articles:', data.error);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesTag = selectedTag === 'all' || (article.tags && article.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  const handleViewArticle = (article) => {
    router.push(`/articles/${article._id}`);
  };

  const truncateContent = (content, maxLength = 150) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-muted-foreground">Loading articles...</div>
      </div>
    );
  }

return (
  <div className="min-h-screen bg-background py-[200px]">
    <div className="container mx-auto px-6 max-w-7xl">

      {/* Header Section */}
      <div ref={headerRef} className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="hidden md:block bg-muted p-3 rounded-full">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
            Islamic <span className="text-primary">Articles</span>
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore insightful articles on Islamic topics, scholarly works, and contemporary discussions to enrich your knowledge
        </p>
        <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-card rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles, authors, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
            >
              {availableTags.map(tag => (
                <option key={tag} value={tag}>
                  {tag === 'all' ? 'All Tags' : tag}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredArticles.length} of {articles.length} articles
        </div>
      </div>

      {/* Articles Grid */}
      <div ref={articlesGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map((article) => (
          <div
            key={article._id}
            className="bg-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden group"
          >
            {/* Article Image or Gradient Header */}
            <div className="relative h-48 overflow-hidden">
              {article.imageUrl ? (
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.parentElement.innerHTML = `
                      <div class="bg-gradient-to-br from-primary to-accent h-full flex items-center justify-center">
                        <svg class="w-16 h-16 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="bg-gradient-to-br from-primary to-accent h-full flex items-center justify-center">
                  <FileText className="w-16 h-16 text-white opacity-80" />
                </div>
              )}
              
              {/* Tags overlay */}
              {article.tags && article.tags.length > 0 && (
                <div className="absolute top-4 right-4">
                  <span className="bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-muted-foreground">
                    {article.tags[0]}
                  </span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-primary mb-2 line-clamp-2 group-hover:text-primary-hover transition-colors">
                {article.title}
              </h3>
              
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <User className="w-4 h-4" />
                <span className="text-sm">{article.author}</span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{formatDate(article.date)}</span>
              </div>
              
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {truncateContent(article.content)}
              </p>
              
              {/* Tags */}
              {article.tags && article.tags.length > 1 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {article.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium bg-muted text-primary rounded-full"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                  {article.tags.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{article.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
              
              <button
                onClick={() => handleViewArticle(article)}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg"
              >
                <Eye className="w-5 h-5" />
                <span>Read Article</span>
              </button>
            </div>
            
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"></div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredArticles.length === 0 && (
        <div className="text-center py-16">
          <FileText className="w-16 h-16 text-disabled-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">No articles found</h3>
          <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
        </div>
      )}
    </div>
  </div>
);

};

export default ArticlesPage;