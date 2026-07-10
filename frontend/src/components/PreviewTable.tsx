import { LocalPreview } from "@/types";

interface PreviewTableProps {
  preview: LocalPreview;
}

export default function PreviewTable({ preview }: PreviewTableProps) {
  const { headers, rows } = preview;

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border p-4 text-center text-gray-500">
        No preview available.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="border-b px-4 py-3 text-left text-sm font-medium"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {headers.map((header) => (
                <td key={header} className="border-b px-4 py-2 text-sm">
                  {String(row[header] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
