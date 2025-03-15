import { connectToDB } from '@/lib/mongoDB';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/lib/models/User';
import Order from '@/lib/models/Order';

export const GET = async () => {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectToDB();

    // Get user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Get user's orders with populated items
    const orders = await Order.find({ _id: { $in: user.orders } })
      .sort({ createdAt: -1 })
      .populate('items.product', 'title price');

    return NextResponse.json(orders);
  } catch (error) {
    console.error('[ORDERS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};
