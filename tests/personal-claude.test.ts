import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parsePersonalReflection} from '../lib/personal-claude';
test('personal output rejects unsupported citations, extra fields and multiple questions',()=>{
 const sample={question:'What else could explain that moment?',perspectives:['You may be missing context.','Your first view may still fit.'],insight:'You noticed a thought and can check its basis.',practice:'Ask one open question.',sourceId:'fleming-lau-2014'};
 assert.equal(parsePersonalReflection(JSON.stringify(sample)).question,sample.question);
 for(const bad of [{...sample,sourceId:'made-up-paper'},{...sample,diagnosis:'anxiety'},{...sample,question:'Why? How?'}])assert.throws(()=>parsePersonalReflection(JSON.stringify(bad)));
});

test('long model questions become a short reviewed prompt instead of being cut mid-sentence',()=>{const value={question:'When you noticed the message was unanswered, what made you think it was your fault?',perspectives:['They may be busy.','You may be missing context.'],insight:'Check what you know.',practice:'Ask a small question.',sourceId:'schooler-2011'};assert.equal(parsePersonalReflection(JSON.stringify(value)).question,'What do you know — and what are you guessing?');});
