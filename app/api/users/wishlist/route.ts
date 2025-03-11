import User from '@/lib/models/User';
import { connectToDB } from '@/lib/mongoDB';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectToDB();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return new NextResponse('Product Id required', { status: 400 });
    }

    const isLiked = user.wishlist.includes(productId);

    if (isLiked) {
      // Remove from wishlist
      user.wishlist = user.wishlist.filter((id: string) => id !== productId);
    } else {
      // Add to wishlist
      user.wishlist.push(productId);
    }

    await user.save();

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.log('[wishlist_POST]', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};

export const dynamic = 'force-dynamic';
