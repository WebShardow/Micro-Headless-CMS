import { NextResponse } from "next/server";
import { createProject, getAllProjects } from "@/lib/project-data";

export async function GET() {
  const projects = await getAllProjects();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.title || !body.categoryId || !body.date) {
    return NextResponse.json(
      { error: "title, categoryId and date are required" },
      { status: 400 }
    );
  }

  const newProject = await createProject({
    title: String(body.title),
    description: String(body.description || ""),
    categoryId: String(body.categoryId),
    date: new Date(body.date),
    thumbnail: body.thumbnail ? String(body.thumbnail) : null,
    gallery: Array.isArray(body.gallery) ? body.gallery : [],
    videoLink: body.videoLink ? String(body.videoLink) : null,
    projectUrl: body.projectUrl ? String(body.projectUrl) : null,
    toolsUsed: Array.isArray(body.toolsUsed) ? body.toolsUsed : [],
  });

  return NextResponse.json(newProject, { status: 201 });
}
