"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

const chapterTimes = [3200, 6700, 7000];
const subscribeMotion = (notify: () => void) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};
const getReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const subscribeVisibility = (notify: () => void) => {
  document.addEventListener("visibilitychange", notify);
  return () => document.removeEventListener("visibilitychange", notify);
};
const getPageVisible = () => !document.hidden;

const chapters = [
  { label: "Közösség", title: <>Mozgásból<br /><em>találkozás.</em></>, description: "Aktív napok, új emberek, valódi kapcsolatok. Ez a Solaris Community.", href: "/rolunk", link: "Ismerd meg a közösséget" },
  { label: "Mozgás", title: <>Együtt<br /><em>indulunk.</em></>, description: "A Solaris Cycling a közös mozgás öröméről szól.", href: "/esemenyek", link: "Fedezd fel az eseményeket" },
  { label: "Találkozás", title: <>Együtt<br /><em>maradunk.</em></>, description: "A Solaris Monarchnál folytatódik a nap: zene, beszélgetés, együttlét.", href: "/esemenyek", link: "Fedezd fel az eseményeket" },
];

export default function StoryHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const clockRef = useRef({ run: 0, elapsed: 0 });
  const [chapter, setChapter] = useState(0);
  const [run, setRun] = useState(0);
  const [manualPause, setManualPause] = useState(false);
  const [inView, setInView] = useState(true);
  const pageVisible = useSyncExternalStore(subscribeVisibility, getPageVisible, () => true);
  const reducedMotion = useSyncExternalStore(subscribeMotion, getReducedMotion, () => false);
  const [finished, setFinished] = useState(false);

  const replay = useCallback(() => {
    const nextRun = clockRef.current.run + 1;
    clockRef.current = { run: nextRun, elapsed: 0 };
    setChapter(0);
    setFinished(false);
    setManualPause(false);
    setRun(nextRun);
  }, []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    motion.addEventListener("change", replay);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      motion.removeEventListener("change", replay);
      observer.disconnect();
    };
  }, [replay]);

  const paused = manualPause || !inView || !pageVisible;

  useEffect(() => {
    if (paused || reducedMotion || finished) return;
    const started = performance.now();
    const timeout = window.setTimeout(() => {
      if (chapter === 2) setFinished(true);
      else setChapter(chapter + 1);
    }, Math.max(0, chapterTimes[chapter] - clockRef.current.elapsed));
    return () => {
      window.clearTimeout(timeout);
      if (clockRef.current.run === run) {
        clockRef.current.elapsed = Math.min(chapterTimes[2], clockRef.current.elapsed + performance.now() - started);
      }
    };
  }, [chapter, finished, paused, reducedMotion, run]);

  return <section ref={sectionRef} className="story-hero" aria-label="Solaris: egy nap története">
    <div key={run} className="story-sticky" data-paused={paused || reducedMotion}>
      <div className="story-sky story-sky--day" aria-hidden="true" />
      <div className="story-sky story-sky--dusk" aria-hidden="true" />
      <div className="story-glow" aria-hidden="true" />
      <div className="story-orbit" aria-hidden="true" />
      <div className="story-horizon" aria-hidden="true" />
      <div className="story-sun-stage" aria-hidden="true">
        <img className="story-sun-image story-sun-image--cycling" src="/brand/cycling-sun.png" alt="" />
        <img className="story-sun-image story-sun-image--monarch" src="/brand/monarch-sun.png" alt="" />
      </div>
      <div className="story-topline"><span>Solaris Community</span><span>Éld meg együtt a napot</span></div>
      {chapters.map((item, index) => <div className={`story-content story-content--${index}`} data-active={chapter === index} aria-hidden={chapter !== index} key={item.label}>
        <span className="story-index">0{index + 1} / 03 — {item.label}</span>
        <h1>{item.title}</h1>
        <p>{item.description}</p>
        <Link href={item.href} className="hero-link" tabIndex={chapter === index ? 0 : -1}>{item.link} <span aria-hidden="true">↗</span></Link>
      </div>)}
      <div className="story-bottom">
        <span>CSÍKSZEREDÁBÓL INDULVA</span>
        <div className="story-progress" aria-hidden="true"><i /></div>
        {!reducedMotion && <button type="button" className="story-playback" onClick={finished ? replay : () => setManualPause(!manualPause)} aria-label={finished ? "Animáció újraindítása" : manualPause ? "Animáció folytatása" : "Animáció megállítása"}>{finished ? "↺ Újra" : manualPause ? "▶ Folytatás" : "Ⅱ Szünet"}</button>}
      </div>
    </div>
  </section>;
}
