'use client';

import React, { useEffect, useRef, useState, use } from 'react';
import { gsap } from "gsap";
import { FileText, Calendar, User, Tag, ArrowLeft, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ArticleDetailPage = ({ params }) => {
  const { id } = use(params); // ✅ unwrap the params promise

  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Only run animation when article is loaded
    if (headerRef.current && contentRef.current && article) {
      const tl = gsap.timeline({ delay: 0.3 });
      gsap.set([headerRef.current, contentRef.current], { opacity: 0, y: 20 });

      tl.to(headerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }).to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.4");

      return () => tl.kill();
    }
  }, [article]);

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/articles/${id}`);
      const data = await response.json();

      if (response.ok) {
        setArticle(data.article);
      } else {
        console.error('Failed to fetch article:', data.error);
      }
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s/g).length;
    return Math.ceil(words / wordsPerMinute);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-light">
        <div className="text-gray-600">Loading article...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-light py-32">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Article Not Found</h2>
            <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or may have been removed.</p>
            <button
              onClick={() => router.back()}
              className="bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Articles</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Articles</span>
          </button>
        </div>

        {/* Article Header */}
        <div ref={headerRef} className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags && article.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 text-sm font-medium bg-light text-primary rounded-full"
              >
                <Tag className="w-4 h-4 mr-1" />
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
            {article.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">
            {article.summary || article.excerpt}
          </p>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="font-medium">{article.author}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{formatDate(article.date)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{calculateReadTime(article.content)} min read</span>
            </div>
          </div>
        </div>

        {/* Article Image */}
        {article.imageUrl && (
          <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <div ref={contentRef} className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="prose max-w-none">
            <div className="text-gray-700 leading-relaxed text-lg space-y-6">
              {article.content.split('\n').map((paragraph, index) => (
                paragraph.trim() ? <p key={index}>{paragraph}</p> : <br key={index} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ArticleDetailPage;
