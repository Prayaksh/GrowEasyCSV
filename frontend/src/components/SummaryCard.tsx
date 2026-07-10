import { ParseResponse } from "@/types";

interface SummaryCardProps {
  result: ParseResponse;
}

export default function SummaryCard({ result }: SummaryCardProps) {
  const totalRows = result.rows.length;
  const mappedFields = Object.keys(result.mapping).length;

  return (
    <div className="rounded-lg border p-6">
      <h2 className="mb-4 text-lg font-semibold">Parse Summary</h2>

      <dl className="grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-gray-500">Processed Rows</dt>
          <dd className="font-medium">{totalRows}</dd>
        </div>

        <div>
          <dt className="text-sm text-gray-500">Mapped Fields</dt>
          <dd className="font-medium">{mappedFields}</dd>
        </div>

        <div>
          <dt className="text-sm text-gray-500">Cache</dt>
          <dd className="font-medium">{result.cacheHit ? "Hit" : "Miss"}</dd>
        </div>

        <div>
          <dt className="text-sm text-gray-500">Status</dt>
          <dd className="font-medium">
            {result.success ? "Success" : "Failed"}
          </dd>
        </div>
      </dl>
    </div>
  );
}
