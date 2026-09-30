"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function StoryHero() {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!ref.current) return;
        const { top, height } = ref.current.getBoundingClientRect();
        const available = Math.max(1, height - window.innerHeight);
        setProgress(Math.min(1, Math.max(0, -top / available)));
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  const phase = progress < .36 ? 0 : progress < .7 ? 1 : 2;
  return <section ref={ref} className="story-hero" aria-label="Solaris: egy nap története"><div className="story-sticky" style={{ "--hero-progress": progress } as React.CSSProperties}>
    <div className="story-glow" aria-hidden="true" /><div className="story-orbit" aria-hidden="true" />
    <img className="story-sun" src={phase === 2 ? "/brand/monarch-sun.png" : "/brand/cycling-sun.png"} alt="" aria-hidden="true" />
    <div className="story-topline"><span>Solaris Community</span><span>Éld meg együtt a napot</span></div>
    <div className="story-content" key={phase}><span className="story-index">0{phase + 1} / 03 — {phase === 0 ? "Közösség" : phase === 1 ? "Mozgás" : "Találkozás"}</span><h1>{phase === 0 ? <>Mozgásból<br/><em>találkozás.</em></> : phase === 1 ? <>Együtt<br/><em>indulunk.</em></> : <>Együtt<br/><em>maradunk.</em></>}</h1><p>{phase === 0 ? "Aktív napok, új emberek, valódi kapcsolatok. Ez a Solaris Community." : phase === 1 ? "A Solaris Cycling a közös mozgás öröméről szól." : "A Solaris Monarchnál folytatódik a nap: zene, beszélgetés, együttlét."}</p><Link href={phase === 0 ? "/rolunk" : "/esemenyek"} className="hero-link">{phase === 0 ? "Ismerd meg a közösséget" : "Fedezd fel az eseményeket"} <span aria-hidden="true">↗</span></Link></div>
    <div className="story-bottom"><span>CSÍKSZEREDÁBÓL INDULVA</span><div className="story-progress" aria-hidden="true"><i style={{ width: `${Math.round(progress * 100)}%` }} /></div><span>GÖRGESS TOVÁBB ↓</span></div>
  </div></section>;
}
