import { connectToDB } from '@/lib/mongoDB';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/lib/models/User';

// Config for admin API
const NEXT_PUBLIC_ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY; // Secure API key for admin access

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
      // User exists in NextAuth but not in our extended User model
      // This should be rare since NextAuth signIn callback should handle this
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
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

    // Also update the corresponding customer record in admin system
    if (updatedUser) {
      try {
        // Create customer update payload
        const customerUpdates = {
          name: updates.name,
          phone: updates.phone,
          address: updates.address,
        };

        // Only include fields that were actually updated
        const filteredUpdates = Object.fromEntries(
          // eslint-disable-next-line no-unused-vars
          Object.entries(customerUpdates).filter(([_, v]) => v !== undefined),
        );

        // Skip the API call if no relevant fields were updated
        if (Object.keys(filteredUpdates).length > 0) {
          const response = await fetch(
            `${NEXT_PUBLIC_ADMIN_API_URL}/customers/${updatedUser.userId}`,
            {
              method: 'PATCH',
              headers: {
                Authorization: `Bearer ${ADMIN_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(filteredUpdates),
            },
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              `Admin API returned ${response.status}: ${JSON.stringify(errorData)}`,
            );
          }
        }
      } catch (apiError: any) {
        // Log error but don't fail the user update
        console.error('[admin_customer_update]', apiError.message);
      }
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
