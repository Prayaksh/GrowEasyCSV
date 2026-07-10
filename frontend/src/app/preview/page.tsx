"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { parseCSV } from "@/services/api";
import { useUploadStore } from "@/lib/storage";

import FileDetails from "@/components/FileDetails";
import ParseButton from "@/components/ParseButton";
import PreviewTable from "@/components/PreviewTable";

import ResultTable from "@/components/ResultTable";
import SummaryCard from "@/components/SummaryCard";

export default function PreviewPage() {
  const router = useRouter();

  const { file, fileInfo, preview, result, setResult } = useUploadStore();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file || !fileInfo || !preview) {
      router.replace("/upload");
    }
  }, [file, fileInfo, preview, router]);

  async function handleParse() {
    if (!file) return;

    try {
      setLoading(true);

      const response = await parseCSV(file);

      setResult(response);
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : "Failed to parse file.");
    } finally {
      setLoading(false);
    }
  }

  if (!fileInfo || !preview) return null;

  return (
    <main className="min-h-screen bg-zinc-50 p-4 md:p-8 text-zinc-900">
      <div className="mx-auto flex max-h-[92vh] max-w-7xl flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl">
        <div className="flex flex-col gap-4 border-b border-zinc-100 px-6 py-6 sm:flex-row sm:items-start sm:justify-between md:px-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Import leads
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Upload CSV/XLSX file to bulk import leads into your system.
            </p>
          </div>

          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-all duration-200 hover:bg-zinc-100 hover:text-zinc-900 hover:border-zinc-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-hidden p-6 md:p-8">
          <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600">
                {/* You can drop your FileSpreadsheet or Table icon component here safely */}
              </div>

              <div>
                <p className="font-semibold text-zinc-900">{fileInfo.name}</p>
                <p className="text-sm text-zinc-500">
                  {(fileInfo.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <button className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition-all duration-200 hover:bg-zinc-100 hover:text-zinc-600">
              <X className="h-4 w-4" />
            </button>
          </div>

          {!result ? (
            <>
              <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
                <div className="max-h-115 overflow-auto">
                  <PreviewTable preview={preview} />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-zinc-100 pt-6 sm:flex-row sm:justify-end">
                <button className="w-full rounded-xl border border-zinc-200 bg-white px-6 py-2.5 font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-100 hover:text-zinc-900 sm:w-auto">
                  Cancel
                </button>

                <ParseButton loading={loading} onClick={handleParse} />
              </div>
            </>
          ) : (
            <>
              <SummaryCard result={result} />

              <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
                <div className="max-h-115 overflow-auto">
                  <ResultTable result={result} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
