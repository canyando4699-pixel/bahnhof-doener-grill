'use client';

import { useEffect, useRef, useState } from 'react';
import { sfx } from '@/lib/sfx';

/**
 * Flappy Döner — Canvas-2D-Arcade (kein WebGL → keine extra GPU-Last).
 * Tippen/Klick/Leertaste = flattern, Döner-Spieße ausweichen,
 * Zutaten in der Lücke = Bonuspunkte. Bestenliste ohne Namen
 * (nur Scores, automatisch gespeichert).
 */

const BOARD_KEY = 'flappy-doener-board';
const BOARD_SIZE = 5;

function loadBoard(): number[] {
  try {
    const data = JSON.parse(localStorage.getItem(BOARD_KEY) || '[]');
    if (!Array.isArray(data)) return [];
    return data
      .map((e) => (typeof e === 'number' ? e : Number(e?.score)))
      .filter((n) => Number.isFinite(n) && n > 0)
      .sort((a, b) => b - a)
      .slice(0, BOARD_SIZE);
  } catch {
    return [];
  }
}

type Pipe = {
  x: number;
  gapY: number;
  gapH: number;
  passed: boolean;
  bonus: { emoji: string; taken: boolean } | null;
};

const BONUS_EMOJIS = ['🍅', '🥬', '🧅', '🌶️'];
const PIPE_W = 58;
const PIPE_SPACING = 270;
const GROUND_H = 26;
const PLAYER_R = 15;

