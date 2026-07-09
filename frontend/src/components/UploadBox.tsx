"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { parseCSV } from "@/services/api";
import { savePreview } from "@/lib/storage";

export default function UploadBox() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setLoading(true);

      const response = await parseCSV(file);

      savePreview({
        file: {
          name: file.name,
          size: file.size,
          type: file.type,
        },
        response,
      });

      router.push("/preview");
    } catch (error) {
      console.error(error);
      alert("Failed to parse file.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border rounded p-6">
      <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} />

      {loading && <p>Uploading...</p>}
    </div>
  );
}
