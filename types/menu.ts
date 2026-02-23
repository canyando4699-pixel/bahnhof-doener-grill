export interface MultiPriceItem {
  id: string;
  nr: number;
  name: string;
  description: string;
  prices: { klein: string; groß: string };
  badges: string[];
}

export interface SinglePriceItem {
  id: string;
  nr: number;
  name: string;
  description: string;
  price: string;
  badges: string[];
}

export type MenuItem = MultiPriceItem | SinglePriceItem;

export function isMultiPrice(item: MenuItem): item is MultiPriceItem {
  return 'prices' in item;
}
