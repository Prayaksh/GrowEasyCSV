import { ParseResponse } from "@/types";

interface ResultTableProps {
  result: ParseResponse;
}

export default function ResultTable({ result }: ResultTableProps) {
  if (result.rows.length === 0) {
    return (
      <div className="rounded-lg border p-6 text-center text-gray-500">
        No parsed rows returned.
      </div>
    );
  }

  const columns = Object.keys(result.rows[0]);

  return (
    <div className="rounded-lg border">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold">Parsed Data</h2>

        <p className="mt-1 text-sm text-gray-500">
          Preview of the normalized data returned by the parser.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="border-b px-4 py-3 text-left text-sm font-medium"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {result.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column} className="border-b px-4 py-2 text-sm">
                    {String(row[column] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
