import { NextRequest, NextResponse } from 'next/server';
import { openSession,sealSession } from '../../../lib/quest-cookie';
import { safeEqual } from '../../../lib/quest-core';
import { validRequestOrigin } from '../_origin';
import { COOKIE, getSession, permittedTrials, store } from '../../../lib/session-store';

export const runtime = 'nodejs';
export async function GET(req: NextRequest) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || expected.length < 32 || !safeEqual(req.headers.get('authorization') ?? '',`Bearer ${expected}`)) {
    return NextResponse.json({error:'Access denied.'},{status:401,headers:{'Cache-Control':'no-store'}});
  }
  const trials = permittedTrials();
  return NextResponse.json({
    schemaVersion:1, storage:'ephemeral-process-memory-30min', researchStatus:'feasibility-prototype',
    completedTrials:trials.length, trials
  },{headers:{'Cache-Control':'no-store','Content-Disposition':'attachment; filename="noocene-research.json"'}});
}
export async function DELETE(req: NextRequest) {
  if (!validRequestOrigin(req)) return NextResponse.json({error:'Invalid request origin.'},{status:403});
  const raw=req.cookies.get(COOKIE)?.value;const restored=openSession(raw);const session=getSession(restored?.id||raw)||restored;
  const response=NextResponse.json({ok:true},{headers:{'Cache-Control':'no-store'}});
  if(session){session.consent=false;store.sessions.set(session.id,session);response.cookies.set(COOKIE,sealSession(session),{httpOnly:true,sameSite:'strict',secure:req.nextUrl.protocol==='https:',maxAge:1800,path:'/'});}
  return response;
}
