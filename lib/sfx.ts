/**
 * Dezentes Sound-Design — komplett synthetisiert (WebAudio, keine Dateien,
 * CSP-sicher). Standard: AUS. Nur sparsame Sounds: Grill-Ambient (Loop)
 * + drei Spiel-Sounds. Keine Hover-/Klick-Geräusche.
 */

let ctx: AudioContext | null = null;
let enabled = false;
let ambient: { gain: GainNode; src: AudioBufferSourceNode } | null = null;

function ac(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq: number, dur: number, type: OscillatorType, vol: number, slideTo?: number) {
  if (!enabled) return;
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

function startAmbient() {
  if (ambient || !enabled) return;
  try {
    const c = ac();
    // 2s Rausch-Buffer, geloopt → durch Bandpass = leises Grill-Brutzeln
    const len = c.sampleRate * 2;
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      // Knistern: meist leise, vereinzelt kleine Spitzen
      data[i] = (Math.random() * 2 - 1) * (Math.random() < 0.012 ? 0.9 : 0.22);
    }
    const src = c.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const bp = c.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 4200;
    bp.Q.value = 0.6;
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.0001, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.014, c.currentTime + 1.2);
    src.connect(bp).connect(gain).connect(c.destination);
    src.start();
    ambient = { gain, src };
  } catch {}
}

function stopAmbient() {
  if (!ambient || !ctx) return;
  try {
    ambient.gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    const src = ambient.src;
    setTimeout(() => { try { src.stop(); } catch {} }, 500);
  } catch {}
  ambient = null;
}

export function setSoundEnabled(on: boolean) {
  enabled = on;
  if (on) startAmbient();
  else stopAmbient();
}

export function isSoundEnabled() {
  return enabled;
}

export const sfx = {
  flap: () => tone(420, 0.09, 'triangle', 0.045, 580),
  score: () => {
    tone(660, 0.12, 'sine', 0.05);
    setTimeout(() => tone(880, 0.16, 'sine', 0.05), 90);
  },
  die: () => tone(220, 0.35, 'sawtooth', 0.055, 65),
};
