import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = { title: 'Noocene Lab · Mind Quest', description: 'Erlebe deine Gedanken aus einer neuen Perspektive.' };

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="de"><body><a className="skip-link" href="#main">Zum Inhalt</a><header className="site-header"><Link className="brand" href="/" aria-label="Noocene Lab Startseite"><span className="brand-mark" aria-hidden="true">◒</span> NOOCENE <span className="brand-light">LAB</span></Link><nav aria-label="Hauptnavigation"><Link href="/research">Die Forschung</Link><span className="lab-status"><span /> Experimenteller Prototyp</span></nav></header><main id="main">{children}</main><footer className="site-footer"><span>Ein neuer Blick beginnt mit einer Frage.</span><div><Link href="/research">Methodik</Link><Link href="/privacy">Datenschutz</Link></div></footer></body></html>;
}
