"use client";

import { useEffect, useRef, useState } from "react";
import { partnerLogoSrc } from "../lib/partners";

type RailPartner = { id: string; name: string; logo_key: string | null };
type Motion = { offset: number; speed: number; width: number; dragging: boolean; focused: boolean; lastX: number; lastTime: number };

function PartnerMark({ partner }: { partner: RailPartner }) {
  const logo = partnerLogoSrc(partner);
  return <div className={`partner-rail__item${logo ? "" : " partner-rail__item--wordmark"}`}>
    {logo ? <img src={logo} alt={partner.name} draggable={false} /> : <span aria-label={partner.name}>{partner.name}</span>}
  </div>;
}

export default function PartnerRail({ partners }: { partners: RailPartner[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLDivElement>(null);
  const motion = useRef<Motion>({ offset: 0, speed: 22, width: 1, dragging: false, focused: false, lastX: 0, lastTime: 0 });
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduced || !trackRef.current || !firstRef.current) {
      if (trackRef.current) trackRef.current.style.transform = "";
      return;
    }
    const state = motion.current;
    const measure = () => { state.width = Math.max(1, firstRef.current?.getBoundingClientRect().width || 1); };
    const observer = new ResizeObserver(measure);
    observer.observe(firstRef.current);
    measure();
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!state.dragging && !state.focused && !document.hidden) {
        state.speed += (22 - state.speed) * Math.min(1, dt * 1.9);
        state.offset += state.speed * dt;
        state.offset = ((state.offset % state.width) + state.width) % state.width;
        if (trackRef.current) trackRef.current.style.transform = `translate3d(${-state.offset}px, 0, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [reduced, partners]);

  const shift = (direction: number) => {
    if (reduced) viewportRef.current?.scrollBy({ left: direction * 260, behavior: "auto" });
    else {
      const state = motion.current;
      state.offset = ((state.offset + direction * 260) % state.width + state.width) % state.width;
      state.speed = 22;
      if (trackRef.current) trackRef.current.style.transform = `translate3d(${-state.offset}px, 0, 0)`;
    }
  };

  return <div className={`partner-rail${reduced ? " partner-rail--reduced" : ""}`}>
    <div className="partner-rail__viewport" ref={viewportRef} tabIndex={0} role="region" aria-label="Korábbi Solaris-partnerek"
      onFocus={() => { motion.current.focused = viewportRef.current?.matches(":focus-visible") ?? false; }}
      onBlur={() => { motion.current.focused = false; }}
      onKeyDown={(event) => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); shift(event.key === "ArrowRight" ? 1 : -1); } }}
      onPointerDown={(event) => {
        if (reduced) return;
        const state = motion.current;
        state.dragging = true;
        state.lastX = event.clientX;
        state.lastTime = performance.now();
        state.speed = 0;
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        const state = motion.current;
        if (!state.dragging || reduced) return;
        const now = performance.now();
        const delta = event.clientX - state.lastX;
        state.offset = ((state.offset - delta) % state.width + state.width) % state.width;
        state.speed = Math.max(-900, Math.min(900, -delta / Math.max(8, now - state.lastTime) * 1000));
        state.lastX = event.clientX;
        state.lastTime = now;
        if (trackRef.current) trackRef.current.style.transform = `translate3d(${-state.offset}px, 0, 0)`;
      }}
      onPointerUp={() => { motion.current.dragging = false; }}
      onPointerCancel={() => { motion.current.dragging = false; }}
    >
      <div className="partner-rail__track" ref={trackRef}>
        <div className="partner-rail__group" ref={firstRef}>{partners.map((partner) => <PartnerMark partner={partner} key={partner.id} />)}</div>
        <div className="partner-rail__group partner-rail__copy" aria-hidden="true">{partners.map((partner) => <PartnerMark partner={partner} key={`copy-${partner.id}`} />)}</div>
      </div>
    </div>
    <div className="partner-rail__controls" aria-label="Partnerlogók léptetése">
      <button type="button" onClick={() => shift(-1)} aria-label="Előző partnerek">←</button>
      <button type="button" onClick={() => shift(1)} aria-label="Következő partnerek">→</button>
    </div>
  </div>;
}
