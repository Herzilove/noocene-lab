import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { POST } from '../app/api/quest/route';
import { GET, DELETE } from '../app/api/research/route';
import { store } from '../lib/session-store';
import { parseReflectionSelection } from '../lib/claude';

const base = 'http://localhost:3000';
function request(body: unknown, cookie = '', origin = base) {
  return new NextRequest(base + '/api/quest', {method:'POST',headers:{'content-type':'application/json',origin,cookie,host:'localhost:3000'},body:JSON.stringify(body)});
}
test('API enforces phase, consent, inputs, origin and idempotency', async () => {
  store.sessions.clear(); store.starts=[];
  assert.equal((await POST(request({action:'start',consent:false},'','https://evil.test'))).status,403);
  assert.equal((await POST(request({action:'start',consent:false,condition:'socratic'}))).status,400);
  const started=await POST(request({action:'start',consent:false}));
  assert.equal(started.status,200);
  const cookie=started.headers.get('set-cookie')!.split(';')[0];
  const data=await started.json();
  assert.equal(data.mode,'demo');
  assert.equal('correctAnswer' in data.question,false);
  assert.equal((await POST(request({action:'finish',answer:2,confidence:80},cookie))).status,409);
  assert.equal((await POST(request({action:'initial',answer:0,confidence:101},cookie))).status,400);
  const reflected=await POST(request({action:'initial',answer:0,confidence:80},cookie));
  assert.equal(reflected.status,200);
  assert.equal((await POST(request({action:'initial',answer:1,confidence:80},cookie))).status,409);
  const result=await POST(request({action:'finish',answer:2,confidence:70},cookie));
  assert.equal(result.status,200);
  const final=await result.json();
  assert.equal(final.final.correct,true);
  assert.deepEqual(await (await POST(request({action:'finish',answer:0,confidence:10},cookie))).json(),final);
  process.env.ADMIN_TOKEN='x'.repeat(32);
  const exportReq=()=>new NextRequest(base+'/api/research',{headers:{authorization:'Bearer '+'x'.repeat(32)}});
  assert.equal((await GET(new NextRequest(base+'/api/research'))).status,401);
  assert.equal((await (await GET(exportReq())).json()).trials.length,0);
  store.sessions.get(data.id)!.consent=true;
  const exported=await (await GET(exportReq())).json();
  assert.equal(exported.trials.length,1);
  assert.equal(JSON.stringify(exported).includes(data.id),false);
  await DELETE(new NextRequest(base+'/api/research',{method:'DELETE',headers:{origin:base,cookie,host:'localhost:3000'}}));
  assert.equal((await (await GET(exportReq())).json()).trials.length,0);
  await POST(request({action:'exit'},cookie));
  assert.equal((await POST(request({action:'finish',answer:2,confidence:80},cookie))).status,401);
  delete process.env.ADMIN_TOKEN;
});
test('live AI needs separate explicit permission even with configured credentials', async () => {
  const old={enabled:process.env.ENABLE_LIVE_AI,key:process.env.ANTHROPIC_API_KEY,model:process.env.ANTHROPIC_MODEL};
  process.env.ENABLE_LIVE_AI='true'; process.env.ANTHROPIC_API_KEY='test-not-real'; process.env.ANTHROPIC_MODEL='test-model';
  const response=await POST(request({action:'start',consent:true,allowAI:false}));
  assert.equal((await response.json()).mode,'demo');
  for(const [key,value] of Object.entries({ENABLE_LIVE_AI:old.enabled,ANTHROPIC_API_KEY:old.key,ANTHROPIC_MODEL:old.model})) {
    if(value===undefined) delete process.env[key]; else process.env[key]=value;
  }
});
test('model text cannot add solutions or invalid structured fields', () => {
  assert.equal((parseReflectionSelection('{"questionId":1}').match(/\?/g)??[]).length,1);
  for(const value of ['{"questionId":99}','{"questionId":0,"solution":2}','Die Antwort ist 2.','{"questionId":"1"}']) {
    assert.throws(()=>parseReflectionSelection(value));
  }
});
test('CSRF uses actual Host rather than normalized internal URL and ignores forwarded host', async () => {
  const make = (origin:string, host:string, forwarded='') => new NextRequest('http://localhost:3100/api/quest', {
    method:'POST', headers:{origin,host,'x-forwarded-host':forwarded,'content-type':'application/json'},
    body:JSON.stringify({action:'start',consent:false})
  });
  assert.equal((await POST(make('http://127.0.0.1:3100','127.0.0.1:3100'))).status,200);
  assert.equal((await POST(make('http://evil.test','127.0.0.1:3100','evil.test'))).status,403);
  const prior=process.env.APP_ORIGIN;
  process.env.APP_ORIGIN='https://noocene.example';
  try {
    assert.equal((await POST(make('https://noocene.example','internal:3000'))).status,200);
    assert.equal((await POST(make('http://internal:3000','internal:3000'))).status,403);
  } finally { if(prior===undefined) delete process.env.APP_ORIGIN; else process.env.APP_ORIGIN=prior; }
});
