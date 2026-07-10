export interface FileInfo {
  name: string;
  size: number;
  type: string;
}

export interface LocalPreview {
  headers: string[];
  rows: Record<string, unknown>[];
}

export interface ParseResponse {
  success: boolean;
  mapping: Record<string, string>;
  rows: Record<string, unknown>[];
  cacheHit: boolean;
}

export interface ImportResponse {
  success: boolean;
  inserted: number;
  failed: number;
  duplicates: number;
  errors?: {
    row: number;
    message: string;
  }[];
}
