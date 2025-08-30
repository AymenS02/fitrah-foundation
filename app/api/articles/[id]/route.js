// app/api/articles/[id]/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/config/db';
import Article from '../../../../lib/models/articleSchema';
import User from '../../../../lib/models/userSchema';

// GET - Fetch single article
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    const article = await Article.findById(id).populate('createdBy', 'name email');
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      article
    });

  } catch (error) {
    console.error('❌ Get article error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

// PUT - Update article
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    const {
      title,
      author,
      date,
      tags,
      imageUrl,
      content
    } = body;

    // Validation
    if (!title || !author || !content) {
      return NextResponse.json(
        { error: 'Title, author, and content are required fields' },
        { status: 400 }
      );
    }

    // Check if article exists
    const existingArticle = await Article.findById(id);
    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Check if another article with same title and author exists (excluding current article)
    const duplicateArticle = await Article.findOne({ 
      _id: { $ne: id },
      title: { $regex: new RegExp(`^${title}$`, 'i') }, 
      author: { $regex: new RegExp(`^${author}$`, 'i') }
    });
    
    if (duplicateArticle) {
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

    // Update article
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        author: author.trim(),
        date: date ? new Date(date) : existingArticle.date,
        tags: processedTags,
        imageUrl: imageUrl?.trim() || null,
        content: content.trim()
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    console.log('✅ Article updated successfully:', updatedArticle._id);

    return NextResponse.json({
      success: true,
      message: 'Article updated successfully',
      article: updatedArticle
    });

  } catch (error) {
    console.error('❌ Update article error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: `Validation error: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

// DELETE - Delete article
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    // Check if article exists
    const article = await Article.findById(id);
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Delete the article
    await Article.findByIdAndDelete(id);

    console.log('✅ Article deleted successfully:', id);

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete article error:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}