'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function SignIn() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-gray-50">
      <h1 className="text-heading2-bold text-gray-900">Welcome to Wavemart</h1>
      <button
        onClick={() => signIn('google', { callbackUrl: '/' })}
        className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm transition-all hover:shadow-md"
      >
        <Image
          src="https://img.icons8.com/color/48/000000/google-logo.png"
          width={24}
          height={24}
          alt="Google"
        />
        <span>Sign in with Google</span>
      </button>
    </div>
  );
}
