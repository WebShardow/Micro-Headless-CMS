import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

// GET: ดึงข้อมูลหน้าเพจ (รองรับทั้ง ID และ Slug)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const page = await prisma.page.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ]
      }
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch page" }, { status: 500 });
  }
}

// PATCH: แก้ไขหน้าเพจ
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, slug, content, isPublished } = body;

    const page = await prisma.page.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        isPublished,
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update page" }, { status: 500 });
  }
}

// DELETE: ลบหน้าเพจ
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.page.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete page" }, { status: 500 });
  }
}
