// The search of the home page. The browser runs it, so it imports no recipe data.

export interface SearchEntry {
  slug: string;
  category: string;
  tags: string[];
  /** Every searchable text of the recipe in both languages, in lowercase. */
  text: string;
}

/** The slugs of the recipes that match the query, the category and the tag. */
export function search(
  index: readonly SearchEntry[],
  query: string,
  category: string | null,
  tag: string | null,
): string[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const slugs: string[] = [];
  for (const entry of index) {
    if (category && entry.category !== category) continue;
    if (tag && !entry.tags.includes(tag)) continue;
    if (words.every((word) => entry.text.includes(word))) slugs.push(entry.slug);
  }
  return slugs;
}
