import { withAuth } from 'next-auth/middleware';

export default withAuth;

export const config = {
  matcher: [
    '/wishlist',
    '/orders',
    '/cart',
    '/api/users/:path*',
    '/api/checkout/:path*',
  ],
};