export default function FlappyDoener() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startRef = useRef<(() => void) | null>(null);

  const [phase, setPhase] = useState<'idle' | 'running' | 'over'>('idle');
  const [score, setScore] = useState(0);
  const [board, setBoard] = useState<number[]>([]);

  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  // Pro Runde nur einmal speichern (StrictMode-Doppel-Effekte abfangen)
  const savedRoundRef = useRef(false);

  useEffect(() => {
    setBoard(loadBoard());
  }, []);

  // Score nach Game Over automatisch in die Bestenliste übernehmen
  useEffect(() => {
    if (phase !== 'over' || score <= 0 || savedRoundRef.current) return;
    savedRoundRef.current = true;
    setBoard((prev) => {
      const next = [...prev, score].sort((a, b) => b - a).slice(0, BOARD_SIZE);
      try {
        localStorage.setItem(BOARD_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, [phase, score]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let raf = 0;
    let last = performance.now();

    const g = {
      y: 0,
      vy: 0,
      speed: 175,
      score: 0,
      pipes: [] as Pipe[],
      embers: [] as { x: number; y: number; r: number; s: number }[],
    };

    const resize = () => {
      W = wrap.clientWidth;
      H = Math.min(540, Math.max(380, Math.round(W * 1.05)));
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      // CSS-Breite 100% statt px: sonst hält der Canvas das Grid-Item
      // auf alter Breite fest (min-width:auto-Blowout) und schrumpft nie
      canvas.style.width = '100%';
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (g.embers.length === 0) {
        for (let i = 0; i < 14; i++) {
          g.embers.push({ x: Math.random() * W, y: Math.random() * H, r: 1 + Math.random() * 2, s: 12 + Math.random() * 26 });
        }
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const spawnPipe = (x: number) => {
      const gapH = Math.max(150, 208 - g.score * 1.6);
      const margin = 60;
      const gapY = margin + Math.random() * Math.max(40, H - GROUND_H - margin * 2 - gapH);
      const bonus = Math.random() < 0.35
        ? { emoji: BONUS_EMOJIS[Math.floor(Math.random() * BONUS_EMOJIS.length)], taken: false }
        : null;
      g.pipes.push({ x, gapY, gapH, passed: false, bonus });
    };

    const reset = () => {
      g.y = H * 0.45;
      g.vy = 0;
      g.speed = 175;
      g.score = 0;
      g.pipes = [];
      for (let i = 0; i < 4; i++) spawnPipe(W + 140 + i * PIPE_SPACING);
    };

    const start = () => {
      reset();
      setScore(0);
      savedRoundRef.current = false;
      setPhase('running');
    };
    startRef.current = start;

    const die = () => {
      setScore(g.score);
      setPhase('over');
      sfx.die();
    };

    const flap = () => {
      g.vy = -530;
      sfx.flap();
    };

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault();
      if (phaseRef.current === 'running') flap();
      else if (phaseRef.current === 'idle') start();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (phaseRef.current !== 'running') return;
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        flap();
      }
    };
    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);

    const update = (dt: number) => {
      g.vy += 1750 * dt;
      g.y += g.vy * dt;
      const px = W * 0.3;

      for (const p of g.pipes) {
        p.x -= g.speed * dt;

        if (!p.passed && p.x + PIPE_W < px - PLAYER_R) {
          p.passed = true;
          g.score += 1;
          g.speed = Math.min(330, g.speed + 3);
          setScore(g.score);
          sfx.score();
        }

        if (p.bonus && !p.bonus.taken) {
          const bx = p.x + PIPE_W / 2;
          const by = p.gapY + p.gapH / 2;
          if (Math.abs(bx - px) < 26 && Math.abs(by - g.y) < 30) {
            p.bonus.taken = true;
            g.score += 2;
            setScore(g.score);
          }
        }

        // Kollision Spieß (Kreis vs. Rechteck oben/unten)
        if (px + PLAYER_R > p.x && px - PLAYER_R < p.x + PIPE_W) {
          if (g.y - PLAYER_R < p.gapY || g.y + PLAYER_R > p.gapY + p.gapH) {
            die();
            return;
          }
        }
      }

      if (g.pipes.length > 0 && g.pipes[0].x < -PIPE_W - 20) {
        g.pipes.shift();
        spawnPipe(g.pipes[g.pipes.length - 1].x + PIPE_SPACING);
      }

      if (g.y + PLAYER_R > H - GROUND_H || g.y - PLAYER_R < 0) {
        die();
      }
    };

    const drawPipes = () => {
      for (const p of g.pipes) {
        for (const [top, h] of [
          [0, p.gapY],
          [p.gapY + p.gapH, H - GROUND_H - (p.gapY + p.gapH)],
        ] as const) {
          if (h <= 0) continue;
          // Fleisch-Stapel
          ctx.fillStyle = '#7c3b18';
          ctx.fillRect(p.x, top, PIPE_W, h);
          ctx.fillStyle = '#5e2a10';
          for (let y = top + 6; y < top + h - 4; y += 14) {
            ctx.fillRect(p.x + 3, y, PIPE_W - 6, 5);
          }
          // Angegrillte Kante
          ctx.fillStyle = '#9c3d0a';
          ctx.fillRect(p.x, top, 4, h);
          ctx.fillRect(p.x + PIPE_W - 4, top, 4, h);
          // Metallspieß in der Mitte
          ctx.fillStyle = '#b8b8b8';
          ctx.fillRect(p.x + PIPE_W / 2 - 3, top, 6, h);
          // Tellerkappe am Lückenrand
          ctx.fillStyle = '#3a3a3a';
          const capY = top === 0 ? p.gapY - 8 : p.gapY + p.gapH;
          ctx.fillRect(p.x - 5, capY, PIPE_W + 10, 8);
        }

        if (p.bonus && !p.bonus.taken) {
          ctx.font = '24px serif';
          ctx.textAlign = 'center';
          ctx.fillText(p.bonus.emoji, p.x + PIPE_W / 2, p.gapY + p.gapH / 2 + 8);
        }
      }
    };

    const draw = (t: number) => {
      // Hintergrund
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#0d0805');
      bg.addColorStop(1, '#1c0e05');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Glut-Funken
      ctx.fillStyle = 'rgba(255, 176, 31, 0.35)';
      for (const e of g.embers) {
        e.y -= e.s * 0.016;
        e.x -= e.s * 0.006;
        if (e.y < -4) { e.y = H + 4; e.x = Math.random() * W; }
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
      }

      drawPipes();

      // Boden
      ctx.fillStyle = '#15090388';
      ctx.fillRect(0, H - GROUND_H, W, GROUND_H);
      const ground = ctx.createLinearGradient(0, 0, W, 0);
      ground.addColorStop(0, '#c41f1f');
      ground.addColorStop(0.5, '#ff5a1f');
      ground.addColorStop(1, '#ffb01f');
      ctx.fillStyle = ground;
      ctx.fillRect(0, H - GROUND_H, W, 2.5);

      // Spieler-Döner
      const px = W * 0.3;
      const py = phaseRef.current === 'running' ? g.y : H * 0.45 + Math.sin(t / 480) * 9;
      const rot = phaseRef.current === 'running'
        ? Math.max(-0.5, Math.min(0.9, g.vy / 620))
        : Math.sin(t / 480) * 0.08;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(rot);
      ctx.font = '34px serif';
      ctx.textAlign = 'center';
      ctx.fillText('🥙', 0, 12);
      ctx.restore();
    };

    const loop = (t: number) => {
      const dt = Math.min(0.032, (t - last) / 1000);
      last = t;
      if (phaseRef.current === 'running') update(dt);
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('keydown', onKeyDown);
      canvas.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  const inTop = phase === 'over' && score > 0 && board.includes(score);
  const isRecord = inTop && score >= board[0];

  return (
    <section className="relative py-[var(--section-py)] overflow-hidden">
      <span
        className="absolute -top-10 left-0 font-display text-[clamp(10rem,28vw,24rem)] leading-none text-outline-dim select-none pointer-events-none"
        aria-hidden="true"
      >
        03
      </span>

      <div className="max-w-container mx-auto px-[var(--container-px)] relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Info + Bestenliste */}
          <div>
            <p className="text-xs tracking-[0.45em] uppercase text-accent mb-4">
              🎮 Mini-Game — Flieg, Döner, flieg!
            </p>
            <h2 className="font-display text-5xl md:text-7xl text-[var(--color-text)] leading-[0.9]">
              Flappy
              <br />
              <span className="ember-text">Döner</span>
            </h2>
            <p className="mt-6 text-[var(--color-text-muted)] leading-relaxed max-w-md">
              Tippen, klicken oder <span className="text-[var(--color-text)]">Leertaste</span> —
              flattere durch die Döner-Spieße. Zutaten in der Lücke geben
              <span className="text-gold"> +2 Bonus</span>. Wie weit kommst du?
            </p>

            {/* Bestenliste */}
            <div className="mt-8 border border-border rounded-2xl p-6 bg-surface max-w-md">
              <p className="text-[10px] tracking-[0.35em] uppercase text-gold mb-4">
                🏆 Bestenliste
              </p>
              {board.length === 0 ? (
                <p className="text-sm text-[var(--color-text-dim)]">
                  Noch leer — hol dir Platz 1!
                </p>
              ) : (
                <ol className="space-y-2">
                  {board.map((entry, i) => (
                    <li
                      key={`${entry}-${i}`}
                      className={`flex items-center justify-between gap-4 text-sm rounded-lg px-3 py-2 ${
                        phase === 'over' && entry === score
                          ? 'bg-gold/15 border border-gold/40 text-gold'
                          : 'text-[var(--color-text-muted)]'
                      }`}
                    >
                      <span className="font-display text-lg w-7">
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                      </span>
                      <span className="font-display text-xl tabular-nums">{entry}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>

          {/* Spielfläche */}
          <div ref={wrapRef} className="relative w-full min-w-0 max-w-[480px] mx-auto lg:mx-0">
            <canvas
              ref={canvasRef}
              className="block w-full rounded-3xl border border-border cursor-pointer select-none"
              style={{ touchAction: 'none' }}
              aria-label="Flappy Döner Spielfeld — tippen zum Flattern"
            />

            {/* Live-Score */}
            {phase === 'running' && (
              <p
                className="absolute top-4 left-1/2 -translate-x-1/2 font-display text-6xl text-[var(--color-text)] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] pointer-events-none select-none"
                aria-hidden="true"
              >
                {score}
              </p>
            )}

            {/* Start-Overlay */}
            {phase === 'idle' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-black/40 rounded-3xl pointer-events-none">
                <p className="font-display text-4xl text-[var(--color-text)] drop-shadow-lg">Bereit?</p>
                <button
                  type="button"
                  onClick={() => startRef.current?.()}
                  className="pointer-events-auto bg-accent hover:bg-accent-hover text-white px-10 py-4 rounded-full font-bold text-lg heat-pulse transition-colors"
                >
                  Start ▶
                </button>
                <p className="text-xs text-[var(--color-text-muted)] tracking-wide">
                  Tippen = flattern · Spießen ausweichen
                </p>
              </div>
            )}

            {/* Game-Over-Overlay */}
            {phase === 'over' && (
              <div className="achievement-in absolute inset-0 flex items-center justify-center bg-black/70 rounded-3xl p-5 overflow-y-auto">
                <div className="w-full max-w-[320px] text-center">
                  <p className="font-display text-3xl text-[var(--color-text)]">Game Over 💀</p>
                  <p className="font-display text-7xl text-gold tabular-nums mt-2 leading-none">{score}</p>
                  <p className="text-xs tracking-[0.25em] uppercase text-[var(--color-text-dim)] mt-2">Punkte</p>

                  {isRecord && (
                    <p className="achievement-in text-sm text-gold mt-4">🏆 Neuer Rekord — gespeichert!</p>
                  )}
                  {inTop && !isRecord && (
                    <p className="achievement-in text-sm text-gold mt-4">In den Top {BOARD_SIZE}! 🎉</p>
                  )}

                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => startRef.current?.()}
                      className="bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-full font-semibold transition-colors"
                    >
                      Nochmal ▶
                    </button>
                    <a
                      href="tel:06451240925"
                      className="px-6 py-3 rounded-full border border-gold/50 text-gold hover:bg-gold/10 transition-colors font-semibold"
                    >
                      Hunger? ☎
                    </a>
                  </div>
                </div>
              </div>
            )}

            <p className="sr-only" aria-live="polite">
              {phase === 'running'
                ? `Spiel läuft. ${score} Punkte.`
                : phase === 'over'
                  ? `Spiel vorbei. ${score} Punkte.`
                  : 'Flappy Döner bereit. Start drücken.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
