import { FileInfo } from "@/types";

interface FileDetailsProps {
  file: FileInfo;
  rows: number;
  columns: number;
}

export default function FileDetails({ file, rows, columns }: FileDetailsProps) {
  return (
    <div className="rounded-lg border p-6">
      <h2 className="mb-4 text-lg font-semibold">File Details</h2>

      <dl className="grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-gray-500">Filename</dt>
          <dd className="font-medium">{file.name}</dd>
        </div>

        <div>
          <dt className="text-sm text-gray-500">File Size</dt>
          <dd className="font-medium">{(file.size / 1024).toFixed(2)} KB</dd>
        </div>

        <div>
          <dt className="text-sm text-gray-500">File Type</dt>
          <dd className="font-medium">{file.type || "Unknown"}</dd>
        </div>

        <div>
          <dt className="text-sm text-gray-500">Columns</dt>
          <dd className="font-medium">{columns}</dd>
        </div>

        <div>
          <dt className="text-sm text-gray-500">Preview Rows</dt>
          <dd className="font-medium">{rows}</dd>
        </div>
      </dl>
    </div>
  );
}
