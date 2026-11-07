import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseGarden, makeDiscovery } from '../lib/garden';
test('garden discards malformed, oversized and unexpected stored content',()=>{
 assert.deepEqual(parseGarden('{broken'),[]);
 assert.deepEqual(parseGarden(JSON.stringify([{id:'x',story:'private data'}])),[]);
 const entry=makeDiscovery('social','My thought','Another view','Ask directly',75,50);
 assert.equal(parseGarden(JSON.stringify([entry]))[0].thought,'My thought');
 assert.equal(parseGarden(JSON.stringify([{...entry,before:101}])).length,0);
 assert.equal(parseGarden(JSON.stringify([{...entry,thought:'x'.repeat(1001)}])).length,0);
 assert.equal(parseGarden(JSON.stringify(Array.from({length:30},()=>entry))).length,20);
});
