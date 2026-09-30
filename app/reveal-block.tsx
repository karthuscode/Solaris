"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function RevealBlock({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current || !('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
    observer.observe(ref.current);
    setReady(true);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={`reveal-block ${className}`} data-ready={ready} data-visible={visible}>{children}</div>;
}
