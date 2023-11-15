export type Medal = {
  medal_id: number;
  name: string;
  link: string;
  description: string;
  grouping: string;
  date: Date;
  pack_id: string | null;
  rarity: number;
}

export type MedalCategories = {
  [category: string]: number;
}

export type SortedMedals = {
  [key: string]: Medal[];
}