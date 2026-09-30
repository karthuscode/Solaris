import type { Metadata } from "next";
import Link from "next/link";
import { env } from "cloudflare:workers";
import "./globals.css";

export function generateMetadata(): Metadata { return {
    title: { default: "Solaris Community — Mozgásból találkozás", template: "%s · Solaris Community" },
    description: "Közösségi mozgás, események, zene és valódi találkozások. A Solaris Community Csíkszeredából indul.",
    robots: env.PUBLIC_LAUNCH_READY === "1" ? { index: true, follow: true } : { index: false, follow: false },
    icons: { icon: "/favicon.svg" },
  }; }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="hu"><body><a className="skip-link" href="#tartalom">Ugrás a tartalomra</a><header className="site-header"><Link className="brand" href="/" aria-label="Solaris Community kezdőoldal"><img src="/brand/solaris-logo-dark.svg" alt="Solaris Community" /></Link><nav aria-label="Fő navigáció"><Link href="/esemenyek">Események</Link><Link href="/rolunk">Rólunk</Link><Link href="/kapcsolat">Kapcsolat</Link></nav><Link className="header-action" href="/esemenyek">Találkozzunk <span aria-hidden="true">↗</span></Link><details className="mobile-menu"><summary>Menü</summary><div><Link href="/esemenyek">Események</Link><Link href="/rolunk">Rólunk</Link><Link href="/kapcsolat">Kapcsolat</Link></div></details></header><div id="tartalom">{children}</div><footer className="site-footer"><div className="footer-top"><div><img src="/brand/solaris-logo-light.svg" alt="Solaris Community" /><p>Mozgás. Találkozás. Együtt tovább.</p></div><div className="footer-links"><Link href="/esemenyek">Események</Link><Link href="/rolunk">Rólunk</Link><Link href="/kapcsolat">Kapcsolat</Link><Link href="/adatkezeles">Adatkezelés</Link></div><div className="footer-links"><a href="https://www.instagram.com/solaris.cycling/" target="_blank" rel="noopener noreferrer">Cycling Instagram ↗</a><a href="https://www.instagram.com/solaris.monarch/" target="_blank" rel="noopener noreferrer">Monarch Instagram ↗</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Solaris Community</span><span>Csíkszereda és azon túl</span></div></footer></body></html>;
}
