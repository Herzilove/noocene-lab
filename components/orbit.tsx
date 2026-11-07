'use client';
import { useState } from 'react';
const moods = [
  { icon: '✦', label: 'Neugier', text: 'Was wäre, wenn dein erster Gedanke nur eine Möglichkeit ist?' },
  { icon: '☀', label: 'Mut', text: 'Du darfst deine Meinung ändern. Probier einen anderen Blick.' },
  { icon: '☾', label: 'Ruhe', text: 'Einatmen. Ausatmen. Welcher Gedanke zieht gerade vorbei?' },
];
export function Orbit({ small = false }: { small?: boolean }) {
 const [active, setActive] = useState(0);
 return <div className={`play-orbit ${small ? 'compact' : ''}`}>
 <button type="button" className={`orbit ${small ? 'orbit-small' : ''} mood-${active}`} onClick={()=>setActive((active+1)%moods.length)} aria-label="Gedankenplaneten drehen: neue Perspektive entdecken"><div className="orbit-glow"/><div className="orbit-ring ring-one"/><div className="orbit-ring ring-two"/><div className="orbit-core"><span className="planet-face">{moods[active].icon}</span></div><span className="orbit-star star-one"/><span className="orbit-star star-two"/></button>
 {!small && <><div className="mood-choices">{moods.map((m,i)=><button type="button" key={m.label} aria-pressed={active===i} onClick={()=>setActive(i)}>{m.icon} {m.label}</button>)}</div><p className="planet-message" aria-live="polite">{moods[active].text}</p><span className="fine-print">Tippe auf deinen Gedankenplaneten</span></>}
 </div>;
}
