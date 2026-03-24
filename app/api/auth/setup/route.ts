import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

// GET: ตรวจสอบว่าต้อง setup ไหม
export async function GET() {
  const count = await prisma.user.count();
  return NextResponse.json({ needsSetup: count === 0 });
}

// POST: สร้าง Super Admin ครั้งแรก
export async function POST(request: NextRequest) {
  try {
    // ห้ามใช้ถ้ามี user อยู่แล้ว
    const count = await prisma.user.count();
    if (count > 0) {
      return NextResponse.json(
        { error: "Setup already completed. Please login." },
        { status: 403 }
      );
    }

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    if (username.length < 3) {
      return NextResponse.json({ error: "Username must be at least 3 characters" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Hash password ด้วย bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: "superadmin",
        mustChangePassword: true, // บังคับเปลี่ยน password ครั้งแรก
      },
    });

    // Auto-login หลัง setup เสร็จ
    const cookieStore = await cookies();
    cookieStore.set("session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
    });
    cookieStore.set("must_change_pw", "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ success: true, mustChangePassword: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Setup failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
