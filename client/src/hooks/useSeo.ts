import { useEffect } from "react";
import { buildSeoMetadata } from "@shared/seoMetadata";

export function useSeo(title: string, description: string, path: string) {
  useEffect(() => {
    const metadata = buildSeoMetadata(title, description, path);
    document.title = metadata.title;
    let descriptionTag = document.querySelector('meta[name="description"]');
    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.setAttribute("name", "description");
      document.head.appendChild(descriptionTag);
    }
    descriptionTag.setAttribute("content", metadata.description);
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}${metadata.canonicalPath}`;
  }, [description, path, title]);
}
