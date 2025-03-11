import { connectToDB } from '@/lib/mongoDB';
import User from '@/lib/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 },
      );
    }

    await connectToDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 },
      );
    }

    // Create new user - password will be hashed by the pre-save middleware
    const user = await User.create({
      name,
      email,
      password,
    });

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 },
    );
  } catch (error) {
    console.error('[REGISTRATION_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
