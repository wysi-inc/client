export type Medal = {
  medal_id: number;
  name: string;
  link: string;
  description: string;
  date: Date;
  rarity: number;
}

export type MedalCategories = {category: String, medals: Medal[]}; 