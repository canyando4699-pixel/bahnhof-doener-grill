/**
 * Spiel-Sounds für Flappy Döner — synthetisiert (WebAudio, keine Dateien,
 * CSP-sicher). Immer aktiv: Der AudioContext entsteht lazy beim ersten
 * Flap (User-Geste → Autoplay-Policy erlaubt es).
 */

let ctx: AudioContext | null = null;

function ac(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq: number, dur: number, type: OscillatorType, vol: number, slideTo?: number) {
  try {
    const c = ac();
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, c.currentTime);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, c.currentTime + dur);
    g.gain.setValueAtTime(vol, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    o.connect(g).connect(c.destination);
    o.start();
    o.stop(c.currentTime + dur + 0.02);
  } catch {}
}

export const sfx = {
  flap: () => tone(420, 0.09, 'triangle', 0.045, 580),
  score: () => {
    tone(660, 0.12, 'sine', 0.05);
    setTimeout(() => tone(880, 0.16, 'sine', 0.05), 90);
  },
  die: () => tone(220, 0.35, 'sawtooth', 0.055, 65),
};
