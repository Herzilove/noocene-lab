import { timingSafeEqual } from 'node:crypto';

export type Answer = { answer: number; confidence: number };
export const QUESTION_VERSION = 'tiles-v1';
// Original task. Logical answer reviewed through countermodels, not psychometrically validated.
export function questionPublic() {
  return {
    id: QUESTION_VERSION,
    text: 'Alle blauen Plättchen sind rund. Einige runde Plättchen sind rau. Folgt daraus sicher, dass einige blaue Plättchen rau sind?',
    options: ['Ja, das folgt sicher.', 'Nein, blaue Plättchen können niemals rau sein.', 'Das lässt sich aus diesen Angaben nicht entscheiden.']
  };
}
export function grade(answer: number) { return answer === 2; }
export function finishTrial(initial: Answer, final: Answer) {
  return {
    initial: { ...initial, correct: grade(initial.answer) },
    final: { ...final, correct: grade(final.answer) },
    correctAnswer: 2,
    explanation: 'Die rauen runden Plättchen könnten blau sein, müssen es aber nicht. Ein Beispiel mit ausschließlich roten rauen Plättchen und glatten blauen Plättchen erfüllt beide Angaben. Auch blaue raue Plättchen wären mit ihnen vereinbar. Daher ist keine der beiden Festlegungen sicher.'
  };
}
export function validOrigin(origin: string | null, url: string) {
  if (!origin) return false;
  try { return new URL(origin).origin === new URL(url).origin; } catch { return false; }
}
export function safeEqual(a: string, b: string) {
  if (!a || !b) return false;
  const left = Buffer.from(a); const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
