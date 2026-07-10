"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { readFilePreview } from "@/services/file";
import { useUploadStore } from "@/lib/storage";

export default function UploadBox() {
  const router = useRouter();

  const setPreview = useUploadStore((state) => state.setPreview);

  const [loading, setLoading] = useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setLoading(true);

      const preview = await readFilePreview(file);

      setPreview(
        file,
        {
          name: file.name,
          size: file.size,
          type: file.type,
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

      // Allow selecting the same file again
      event.target.value = "";
    }
  }

  return (
    <div className="border rounded-lg p-6">
      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileChange}
        disabled={loading}
      />

      {loading && <p className="mt-4 text-sm text-gray-500">Reading file...</p>}
    </div>
  );
}
