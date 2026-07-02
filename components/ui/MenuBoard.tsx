import Reveal from '@/components/ui/Reveal';
import AddToOrderButton from '@/components/order/AddToOrderButton';

interface BoardItem {
  id: string;
  title: string;
  description?: string;
  price?: string;
}

/**
 * Getränke-Tafel: bildlose Preisliste mit Punkt-Leader.
 * Bewusst anderes Layout als die Bild-Karten → Abwechslung im Menü.
 */
export default function MenuBoard({ items }: { items: BoardItem[] }) {
  return (
    <div className="rounded-3xl border border-border bg-surface/60 p-6 md:p-10">
      <ul className="grid gap-x-12 gap-y-1 sm:grid-cols-2">
        {items.map((item, i) => (
          <Reveal key={item.id} index={i} step={45}>
            <li className="group flex items-center gap-3 py-3 border-b border-border/50">
              <span className="text-[var(--color-text)] font-medium group-hover:text-gold transition-colors duration-200 shrink-0">
                {item.title}
                {item.description && (
                  <span className="text-[var(--color-text-dim)] font-normal text-sm ml-2">
                    {item.description}
                  </span>
                )}
              </span>
              <span
                className="flex-1 border-b border-dotted border-border/70"
                aria-hidden="true"
              />
              <span className="ember-text font-display text-lg tabular-nums shrink-0">
                {item.price}
              </span>
              <AddToOrderButton
                item={{ id: item.id, title: item.title, description: item.description, price: item.price }}
                variant="row"
              />
            </li>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
