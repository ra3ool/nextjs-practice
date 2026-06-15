function createSlug(name: string): string {
  if (!name || typeof name !== 'string') return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-word characters
    .replace(/\s+/g, '-') // replace spaces with -
    .replace(/-+/g, '-'); // collapse multiple -
}

export { createSlug };
