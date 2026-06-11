'use client';

import { useEffect, useRef, useState } from 'react';

type Kind = 'fleisch' | 'gemuese' | 'sosse' | 'troll';

type Ingredient = {
  id: string;
  name: string;
  emoji: string;
  points: number;
  layerClass: string;
  kind: Kind;
};

const INGREDIENTS: Ingredient[] = [
  { id: 'fleisch',   name: 'Kalbfleisch',    emoji: '🥩', points: 150,  layerClass: 'layer-fleisch',   kind: 'fleisch' },
  { id: 'salat',     name: 'Salat',          emoji: '🥬', points: 80,   layerClass: 'layer-salat',     kind: 'gemuese' },
  { id: 'tomate',    name: 'Tomaten',        emoji: '🍅', points: 80,   layerClass: 'layer-tomate',    kind: 'gemuese' },
  { id: 'zwiebel',   name: 'Zwiebeln',       emoji: '🧅', points: 70,   layerClass: 'layer-zwiebel',   kind: 'gemuese' },
  { id: 'mais',      name: 'Mais',           emoji: '🌽', points: 60,   layerClass: 'layer-mais',      kind: 'gemuese' },
  { id: 'peperoni',  name: 'Peperoni',       emoji: '🌶️', points: 90,   layerClass: 'layer-peperoni',  kind: 'gemuese' },
  { id: 'knoblauch', name: 'Knoblauch-Soße', emoji: '🧄', points: 100,  layerClass: 'layer-knoblauch', kind: 'sosse' },
  { id: 'scharf',    name: 'Scharfe Soße',   emoji: '🔥', points: 100,  layerClass: 'layer-scharf',    kind: 'sosse' },
  { id: 'ananas',    name: 'Ananas',         emoji: '🍍', points: -200, layerClass: 'layer-ananas',    kind: 'troll' },
];

const byId = (id: string) => INGREDIENTS.find((i) => i.id === id)!;

const GAME_TIME = 30;
const PRAISE = ['Lecker! 😋', 'Sauber! 👌', 'Weiter so! 🔥', 'Meisterhaft! ⭐'];

function makeOrder(): string[] {
  const veggies = ['salat', 'tomate', 'zwiebel', 'mais', 'peperoni'];
  const sauces = ['knoblauch', 'scharf'];
  const n = 1 + Math.floor(Math.random() * 3);
  const shuffled = [...veggies].sort(() => Math.random() - 0.5);
  return ['fleisch', ...shuffled.slice(0, n), sauces[Math.floor(Math.random() * 2)]];
}

type Pop = { id: number; points: number };

