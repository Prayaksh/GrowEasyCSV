import { PreviewState } from "@/types";

const STORAGE_KEY = "csv-preview";

export function savePreview(data: PreviewState) {
  if (typeof window === "undefined") return;

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getPreview(): PreviewState | null {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem(STORAGE_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw) as PreviewState;
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearPreview() {
  if (typeof window === "undefined") return;

  sessionStorage.removeItem(STORAGE_KEY);
}
