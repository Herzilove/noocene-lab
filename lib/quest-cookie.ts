import {createHmac,randomBytes,timingSafeEqual} from 'node:crypto';
import type {Session} from './session-store';
const revoked=new Map<string,number>();
export function revokeSession(id:string){for(const[k,until]of revoked)if(until<Date.now())revoked.delete(k);revoked.set(id,Date.now()+1800000);}
const localKey=randomBytes(32).toString('hex');
function key(){return process.env.SESSION_SECRET||process.env.ANTHROPIC_API_KEY||localKey;}
const sign=(payload:string)=>createHmac('sha256',key()).update('noocene-quest-cookie-v1:'+payload).digest('base64url');
export function sealSession(session:Session){const {pending,...safe}=session;void pending;const payload=Buffer.from(JSON.stringify(safe)).toString('base64url');return payload+'.'+sign(payload);}
export function openSession(value?:string):Session|undefined{
 try{if(!value||value.length>7000)return;const[payload,signature]=value.split('.');if(!payload||!signature)return;const a=Buffer.from(signature),b=Buffer.from(sign(payload));if(a.length!==b.length||!timingSafeEqual(a,b))return;const s=JSON.parse(Buffer.from(payload,'base64url').toString()) as Session;const now=Date.now();if(revoked.has(s.id)||!/^[a-f0-9]{64}$/.test(s.id)||s.expiresAt<=now||s.expiresAt>now+1800000||typeof s.consent!=='boolean'||typeof s.allowAI!=='boolean'||!['socratic','independent'].includes(s.condition)||!['live','demo'].includes(s.mode))return;return s;}catch{return;}
}
