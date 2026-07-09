interface PreviewTableProps {
  rows: Record<string, any>[];
}

export default function PreviewTable({ rows }: PreviewTableProps) {
  if (rows.length === 0) {
    return <div className="border rounded p-4">No preview available.</div>;
  }

  const columns = Object.keys(rows[0]);

  return (
    <div className="border rounded p-4 overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} className="border px-3 py-2 text-left">
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column} className="border px-3 py-2">
                  {String(row[column] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
