import { createInterface } from 'node:readline';
import { createSession, advance, currentQuestion } from './reflection.mjs';

console.log('Reality Replay — geskriptete Ablaufdemo, ohne KI oder Speicherung.');
console.log('Du kannst mit „überspringen“ weitergehen oder mit „stop“ beenden.\n');
const terminal = createInterface({ input: process.stdin, output: process.stdout });
let session = createSession();
console.log(currentQuestion(session));
terminal.on('line', input => {
  session = advance(session, input);
  if (session.status !== 'active') {
    console.log(session.status === 'completed'
      ? '\nDie Reflexion ist abgeschlossen. Du entscheidest, was du daraus mitnimmst.'
      : '\nDie Reflexion wurde beendet.');
    terminal.close();
    return;
  }
  console.log('\n' + currentQuestion(session));
});
