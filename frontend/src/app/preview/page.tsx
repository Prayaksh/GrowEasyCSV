"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getPreview } from "@/lib/storage";
import { PreviewState } from "@/types";

import FileDetails from "@/components/FileDetails";
import SummaryCard from "@/components/SummaryCard";
import PreviewTable from "@/components/PreviewTable";

export default function PreviewPage() {
  const router = useRouter();

  const [preview, setPreview] = useState<PreviewState | null>(null);

  useEffect(() => {
    const data = getPreview();

    if (!data) {
      router.replace("/upload");
      return;
    }

    setPreview(data);
  }, [router]);

  if (!preview) {
    return <div>Loading preview...</div>;
  }

  return (
    <main className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">CSV Preview</h1>

      <FileDetails file={preview.file} />

      <SummaryCard response={preview.response} />

      <PreviewTable rows={preview.response.rows} />
    </main>
  );
}
