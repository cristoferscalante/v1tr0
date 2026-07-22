import { auth } from "@/auth"
import { db } from "@/lib/db"
import { profiles } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function getCurrentProfile() {
  const session = await auth()
  if (!session?.user?.id) return null

  const profile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .then((r) => r[0] ?? null)

  return {
    ...session.user,
    role: profile?.role ?? "client" as const,
    profile,
  }
}

export type CurrentProfile = Awaited<ReturnType<typeof getCurrentProfile>>
