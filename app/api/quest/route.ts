import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { finishTrial, questionPublic } from '../../../lib/quest-core';
import { validRequestOrigin } from '../_origin';
import { COOKIE, getSession, startSession, store } from '../../../lib/session-store';
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
  if (!validRequestOrigin(req)) return json({error:'Ungültiger Ursprung.'},403);
  if (!req.headers.get('content-type')?.includes('application/json')) return json({error:'JSON erforderlich.'},415);
  const raw = await req.text();
  if (raw.length > 2048) return json({error:'Eingabe zu groß.'},413);
  let payload;
  try { payload = input.parse(JSON.parse(raw)); } catch { return json({error:'Bitte prüfe deine Eingabe.'},400); }
  const id = req.cookies.get(COOKIE)?.value;
  if (payload.action === 'exit') {
    if (id) store.sessions.delete(id);
    const response = json({ok:true}); response.cookies.delete(COOKIE); return response;
  }
  if (payload.action === 'start') {
    // Repeated start is idempotent for an active session.
    let session = getSession(id);
    if (session && (session.consent !== payload.consent || session.allowAI !== payload.allowAI)) { store.sessions.delete(session.id); session = undefined; }
    if (session?.result) { store.sessions.delete(session.id); session = undefined; }
    try { session ??= startSession(payload.consent,payload.allowAI); } catch { return json({error:'Gerade sind zu viele Sitzungen aktiv. Bitte versuche es später erneut.'},429); }
    const response = json({id:session.id,condition:session.condition,mode:session.mode,question:questionPublic()});
    response.cookies.set(COOKIE,session.id,{httpOnly:true,sameSite:'strict',secure:req.nextUrl.protocol==='https:',maxAge:1800,path:'/'});
    return response;
  }
  const session = getSession(id);
  if (!session) return json({error:'Die Sitzung ist abgelaufen. Bitte starte neu.'},401);
  if (payload.action === 'initial') {
    if (session.result) return json({error:'Die Sitzung ist abgeschlossen.'},409);
    if (session.pending) return json({error:'Die Reflexionsfrage wird noch vorbereitet.'},409);
    if (session.failed) return json({error:'Der Modellaufruf ist fehlgeschlagen. Bitte beende die Sitzung und starte neu. Dieser Durchlauf wird nicht ausgewertet.'},503);
    if (session.initial && (session.initial.answer !== payload.answer || session.initial.confidence !== payload.confidence)) return json({error:'Die erste Antwort wurde bereits abgegeben.'},409);
    if (session.reflection) return json({question:session.reflection,mode:session.mode});
    session.initial = {answer:payload.answer,confidence:payload.confidence}; session.pending = true;
    try {
      session.reflection = session.condition === 'independent'
        ? 'Nimm dir kurz Zeit, deine erste Antwort selbstständig zu überprüfen. Möchtest du bei deiner Einschätzung bleiben?'
        : await reflectionQuestion(session.initial, session.mode);
      return json({question:session.reflection,mode:session.mode});
    } catch {
      session.failed = true;
      return json({error:'Die Reflexionsfrage konnte nicht geladen werden. Es wurde keine Demoantwort eingesetzt. Bitte beende diese Sitzung.'},503);
    } finally { session.pending = false; }
  }
  if (!session.initial || !session.reflection || session.pending || session.failed) return json({error:'Bitte schließe zuerst den Reflexionsschritt ab.'},409);
  if (!session.result) {
    session.result = finishTrial(session.initial,{answer:payload.answer,confidence:payload.confidence});
    session.finishedAt = Date.now();
  }
  return json({...session.result,condition:session.condition,mode:session.mode});
}
