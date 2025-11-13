export function formatName(
  city_name: string,
  type: 'raw' | 'formatted' = 'raw',
): string {
  if (type === 'raw') return city_name.trim().toLowerCase().replace(/\s+/g, '');
  return city_name
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
