"use client";

import { create } from "zustand";
import { ParseResponse } from "@/types";

export interface UploadFileInfo {
  name: string;
  size: number;
  type: string;
}

export interface LocalPreview {
  headers: string[];
  rows: Record<string, unknown>[];
}

interface UploadStore {
  file: File | null;

  fileInfo: UploadFileInfo | null;

  preview: LocalPreview | null;

  result: ParseResponse | null;

  setPreview: (
    file: File,
    fileInfo: UploadFileInfo,
    preview: LocalPreview,
  ) => void;

  setResult: (result: ParseResponse) => void;

  clear: () => void;
}

const initialState = {
  file: null,
  fileInfo: null,
  preview: null,
  result: null,
};

export const useUploadStore = create<UploadStore>((set) => ({
  ...initialState,

  setPreview: (file, fileInfo, preview) =>
    set({
      file,
      fileInfo,
      preview,
      result: null,
    }),

  setResult: (result) =>
    set({
      result,
    }),

  clear: () => set(initialState),
}));
