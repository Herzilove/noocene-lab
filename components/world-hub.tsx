'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DreamScene } from './dream-scene';
import { GARDEN_KEY, parseGarden } from '../lib/garden';
export function WorldHub(){
 const [seeds,setSeeds]=useState(0);
 useEffect(()=>{try{setSeeds(parseGarden(localStorage.getItem(GARDEN_KEY)).length);}catch{}},[]);
 return <div className="world-hub"><div className="world-topline"><span className="live-dot"/> ONE MOMENT. A FRESH PERSPECTIVE. <Link href="/garden">✿ {seeds?`${seeds} discoveries`:'Your garden'}</Link></div><section className="world-hero"><div className="world-intro"><span className="world-kicker">INNERSPACE / ROOM TO RETHINK</span><h1>A little less<br/><span>overthinking.</span><i>A little more room.</i></h1><p>Something on your mind?<br/>Take a quick detour. See it a little differently.</p><Link className="world-cta" href="/innerspace">Let’s take a look <span>↗</span></Link><span className="world-footnote">No sign-up. No right answers. Just a fresh angle.</span></div><div className="world-preview"><div className="orbit-caption">Same moment. New angle.</div><DreamScene variant="social" active/><div className="preview-sticker">✦ Room for another thought</div><span className="preview-coordinate">YOU ARE HERE ↙</span></div></section><section className="simple-route" aria-label="Your three steps"><span>01 <b>Replay</b></span><i>→</i><span>02 <b>Notice</b></span><i>→</i><span>03 <b>Remix</b></span></section><section className="world-bottom"><Link href="/garden"><span className="world-mini-icon">✿</span><div><strong>Keep the thoughts worth coming back to.</strong><p>Plant a small idea. See what happens.</p></div><span>↗</span></Link><Link href="/research"><span className="world-mini-icon">⌁</span><div><strong>Can AI help us reflect?</strong><p>Our open research question.</p></div><span>↗</span></Link></section></div>;
}
