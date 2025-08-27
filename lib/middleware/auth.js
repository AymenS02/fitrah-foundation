import jwt from 'jsonwebtoken';
import User from '../models/userSchema';
import { connectDB } from '../config/db';

/**
 * Verifies JWT token from Authorization header and returns the user.
 * @param {Request} req - Next.js request object
 * @returns {Promise<User>} - Mongoose User document
 * @throws {Error} - If token is missing, invalid, or user not found
 */
export async function verifyToken(req) {
  await connectDB(); // Ensure DB is connected

  // Get Authorization header (Bearer <token>)
  const authHeader = req.headers.get?.('authorization') || req.headers?.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in database
    const user = await User.findById(decoded.userId);
    if (!user) throw new Error('User not found');

    return user;
  } catch (err) {
    // Throw generic error to avoid leaking info
    throw new Error('Invalid or expired token');
  }
}
