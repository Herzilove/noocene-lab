import test from 'node:test';
import assert from 'node:assert/strict';
import { createSession, advance, currentQuestion } from '../src/reflection.mjs';

test('each stage asks one question and completion stops questions', () => {
  let session = createSession();
  for (let index = 0; index < 5; index++) {
    assert.equal((currentQuestion(session).match(/\?/g) ?? []).length, 1);
    session = advance(session, `Antwort ${index}`);
  }
  assert.equal(session.status, 'completed');
  assert.equal(currentQuestion(session), null);
  assert.equal(session.answers.length, 5);
});

test('empty input does not advance; skipping does not invent an answer', () => {
  const session = createSession();
  assert.deepEqual(advance(session, '  '), session);
  const skipped = advance(session, 'überspringen');
  assert.equal(skipped.step, 1);
  assert.equal(skipped.answers[0].text, null);
});

test('stop works at any stage and does not record the command as disclosure', () => {
  for (let count = 0; count < 5; count++) {
    let session = createSession();
    for (let i = 0; i < count; i++) session = advance(session, 'Beispiel');
    const stopped = advance(session, ' STOP ');
    assert.equal(stopped.status, 'stopped');
    assert.equal(stopped.answers.length, count);
    assert.equal(currentQuestion(stopped), null);
    assert.deepEqual(advance(stopped, 'weiter'), stopped);
  }
});

test('sessions are independent and earlier state is not mutated', () => {
  const initial = createSession();
  const next = advance(initial, '<eigene Antwort>');
  assert.equal(initial.answers.length, 0);
  assert.equal(createSession().answers.length, 0);
  assert.equal(next.answers[0].text, '<eigene Antwort>');
});
