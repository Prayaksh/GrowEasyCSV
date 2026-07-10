import { ParseResponse } from "@/types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function parseCSV(file: File): Promise<ParseResponse> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(`${API}/parse`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text();

    throw new Error(message || "Failed to parse CSV.");
  }

  return response.json();
}
