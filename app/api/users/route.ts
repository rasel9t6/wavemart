import { connectToDB } from '@/lib/mongoDB';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/lib/models/User';

export const GET = async () => {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectToDB();

    // Find user and populate orders
    const user = await User.findOne({ email: session.user.email })
      .select('+userId') // Explicitly select userId
      .populate({
        path: 'orders',
        options: { sort: { createdAt: -1 } },
      });

    if (!user) {
      // Create new user with session data
      const newUser = await User.create({
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        wishlist: [],
        orders: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await newUser.save();
      return NextResponse.json(newUser, { status: 201 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('[users_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectToDB();

    const updateData = await req.json();
    const allowedFields = ['name', 'phone', 'image', 'address'];

    // Validate update data
    const updates: any = {};
    Object.keys(updateData).forEach((key) => {
      if (allowedFields.includes(key)) {
        if (key === 'address') {
          // Validate address fields
          const addressFields = [
            'street',
            'city',
            'state',
            'postalCode',
            'country',
          ];
          updates.address = {};
          addressFields.forEach((field) => {
            if (updateData.address?.[field]) {
              updates.address[field] = updateData.address[field];
            }
          });
        } else {
          updates[key] = updateData[key];
        }
      }
    });

    // Add updatedAt timestamp
    updates.updatedAt = new Date();

    // Find and update user
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: updates },
      {
        new: true, // Return updated document
        runValidators: true, // Run model validations
      },
    )
      .select('+userId') // Explicitly select userId
      .populate({
        path: 'orders',
        options: { sort: { createdAt: -1 } },
      });

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error('[users_POST]', error);

    // Handle specific MongoDB validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
};
