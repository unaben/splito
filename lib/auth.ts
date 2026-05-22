/**
 * lib/auth.ts
 * ─────────────────────────────────────────────────────────────
 * NextAuth v4 configuration.
 * Uses Credentials provider — email + bcrypt password against
 * the single registered user (user-1) in supabase users table.
 * ─────────────────────────────────────────────────────────────
 */

import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { findOneUserByEmail } from "./db";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await findOneUserByEmail(credentials.email);

        if (!user || user.isSeeded || !user.passwordHash) return null;

        const valid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
