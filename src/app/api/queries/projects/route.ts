import { getUserProjectsLight } from '@/actions/projects';
import { NextResponse } from 'next/server';

export const GET = async () => {
  const projects = await getUserProjectsLight();
  return NextResponse.json(projects);
};
