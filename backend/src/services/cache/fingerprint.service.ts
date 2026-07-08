import crypto from "crypto";

export class FingerprintService {
  generate(rows: Record<string, unknown>[]): string {
    if (rows.length === 0) {
      return "";
    }
    const headers = Object.keys(rows[0])
      .map((h) => h.trim())
      .sort();

    return crypto.createHash("sha256").update(headers.join("|")).digest("hex");
  }
}
