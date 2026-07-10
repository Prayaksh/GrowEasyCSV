"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

  if (!fileInfo || !preview) {
    return null;
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">Preview Upload</h1>

        <p className="mt-2 text-gray-500">
          Review your uploaded file before parsing it.
        </p>
      </div>

      <FileDetails
        file={fileInfo}
        rows={preview.rows.length}
        columns={preview.headers.length}
      />

      {!result ? (
        <>
          <PreviewTable preview={preview} />

          <div className="flex justify-end">
            <ParseButton loading={loading} onClick={handleParse} />
          </div>
        </>
      ) : (
        <>
          <SummaryCard result={result} />

          <ResultTable result={result} />
        </>
      )}
    </main>
  );
}
