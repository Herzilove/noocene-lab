'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Orbit } from '../../components/orbit';
const topics = {
 Kontakt: { example:'Jemand hat auf meine Nachricht noch nicht geantwortet.', thought:'Die Person mag mich nicht.', alternative:'Vielleicht hat die Person gerade keine Zeit.', action:'Ich frage freundlich nach, statt ihre Absicht zu erraten.' },
 Arbeit: { example:'In einem Meeting wurde meine Idee nicht aufgegriffen.', thought:'Meine Idee ist schlecht.', alternative:'Vielleicht war die Idee noch nicht verständlich genug.', action:'Ich frage nach einem konkreten Feedback.' },
 Selbstzweifel: { example:'Ich habe eine Aufgabe aufgeschoben.', thought:'Ich kriege das nie hin.', alternative:'Vielleicht ist der erste Schritt noch zu groß.', action:'Ich probiere einen kleinen Schritt für fünf Minuten.' },
 Eigener: { example:'Heute ist etwas passiert, das mich beschäftigt.', thought:'Mein erster Gedanke war …', alternative:'Eine andere Möglichkeit wäre …', action:'Ein kleiner nächster Schritt wäre …' },
};
type Topic = keyof typeof topics;
export default function Innerspace(){
 const [step,setStep]=useState(0);
 const [topic,setTopic]=useState<Topic>('Kontakt');
 const [answers,setAnswers]=useState(['','','','','']);
 const [before,setBefore]=useState(50);const [after,setAfter]=useState(50);
 function reset(){setStep(0);setAnswers(['','','','','']);setBefore(50);setAfter(50);}
 const example=topics[topic];
 const titles=['Was ist gerade passiert?','Was ging dir zuerst durch den Kopf?','Was hast du tatsächlich beobachtet?','Was könnte außerdem dahinterstecken?','Was möchtest du jetzt ausprobieren?'];
 const hints=['Ein kleiner Moment von heute reicht. Ein Satz ist genug.','Ein Gedanke ist erst einmal eine Deutung. Du darfst ihn prüfen.','Was hätte eine Kamera aufgenommen? Beschreibe Worte oder Verhalten, ohne eine Absicht zu erraten.','Suche eine Möglichkeit, die zu deiner Beobachtung passt. Dein erster Gedanke darf weiterhin plausibel sein.','Wähle etwas Kleines, das du selbst tun kannst. Auch Abwarten ist eine Möglichkeit.'];
 const placeholders=[example.example,example.thought,'Ich habe gesehen oder gehört …',example.alternative,example.action];
 function change(value:string){setAnswers(prev=>prev.map((a,i)=>i===step?value:a));}
 return <section className="flow-shell"><div className="flow-heading"><Link href="/" className="back-link">← Übersicht</Link><span className="eyebrow">DEIN GEDANKENMOMENT</span><button className="quiet-button" onClick={reset}>Neu beginnen</button></div><div className="progress-track" aria-label={`Schritt ${Math.min(step+1,5)} von 5`}><span style={{width:`${step/5*100}%`}}/></div><div className="flow-card"><div className="mode-row"><span className="pill">Geführt · ohne KI</span><span className="fine-print">Bleibt in diesem Tab</span></div><Orbit small/>{step<5?<>
 <span className="eyebrow">{['01 / DEIN MOMENT','02 / DEIN ERSTER GEDANKE','03 / BEOBACHTUNG ODER DEUTUNG?','04 / EIN ANDERER BLICK','05 / DEIN KLEINER VERSUCH'][step]}</span>
 <h1 className="question-title">{titles[step]}</h1><p>{hints[step]}</p>
 {step===0&&<div className="quick-options" role="group" aria-label="Dein Thema">{(Object.keys(topics) as Topic[]).map(t=><button className="pill" key={t} aria-pressed={topic===t} onClick={()=>setTopic(t)}>{t==='Eigener'?'Eigenes Thema':t}</button>)}</div>}
 {step>0&&<div className="thought-context"><span className="eyebrow">{step===1?'DEIN MOMENT':step===2?'DEIN ERSTER GEDANKE':'DEINE BEOBACHTUNG'}</span><p>„{answers[step===1?0:step===2?1:2]||'Für dich behalten'}“</p></div>}
 <label className="sr-only" htmlFor="reflection">Deine Antwort</label><textarea id="reflection" maxLength={2000} rows={3} value={answers[step]} onChange={e=>change(e.target.value)} placeholder={placeholders[step]}/>
 {step===0&&<button className="quiet-button" onClick={()=>change(example.example)}>Mit einem erfundenen Beispiel ausprobieren</button>}
 {(step===1||step===4)&&<div className="thought-certainty"><label htmlFor="belief">{step===1?'Wie sicher stimmt dieser Gedanke für dich?':'Wie sicher stimmt dein erster Gedanke jetzt?'} <strong>{step===1?before:after}%</strong></label>{step===4&&<p>„{answers[1]||'Für dich behalten'}“</p>}<input id="belief" aria-label="Überzeugung vom ersten Gedanken" type="range" min="0" max="100" step="5" value={step===1?before:after} onChange={e=>step===1?setBefore(+e.target.value):setAfter(+e.target.value)}/><div className="range-labels"><span>Unsicher</span><span>Sehr sicher</span></div></div>}
 <button className="button primary" onClick={()=>{if(step===1)setAfter(before);setStep(step+1);}}>{step===4?'Meine Entdeckung':'Weiter'} <span>→</span></button><button className="quiet-button" onClick={()=>setStep(step+1)}>Für mich behalten & weiter</button>
 </>:<><span className="eyebrow">DEINE GEDANKENKARTE</span><h1>Ein Gedanke.<br/><em>Mehr Spielraum.</em></h1><div className="thought-map">{[['Mein erster Gedanke',answers[1]],['Was ich beobachtet habe',answers[2]],['Eine weitere Möglichkeit',answers[3]],['Mein kleiner Versuch',answers[4]]].map(([label,value])=><div key={label}><span className="eyebrow">{label}</span><p>{value||'Für dich behalten'}</p></div>)}</div><div className="discovery-note"><p>Deine Überzeugung vom ersten Gedanken: <strong>{before}% → {after}%</strong></p><p>Was erkennst du jetzt über deinen ersten Gedanken?</p><p>Eine andere Einschätzung muss nicht besser sein. Auch bei deiner Sicht zu bleiben kann begründet sein. Diese Karte zeigt deine Angaben, keinen gemessenen Lerngewinn.</p></div><button className="button primary" onClick={reset}>Einen weiteren Moment betrachten <span>↗</span></button></>}<Link href="/" className="text-link">Reflexion verlassen →</Link></div></section>;
}
