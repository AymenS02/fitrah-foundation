import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { verifyToken } from '../../../../lib/middleware/auth';
import { connectDB } from '../../../../lib/config/db';

export async function PUT(req) {
  try {
    await connectDB();
    const user = await verifyToken(req);

    const { current, newPass } = await req.json();
    if (!current || !newPass) {
      return NextResponse.json({ message: 'Current and new password are required' }, { status: 400 });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(current, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Current password is incorrect' }, { status: 400 });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPass, salt);

    await user.save();

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 401 });
  }
}
