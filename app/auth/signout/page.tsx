'use client';

import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

export default function SignOut() {
  useEffect(() => {
    signOut({ callbackUrl: '/' });
  }, []);

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <p>Signing out...</p>
    </div>
  );
}
