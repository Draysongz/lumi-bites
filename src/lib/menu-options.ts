export type SideOption = {
  id: string;
  name: string;
  description: string;
  priceKobo: number;
};

export type SpiceOption = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export const SPICE_OPTIONS: SpiceOption[] = [
  { id: "mild", name: "Mild Pepper", description: "Gentle warmth", icon: "sentiment_satisfied" },
  { id: "lumis-hot", name: "Lumi's Hot", description: "Chef signature", icon: "local_fire_department" },
  { id: "extra-fiery", name: "Extra Fiery", description: "Heavy ata rodo", icon: "whatshot" },
];

export const SIDE_OPTIONS: SideOption[] = [
  { id: "dodo", name: "Extra Sweet Fried Plantain (Dodo)", description: "Caramelized golden slices", priceKobo: 120000 },
  { id: "jollof", name: "Portion of Smokey Jollof Rice", description: "Firewood spiced party rice bowl", priceKobo: 200000 },
  { id: "pepper-dip", name: "Extra Scotch Bonnet Pepper Dip", description: "2oz pepper sauce cup", priceKobo: 70000 },
];
