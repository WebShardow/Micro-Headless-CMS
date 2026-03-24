import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const MODULES_DIR = path.join(process.cwd(), "modules");
const TEMP_DIR = path.join(process.cwd(), "tmp", "uploads");

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file || !file.name.endsWith(".zip")) {
      return NextResponse.json({ error: "Please upload a valid .zip file" }, { status: 400 });
    }

    // 1. เตรียมโฟลเดอร์
    if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });
    if (!fs.existsSync(MODULES_DIR)) fs.mkdirSync(MODULES_DIR, { recursive: true });

    const zipPath = path.join(TEMP_DIR, `${Date.now()}-${file.name}`);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(zipPath, buffer);

    // 2. แตกไฟล์โดยใช้ PowerShell (Windows)
    const moduleName = file.name.replace(".zip", "");
    const extractPath = path.join(MODULES_DIR, moduleName);
    
    // ลบโฟลเดอร์เก่าถ้ามีซ้ำ
    if (fs.existsSync(extractPath)) {
      fs.rmSync(extractPath, { recursive: true, force: true });
    }
    fs.mkdirSync(extractPath, { recursive: true });

    // คำสั่ง PowerShell สำหรับแตกไฟล์
    const cmd = `powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${extractPath}' -Force"`;
    await execAsync(cmd);

    // 3. ลบไฟล์ Zip ชั่วคราว
    fs.unlinkSync(zipPath);

    return NextResponse.json({ 
      success: true, 
      message: `Module '${moduleName}' installed.`,
      path: extractPath
    });
  } catch (error: any) {
    console.error("Module install error:", error);
    return NextResponse.json({ error: "Failed to install module: " + error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!fs.existsSync(MODULES_DIR)) return NextResponse.json([]);
    const dirs = fs.readdirSync(MODULES_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => ({ name: dirent.name }));
    return NextResponse.json(dirs);
  } catch {
    return NextResponse.json([]);
  }
}
