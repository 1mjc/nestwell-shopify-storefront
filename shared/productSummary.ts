export function conciseProductSummary(description: string) {
  const clean = description.replace(/\s+/g, " ").trim();
  if (!clean) return "A thoughtfully selected Nestwell essential.";
  const narrative = clean.match(/\b(This\s+[^.?!]+[.?!]|Made\s+[^.?!]+[.?!]|Designed\s+[^.?!]+[.?!]|You\s+can(?:not|'t)\s+[^.?!]+[.?!])/i)?.index;
  const summary = narrative !== undefined ? clean.slice(narrative) : clean;
  return summary.length <= 480 ? summary : `${summary.slice(0, 477).trimEnd()}…`;
}
