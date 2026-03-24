import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "prisma", "dev.db");

// GET: Backup - ดาวน์โหลดไฟล์ฐานข้อมูล
export async function GET() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return NextResponse.json({ error: "Database file not found" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(DB_PATH);
    
    return new Response(fileBuffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="backup-${new Date().toISOString().slice(0, 10)}.db"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to backup database" }, { status: 500 });
  }
}

// POST: Restore - กู้คืนฐานข้อมูล (รองรับ multipart/form-data)
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // สำรองข้อมูลเดิมไว้กันเหนียวในโฟลเดอร์ tmp ก่อนเขียนทับ
    const backupOldPath = path.join(process.cwd(), "prisma", "dev.db.bak");
    if (fs.existsSync(DB_PATH)) {
      fs.copyFileSync(DB_PATH, backupOldPath);
    }

    fs.writeFileSync(DB_PATH, buffer);

    return NextResponse.json({ success: true, message: "Database restored successfully. Please restart dev server if needed." });
  } catch (error) {
    console.error("Restore error:", error);
    return NextResponse.json({ error: "Failed to restore database" }, { status: 500 });
  }
}
