export function resolveImageUrl(path: string | null | undefined, apiUrl: string): string {
  if (!path) return "";
  return path.startsWith("http") ? path : `${apiUrl}${path}`;
}