import { connectToDB } from '@/lib/mongoDB';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/lib/models/User';

// Config for admin API
const NEXT_PUBLIC_ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

export const GET = async () => {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectToDB();

    // Find user without orders
    const user = await User.findOne({ email: session.user.email }).select(
      '+userId',
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If user has userId, fetch orders from admin API
    if (user.userId) {
      try {
        const response = await fetch(
          `${NEXT_PUBLIC_ADMIN_API_URL}/customers/${user.userId}/orders`,
          {
            headers: {
              Authorization: `Bearer ${ADMIN_API_KEY}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.ok) {
          const ordersData = await response.json();
          // Attach orders to user response
          user._doc.orders = ordersData;
        }
      } catch (apiError) {
        console.error('[fetch_orders]', apiError);
        // Continue without orders data
      }
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
        new: true,
        runValidators: true,
      },
    ).select('+userId');
    console.log(updatedUser);
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Also update the customer record in admin system
    if (updatedUser && updatedUser.userId) {
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
            `${NEXT_PUBLIC_ADMIN_API_URL}/customers/${updatedUser.userId}/orders`,
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

        // After updating customer, fetch their orders
        const ordersResponse = await fetch(
          `${NEXT_PUBLIC_ADMIN_API_URL}/customers/${updatedUser.userId}/orders`,
          {
            headers: {
              Authorization: `Bearer ${ADMIN_API_KEY}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          // Attach orders to user response
          updatedUser._doc.orders = ordersData;
        }
      } catch (apiError: any) {
        // Log error but don't fail the user update
        console.error('[admin_api_error]', apiError.message);
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
