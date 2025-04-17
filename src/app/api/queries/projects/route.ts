import { getUserProjects } from "@/actions/projects";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const projects = await getUserProjects();
  const simplifiedProjects = projects.map((project) => {
    return {
      id: project.id,
      title: project.title,
      type: project.type,
    }
  })
  return NextResponse.json(simplifiedProjects);
}