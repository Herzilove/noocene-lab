'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DreamScene } from './dream-scene';
import { GARDEN_KEY, parseGarden } from '../lib/garden';
export function WorldHub(){
 const [seeds,setSeeds]=useState(0);
 useEffect(()=>{try{setSeeds(parseGarden(localStorage.getItem(GARDEN_KEY)).length);}catch{}},[]);
 return <div className="world-hub"><div className="world-topline"><span className="live-dot"/> EIN MOMENT. EIN NEUER BLICK. <Link href="/garden">✿ {seeds?`${seeds} Entdeckungen`:'Dein Garten'}</Link></div><section className="world-hero"><div className="world-intro"><span className="world-kicker">INNERSPACE / DEIN RAUM ZUM NEU DENKEN</span><h1>Raus aus dem<br/><span>Autopilot.</span><i>Rein in deinen Kopf.</i></h1><p>Bring mit, was dich beschäftigt.<br/>Drei kleine Schritte. Dein eigener Aha-Moment.</p><Link className="world-cta" href="/innerspace">Meinen Moment erkunden <span>↗</span></Link><span className="world-footnote">Ohne Konto · In deinem Tempo · Geführt ohne KI</span></div><div className="world-preview"><div className="orbit-caption">Was weiß ich — und was denke ich?</div><DreamScene variant="social" active/><div className="preview-sticker">✦ Dein Gedankenraum</div><span className="preview-coordinate">YOU ARE HERE ↙</span></div></section><section className="simple-route" aria-label="Deine drei Schritte"><span>01 <b>Dein Moment</b></span><i>→</i><span>02 <b>Dein Gedanke</b></span><i>→</i><span>03 <b>Dein neuer Blick</b></span></section><section className="world-bottom"><Link href="/garden"><span className="world-mini-icon">✿</span><div><strong>Deine Aha-Momente wachsen weiter.</strong><p>Speichern. Ausprobieren. Später neu draufschauen.</p></div><span>↗</span></Link><Link href="/research"><span className="world-mini-icon">⌁</span><div><strong>Hilft uns KI beim Reflektieren?</strong><p>Unsere offene Forschungsfrage.</p></div><span>↗</span></Link></section></div>;
}
