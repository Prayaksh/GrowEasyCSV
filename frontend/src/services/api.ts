import { ParseResponse } from "@/types";

const API = "http://localhost:8000";

export async function parseCSV(file: File): Promise<ParseResponse> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(`${API}/parse`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to parse CSV");
  }

  return response.json();
}
