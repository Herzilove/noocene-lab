import {test} from 'node:test';
import assert from 'node:assert/strict';
import {reflectionInsight} from '../lib/reflection-insight';
test('insights cite visible cues and do not invent a diagnosis or measured gain',()=>{
 const result=reflectionInsight('Alle ignorieren mich',80,50);
 assert.match(result.title,/Verallgemeinerung/);
 assert.match(result.reason,/Alle/);
 assert.equal(result.sourceId,'fleming-lau-2014');
 assert.match(reflectionInsight('',50,50).reason,/keinen ersten Gedanken/);
 assert.match(reflectionInsight('Ich bin unsicher',50,50).practice,/Freund/);
});
