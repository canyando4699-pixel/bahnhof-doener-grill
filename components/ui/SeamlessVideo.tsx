'use client';

import { useEffect, useRef } from 'react';

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
  const activeRef = useRef<'a' | 'b'>('a');
  const fadingRef = useRef(false);

  useEffect(() => {
    const a = aRef.current;
    const b = bRef.current;
    if (!a || !b) return;

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
      const active = activeRef.current === 'a' ? a : b;
      if (sender !== active) return;
      if (fadingRef.current) return;
      if (!active.duration || !Number.isFinite(active.duration)) return;

      const remaining = active.duration - active.currentTime;
      if (remaining > fadeTime) return;

      const standby = active === a ? b : a;
      swap(active, standby, Math.min(remaining, fadeTime));
    };

    // Fallback: if video ends without the timeupdate crossfade having fired,
    // do an instant swap so playback never freezes.
    const handleEnded = (sender: HTMLVideoElement) => {
      const active = activeRef.current === 'a' ? a : b;
      if (sender !== active) return;
      if (fadingRef.current) return;
      const standby = active === a ? b : a;
      swap(active, standby, 0);
    };

    const onATime = () => handleTimeUpdate(a);
    const onBTime = () => handleTimeUpdate(b);
    const onAEnd  = () => handleEnded(a);
    const onBEnd  = () => handleEnded(b);

    a.addEventListener('timeupdate', onATime);
    b.addEventListener('timeupdate', onBTime);
    a.addEventListener('ended', onAEnd);
    b.addEventListener('ended', onBEnd);

    return () => {
      a.removeEventListener('timeupdate', onATime);
      b.removeEventListener('timeupdate', onBTime);
      a.removeEventListener('ended', onAEnd);
      b.removeEventListener('ended', onBEnd);
    };
  }, [fadeTime]);

  return (
    <div className={wrapperClassName} aria-hidden="true">
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

      {/* Loop-transition overlay */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />
    </div>
  );
}