export default function DoenerBuilder() {
  const [mode, setMode] = useState<'free' | 'rush'>('free');
  const [phase, setPhase] = useState<'idle' | 'running' | 'over'>('idle');
  const [stack, setStack] = useState<string[]>([]);
  const [pops, setPops] = useState<Pop[]>([]);
  const [order, setOrder] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [rushScore, setRushScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [highscore, setHighscore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);

  // Ref-Spiegel: schützt vor verlorenen Updates bei sehr schnellen Klicks
  const stackRef = useRef<string[]>([]);
  const popCounter = useRef(0);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    try {
      setHighscore(Number(localStorage.getItem('doener-rush-best')) || 0);
    } catch {}
    return () => clearTimeout(feedbackTimer.current);
  }, []);

  useEffect(() => {
    if (phase !== 'running') return;
    const t = setInterval(() => setTimeLeft((s) => Math.max(0, s - 0.1)), 100);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'running' || timeLeft > 0) return;
    setPhase('over');
    if (rushScore > highscore) {
      setHighscore(rushScore);
      try {
        localStorage.setItem('doener-rush-best', String(rushScore));
      } catch {}
    }
  }, [phase, timeLeft, rushScore, highscore]);

  const freeScore = stack.reduce((sum, id) => sum + byId(id).points, 0);
  const hasFleisch = stack.includes('fleisch');
  const sossen = stack.filter((id) => byId(id).kind === 'sosse').length;
  const gemuese = stack.filter((id) => byId(id).kind === 'gemuese').length;
  const isMeister = mode === 'free' && hasFleisch && sossen >= 1 && gemuese >= 3 && !stack.includes('ananas');
  const freeTotal = freeScore + (isMeister ? 500 : 0);
  const extras = stack.filter((id) => !order.includes(id)).length;

  const showFeedback = (msg: string) => {
    clearTimeout(feedbackTimer.current);
    setFeedback(msg);
    feedbackTimer.current = setTimeout(() => setFeedback(null), 1400);
  };

  const clearStack = () => {
    stackRef.current = [];
    setStack([]);
  };

  const addPop = (points: number) => {
    popCounter.current += 1;
    const id = popCounter.current; // vor dem Updater einfrieren, sonst doppelte Keys
    setPops((prev) => [...prev.slice(-2), { id, points }]);
  };

  const toggle = (ing: Ingredient) => {
    const cur = stackRef.current;
    const adding = !cur.includes(ing.id);
    const next = adding ? [...cur, ing.id] : cur.filter((id) => id !== ing.id);
    stackRef.current = next;
    setStack(next);
    if (adding && mode === 'free') addPop(ing.points);
  };

  const switchMode = (m: 'free' | 'rush') => {
    setMode(m);
    setPhase('idle');
    setPops([]);
    setFeedback(null);
    clearStack();
  };

  const startRush = () => {
    clearStack();
    setPops([]);
    setRushScore(0);
    setCombo(1);
    setTimeLeft(GAME_TIME);
    setOrder(makeOrder());
    setPhase('running');
  };

  const serve = () => {
    const cur = stackRef.current;
    const ok = cur.length === order.length && order.every((id) => cur.includes(id));
    if (ok) {
      const base = order.reduce((s, id) => s + byId(id).points, 0);
      const gained = base * combo;
      setRushScore((s) => s + gained);
      addPop(gained);
      setCombo((c) => Math.min(5, c + 1));
      setTimeLeft((t) => Math.min(GAME_TIME, t + 4));
      showFeedback(PRAISE[Math.floor(Math.random() * PRAISE.length)]);
      clearStack();
      setOrder(makeOrder());
    } else {
      setRushScore((s) => Math.max(0, s - 100));
      setCombo(1);
      setShakeKey((k) => k + 1);
      showFeedback(cur.includes('ananas') ? 'Ananas?! Niemals! 😤' : 'Falsche Bestellung! 😵');
    }
  };

  return (
    <section className="relative py-[var(--section-py)] overflow-hidden">
      <span
        className="absolute -top-10 left-0 font-display text-[clamp(10rem,28vw,24rem)] leading-none text-outline-dim select-none pointer-events-none"
        aria-hidden="true"
      >
        03
      </span>

      <div className="max-w-container mx-auto px-[var(--container-px)] relative">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">
          {/* Steuerung */}
          <div>
            <p className="text-xs tracking-[0.45em] uppercase text-accent mb-4">
              🎮 Mini-Game — Tipp dich satt
            </p>
            <h2 className="font-display text-5xl md:text-7xl text-[var(--color-text)] leading-[0.9]">
              Bau dir
              <br />
              <span className="ember-text">deinen Döner</span>
            </h2>

            {/* Modus-Tabs */}
            <div className="mt-7 flex gap-2">
              {(
                [
                  ['free', '🛠 Freies Bauen'],
                  ['rush', '⏱ Bestell-Rush'],
                ] as const
              ).map(([m, label]) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold border transition-all duration-200 ${
                    mode === m
                      ? 'border-accent bg-accent text-white'
                      : 'border-border bg-surface text-[var(--color-text-muted)] hover:border-accent/50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {mode === 'free' && (
              <p className="mt-5 text-[var(--color-text-muted)] leading-relaxed max-w-md">
                Fleisch, mindestens drei Beläge und eine Soße — dann gibt&apos;s den
                <span className="text-gold"> Döner-Meister-Bonus</span>. Aber Vorsicht
                vor der Ananas. 🍍
              </p>
            )}

            {mode === 'rush' && phase === 'idle' && (
              <div className="mt-5 border border-border rounded-2xl p-6 bg-surface max-w-md">
                <p className="text-[var(--color-text-muted)] leading-relaxed text-sm">
                  <span className="text-[var(--color-text)] font-semibold">30 Sekunden.</span> Baue
                  die Bestellungen exakt nach und serviere — jede richtige Bestellung gibt
                  <span className="text-gold"> Combo-Punkte und +4 Sekunden</span>. Falsch serviert:
                  −100 und Combo weg.
                </p>
                <button
                  type="button"
                  onClick={startRush}
                  className="mt-5 bg-accent hover:bg-accent-hover text-white px-8 py-3.5 rounded-full font-semibold heat-pulse transition-colors"
                >
                  Start ▶
                </button>
                {highscore > 0 && (
                  <p className="mt-4 text-xs tracking-[0.2em] uppercase text-[var(--color-text-dim)]">
                    🏆 Highscore: <span className="text-gold tabular-nums">{highscore}</span>
                  </p>
                )}
              </div>
            )}

            {mode === 'rush' && phase === 'running' && (
              <div className="mt-5 border border-gold/40 rounded-2xl p-5 bg-surface max-w-md">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-gold">🧾 Bestellung</p>
                  <p className="font-display text-2xl text-[var(--color-text)] tabular-nums leading-none">
                    {Math.ceil(timeLeft)}s
                  </p>
                </div>
                {/* Timer-Balken */}
                <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden" aria-hidden="true">
                  <div
                    className={`h-full rounded-full transition-[width] duration-100 ${
                      timeLeft < 8 ? 'bg-ember' : 'bg-gradient-to-r from-gold to-accent'
                    }`}
                    style={{ width: `${(timeLeft / GAME_TIME) * 100}%` }}
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {order.map((id) => {
                    const ing = byId(id);
                    const done = stack.includes(id);
                    return (
                      <span
                        key={id}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
                          done
                            ? 'border-gold/60 bg-gold/15 text-gold'
                            : 'border-border text-[var(--color-text-muted)]'
                        }`}
                      >
                        <span aria-hidden="true">{ing.emoji}</span> {ing.name} {done && '✓'}
                      </span>
                    );
                  })}
                </div>
                {extras > 0 && (
                  <p className="text-xs text-[#ff8a8a] mt-3">⚠️ {extras} Zutat{extras > 1 ? 'en' : ''} zu viel drauf!</p>
                )}
                <div className="mt-4 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={serve}
                    className="bg-gold hover:bg-accent text-black hover:text-white px-7 py-3 rounded-full font-bold transition-colors"
                  >
                    Servieren 🛎️
                  </button>
                  {combo > 1 && (
                    <span key={combo} className="achievement-in font-display text-2xl text-accent">
                      Combo ×{combo} 🔥
                    </span>
                  )}
                </div>
              </div>
            )}

            {mode === 'rush' && phase === 'over' && (
              <div className="achievement-in mt-5 border border-gold/50 rounded-2xl p-6 bg-gold/10 max-w-md">
                <p className="text-[10px] tracking-[0.35em] uppercase text-gold">⏱ Zeit um!</p>
                <p className="font-display text-6xl text-[var(--color-text)] mt-3 leading-none tabular-nums">
                  {rushScore} <span className="text-2xl text-[var(--color-text-muted)]">Punkte</span>
                </p>
                <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                  {rushScore >= highscore && rushScore > 0
                    ? '🏆 Neuer Highscore! Der Spieß verneigt sich.'
                    : `Highscore: ${highscore} — das geht besser!`}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={startRush}
                    className="bg-accent hover:bg-accent-hover text-white px-7 py-3 rounded-full font-semibold transition-colors"
                  >
                    Nochmal ▶
                  </button>
                  <a
                    href="tel:06451240925"
                    className="px-6 py-3 rounded-full border border-gold/50 text-gold hover:bg-gold/10 transition-colors font-semibold"
                  >
                    Verdient — jetzt in echt ☎
                  </a>
                </div>
              </div>
            )}

            {/* Zutaten-Chips */}
            {(mode === 'free' || phase === 'running') && (
              <div className="mt-7 flex flex-wrap gap-3">
                {INGREDIENTS.map((ing) => {
                  const active = stack.includes(ing.id);
                  const troll = ing.kind === 'troll';
                  return (
                    <button
                      key={ing.id}
                      type="button"
                      onClick={() => toggle(ing)}
                      aria-pressed={active}
                      className={`group flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 active:scale-90 ${
                        active
                          ? troll
                            ? 'border-ember bg-ember/20 text-[var(--color-text)]'
                            : 'border-accent bg-accent/15 text-[var(--color-text)] shadow-[0_0_22px_-6px_rgba(255,90,31,0.7)]'
                          : 'border-border bg-surface text-[var(--color-text-muted)] hover:border-accent/50 hover:text-[var(--color-text)]'
                      }`}
                    >
                      <span className="text-lg leading-none" aria-hidden="true">{ing.emoji}</span>
                      {ing.name}
                      {mode === 'free' && (
                        <span className={`text-[10px] tabular-nums ${active ? 'text-gold' : 'text-[var(--color-text-dim)]'}`}>
                          {active ? '✓' : `${ing.points > 0 ? '+' : ''}${ing.points}`}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {mode === 'free' && (
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="tel:06451240925"
                  className={`bg-accent hover:bg-accent-hover text-white px-8 py-4 rounded-full font-semibold transition-colors ${
                    isMeister ? 'heat-pulse' : ''
                  }`}
                >
                  Jetzt in echt holen ☎
                </a>
                {stack.length > 0 && (
                  <button
                    type="button"
                    onClick={clearStack}
                    className="px-6 py-4 rounded-full border border-white/15 hover:border-gold/60 hover:bg-white/5 transition-colors text-[var(--color-text)]"
                  >
                    Neu starten ↺
                  </button>
                )}
              </div>
            )}

            {isMeister && (
              <div className="achievement-in mt-7 inline-flex items-center gap-4 border border-gold/50 bg-gold/10 rounded-2xl px-5 py-4">
                <span className="text-3xl" aria-hidden="true">🏆</span>
                <div>
                  <p className="font-display text-xl text-gold leading-tight">Döner-Meister freigeschaltet!</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">+500 Bonus — so isst man in Frankenberg.</p>
                </div>
              </div>
            )}
          </div>

          {/* Bühne */}
          <div key={shakeKey} className={`relative flex flex-col items-center ${shakeKey > 0 ? 'builder-shake' : ''}`}>
            {/* Score */}
            <div className="absolute top-0 right-0 text-right select-none">
              <p className="text-[10px] tracking-[0.35em] uppercase text-[var(--color-text-dim)]">Score</p>
              <p className="font-display text-5xl text-gold tabular-nums leading-none mt-1">
                {mode === 'rush' ? rushScore : freeTotal}
              </p>
              {mode === 'rush' && highscore > 0 && (
                <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-dim)] mt-1.5">
                  Best: <span className="text-gold tabular-nums">{highscore}</span>
                </p>
              )}
              {isMeister && (
                <p className="text-[10px] tracking-[0.2em] uppercase text-accent mt-1.5">inkl. +500 Bonus</p>
              )}
            </div>

            {/* Feedback */}
            {feedback && (
              <p
                key={feedback}
                className="achievement-in absolute left-1/2 -translate-x-1/2 top-2 font-display text-2xl text-[var(--color-text)] whitespace-nowrap z-10"
                aria-hidden="true"
              >
                {feedback}
              </p>
            )}

            {/* Punkte-Popups */}
            {pops.map((p) => (
              <span
                key={p.id}
                className="point-pop absolute left-1/2 top-16 font-display text-4xl text-gold z-10"
                aria-hidden="true"
              >
                +{p.points}
              </span>
            ))}

            <div className="min-h-[340px] w-[240px] md:w-[300px] flex flex-col justify-end items-stretch pt-20">
              {stack.length === 0 && (
                <p className="text-center text-sm text-[var(--color-text-dim)] mb-6 animate-bounce-slow" aria-hidden="true">
                  Tippe auf die Zutaten 👇
                </p>
              )}
              <div key={`top-${stack.length}`} className="builder-bread-top builder-drop" aria-hidden="true" />
              <div className="flex flex-col-reverse items-center gap-[3px] py-[3px]" aria-hidden="true">
                {stack.map((id, i) => (
                  <div
                    key={id}
                    className={`builder-layer builder-drop ${byId(id).layerClass}`}
                    style={{ width: `${96 - (i % 3) * 5}%` }}
                  />
                ))}
              </div>
              <div className="builder-bread-bottom" aria-hidden="true" />
              {/* Schatten */}
              <div className="mx-auto mt-5 h-3 w-3/4 rounded-[50%] bg-black/60 blur-md" aria-hidden="true" />
            </div>

            <p className="sr-only" aria-live="polite">
              {mode === 'rush'
                ? phase === 'running'
                  ? `Bestell-Rush läuft. ${Math.ceil(timeLeft)} Sekunden übrig. ${rushScore} Punkte. Bestellung: ${order.map((id) => byId(id).name).join(', ')}.`
                  : phase === 'over'
                    ? `Spiel vorbei. ${rushScore} Punkte.`
                    : 'Bestell-Rush bereit.'
                : stack.length === 0
                  ? 'Noch keine Zutaten gewählt.'
                  : `Dein Döner: ${stack.map((id) => byId(id).name).join(', ')}. ${freeTotal} Punkte.${isMeister ? ' Döner-Meister freigeschaltet!' : ''}`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
