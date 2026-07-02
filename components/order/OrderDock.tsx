'use client';

import { useEffect, useState } from 'react';
import { useOrder, parsePrice } from '@/components/order/OrderContext';

/**
 * Schwebender Bestelllisten-Button (unten rechts) + Slide-in-Panel.
 * Merkliste fürs Bestellen am Tresen/Telefon — kein Online-Checkout.
 */
export default function OrderDock() {
  const { items, count, add, dec, remove, clear } = useOrder();
  const [open, setOpen] = useState(false);

  /* ESC schließt das Panel */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const hasAb = items.some((i) => i.prices);
  const total = items.reduce(
    (sum, i) => sum + parsePrice(i.prices ? i.prices.klein : i.price ?? '0') * i.qty,
    0,
  );
  const totalLabel = `${hasAb ? 'ab ' : ''}${total.toFixed(2).replace('.', ',')} €`;

  return (
    <>
      {/* ── Floating Button ─────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-[60] flex items-center gap-2.5 rounded-full px-5 py-3.5 font-semibold text-white bg-accent hover:bg-accent-hover transition-colors shadow-[0_10px_40px_-8px_rgba(255,90,31,0.7)] ${
          count > 0 ? 'heat-pulse' : ''
        }`}
        aria-label={`Bestellliste öffnen (${count} ${count === 1 ? 'Gericht' : 'Gerichte'})`}
        aria-expanded={open}
      >
        <span aria-hidden="true">🧾</span>
        <span className="hidden sm:inline">Bestellliste</span>
        <span className="min-w-6 h-6 px-1.5 rounded-full bg-black/30 flex items-center justify-center text-sm tabular-nums">
          {count}
        </span>
      </button>

      {/* ── Backdrop ────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-[65] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* ── Panel ───────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 right-0 z-[70] w-full sm:w-[26rem] bg-[#0d0a08] border-l border-border flex flex-col transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Bestellliste"
        aria-hidden={!open}
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-display text-3xl text-[var(--color-text)]">
              🧾 Bestell<span className="ember-text">liste</span>
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-9 h-9 rounded-full border border-border text-[var(--color-text-muted)] hover:text-white hover:border-accent transition-colors"
              aria-label="Bestellliste schließen"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-[var(--color-text-muted)] mt-2 leading-relaxed">
            🔥 Deine Hunger-Liste — damit du beim Bestellen nichts vergisst.
          </p>
        </div>

        {/* Liste */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-8 gap-3">
              <span className="text-5xl animate-float" aria-hidden="true">🥙</span>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                Noch nichts drauf — tippe das <span className="text-accent font-bold">+</span> auf
                einem Gericht und sammle deinen Hunger ein!
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-surface border border-border rounded-2xl p-3.5"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--color-text)] text-sm truncate">
                    {item.title}
                  </p>
                  {item.description && (
                    <p className="text-xs text-[var(--color-text-dim)] truncate mt-0.5">
                      {item.description}
                    </p>
                  )}
                  <p className="ember-text font-display text-base mt-1 tabular-nums">
                    {item.prices ? `kl. ${item.prices.klein} · gr. ${item.prices.groß}` : item.price}
                  </p>
                </div>

                {/* Menge − / + */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => dec(item.id)}
                    className="w-7 h-7 rounded-full border border-border text-[var(--color-text-muted)] hover:border-accent hover:text-white transition-colors"
                    aria-label={`${item.title}: eins weniger`}
                  >
                    −
                  </button>
                  <span className="w-6 text-center tabular-nums text-sm font-semibold text-[var(--color-text)]">
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      add({ id: item.id, title: item.title, description: item.description, price: item.price, prices: item.prices })
                    }
                    className="w-7 h-7 rounded-full border border-border text-[var(--color-text-muted)] hover:border-accent hover:text-white transition-colors"
                    aria-label={`${item.title}: eins mehr`}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="w-7 h-7 rounded-full text-[var(--color-text-dim)] hover:text-ember transition-colors ml-1"
                    aria-label={`${item.title} von der Liste entfernen`}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border space-y-4">
            <div className="flex items-end justify-between">
              <span className="text-sm text-[var(--color-text-muted)]">
                Summe ({count} {count === 1 ? 'Gericht' : 'Gerichte'})
              </span>
              <span className="font-display text-3xl ember-text tabular-nums">{totalLabel}</span>
            </div>
            {hasAb && (
              <p className="text-[11px] text-[var(--color-text-dim)] leading-relaxed">
                Bei Gerichten mit zwei Größen ist der Preis für „klein" gerechnet.
              </p>
            )}
            <a
              href="tel:06451240925"
              className="block text-center bg-accent hover:bg-accent-hover text-white rounded-full px-6 py-3.5 font-semibold transition-colors"
            >
              ☎ Bestellung durchgeben — 06451 240925
            </a>
            <button
              type="button"
              onClick={clear}
              className="block w-full text-center text-xs tracking-[0.2em] uppercase text-[var(--color-text-dim)] hover:text-ember transition-colors"
            >
              Liste leeren
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
