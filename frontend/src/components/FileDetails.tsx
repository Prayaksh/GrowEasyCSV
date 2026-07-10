import { FileInfo } from "@/types";

interface FileDetailsProps {
  file: FileInfo;
  rows: number;
  columns: number;
}

export default function FileDetails({ file, rows, columns }: FileDetailsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-slate-900">
      <div className="border-b border-slate-100 pb-4 mb-5">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          File Details
        </h2>
      </div>

      <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all duration-200 hover:border-indigo-100 hover:bg-indigo-50/10">
          <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Filename
          </dt>
          <dd className="mt-1.5 font-semibold text-slate-800 break-all">
            {file.name}
          </dd>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all duration-200 hover:border-indigo-100 hover:bg-indigo-50/10">
          <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">
            File Size
          </dt>
          <dd className="mt-1.5 font-semibold text-slate-800">
            {(file.size / 1024).toFixed(2)} KB
          </dd>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all duration-200 hover:border-indigo-100 hover:bg-indigo-50/10">
          <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">
            File Type
          </dt>
          <dd className="mt-1.5">
            <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200">
              {file.type || "Unknown"}
            </span>
          </dd>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all duration-200 hover:border-indigo-100 hover:bg-indigo-50/10">
          <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Columns
          </dt>
          <dd className="mt-1.5 font-mono text-base font-bold text-indigo-600">
            {columns}
          </dd>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all duration-200 hover:border-indigo-100 hover:bg-indigo-50/10">
          <dt className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Preview Rows
          </dt>
          <dd className="mt-1.5 font-mono text-base font-bold text-indigo-600">
            {rows}
          </dd>
        </div>
      </dl>
    </div>
  );
}
