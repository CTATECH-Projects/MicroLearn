import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

const JWT_SECRET: string = process.env.JWT_SECRET;
function getExpiration(): jwt.SignOptions["expiresIn"] {
  const exp = process.env.JWT_EXPIRATION;
  return exp ? (exp as jwt.SignOptions["expiresIn"]) : "7d";
}

const JWT_EXPIRATION = getExpiration();

export function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

export function verifyToken(token: string): { userId: number } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export function getTokenExpiration(): Date {
  const now = new Date();
  now.setDate(now.getDate() + 7); // 7 days
  return now;
}
