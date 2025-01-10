import { connectToDB } from '@/lib/mongoDB';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/lib/models/User';
export const dynamic = 'force-dynamic';
export const GET = async (req: NextRequest) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    await connectToDB();
    let user = await User.findOne({ clerkId: userId });
    if (!user) {
      user = await User.create({ clerkId: userId });
      await user.save();
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.log('[user_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};
