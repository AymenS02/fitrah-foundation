// app/api/articles/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/config/db';
import Article from '../../../lib/models/articleSchema';
import User from '../../../lib/models/userSchema';

// GET - Fetch all articles
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const tags = searchParams.get('tags') || '';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Build search query
    let query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (tags && tags !== 'all') {
      // Handle multiple tags separated by comma
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }

    // Fetch articles with pagination and populate createdBy
    const articles = await Article.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Article.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Get articles error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

// POST - Create new article
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const {
      title,
      author,
      date,
      tags,
      imageUrl,
      content,
      createdBy
    } = body;

    // Validation
    if (!title || !author || !content) {
      return NextResponse.json(
        { error: 'Title, author, and content are required fields' },
        { status: 400 }
      );
    }

    // Validate that createdBy user exists
    if (createdBy) {
      const user = await User.findById(createdBy);
      if (!user) {
        return NextResponse.json(
          { error: 'Invalid user ID' },
          { status: 400 }
        );
      }
    }

    // Check if article with same title and author already exists
    const existingArticle = await Article.findOne({ 
      title: { $regex: new RegExp(`^${title}$`, 'i') }, 
      author: { $regex: new RegExp(`^${author}$`, 'i') }
    });
    
    if (existingArticle) {
      return NextResponse.json(
        { error: 'An article with this title and author already exists' },
        { status: 409 }
      );
    }

    // Process tags - ensure it's an array and clean up
    let processedTags = [];
    if (tags) {
      if (Array.isArray(tags)) {
        processedTags = tags.map(tag => tag.trim()).filter(tag => tag.length > 0);
      } else if (typeof tags === 'string') {
        processedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      }
    }

    // Create new article
    const newArticle = new Article({
      title: title.trim(),
      author: author.trim(),
      date: date ? new Date(date) : new Date(),
      tags: processedTags,
      imageUrl: imageUrl?.trim() || null,
      content: content.trim(),
      createdBy: createdBy || null
    });

    const savedArticle = await newArticle.save();
    
    // Populate the createdBy field for response
    await savedArticle.populate('createdBy', 'name email');

    console.log('✅ Article created successfully:', savedArticle._id);

    return NextResponse.json({
      success: true,
      message: 'Article created successfully',
      article: savedArticle
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Create article error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: `Validation error: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}

// PUT - Update article (handled in individual article route)
export async function PUT() {
  return NextResponse.json(
    { error: 'Use /api/articles/[id] for updating specific articles' },
    { status: 405 }
  );
}

// DELETE - Delete multiple articles (handled in individual article route for single delete)
export async function DELETE() {
  return NextResponse.json(
    { error: 'Use /api/articles/[id] for deleting specific articles' },
    { status: 405 }
  );
}