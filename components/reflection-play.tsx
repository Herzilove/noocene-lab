'use client';
import {useState} from 'react';
import {DreamScene} from './dream-scene';

const cues=[
 ['Start with one moment, not your whole day.','A message, a decision, a tiny awkward moment.','A few words is enough. You can edit them later.'],
 ['Catch the sentence that popped into your head.','You can notice a thought without agreeing with it.','Unsure? “I don’t know yet” counts too.'],
 ['Try another possibility. It doesn’t have to be positive.','What happened and what it means can be different.','Your first thought might still fit. Leave room to check.'],
 ['Pick one tiny move you could actually try.','Keep a prediction. Come back with fresh evidence.','You can change your mind when you learn more.'],
];
export function ReflectionCompanion({step,busy}:{step:number;busy:boolean}){
 const [hint,setHint]=useState(-1);
 return <div className={`reflection-companion companion-phase-${step}`}>
  <button className="companion-tap" aria-label="Get a hint from your companion" onClick={()=>setHint(v=>(v+1)%3)}>
   <DreamScene variant={step>1?'self':'social'} active/>
   <span>{busy?'Finding a new angle …':'✦ Tap for a little nudge'}</span>
  </button>
  {hint>=0&&<p className="companion-cue" role="status">{cues[Math.min(step,3)][hint]}</p>}
 </div>;
}

export function RealityLens({moment,thought}:{moment:string;thought:string}){
 const [side,setSide]=useState(0);
 return <div className={`reality-lens lens-side-${side}`}>
  <div className="lens-header"><span>◈ REALITY LENS</span><small>Same moment. Two layers.</small></div>
  <div className="lens-switch" aria-label="Explore your thinking">
   <button aria-pressed={side===0} onClick={()=>setSide(0)}>What happened</button>
   <button aria-pressed={side===1} onClick={()=>setSide(1)}>My interpretation</button>
  </div>
  <div className="reality-content" key={side}><span aria-hidden="true">{side===0?'◉':'☁'}</span><p>{side===0?moment||'Kept to yourself':thought||'Kept to yourself'}</p></div>
  <p className="lens-caption">{side===0?'The moment, as you described it.':'A thought you had. Something you can examine.'}</p>
 </div>;
}
