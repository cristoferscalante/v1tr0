import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import { users, accounts, sessions, verificationTokens, profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [Google],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      const profile = await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, user.id))
        .then((r) => r[0]);
      session.user.role = profile?.role ?? "client";
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      if (user.id) {
        const existing = await db
          .select()
          .from(profiles)
          .where(eq(profiles.id, user.id))
          .then((r) => r[0]);
        if (!existing) {
          await db.insert(profiles).values({
            id: user.id,
            email: user.email ?? "",
            name: user.name,
            role: "client",
          });
        }
      }
    },
  },
});
