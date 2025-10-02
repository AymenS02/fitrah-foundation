import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/config/db';
import { verifyToken } from '../../../../lib/middleware/auth';

export async function GET(req) {
  try {
    // Connect to the database
    await connectDB();

    const user = await verifyToken(req);

    if (user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ message: 'Access granted', user });

  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}