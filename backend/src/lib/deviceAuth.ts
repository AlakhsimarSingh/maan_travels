import crypto from "crypto";

/**
 * Admin device tokens are sent to the browser as an httpOnly cookie and
 * must remain valid as a "bearer secret" — anyone who has the raw value
 * can act as that device. Storing the raw value in the database means a
 * DB leak (backup exposure, SQL injection, careless query log, etc.) hands
 * out every admin session directly. Hashing means the database only ever
 * holds something that's useless without the original value.
 *
 * We use HMAC-SHA256 with a server-side secret rather than a plain hash,
 * so even a stolen database dump can't be brute-forced into raw tokens
 * without also having the server's secret.
 */

const SECRET = process.env.DEVICE_TOKEN_SECRET;

if (!SECRET) {
  // Fail loudly at startup rather than silently hashing with an empty key,
  // which would make every token's hash trivially predictable.
  throw new Error(
    "DEVICE_TOKEN_SECRET is not set. Add a long random value to your .env file."
  );
}

export function generateDeviceToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function hashDeviceToken(rawToken: string): string {
  return crypto.createHmac("sha256", SECRET as string).update(rawToken).digest("hex");
}

export function generateInviteCode(): string {
  // Shorter than a device token since it's meant to be typed/shared once,
  // but still long enough to not be guessable within its short expiry window.
  return crypto.randomBytes(16).toString("hex");
}

/**
 * Constant-time comparison to avoid timing attacks when comparing hashes.
 * Hash lengths are fixed (64 hex chars for SHA256) so this is always safe
 * to call directly without a length pre-check leaking information.
 */
export function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);

  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}