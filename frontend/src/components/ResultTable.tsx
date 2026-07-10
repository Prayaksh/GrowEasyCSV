import { ParseResponse } from "@/types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ResultTableProps {
  result: ParseResponse;
}

export default function ResultTable({ result }: ResultTableProps) {
  if (!result.rows.length) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed bg-muted/20">
        <div className="text-center">
          <p className="font-medium">No parsed rows found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            The parser didn't return any normalized records.
          </p>
        </div>
      </div>
    );
  }

  const columns = Object.keys(result.rows[0]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md text-slate-900">
      <div className="border-b border-slate-200 bg-linear-to-r from-slate-50/50 to-white px-6 py-5">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Parsed Data
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Preview of the normalized data returned by the parser.
        </p>
      </div>

      <div className="max-h-125 overflow-auto">
        <Table className="min-w-max">
          <TableHeader className="sticky top-0 z-20 shadow-[0_1px_0_0_rgba(226,232,240,1)]">
            <TableRow className="border-none hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column}
                  className="whitespace-nowrap bg-slate-100 px-5 py-4 text-sm font-bold uppercase tracking-wider text-slate-700"
                >
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {result.rows.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="border-b border-slate-100 last:border-0 odd:bg-slate-50/40 transition-all duration-150 hover:bg-indigo-50/60"
              >
                {columns.map((column) => (
                  <TableCell
                    key={column}
                    className="whitespace-nowrap px-5 py-3.5 align-top font-mono text-sm text-slate-600 transition-colors duration-150"
                  >
                    {String(row[column] ?? "")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-600 flex items-center gap-2">
        <span>Showing</span>
        <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-100">
          {result.rows.length} records
        </span>
        <span className="text-slate-400">·</span>
        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200">
          {columns.length} fields
        </span>
        <span className="text-slate-500">normalized</span>
      </div>
    </div>
  );
}
