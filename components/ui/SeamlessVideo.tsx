'use client';

import { useEffect, useRef, useState } from 'react';

interface SeamlessVideoProps {
  webmSrc: string;
  mp4Src: string;
  poster?: string;
  wrapperClassName?: string;
  videoClassName?: string;
  fadeTime?: number;
}

export default function SeamlessVideo({
  webmSrc,
  mp4Src,
  poster,
  wrapperClassName = '',
  videoClassName = '',
  fadeTime = 1.5,
}: SeamlessVideoProps) {
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<'a' | 'b'>('a');
  const fadingRef = useRef(false);
  const [needsTap, setNeedsTap] = useState(false);

  useEffect(() => {
    const a = aRef.current;
    const b = bRef.current;
    const wrapper = wrapperRef.current;
    if (!a || !b || !wrapper) return;

    const getActive = () => (activeRef.current === 'a' ? a : b);

    const playActive = () =>
      getActive()
        .play()
        .then(() => setNeedsTap(false))
        .catch(() => setNeedsTap(true));

    const swap = (outgoing: HTMLVideoElement, incoming: HTMLVideoElement, dur: number) => {
      fadingRef.current = true;
      activeRef.current = activeRef.current === 'a' ? 'b' : 'a';

      incoming.currentTime = 0;
      incoming.play().catch(() => {});

      const transition = dur > 0 ? `opacity ${dur}s linear` : 'none';
      outgoing.style.transition = transition;
      incoming.style.transition = transition;

      requestAnimationFrame(() => {
        outgoing.style.opacity = '0';
        incoming.style.opacity = '1';
      });

      setTimeout(() => {
        outgoing.pause();
        outgoing.currentTime = 0;
        outgoing.style.transition = 'none';
        incoming.style.transition = 'none';
        fadingRef.current = false;
      }, dur * 1000 + 100);
    };

    const handleTimeUpdate = (sender: HTMLVideoElement) => {
      const active = getActive();
      if (sender !== active) return;
      if (fadingRef.current) return;
      if (!active.duration || !Number.isFinite(active.duration)) return;

      const remaining = active.duration - active.currentTime;
      if (remaining > fadeTime) return;

      swap(active, active === a ? b : a, Math.min(remaining, fadeTime));
    };

    // Fallback: instant swap if video ends without crossfade
    const handleEnded = (sender: HTMLVideoElement) => {
      const active = getActive();
      if (sender !== active || fadingRef.current) return;
      swap(active, active === a ? b : a, 0);
    };

    // IntersectionObserver: play only when visible (fixes iOS below-fold autoplay)
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) playActive(); },
      { threshold: 0.1 }
    );
    observer.observe(wrapper);

    // BFCache restore (iOS Safari back button)
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) playActive();
    };

    // Tab visibility resume
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') playActive();
    };

    a.addEventListener('timeupdate', () => handleTimeUpdate(a));
    b.addEventListener('timeupdate', () => handleTimeUpdate(b));
    a.addEventListener('ended', () => handleEnded(a));
    b.addEventListener('ended', () => handleEnded(b));
    window.addEventListener('pageshow', handlePageShow);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      observer.disconnect();
      window.removeEventListener('pageshow', handlePageShow);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [fadeTime]);

  return (
    <div ref={wrapperRef} className={wrapperClassName} aria-hidden="true">
      {/* Video A — primary */}
      <video
        ref={aRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        poster={poster}
        className={videoClassName}
        style={{ opacity: 1 }}
      >
        <source src={webmSrc} type="video/webm" />
        <source src={mp4Src} type="video/mp4" />
      </video>

      {/* Video B — standby, overlaid */}
      <video
        ref={bRef}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ opacity: 0 }}
      >
        <source src={webmSrc} type="video/webm" />
        <source src={mp4Src} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      {/* Tap-to-play overlay (Low Power Mode / autoplay blocked) */}
      {needsTap && (
        <button
          type="button"
          onClick={() => {
            const active = activeRef.current === 'a' ? aRef.current : bRef.current;
            active?.play().then(() => setNeedsTap(false)).catch(() => {});
          }}
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
          aria-label="Video abspielen"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 80 80"
            className="w-16 h-16 text-white drop-shadow-lg"
            fill="currentColor"
          >
            <circle cx="40" cy="40" r="38" fill="rgba(0,0,0,0.45)" stroke="white" strokeWidth="2" />
            <polygon points="32,24 60,40 32,56" />
          </svg>
        </button>
      )}
    </div>
  );
}
