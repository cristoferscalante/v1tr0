/**
 * Siembra un usuario + sesión de prueba directamente en la base.
 *
 * El login del sitio es solo Google OAuth, que no se puede automatizar en CI.
 * Como NextAuth está configurado con estrategia de base de datos (DrizzleAdapter),
 * basta con insertar una fila en `sessions` y mandar su token en la cookie
 * `authjs.session-token` para que `auth()` reconozca al usuario.
 *
 * Todo lo sembrado usa el prefijo E2E_ y se borra en el teardown.
 */
import { db } from "@/lib/db"
import { users, profiles, sessions, carts, cartItems, orders } from "@/lib/db/schema"
import { eq, like } from "drizzle-orm"
import { randomUUID } from "node:crypto"

export const E2E_EMAIL = "e2e-test@v1tr0.local"
export const E2E_USER_ID = "e2e-user-fixed-id"

export interface SeededSession {
  userId: string
  sessionToken: string
}

export async function seedSession(): Promise<SeededSession> {
  await cleanupSession()

  await db.insert(users).values({
    id: E2E_USER_ID,
    name: "E2E Test",
    email: E2E_EMAIL,
    emailVerified: new Date(),
  })

  await db.insert(profiles).values({
    id: E2E_USER_ID,
    email: E2E_EMAIL,
    name: "E2E Test",
    role: "client",
  })

  const sessionToken = `e2e-${randomUUID()}`
  await db.insert(sessions).values({
    sessionToken,
    userId: E2E_USER_ID,
    // 1 día: sobra para una corrida y no deja sesiones vivas si algo falla.
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  })

  return { userId: E2E_USER_ID, sessionToken }
}

/** Borra todo rastro del usuario de prueba. Idempotente. */
export async function cleanupSession(): Promise<void> {
  // Las órdenes no caen por cascada desde users, así que van primero.
  await db.delete(orders).where(eq(orders.profileId, E2E_USER_ID))

  const cart = await db.select().from(carts).where(eq(carts.profileId, E2E_USER_ID)).then((r) => r[0])
  if (cart) {
    await db.delete(cartItems).where(eq(cartItems.cartId, cart.id))
    await db.delete(carts).where(eq(carts.id, cart.id))
  }

  await db.delete(sessions).where(like(sessions.sessionToken, "e2e-%"))
  await db.delete(profiles).where(eq(profiles.id, E2E_USER_ID))
  await db.delete(users).where(eq(users.id, E2E_USER_ID))
}
