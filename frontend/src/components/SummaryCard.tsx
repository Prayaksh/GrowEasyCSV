import { ParseResponse } from "@/types";

interface SummaryCardProps {
  response: ParseResponse;
}

export default function SummaryCard({ response }: SummaryCardProps) {
  const rows = response.rows.length;

  const columns = rows > 0 ? Object.keys(response.rows[0]).length : 0;

  const mappedFields = Object.keys(response.mapping).length;

  return (
    <div className="border rounded p-4">
      <h2 className="text-lg font-semibold mb-4">Summary</h2>

      <div className="space-y-2">
        <p>
          <strong>Total Rows:</strong> {rows}
        </p>

        <p>
          <strong>Total Columns:</strong> {columns}
        </p>

        <p>
          <strong>Mapped Fields:</strong> {mappedFields}
        </p>

        <p>
          <strong>Cache Hit:</strong> {response.cacheHit ? "Yes" : "No"}
        </p>
      </div>
    </div>
  );
}
