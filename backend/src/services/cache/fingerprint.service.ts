import { createHash } from "node:crypto";

export class FingerprintService {
  private readonly PREFIX = "crm:mapping:v1";

  generate(headers: string[]): string {
    const fingerprint = createHash("sha256")
      .update(headers.sort().join("|"))
      .digest("hex");

    return `${this.PREFIX}:${fingerprint}`;
  }
}
