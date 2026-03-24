import { prisma } from "./prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export async function login(username: string, password: string) {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const cookieStore = await cookies();

  // Session cookie
  cookieStore.set("session", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  // Flag บังคับเปลี่ยน password (ถ้าจำเป็น)
  if (user.mustChangePassword) {
    cookieStore.set("must_change_pw", "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
    });
  } else {
    cookieStore.delete("must_change_pw");
  }

  return { mustChangePassword: user.mustChangePassword };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  cookieStore.delete("must_change_pw");
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  if (!session) return null;

  const user = await prisma.user.findUnique({ where: { id: session.value } });
  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}