'use client';
import { useState } from 'react';
const moods = [
  { icon: '✦', label: 'Curiosity', text: 'What if your first thought is just one possibility?' },
  { icon: '☀', label: 'Courage', text: 'You can change your mind. Try another perspective.' },
  { icon: '☾', label: 'Calm', text: 'Breathe in. Breathe out. What thought is passing by?' },
];
export function Orbit({ small = false }: { small?: boolean }) {
 const [active, setActive] = useState(0);
 return <div className={`play-orbit ${small ? 'compact' : ''}`}>
 <button type="button" className={`orbit ${small ? 'orbit-small' : ''} mood-${active}`} onClick={()=>setActive((active+1)%moods.length)} aria-label="Turn the thought planet to discover another perspective"><div className="orbit-glow"/><div className="orbit-ring ring-one"/><div className="orbit-ring ring-two"/><div className="orbit-core"><span className="planet-face">{moods[active].icon}</span></div><span className="orbit-star star-one"/><span className="orbit-star star-two"/></button>
 {!small && <><div className="mood-choices">{moods.map((m,i)=><button type="button" key={m.label} aria-pressed={active===i} onClick={()=>setActive(i)}>{m.icon} {m.label}</button>)}</div><p className="planet-message" aria-live="polite">{moods[active].text}</p><span className="fine-print">Tap your thought planet</span></>}
 </div>;
}
