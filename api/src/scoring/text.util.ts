// Greenhouse (and most ATS) return descriptions as HTML, often entity-encoded
// (e.g. "&lt;p&gt;Hello&lt;/p&gt;"). Signals want clean plain text, so we decode
// entities, strip tags, and normalize whitespace.
const ENTITIES: Record<string, string> = {
  '&lt;': '<',
  '&gt;': '>',
  '&amp;': '&',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
};

function decodeEntities(input: string): string {
  let out = input.replace(/&[a-zA-Z]+;|&#\d+;/g, (match) => {
    if (ENTITIES[match]) return ENTITIES[match];
    const numeric = /^&#(\d+);$/.exec(match);
    return numeric ? String.fromCharCode(Number(numeric[1])) : match;
  });
  // Content can be double-encoded; a second pass resolves the inner layer.
  out = out.replace(/&[a-zA-Z]+;|&#\d+;/g, (match) => ENTITIES[match] ?? match);
  return out;
}

export function htmlToText(input?: string | null): string {
  if (!input) return '';
  const decoded = decodeEntities(input);
  const withoutTags = decoded.replace(/<[^>]+>/g, ' ');
  return withoutTags.replace(/\s+/g, ' ').trim();
}

export function wordCount(text: string): number {
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}
