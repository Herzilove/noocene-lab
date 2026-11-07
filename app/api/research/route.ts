import { NextRequest, NextResponse } from 'next/server';
import { safeEqual } from '../../../lib/quest-core';
import { validRequestOrigin } from '../_origin';
import { COOKIE, getSession, permittedTrials } from '../../../lib/session-store';

export const runtime = 'nodejs';
export async function GET(req: NextRequest) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || expected.length < 32 || !safeEqual(req.headers.get('authorization') ?? '',`Bearer ${expected}`)) {
    return NextResponse.json({error:'Zugriff nicht erlaubt.'},{status:401,headers:{'Cache-Control':'no-store'}});
  }
  const trials = permittedTrials();
  return NextResponse.json({
    schemaVersion:1, storage:'ephemeral-process-memory-30min', researchStatus:'feasibility-prototype',
    completedTrials:trials.length, trials
  },{headers:{'Cache-Control':'no-store','Content-Disposition':'attachment; filename="noocene-research.json"'}});
}
export async function DELETE(req: NextRequest) {
  if (!validRequestOrigin(req)) return NextResponse.json({error:'Ungültiger Ursprung.'},{status:403});
  const session = getSession(req.cookies.get(COOKIE)?.value);
  if (session) session.consent = false;
  return NextResponse.json({ok:true},{headers:{'Cache-Control':'no-store'}});
}
