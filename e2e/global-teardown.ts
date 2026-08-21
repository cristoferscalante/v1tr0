import { cleanupSession } from "./seed-session"

/** Deja la base como estaba aunque la corrida falle a mitad. */
export default async function globalTeardown() {
  await cleanupSession()
}
