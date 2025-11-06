export function formatName(
  cityName: string,
  type: 'raw' | 'formatted' = 'raw',
): string {
  if (type === 'raw') return cityName.trim().toLowerCase().replace(/\s+/g, '');
  return cityName
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
