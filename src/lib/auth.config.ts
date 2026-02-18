import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible auth configuration.
 * This file must NOT import any Node.js-only modules (prisma, bcrypt, pg, crypto, etc.)
 * It is used by the middleware which runs in Edge Runtime.
 */
export const authConfig: NextAuthConfig = {
  providers: [], // Providers are added in auth.ts (Node.js runtime only)
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAuth =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register");
      const isApiRoute = nextUrl.pathname.startsWith("/api");

      // Allow API routes through (they handle their own auth)
      if (isApiRoute) {
        return true;
      }

      // Redirect logged-in users away from auth pages
      if (isOnAuth && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      // Protect dashboard pages
      if (isOnDashboard && !isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl));
      }

      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
  trustHost: true,
};
