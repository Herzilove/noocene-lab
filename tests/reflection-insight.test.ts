import {test} from 'node:test';
import assert from 'node:assert/strict';
import {reflectionInsight} from '../lib/reflection-insight';
test('insights cite visible cues and do not invent a diagnosis or measured gain',()=>{
 const result=reflectionInsight('Everyone ignores me',80,50);
 assert.match(result.title,/generalization/);
 assert.match(result.reason,/Everyone/);
 assert.equal(result.sourceId,'fleming-lau-2014');
 assert.match(reflectionInsight('',50,50).reason,/did not enter a first thought/);
 assert.match(reflectionInsight('I feel unsure',50,50).practice,/friend/);
});

test('legacy German entries still receive English guidance without being rewritten',()=>{
 const thought='Alle ignorieren mich';
 const result=reflectionInsight(thought,70,70);
 assert.match(result.title,/generalization/);
 assert.match(result.reason,/Alle/);
 assert.match(result.certainty,/neither success nor failure/);
});
