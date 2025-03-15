import { connectToDB } from '@/lib/mongoDB';
import User from '@/lib/models/User';
import { NextRequest, NextResponse } from 'next/server';

// Config for admin API
const NEXT_PUBLIC_ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;
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
    const newUser = await User.create({
      name,
      email,
      password,
      wishlist: [],
      orders: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    // Create corresponding customer in admin system via API call
    try {
      const response = await fetch(`${NEXT_PUBLIC_ADMIN_API_URL}/customers`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${ADMIN_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: newUser.userId,
          name: newUser.name || 'New Customer',
          email: newUser.email,
          phone: '', // Required field but no value from user registration
          status: 'active',
          customerType: 'regular',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Admin API returned ${response.status}: ${JSON.stringify(errorData)}`,
        );
      }

      console.log(`Created new customer for user: ${newUser.email}`);
    } catch (apiError) {
      // Log error but don't fail the user creation
      console.error(
        '[admin_customer_create]',
        apiError instanceof Error ? apiError.message : String(apiError),
      );
    }

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
