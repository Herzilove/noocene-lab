import test from 'node:test';
import assert from 'node:assert/strict';
import { analyze, validateTrials } from '../research/analysis.mjs';

const row = (overrides={}) => ({participantId:'synthetic-1', trialId:'t1', questionId:'q1', condition:'independent', consent:true, synthetic:true, completed:true, initialCorrect:0, finalCorrect:1, initialConfidence:80, finalConfidence:90, durationSeconds:60,...overrides});
test('known values produce exact accuracy, transition and Brier metrics', () => {
  const result=analyze([row(),row({trialId:'t2', participantId:'synthetic-2',initialCorrect:1,finalCorrect:0,initialConfidence:60,finalConfidence:20})]);
  const a=result.conditions.independent;
  assert.equal(a.accuracyBefore,.5); assert.equal(a.accuracyAfter,.5);
  assert.equal(a.selfCorrections,1); assert.equal(a.regressions,1);
  assert.ok(Math.abs(a.brierBefore-.4)<1e-12);
  assert.ok(Math.abs(a.brierAfter-.025)<1e-12);
});
test('rejects inconsistent, identifying, nonconsenting or mixed data', () => {
  for(const bad of [row({initialConfidence:101}),row({consent:false}),row({name:'Person'}),row({initialCorrect:2})]) assert.throws(()=>validateTrials([bad]));
  assert.throws(()=>validateTrials([row(),row({trialId:'t2',synthetic:false})]));
  assert.throws(()=>validateTrials([row(),row()]));
});
test('incomplete trials count in completion denominator, not accuracy', () => {
  const r=analyze([row(),row({trialId:'t2',participantId:'synthetic-2',completed:false,finalCorrect:null,finalConfidence:null})]);
  assert.equal(r.conditions.independent.completionRate,.5);
  assert.equal(r.conditions.independent.accuracyAfter,1);
});
test('participant means are calculated separately from pooled trial metrics', () => {
  const r=analyze([row(),row({trialId:'t2'}),row({trialId:'t3',participantId:'synthetic-2',initialCorrect:1,finalCorrect:1})]);
  assert.equal(r.conditions.independent.participants,2);
  assert.equal(r.conditions.independent.participantMeanAccuracyChange,.5);
});
