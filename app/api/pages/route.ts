import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// GET: ดึงหน้าเพจทั้งหมด
export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(pages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
  }
}

// POST: สร้างหน้าเพจใหม่
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug, content, isPublished } = body;

    const page = await prisma.page.create({
      data: {
        title,
        slug,
        content,
        isPublished: isPublished ?? true,
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create page" }, { status: 500 });
  }
}
