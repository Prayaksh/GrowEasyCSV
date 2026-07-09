export interface PreviewResponse {
  uploadId: string;
  file: {
    name: string;
    rows: number;
    columns: number;
    size: number;
  };
  columns: string[];
  preview: Record<string, any>[];
  mapping: Record<string, string>;
  summary: {
    matched: number;
    unmatched: number;
  };
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
export interface ParseResponse {
  success: boolean;
  mapping: Record<string, string>;
  rows: Record<string, any>[];
  cacheHit: boolean;
}

export interface PreviewState {
  file: {
    name: string;
    size: number;
    type: string;
  };

  response: ParseResponse;
}
