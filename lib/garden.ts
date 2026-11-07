export const GARDEN_KEY = 'noocene:garden:v1';
export type Discovery = { version:1; confidenceRated?:boolean; prediction?:string; id:string; world:string; thought:string; observation:string; alternative:string; action:string; before:number; after:number; created:string; outcome:string };
export function makeDiscovery(world:string,thought:string,alternative:string,action:string,before:number,after:number,observation='',confidenceRated=false,prediction=''):Discovery {
 return {version:1,confidenceRated,prediction:prediction.slice(0,1000),id:crypto.randomUUID(),world,thought:thought.slice(0,1000),observation:observation.slice(0,1000),alternative:alternative.slice(0,1000),action:action.slice(0,1000),before,after,created:new Date().toISOString(),outcome:''};
}
export function parseGarden(raw:string|null):Discovery[]{
 try{const data:unknown=JSON.parse(raw||'[]');if(!Array.isArray(data))return [];
 return data.filter((v):v is Discovery=>!!v&&v.version===1&&(v.prediction===undefined||(typeof v.prediction==='string'&&v.prediction.length<=1000))&&(v.observation===undefined||(typeof v.observation==='string'&&v.observation.length<=1000))&&['id','world','thought','alternative','action','created','outcome'].every(k=>typeof v[k]==='string'&&v[k].length<=1000)&&['before','after'].every(k=>typeof v[k]==='number'&&v[k]>=0&&v[k]<=100)).slice(0,20).map(v=>({version:1,confidenceRated:v.confidenceRated===true,prediction:v.prediction||'',id:v.id,world:v.world,thought:v.thought,observation:v.observation||'',alternative:v.alternative,action:v.action,before:v.before,after:v.after,created:v.created,outcome:v.outcome}));
 }catch{return [];}
}
