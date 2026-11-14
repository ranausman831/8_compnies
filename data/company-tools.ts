export type ToolUrls = Record<string, string>;

const getKey = (companyId: number) => `digital-marketing-hub-tools-${companyId}`;

/** Accepts "calendly.com/name" or "https://..." and returns a clean https URL, or null if invalid. */
export function normalizeHttpsUrl(input: string): string | null {
  const value = input.trim();
  if (!value) return null;

  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    if (url.protocol !== 'https:') return null;
    if (!url.hostname.includes('.')) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function getToolUrls(companyId: number): ToolUrls {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(getKey(companyId));
    if (!raw) return {};

    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};

    // Re-validate on read so a tampered value can never become an iframe/link target.
    const clean: ToolUrls = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof value !== 'string') continue;
      const normalized = normalizeHttpsUrl(value);
      if (normalized) clean[key] = normalized;
    }
    return clean;
  } catch {
    return {};
  }
}

/** Saves (or removes, when url is null) one tool link for a company and returns the updated map. */
export function saveToolUrl(companyId: number, toolKey: string, url: string | null): ToolUrls {
  const next = { ...getToolUrls(companyId) };

  if (url) next[toolKey] = url;
  else delete next[toolKey];

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(getKey(companyId), JSON.stringify(next));
  }
  return next;
}
