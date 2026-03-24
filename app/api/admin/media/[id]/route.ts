import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import fs from "fs";
import path from "path";

// DELETE: ลบสื่อ
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // ค้นหาข้อมูลเดิมก่อน
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    // ลบไฟล์จริงออกจากดิสก์
    const filePath = path.join(process.cwd(), "public", media.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // ลบข้อมูลจากฐานข้อมูล
    await prisma.media.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
  }
}
