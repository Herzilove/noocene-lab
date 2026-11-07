import {test} from 'node:test';import assert from 'node:assert/strict';import {NextRequest} from 'next/server';import {POST} from '../app/api/quest/route';import {store} from '../lib/session-store';
const req=(body:unknown,cookie='')=>new NextRequest('http://localhost:3000/api/quest',{method:'POST',headers:{origin:'http://localhost:3000',host:'localhost:3000','content-type':'application/json',cookie},body:JSON.stringify(body)});
test('quest completes when each request reaches a fresh process store',async()=>{
 store.sessions.clear();store.starts=[];
 const start=await POST(req({action:'start',consent:false,allowAI:false}));const first=start.headers.get('set-cookie')!.split(';')[0];
 store.sessions.clear();const initial=await POST(req({action:'initial',answer:0,confidence:70},first));assert.equal(initial.status,200);
 const second=initial.headers.get('set-cookie')!.split(';')[0];
 store.sessions.clear();const finish=await POST(req({action:'finish',answer:2,confidence:80},second));assert.equal(finish.status,200);assert.equal((await finish.json()).final.correct,true);
});
