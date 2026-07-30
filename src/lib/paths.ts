const baseUrl = import.meta.env.BASE_URL;

export function withBase(path: string): string {
  const cleanPath = path.replace(/^\/+/, '');
  return `${baseUrl}${cleanPath}`;
}
