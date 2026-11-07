import test from 'node:test';
import assert from 'node:assert/strict';
import { questionPublic, grade, finishTrial, validOrigin, safeEqual } from '../lib/quest-core.ts';

test('public task never exposes its answer or explanation', () => {
  assert.deepEqual(Object.keys(questionPublic()).sort(), ['id','options','text']);
  assert.equal(grade(2), true);
  assert.equal(grade(0), false);
});
test('known confidence errors and correction are calculated', () => {
  const result = finishTrial({answer:0,confidence:80}, {answer:2,confidence:70});
  assert.equal(result.initial.correct, false);
  assert.equal(result.final.correct, true);
  assert.equal(result.correctAnswer, 2);
});
test('task answer has explicit satisfying countermodels in both directions', () => {
  const satisfies = tiles => tiles.every(t => !t.blue || t.round) && tiles.some(t => t.round && t.rough);
  const conclusion = tiles => tiles.some(t => t.blue && t.rough);
  const positive = [{blue:true,round:true,rough:true}];
  const negative = [{blue:true,round:true,rough:false},{blue:false,round:true,rough:true}];
  assert.equal(satisfies(positive),true); assert.equal(satisfies(negative),true);
  assert.equal(conclusion(positive),true); assert.equal(conclusion(negative),false);
});
test('unsafe origins and token comparisons fail closed', () => {
  assert.equal(validOrigin('http://localhost:3000','http://localhost:3000/api/quest'), true);
  assert.equal(validOrigin(null,'http://localhost:3000/api/quest'), false);
  assert.equal(validOrigin('http://evil.test','http://localhost:3000/api/quest'), false);
  assert.equal(safeEqual('secret','secret'), true);
  assert.equal(safeEqual('secret','secret-longer'), false);
  assert.equal(safeEqual('', ''), false);
});
