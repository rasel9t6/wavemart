// lib/auth-options.ts
import { NextAuthOptions } from 'next-auth';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import clientPromise, { connectToDB } from '@/lib/mongoDB';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import { createCustomerInAdminSystem } from '@/lib/admin-customer';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  // eslint-disable-next-line no-unused-vars
  interface Session extends DefaultSession {
    user: {
      id: string;
      phone?: string | null;
      address?: {
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
      } | null;
      userId?: string | null;
    } & DefaultSession['user'];
  }
}
export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password');
        }
        await connectToDB();
        const user = await User.findOne({ email: credentials.email }).select(
          '+password',
        );
        if (!user || !user.password) {
          throw new Error('No user found with this email');
        }
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!passwordMatch) {
          throw new Error('Incorrect password');
        }
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      try {
        // Only create customer for OAuth providers (like Google)
        // since credential users go through registration
        if (account?.provider === 'google') {
          await createCustomerInAdminSystem(user);
        }
      } catch (error) {
        console.error('[SIGNIN_CUSTOMER_CREATE_ERROR]', error);
        // Don't block sign-in if customer creation fails
      }
      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  debug: process.env.NODE_ENV === 'development',
};
