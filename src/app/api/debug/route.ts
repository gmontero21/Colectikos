import { NextResponse } from 'next/server';
import { checkInAndAwardXP } from '@/actions/gamification';

export async function GET() {
  const res = await checkInAndAwardXP('95', 'CURIOSO', 'gmontero21');
  return NextResponse.json(res);
}
