import { randomBytes, randomInt } from 'node:crypto';
import type { Answer } from './quest-core';

export type Session = {
  id: string; condition: 'independent' | 'socratic'; mode: 'demo' | 'live';
  consent: boolean; allowAI: boolean; createdAt: number; expiresAt: number;
  initial?: Answer; result?: ReturnType<typeof import('./quest-core').finishTrial>;
  reflection?: string; pending?: boolean; failed?: boolean; finishedAt?: number;
};
type Store = { sessions: Map<string, Session>; starts: number[] };
const scope = globalThis as unknown as { nooceneStore?: Store };
export const store: Store = scope.nooceneStore ??= { sessions: new Map<string, Session>(), starts: [] as number[] };
export const COOKIE = 'noocene_session';
export const TTL = 30 * 60 * 1000;
export function prune() {
  const now = Date.now();
  for (const [id, s] of store.sessions) if (s.expiresAt <= now) store.sessions.delete(id);
  store.starts = store.starts.filter(t => t > now - 60_000);
}
export function startSession(consent: boolean, allowAI = false) {
  prune();
  if (store.sessions.size >= 500 || store.starts.length >= 30) throw new Error('CAPACITY');
  const now = Date.now();
  const s: Session = {
    id: randomBytes(32).toString('hex'), condition: randomInt(2) ? 'socratic' : 'independent',
    mode: allowAI && process.env.ENABLE_LIVE_AI === 'true' && !!process.env.ANTHROPIC_API_KEY && !!process.env.ANTHROPIC_MODEL ? 'live' : 'demo',
    consent, allowAI, createdAt: now, expiresAt: now + TTL
  };
  store.starts.push(now); store.sessions.set(s.id, s); return s;
}
export function getSession(id?: string) { prune(); return id ? store.sessions.get(id) : undefined; }
export function permittedTrials() {
  prune();
  return [...store.sessions.values()].filter(s => s.consent && s.result).map(s => ({
    // No cookie credential, session ID, IP address, or narrative is exported.
    condition: s.condition, mode: s.mode, questionId: 'tiles-v1', studyVersion: 'pilot-v1',
    initialAnswer: s.result!.initial.answer, finalAnswer: s.result!.final.answer,
    initialConfidence: s.result!.initial.confidence, finalConfidence: s.result!.final.confidence,
    initialCorrect: s.result!.initial.correct, finalCorrect: s.result!.final.correct,
    durationMs: s.finishedAt! - s.createdAt
  }));
}
