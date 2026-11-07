export const GARDEN_KEY = 'noocene:garden:v1';
export type Discovery = { version:1; id:string; world:string; thought:string; alternative:string; action:string; before:number; after:number; created:string; outcome:string };
export function makeDiscovery(world:string,thought:string,alternative:string,action:string,before:number,after:number):Discovery {
 return {version:1,id:crypto.randomUUID(),world,thought:thought.slice(0,1000),alternative:alternative.slice(0,1000),action:action.slice(0,1000),before,after,created:new Date().toISOString(),outcome:''};
}
export function parseGarden(raw:string|null):Discovery[]{
 try{const data:unknown=JSON.parse(raw||'[]');if(!Array.isArray(data))return [];
 return data.filter((v):v is Discovery=>!!v&&v.version===1&&['id','world','thought','alternative','action','created','outcome'].every(k=>typeof v[k]==='string'&&v[k].length<=1000)&&['before','after'].every(k=>typeof v[k]==='number'&&v[k]>=0&&v[k]<=100)).slice(0,20).map(v=>({version:1,id:v.id,world:v.world,thought:v.thought,alternative:v.alternative,action:v.action,before:v.before,after:v.after,created:v.created,outcome:v.outcome}));
 }catch{return [];}
}
