import { getUserProjectsLight } from '@/actions/projects';
import { NextResponse } from 'next/server';

export const GET = async () => {
  const result = await getUserProjectsLight();
  return NextResponse.json(result.success ? result.data : []);
};
