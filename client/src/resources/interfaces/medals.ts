export interface Medal {
  MedalID: string;
  Name: string;
  Link: string;
  Description: string;
  Grouping: string;
  Date: string;
  PackID?: string | null;
  Rarity: string;
}

export interface MedalCategories {
  [category: string]: number;
}

export interface SortedMedals {
  [key: string]: Medal[];
}