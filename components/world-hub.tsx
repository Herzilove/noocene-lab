'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DreamScene } from './dream-scene';
import { GARDEN_KEY, parseGarden } from '../lib/garden';
export function WorldHub(){
 const [seeds,setSeeds]=useState(0);
 useEffect(()=>{try{setSeeds(parseGarden(localStorage.getItem(GARDEN_KEY)).length);}catch{}},[]);
 return <div className="world-hub"><div className="world-topline"><span className="live-dot"/> ONE MOMENT. A FRESH PERSPECTIVE. <Link href="/garden">✿ {seeds?`${seeds} discoveries`:'Your garden'}</Link></div><section className="world-hero"><div className="world-intro"><span className="world-kicker">INNERSPACE / ROOM TO RETHINK</span><h1>Step out of<br/><span>autopilot.</span><i>Meet your mind.</i></h1><p>Bring whatever is on your mind.<br/>Three small steps. Your own aha moment.</p><Link className="world-cta" href="/innerspace">Explore my moment <span>↗</span></Link><span className="world-footnote">No account · Your pace · Guided without AI</span></div><div className="world-preview"><div className="orbit-caption">What do I know — and what am I assuming?</div><DreamScene variant="social" active/><div className="preview-sticker">✦ Your thinking space</div><span className="preview-coordinate">YOU ARE HERE ↙</span></div></section><section className="simple-route" aria-label="Your three steps"><span>01 <b>Your moment</b></span><i>→</i><span>02 <b>Your thought</b></span><i>→</i><span>03 <b>Your new perspective</b></span></section><section className="world-bottom"><Link href="/garden"><span className="world-mini-icon">✿</span><div><strong>Let your aha moments grow.</strong><p>Save. Try it out. Come back with fresh eyes.</p></div><span>↗</span></Link><Link href="/research"><span className="world-mini-icon">⌁</span><div><strong>Can AI help us reflect?</strong><p>Our open research question.</p></div><span>↗</span></Link></section></div>;
}
