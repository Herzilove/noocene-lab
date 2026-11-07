'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Orbit } from '../../components/orbit';

type Session = { id: string; condition: 'independent' | 'socratic'; mode: 'demo' | 'live'; question: {id:string;text:string;options:string[]} };
type Result = { initial:{answer:number;confidence:number;correct:boolean}; final:{answer:number;confidence:number;correct:boolean}; correctAnswer:number; explanation:string; condition:string;mode:string };
type Step = 'intro' | 'answer' | 'confidence' | 'reflect' | 'revise' | 'final-confidence' | 'discovery';

export default function Quest() {
 const [step,setStep]=useState<Step>('intro');
 const [session,setSession]=useState<Session|null>(null);
 const [answer,setAnswer]=useState<number|null>(null);
 const [confidence,setConfidence]=useState(50);
 const [reflection,setReflection]=useState('');
 const [result,setResult]=useState<Result|null>(null);
 const [consent,setConsent]=useState(false);
 const [allowAI,setAllowAI]=useState(false);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 async function request(body:object) {
   setBusy(true); setError('');
   try { const response=await fetch('/api/quest',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(25000)}); const data=await response.json(); if(!response.ok) throw new Error(data.error||'This step could not be completed.'); return data; }
   catch(e){setError(e instanceof Error?e.message:'Please try again.');return null;}
   finally{setBusy(false);}
 }
 async function start(){const data=await request({action:'start',consent,allowAI});if(data){setSession(data);setAnswer(null);setConfidence(50);setStep('answer');}}
 async function reflect(){const data=await request({action:'initial',answer,confidence});if(data){setReflection(data.question);setStep('reflect');}}
 async function finish(){const data=await request({action:'finish',answer,confidence});if(data){setResult(data);setStep('discovery');}}
 async function exit(){const data=await request({action:'exit'});if(data){setSession(null);setResult(null);setAnswer(null);setReflection('');setStep('intro');}}
 const stages:Step[]=['answer','confidence','reflect','revise','final-confidence','discovery'];
 const progress=Math.max(0,stages.indexOf(step)+1);
 const choosing=step==='answer'||step==='revise';
 return <section className="flow-shell"><div className="flow-heading"><Link href="/" className="back-link">← Overview</Link><span className="eyebrow">MIND QUEST</span>{session?<button className="quiet-button" disabled={busy} onClick={exit}>End session</button>:<span/>}</div><div className="progress-track" aria-label={`Step ${progress} of 6`}><span style={{width:`${progress/6*100}%`}}/></div><div className="flow-card" aria-busy={busy}>
 {step==='intro'?<><Link href="/innerspace" className="button primary">Explore my own experience →</Link><p>Want to explore your own thoughts? Start with a personal moment. The separate reasoning experiment is below.</p><Orbit small/><span className="eyebrow">PAUSE A MOMENT. THINK AGAIN.</span><h1>Surprise<br/><em>yourself.</em></h1><p>One small reasoning task. Answer, pause, then take another look.</p><div className="notice">Depending on configuration, reflection uses Claude or a clearly labeled demo. With Claude, the task, answer and confidence are sent to Anthropic.</div><label className="consent"><input type="checkbox" checked={allowAI} onChange={e=>setAllowAI(e.target.checked)}/><span>I consent to sending the task, my answer and confidence to Anthropic for AI-guided reflection. Without this consent I use the demo.</span></label><label className="consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>I volunteer for the pilot. My task answers, confidence and completion time may be stored pseudonymously for analysis. <Link href="/privacy">Details</Link></span></label><button className="button primary" onClick={start} disabled={busy}>{busy?'Getting ready …':'Let’s begin'} <span>→</span></button><p className="fine-print">You can use this without joining the research. Demo and live modes are labeled during the experience.</p></>:null}
 {session&&step!=='intro'?<div className="mode-row"><span className="pill">{session.mode==='demo'?'Demo · no live AI':'Live · Claude'}</span><span className="fine-print">{progress} / 6</span></div>:null}
 {choosing&&session?<><span className="eyebrow">{step==='answer'?'YOUR FIRST THOUGHT':'YOUR SECOND LOOK'}</span><h1 className="question-title">{session.question.text}</h1><p>{step==='revise'?'You can change your answer or keep it.':'Choose the answer that makes sense to you.'}</p><div className="answer-options" role="group" aria-label="Answer options">{session.question.options.map((option,index)=><button key={index} className={`answer-option ${answer===index?'selected':''}`} aria-pressed={answer===index} onClick={()=>setAnswer(index)}><span className="option-letter">{String.fromCharCode(65+index)}</span>{option}<span aria-hidden="true">{answer===index?'●':'○'}</span></button>)}</div><button className="button primary" disabled={answer===null||busy} onClick={()=>setStep(step==='answer'?'confidence':'final-confidence')}>Confirm answer <span>→</span></button></>:null}
 {(step==='confidence'||step==='final-confidence')?<><span className="eyebrow">YOUR CONFIDENCE</span><h1>How sure<br/><em>are you?</em></h1><p>How likely is it that your answer is correct?</p><div className="confidence-value"><output htmlFor="confidence">{confidence}</output><span>%</span></div><input id="confidence" aria-label="Confidence as a percentage" type="range" min="0" max="100" step="5" value={confidence} onChange={e=>setConfidence(Number(e.target.value))}/><div className="range-labels"><span>Very unsure</span><span>Very sure</span></div><button className="button primary" disabled={busy} onClick={step==='confidence'?reflect:finish}>{busy?'One moment …':step==='confidence'?'Continue to reflection':'See my discovery'} <span>→</span></button></>:null}
 {step==='reflect'?<><Orbit small/><span className="eyebrow">A MOMENT TO THINK</span><h1 className="question-title">{reflection}</h1><p>Take about 20 seconds to think before reviewing your answer.</p><button className="button primary" onClick={()=>{setConfidence(50);setStep('revise');}}>Decide again <span>→</span></button></>:null}
 {step==='discovery'&&result&&session?<><span className="eyebrow">YOUR DISCOVERY</span><h1>A second look<br/><em>reveals more.</em></h1><div className="comparison"><div><span className="eyebrow">BEFORE</span><strong>{session.question.options[result.initial.answer]}</strong><span>{result.initial.confidence}% confident</span><span className="pill">{result.initial.correct?'Correct':'Incorrect'}</span></div><div><span className="eyebrow">AFTER</span><strong>{session.question.options[result.final.answer]}</strong><span>{result.final.confidence}% confident</span><span className="pill">{result.final.correct?'Correct':'Incorrect'}</span></div></div><div className="discovery-note"><span className="eyebrow">THE EXPLANATION</span><h2>{session.question.options[result.correctAnswer]}</h2><p>{result.explanation}</p></div><p className="fine-print">This single trial describes your answers to this task. It does not measure intelligence or consciousness.</p><button className="button primary" disabled={busy} onClick={start}>Try again <span>↗</span></button></>:null}
 {error?<div className="error" role="alert">{error}<p>Your entries are preserved. You can retry this step or end the session.</p></div>:null}
 </div></section>;
}
