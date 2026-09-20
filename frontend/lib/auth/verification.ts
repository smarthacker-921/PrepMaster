import crypto from "crypto";

const CODE_EXPIRY_MINUTES = 5;

export function generateVerificationCode(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

export function hashVerificationCode(code: string): string {
  return crypto
    .createHash("sha256")
    .update(code)
    .digest("hex");
}

export function getVerificationExpiry(): Date {
  return new Date(
    Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000
  );
}

export function verifyCode(
  code: string,
  codeHash: string
): boolean {
  const hash = hashVerificationCode(code);

  return crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(codeHash, "hex")
  );
}