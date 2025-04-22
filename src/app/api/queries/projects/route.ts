import { getUserProjectsLight } from "@/actions/projects";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const projects = await getUserProjectsLight();
  return NextResponse.json(projects);
}