import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE = "sudan_store_admin";
function secretKey() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters");
  return new TextEncoder().encode(secret);
}
export async function createAdminSession(email: string) {
  const token = await new SignJWT({ role: "admin", email }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("8h").sign(secretKey());
  const jar = await cookies();
  jar.set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
}
export async function isAdmin() {
  try {
    const token = (await cookies()).get(COOKIE)?.value;
    if (!token) return false;
    const { payload } = await jwtVerify(token, secretKey());
    return payload.role === "admin" && payload.email === process.env.ADMIN_EMAIL;
  } catch { return false; }
}
export async function requireAdminApi() {
  if (await isAdmin()) return null;
  return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
}
export async function destroyAdminSession() {
  (await cookies()).delete(COOKIE);
}
