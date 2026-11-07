import {NextRequest,NextResponse} from 'next/server';
import {createHmac} from 'node:crypto';
import {validRequestOrigin} from '../_origin';
import {personalInput,personalReflection} from '../../../lib/personal-claude';
export const runtime='nodejs';
const scope=globalThis as unknown as {personalLimits?:Map<string,{count:number,until:number}>};
const limits=scope.personalLimits??=new Map();
const json=(data:unknown,status=200)=>NextResponse.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function POST(req:NextRequest){
 if(!validRequestOrigin(req))return json({error:'Invalid request origin.'},403);
 if(!req.headers.get('content-type')?.includes('application/json'))return json({error:'JSON is required.'},415);
 if(Number(req.headers.get('content-length'))>5000)return json({error:'Please keep your moment short.'},413);
 const text=await req.text();if(text.length>5000)return json({error:'Please keep your moment short.'},413);
 let input;try{input=personalInput.parse(JSON.parse(text));}catch{return json({error:'Please add a moment and a thought, and choose whether to share them with Claude.'},400);}
 if(process.env.ENABLE_LIVE_AI!=='true'||!process.env.ANTHROPIC_API_KEY||!process.env.ANTHROPIC_MODEL)return json({error:'Claude is not connected right now. You can keep going on your own.'},503);
 const now=Date.now();for(const[k,v]of limits)if(v.until<now)limits.delete(k);
 const key=createHmac('sha256',process.env.ANTHROPIC_API_KEY).update('personal-rate-v1:'+ (req.headers.get('x-vercel-forwarded-for')||req.headers.get('x-forwarded-for')||'unknown')).digest('hex');
 const limit=limits.get(key)||{count:0,until:now+60000};const total=limits.get('all')||{count:0,until:now+60000};
 if(limit.count>=6||total.count>=30)return json({error:'A little pause: try again in a minute, or keep going without Claude.'},429);
 limit.count++;total.count++;limits.set(key,limit);limits.set('all',total);
 try{return json({mode:'live',...await personalReflection(input)});}catch(e){const err=e as {status?:number;name?:string;message?:string};const code=typeof err.message==='string'&&/^INVALID_(FIELDS|TOOL)_/.test(err.message)?err.message:err.status?'PROVIDER_'+err.status:err.name==='APIConnectionTimeoutError'?'PROVIDER_TIMEOUT':'PROVIDER_UNAVAILABLE';console.warn('personal-call-failed',{code});return json({error:'Claude could not finish this reflection. Your words are still here. You can try again or continue without AI.',code},502);}
}
