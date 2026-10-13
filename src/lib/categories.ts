export const categories = {
  ulam: { en: "Main dishes", tl: "Ulam" },
  sabaw: { en: "Soups and stews", tl: "Sabaw" },
  "kanin-at-pansit": { en: "Rice and noodles", tl: "Kanin at Pansit" },
  almusal: { en: "Breakfast", tl: "Almusal" },
  merienda: { en: "Snacks", tl: "Merienda" },
  panghimagas: { en: "Desserts", tl: "Panghimagas" },
  inumin: { en: "Drinks", tl: "Inumin" },
  sawsawan: { en: "Sauces and dips", tl: "Sawsawan" },
} as const;

export type CategoryKey = keyof typeof categories;

export const categoryKeys = Object.keys(categories) as CategoryKey[];

export function isCategory(value: string | undefined): value is CategoryKey {
  return value !== undefined && value in categories;
}
