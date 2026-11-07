import { timingSafeEqual } from 'node:crypto';

export type Answer = { answer: number; confidence: number };
export const QUESTION_VERSION = 'tiles-v1-en';
// Original task. Logical answer reviewed through countermodels, not psychometrically validated.
export function questionPublic() {
  return {
    id: QUESTION_VERSION,
    text: 'All blue tiles are round. Some round tiles are rough. Does it follow with certainty that some blue tiles are rough?',
    options: ['Yes, that follows with certainty.', 'No, blue tiles can never be rough.', 'That cannot be determined from the information given.']
  };
}
export function grade(answer: number) { return answer === 2; }
export function finishTrial(initial: Answer, final: Answer) {
  return {
    initial: { ...initial, correct: grade(initial.answer) },
    final: { ...final, correct: grade(final.answer) },
    correctAnswer: 2,
    explanation: 'The rough round tiles could be blue, but they do not have to be. A set with only red rough tiles and smooth blue tiles satisfies both statements. Blue rough tiles would also be consistent with them. Neither definite conclusion is therefore guaranteed.'
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
