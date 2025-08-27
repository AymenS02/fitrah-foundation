import { NextResponse } from 'next/server';
import User from '../../../../lib/models/userSchema';  
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '../../../../lib/config/db';

export async function POST(request) {
  try {
    await connectDB();
    const { email, password, firstName, lastName, gender } = await request.json();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Build user data object
    const userData = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'STUDENT',  // always student unless changed manually
      gender
    };


    const user = new User(userData);
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        gender: user.gender, 
      }
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
