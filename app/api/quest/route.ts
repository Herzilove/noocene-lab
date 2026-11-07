import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { finishTrial, questionPublic } from '../../../lib/quest-core';
import { validRequestOrigin } from '../_origin';
import { COOKIE, getSession, startSession, store } from '../../../lib/session-store';
import { openSession, sealSession, revokeSession } from '../../../lib/quest-cookie';
import { reflectionQuestion } from '../../../lib/claude';

export const runtime = 'nodejs';
const answer = { answer: z.number().int().min(0).max(2), confidence: z.number().min(0).max(100) };
const input = z.discriminatedUnion('action', [
  z.object({ action: z.literal('start'), consent: z.boolean(), allowAI: z.boolean().default(false) }).strict(),
  z.object({ action: z.literal('initial'), ...answer }).strict(),
  z.object({ action: z.literal('finish'), ...answer }).strict(),
  z.object({ action: z.literal('exit') }).strict()
]);
function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
}
export async function POST(req: NextRequest) {
  if (!validRequestOrigin(req)) return json({error:'Invalid request origin.'},403);
  if (!req.headers.get('content-type')?.includes('application/json')) return json({error:'JSON is required.'},415);
  const raw = await req.text();
  if (raw.length > 2048) return json({error:'Input is too large.'},413);
  let payload;
  try { payload = input.parse(JSON.parse(raw)); } catch { return json({error:'Please check your input.'},400); }
  const rawCookie = req.cookies.get(COOKIE)?.value;
  const restored = openSession(rawCookie);
  const id = restored?.id || rawCookie;
  if(restored&&!getSession(restored.id))store.sessions.set(restored.id,restored);
  function reply(data:unknown, session:NonNullable<ReturnType<typeof getSession>>){const response=json(data);response.cookies.set(COOKIE,sealSession(session),{httpOnly:true,sameSite:'strict',secure:req.nextUrl.protocol==='https:',maxAge:1800,path:'/'});return response;}
  if (payload.action === 'exit') {
    if (id) {store.sessions.delete(id);revokeSession(id);}
    const response = json({ok:true}); response.cookies.delete(COOKIE); return response;
  }
  if (payload.action === 'start') {
    // Repeated start is idempotent for an active session.
    let session = getSession(id);
    if (session && (session.consent !== payload.consent || session.allowAI !== payload.allowAI)) { store.sessions.delete(session.id); session = undefined; }
    if (session?.result) { store.sessions.delete(session.id); session = undefined; }
    try { session ??= startSession(payload.consent,payload.allowAI); } catch { return json({error:'Too many sessions are active. Please try again later.'},429); }
    const response = json({id:session.id,condition:session.condition,mode:session.mode,question:questionPublic()});
    response.cookies.set(COOKIE,sealSession(session),{httpOnly:true,sameSite:'strict',secure:req.nextUrl.protocol==='https:',maxAge:1800,path:'/'});
    return response;
  }
  const session = getSession(id);
  if (!session) return json({error:'Your session has expired. Please start again.'},401);
  if (payload.action === 'initial') {
    if (session.result) return json({error:'This session is complete.'},409);
    if (session.pending) return json({error:'The reflection question is still being prepared.'},409);
    if (session.failed) return json({error:'The model request failed. Please end the session and start again. This trial will not be analyzed.'},503);
    if (session.initial && (session.initial.answer !== payload.answer || session.initial.confidence !== payload.confidence)) return json({error:'Your initial answer has already been submitted.'},409);
    if (session.reflection) return reply({question:session.reflection,mode:session.mode},session);
    session.initial = {answer:payload.answer,confidence:payload.confidence}; session.pending = true;
    try {
      session.reflection = session.condition === 'independent'
        ? 'Take a moment to review your first answer independently. Would you keep your answer?'
        : await reflectionQuestion(session.initial, session.mode);
      return reply({question:session.reflection,mode:session.mode},session);
    } catch {
      session.failed = true;
      return json({error:'The reflection question could not be loaded. No demo response was substituted. Please end this session.'},503);
    } finally { session.pending = false; }
  }
  if (!session.initial || !session.reflection || session.pending || session.failed) return json({error:'Please complete the reflection step first.'},409);
  if (!session.result) {
    session.result = finishTrial(session.initial,{answer:payload.answer,confidence:payload.confidence});
    session.finishedAt = Date.now();
  }
  return reply({...session.result,condition:session.condition,mode:session.mode},session);
}
