"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

import { readFilePreview } from "@/services/file";
import { useUploadStore } from "@/lib/storage";

export default function UploadBox() {
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const setPreview = useUploadStore((state) => state.setPreview);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
  }

  async function handleUpload() {
    if (!selectedFile) return;

    try {
      setLoading(true);

      const preview = await readFilePreview(selectedFile);

      setPreview(
        selectedFile,
        {
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
        },
        preview,
      );

      router.push("/preview");
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to read the selected file.",
      );
    } finally {
      setLoading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function handleCancel() {
    setSelectedFile(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
      {/* Upload Area */}

      <label
        htmlFor="upload-file"
        className="
          flex cursor-pointer flex-col items-center
          px-8 py-16 text-center
          transition-colors
          hover:bg-primary/5
        "
      >
        {/* Replace with your asset */}
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10">
          <Upload className="h-12 w-12 text-primary" />
        </div>

        <h2 className="text-2xl font-semibold">Drop your file here</h2>

        <p className="mt-2 text-muted-foreground">or click to browse files</p>

        <div className="mt-6 rounded-full border bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          Supports .csv and .xlsx files
        </div>

        {selectedFile && (
          <div className="mt-8 rounded-xl border bg-muted/40 px-4 py-3">
            <p className="font-medium">{selectedFile.name}</p>

            <p className="mt-1 text-sm text-muted-foreground">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}
      </label>

      <input
        ref={inputRef}
        id="upload-file"
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        onChange={handleFileChange}
        disabled={loading}
      />

      {/* Footer */}

      <div className="flex flex-col-reverse gap-3 border-t px-6 py-5 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={loading && !selectedFile}
        >
          Cancel
        </Button>

        <Button onClick={handleUpload} disabled={!selectedFile || loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Upload file"
          )}
        </Button>
      </div>
    </div>
  );
}
