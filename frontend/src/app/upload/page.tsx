"use client";

import UploadBox from "@/components/UploadBox";

export default function UploadPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 md:p-12 bg-linear-to-b from-slate-50 to-white text-slate-900">
      <div className="w-full max-w-3xl space-y-8 rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-100/50">
        <div className="border-b border-slate-100 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight  bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Upload File
          </h1>

          <p className="mt-2.5 text-base leading-relaxed text-slate-500">
            Upload a CSV or Excel file to preview and normalize it before
            importing.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50/50 p-2 border border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/10 transition-all duration-200">
          <UploadBox />
        </div>
      </div>
    </main>
  );
}
