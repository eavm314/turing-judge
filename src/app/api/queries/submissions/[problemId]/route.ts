import { getUserSubmissions } from '@/actions/submissions';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ problemId: string }> },
) => {
  const { problemId } = await params;
  const result = await getUserSubmissions(problemId);
  return NextResponse.json(result.success ? result.data : []);
};
