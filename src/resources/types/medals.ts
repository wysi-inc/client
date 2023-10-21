export type Medal = {
  MedalID: string;
  Name: string;
  Link: string;
  Description: string;
  Grouping: string;
  Date: string;
  PackID?: string | null;
  Rarity: string;
}

export type MedalCategories = {
  [category: string]: number;
}

export type SortedMedals = {
  [key: string]: Medal[];
}