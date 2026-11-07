import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseGarden, makeDiscovery } from '../lib/garden';
test('garden discards malformed, oversized and unexpected stored content',()=>{
 assert.deepEqual(parseGarden('{broken'),[]);
 assert.deepEqual(parseGarden(JSON.stringify([{id:'x',story:'private data'}])),[]);
 const entry=makeDiscovery('social','My thought','Another view','Ask directly',75,50);
 assert.equal(parseGarden(JSON.stringify([entry]))[0].thought,'My thought');
 const observed=makeDiscovery('social','Thought','Alternative','Action',50,50,'Observed event');
 assert.equal(parseGarden(JSON.stringify([observed]))[0].observation,'Observed event');
 assert.equal(parseGarden(JSON.stringify([{...observed,observation:'x'.repeat(1001)}])).length,0);
 assert.equal(parseGarden(JSON.stringify([{...entry,before:101}])).length,0);
 assert.equal(parseGarden(JSON.stringify([{...entry,thought:'x'.repeat(1001)}])).length,0);
 assert.equal(parseGarden(JSON.stringify(Array.from({length:30},()=>entry))).length,20);
});

test('time capsules survive reload, reject invalid predictions and preserve older discoveries',()=>{
 const entry=makeDiscovery('innerspace','Thought','Alternative','Ask',50,50);
 const restored=parseGarden(JSON.stringify([{...entry,prediction:'I expect a reply tomorrow.'}]))[0];
 assert.equal(restored.prediction,'I expect a reply tomorrow.');
 assert.equal(parseGarden(JSON.stringify([entry]))[0].prediction,'');
 assert.equal(parseGarden(JSON.stringify([{...entry,prediction:42}])).length,0);
 assert.equal(parseGarden(JSON.stringify([{...entry,prediction:'x'.repeat(1001)}])).length,0);
});
