import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

/**
 * Middleware for route protection.
 * Uses the edge-compatible auth.config.ts (NO prisma/bcrypt imports).
 */
export default auth;

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, icons, etc.)
     * - api/auth routes (handled by NextAuth)
     */
    "/((?!_next/static|_next/image|favicon.ico|images/|icons/|api/auth).*)",
  ],
};
