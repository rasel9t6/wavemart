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
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      const newUser = await User.create({
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      });
      await newUser.save();
      return NextResponse.json(newUser, { status: 200 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.log('[user_GET]', error);
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
    const { name, address } = await req.json();

    if (!name || !address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.name = name;
    user.address = address;
    await user.save();

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('[users_POST]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
};

// export const GET = async (req: NextRequest) => {
//   try {
//     await connectToDB();
//     const users = await User.find().sort({ createdAt: -1 });

//     return NextResponse.json(users, { status: 200 });
//   } catch (error) {
//     console.error('[users_GET]', error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 },
//     );
//   }
// };

// // Create a new user (when a user signs up)
// export const POST = async (req: NextRequest) => {
//   try {
//     await connectToDB();
//     const { clerkId, name, email, phone, address } = await req.json();

//     if (!clerkId || !name || !email || !phone || !address) {
//       return NextResponse.json(
//         { error: 'Missing required fields' },
//         { status: 400 },
//       );
//     }

//     const existingUser = await User.findOne({ clerkId });
//     if (existingUser) {
//       return NextResponse.json(
//         { error: 'User already exists' },
//         { status: 400 },
//       );
//     }

//     const newUser = await User.create({ clerkId, name, email, phone, address });
//     return NextResponse.json(newUser, { status: 201 });
//   } catch (error) {
//     console.error('[users_POST]', error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 },
//     );
//   }
// };
