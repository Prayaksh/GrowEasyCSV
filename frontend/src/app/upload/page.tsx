"use client";

import UploadBox from "@/components/UploadBox";

export default function UploadPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Upload File</h1>

          <p className="mt-2 text-gray-500">
            Upload a CSV or Excel file to preview and normalize it before
            importing.
          </p>
        </div>

        <UploadBox />
      </div>
    </main>
  );
}
