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
   try { const response=await fetch('/api/quest',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(25000)}); const data=await response.json(); if(!response.ok) throw new Error(data.error||'Der Schritt konnte nicht abgeschlossen werden.'); return data; }
   catch(e){setError(e instanceof Error?e.message:'Bitte versuche es erneut.');return null;}
   finally{setBusy(false);}
 }
 async function start(){const data=await request({action:'start',consent,allowAI});if(data){setSession(data);setAnswer(null);setConfidence(50);setStep('answer');}}
 async function reflect(){const data=await request({action:'initial',answer,confidence});if(data){setReflection(data.question);setStep('reflect');}}
 async function finish(){const data=await request({action:'finish',answer,confidence});if(data){setResult(data);setStep('discovery');}}
 async function exit(){const data=await request({action:'exit'});if(data){setSession(null);setResult(null);setAnswer(null);setReflection('');setStep('intro');}}
 const stages:Step[]=['answer','confidence','reflect','revise','final-confidence','discovery'];
 const progress=Math.max(0,stages.indexOf(step)+1);
 const choosing=step==='answer'||step==='revise';
 return <section className="flow-shell"><div className="flow-heading"><Link href="/" className="back-link">← Übersicht</Link><span className="eyebrow">MIND QUEST</span>{session?<button className="quiet-button" disabled={busy} onClick={exit}>Beenden</button>:<span/>}</div><div className="progress-track" aria-label={`Schritt ${progress} von 6`}><span style={{width:`${progress/6*100}%`}}/></div><div className="flow-card" aria-busy={busy}>
 {step==='intro'?<><Link href="/innerspace" className="button primary">Mit meinem Alltag starten →</Link><p>Du möchtest deine eigenen Gedanken erkunden? Wähle deinen persönlichen Moment. Darunter kannst du das separate Logikexperiment ausprobieren.</p><Orbit small/><span className="eyebrow">KURZ INNEHALTEN. NEU DENKEN.</span><h1>Überrasche<br/><em>dich selbst.</em></h1><p>Eine kleine Denkaufgabe. Du antwortest, hältst kurz inne und entscheidest noch einmal.</p><div className="notice">Je nach Konfiguration nutzt die Reflexion Claude oder eine deutlich markierte Demo. Bei Claude werden Aufgabe, Antwort und Sicherheit an Anthropic übermittelt.</div><label className="consent"><input type="checkbox" checked={allowAI} onChange={e=>setAllowAI(e.target.checked)}/><span>Ich stimme zu, dass Aufgabe, Antwort und Sicherheit für die KI-Reflexion an Anthropic gesendet werden. Ohne diese Zustimmung nutze ich die Demo.</span></label><label className="consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>Ich möchte freiwillig am Pilot teilnehmen. Meine Aufgabenantworten, Sicherheit und Dauer dürfen pseudonym für die Auswertung gespeichert werden. <Link href="/privacy">Details</Link></span></label><button className="button primary" onClick={start} disabled={busy}>{busy?'Wird vorbereitet …':'Los geht’s'} <span>→</span></button><p className="fine-print">Auch ohne Forschungsteilnahme nutzbar. Demo und Live-Modus werden im Ablauf gekennzeichnet.</p></>:null}
 {session&&step!=='intro'?<div className="mode-row"><span className="pill">{session.mode==='demo'?'Demo · keine echte KI':'Live · Claude'}</span><span className="fine-print">{progress} / 6</span></div>:null}
 {choosing&&session?<><span className="eyebrow">{step==='answer'?'DEIN ERSTER GEDANKE':'DEIN ZWEITER BLICK'}</span><h1 className="question-title">{session.question.text}</h1><p>{step==='revise'?'Du kannst deine Antwort ändern oder bei ihr bleiben.':'Wähle die Antwort, die dich überzeugt.'}</p><div className="answer-options" role="group" aria-label="Antwortmöglichkeiten">{session.question.options.map((option,index)=><button key={index} className={`answer-option ${answer===index?'selected':''}`} aria-pressed={answer===index} onClick={()=>setAnswer(index)}><span className="option-letter">{String.fromCharCode(65+index)}</span>{option}<span aria-hidden="true">{answer===index?'●':'○'}</span></button>)}</div><button className="button primary" disabled={answer===null||busy} onClick={()=>setStep(step==='answer'?'confidence':'final-confidence')}>Antwort festhalten <span>→</span></button></>:null}
 {(step==='confidence'||step==='final-confidence')?<><span className="eyebrow">DEINE EINSCHÄTZUNG</span><h1>Wie sicher<br/><em>bist du dir?</em></h1><p>Wie wahrscheinlich ist es, dass deine Antwort stimmt?</p><div className="confidence-value"><output htmlFor="confidence">{confidence}</output><span>%</span></div><input id="confidence" aria-label="Sicherheit in Prozent" type="range" min="0" max="100" step="5" value={confidence} onChange={e=>setConfidence(Number(e.target.value))}/><div className="range-labels"><span>Sehr unsicher</span><span>Ganz sicher</span></div><button className="button primary" disabled={busy} onClick={step==='confidence'?reflect:finish}>{busy?'Einen Moment …':step==='confidence'?'Weiter zur Reflexion':'Meine Entdeckung ansehen'} <span>→</span></button></>:null}
 {step==='reflect'?<><Orbit small/><span className="eyebrow">EIN MOMENT FÜR DEIN DENKEN</span><h1 className="question-title">{reflection}</h1><p>Nimm dir etwa 20 Sekunden. Überlege für dich, bevor du deine Antwort noch einmal betrachtest.</p><button className="button primary" onClick={()=>{setConfidence(50);setStep('revise');}}>Noch einmal entscheiden <span>→</span></button></>:null}
 {step==='discovery'&&result&&session?<><span className="eyebrow">DEINE ENTDECKUNG</span><h1>Ein zweiter Blick<br/><em>macht sichtbar.</em></h1><div className="comparison"><div><span className="eyebrow">VORHER</span><strong>{session.question.options[result.initial.answer]}</strong><span>{result.initial.confidence}% sicher</span><span className="pill">{result.initial.correct?'Richtig':'Nicht richtig'}</span></div><div><span className="eyebrow">NACHHER</span><strong>{session.question.options[result.final.answer]}</strong><span>{result.final.confidence}% sicher</span><span className="pill">{result.final.correct?'Richtig':'Nicht richtig'}</span></div></div><div className="discovery-note"><span className="eyebrow">DIE AUFLÖSUNG</span><h2>{session.question.options[result.correctAnswer]}</h2><p>{result.explanation}</p></div><p className="fine-print">Dieser einzelne Durchlauf beschreibt deine Antworten auf diese Aufgabe. Er misst weder Intelligenz noch Bewusstsein.</p><button className="button primary" disabled={busy} onClick={start}>Erneut ausprobieren <span>↗</span></button></>:null}
 {error?<div className="error" role="alert">{error}<p>Deine Eingaben bleiben erhalten. Du kannst den Schritt erneut versuchen oder beenden.</p></div>:null}
 </div></section>;
}
