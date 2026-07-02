'use client';

import { useOrder, type OrderItem } from '@/components/order/OrderContext';

interface AddToOrderButtonProps {
  item: Omit<OrderItem, 'qty'>;
  /** 'card' = rund, schwebt über dem Bild · 'row' = klein, inline (Getränke-Tafel) */
  variant?: 'card' | 'row';
}

export default function AddToOrderButton({ item, variant = 'card' }: AddToOrderButtonProps) {
  const { add, has } = useOrder();
  const qty = has(item.id);
  const inList = qty > 0;

  const base =
    'flex items-center justify-center rounded-full border font-semibold transition-all duration-200 active:scale-90 select-none';
  const size = variant === 'card' ? 'w-9 h-9 text-lg' : 'w-7 h-7 text-sm shrink-0';
  const state = inList
    ? 'bg-accent border-accent text-white shadow-[0_0_16px_-2px_rgba(255,90,31,0.8)]'
    : 'bg-black/45 backdrop-blur-md border-white/25 text-white hover:bg-accent hover:border-accent';
  const pos = variant === 'card' ? 'absolute top-3 right-3 z-10' : '';

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        add(item);
      }}
      className={`${base} ${size} ${state} ${pos}`}
      aria-label={inList ? `${item.title} nochmal zur Bestellliste (aktuell ${qty}×)` : `${item.title} zur Bestellliste hinzufügen`}
      title="Zur Bestellliste"
    >
      {inList ? <span className="tabular-nums text-sm">{qty}</span> : '+'}
    </button>
  );
}
