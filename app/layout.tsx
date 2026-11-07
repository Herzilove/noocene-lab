import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import './world.css';

export const metadata: Metadata = { title: 'Noocene Lab · Mind Quest', description: 'A fresh look at whatever is on your mind.' };

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><header className="site-header"><Link className="brand" href="/" aria-label="Noocene Lab home"><span className="brand-mark" aria-hidden="true">◒</span> NOOCENE <span className="brand-light">LAB</span></Link><nav aria-label="Main navigation"><Link href="/garden">Your garden</Link><Link href="/research">The research</Link><span className="lab-status"><span /> Experimental prototype</span></nav></header><main id="main">{children}</main><footer className="site-footer"><span>A little space for another thought.</span><div><Link href="/research">Methodology</Link><Link href="/privacy">Privacy</Link></div></footer></body></html>;
}
