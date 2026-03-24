import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// GET: ดึงรายการสื่อทั้งหมด
export async function GET() {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(media);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

// POST: อัปโหลดสื่อใหม่
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // สร้างชื่อไฟล์ที่ไม่ซ้ำกัน
    const timestamp = Date.now();
    const safeName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-]/g, '');
    const fileName = `${timestamp}-${safeName}`;
    const filePath = path.join(UPLOAD_DIR, fileName);
    const fileUrl = `/uploads/${fileName}`;

    // บันทึกไฟล์ลงดิสก์
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    fs.writeFileSync(filePath, buffer);

    // บันทึกข้อมูลลงฐานข้อมูล
    const media = await prisma.media.create({
      data: {
        name: file.name,
        url: fileUrl,
        type: file.type,
        size: file.size,
      },
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
