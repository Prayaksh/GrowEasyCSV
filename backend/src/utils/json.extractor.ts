export function extractJSONObject(text: string): unknown | null {
  const firstBrace = text.indexOf("{");
  const firstBracket = text.indexOf("[");

  if (firstBrace === -1 && firstBracket === -1) {
    return null;
  }

  const objectFirst =
    firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket);

  const open = objectFirst ? "{" : "[";
  const close = objectFirst ? "}" : "]";

  const start = objectFirst ? firstBrace : firstBracket;

  let depth = 0;

  for (let i = start; i < text.length; i++) {
    if (text[i] === open) depth++;
    if (text[i] === close) depth--;

    if (depth === 0) {
      try {
        const parsed = JSON.parse(text.slice(start, i + 1));

        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          return parsed;
        }

        if (Array.isArray(parsed)) {
          return {
            mappings: parsed,
          };
        }

        return null;
      } catch {
        return null;
      }
    }
  }

  return null;
}
