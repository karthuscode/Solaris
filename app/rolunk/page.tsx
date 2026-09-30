import type { Metadata } from "next";
import Link from "next/link";
import { getCopy } from "../../lib/data";

export const metadata: Metadata = { title: "Rólunk", description: "Ismerd meg a Solaris Communityt: közös mozgás, zene és valódi kapcsolatok." };
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const intro = await getCopy("about_intro");
  return <main className="inner-page about-page">
    <div className="inner-hero about-inner-hero"><span className="eyebrow">Solaris Community</span><h1>Együtt<br />tovább.</h1><p className="intro">{intro}</p></div>
    <section className="content-section about-story"><div className="content-grid"><h2>Egy napnál több.</h2><div><p>Fiatal szervezőkként abban hiszünk, hogy az aktív élet és a személyes találkozások egymást erősítik. Az első Solaris nap Csíkszeredában valósult meg. A következő alkalmakat a környező településeken is szeretnénk életre hívni.</p><p>Nem kell sportolónak lenned. Jöhetsz tekerni, kipróbálni valami újat, zenét hallgatni vagy egyszerűen beszélgetni.</p></div></div></section>
    <section className="content-section about-chapters"><div className="day-timeline"><article className="timeline-card"><span className="eyebrow">Nappal / Cycling</span><h3>Mozduljunk meg.</h3><p>Közös tekerések és más aktív programok. A mozgás itt meghívás: a saját tempódban kapcsolódhatsz.</p></article><article className="timeline-card monarch"><span className="eyebrow">Délután / Monarch</span><h3>Maradj velünk.</h3><p>A nap zenével, találkozásokkal és kötetlen együttléttel folytatódik. Itt az útközben kezdődő beszélgetéseknek is van idejük.</p></article></div></section>
    <section className="content-section about-invite"><div className="content-grid"><h2>Hozzátennél a következő naphoz?</h2><div><p>Sportprogrammal, felszereléssel, helyszínnel, támogatással vagy előadóként is lehet csatlakozni. Írj nekünk, és találjuk ki együtt, mi illik a következő eseményhez.</p><Link className="pill-link dark" href="/kapcsolat">Kapcsolatfelvétel <span aria-hidden="true">↗</span></Link></div></div></section>
  </main>;
}
