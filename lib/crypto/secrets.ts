import { createCipheriv, createDecipheriv, randomBytes } from "crypto"

/**
 * Cifrado en reposo para la bóveda de credenciales (client_secrets).
 * AES-256-GCM: cada valor se cifra con un IV aleatorio distinto y produce
 * un authTag que detecta cualquier manipulación del texto cifrado.
 *
 * La clave sale de SECRETS_ENCRYPTION_KEY (32 bytes en base64). Generarla:
 *   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
 * Sin esta variable de entorno el sistema rechaza cifrar o descifrar — no
 * hay una clave de repuesto embebida en el código, sería un hueco de
 * seguridad silencioso.
 */

function getKey(): Buffer {
  const raw = process.env.SECRETS_ENCRYPTION_KEY
  if (!raw) {
    throw new Error(
      "Falta SECRETS_ENCRYPTION_KEY en el entorno. Genera una con: " +
        "node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\" " +
        "y agrégala a .env.local",
    )
  }
  const key = Buffer.from(raw, "base64")
  if (key.length !== 32) {
    throw new Error("SECRETS_ENCRYPTION_KEY debe decodificar a exactamente 32 bytes (AES-256)")
  }
  return key
}

export interface EncryptedPayload {
  value: string // ciphertext en base64
  iv: string // base64
  authTag: string // base64
}

export function encryptSecret(plaintext: string): EncryptedPayload {
  const key = getKey()
  const iv = randomBytes(12) // 96 bits, recomendado para GCM
  const cipher = createCipheriv("aes-256-gcm", key, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()])
  return {
    value: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    authTag: cipher.getAuthTag().toString("base64"),
  }
}

export function decryptSecret(payload: EncryptedPayload): string {
  const key = getKey()
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(payload.iv, "base64"))
  decipher.setAuthTag(Buffer.from(payload.authTag, "base64"))
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payload.value, "base64")),
    decipher.final(),
  ])
  return decrypted.toString("utf8")
}
