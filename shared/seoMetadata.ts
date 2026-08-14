export function buildSeoMetadata(title: string, description: string, path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return {
    title: title.replace(/\s+/g, " ").trim(),
    description: description.replace(/\s+/g, " ").trim().slice(0, 160),
    canonicalPath: normalizedPath,
  };
}
