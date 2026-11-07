import {test} from 'node:test';import assert from 'node:assert/strict';import {NextRequest} from 'next/server';import {POST} from '../app/api/personal/route';
const req=(body:unknown,origin='http://localhost:3000')=>new NextRequest('http://localhost:3000/api/personal',{method:'POST',headers:{origin,host:'localhost:3000','content-type':'application/json'},body:JSON.stringify(body)});
test('personal route rejects missing consent, oversized fields and foreign origins without provider calls',async()=>{
 const input={consent:true,phase:'explore',moment:'A fictional meeting',thought:'My idea was ignored'};
 assert.equal((await POST(req(input,'https://evil.example'))).status,403);
 assert.equal((await POST(req({...input,consent:false}))).status,400);
 assert.equal((await POST(req({...input,moment:'x'.repeat(1001)}))).status,400);
 const prior=process.env.ENABLE_LIVE_AI;process.env.ENABLE_LIVE_AI='false';try{assert.equal((await POST(req(input))).status,503);}finally{if(prior===undefined)delete process.env.ENABLE_LIVE_AI;else process.env.ENABLE_LIVE_AI=prior;}
});
