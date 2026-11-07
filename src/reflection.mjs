const questions = Object.freeze([
  'Welche kleine Alltagssituation möchtest du noch einmal betrachten?',
  'Welchen Gedanken oder welches Gefühl hast du dabei bei dir bemerkt?',
  'Welche deiner bisherigen Deutungen geht über das direkt Beobachtete hinaus?',
  'Welche andere Erklärung wäre ebenfalls möglich?',
  'Welchen kleinen nächsten Schritt möchtest du selbst ausprobieren?'
]);

export function createSession() {
  return { step: 0, status: 'active', answers: [] };
}

export function currentQuestion(session) {
  return session.status === 'active' ? questions[session.step] : null;
}

export function advance(session, input) {
  if (session.status !== 'active') return session;
  const text = input.trim();
  if (!text) return session;
  const command = text.toLocaleLowerCase('de');
  if (['stop', 'stopp', 'beenden'].includes(command)) {
    return { ...session, status: 'stopped' };
  }
  const skip = ['skip', 'überspringen'].includes(command);
  const step = session.step + 1;
  return {
    step,
    status: step === questions.length ? 'completed' : 'active',
    answers: [...session.answers, { step: session.step, text: skip ? null : text }]
  };
}
