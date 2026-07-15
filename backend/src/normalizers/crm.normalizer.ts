import { INormalizer } from "./normalizer.interface.js";
import {
  CRMRecord,
  ALLOWED_CRM_STATUS,
  ALLOWED_DATA_SOURCES,
} from "../types/types.js";

export class CRMRecordNormalizer implements INormalizer<CRMRecord> {
  normalize(rows: CRMRecord[]): CRMRecord[] {
    return rows.map((row) => this.normalizeRow(row));
  }

  private normalizeRow(row: CRMRecord): CRMRecord {
    const normalized = { ...row };

    this.normalizeDate(normalized);
    this.normalizeStatus(normalized);
    this.normalizeDataSource(normalized);
    this.normalizeEmails(normalized);
    this.normalizePhones(normalized);
    this.normalizeNotes(normalized);

    return normalized;
  }

  private normalizeStatus(row: CRMRecord) {
    if (row.crm_status && !ALLOWED_CRM_STATUS.has(row.crm_status)) {
      row.crm_status = null;
    }
  }

  private normalizeDataSource(row: CRMRecord) {
    if (row.data_source && !ALLOWED_DATA_SOURCES.has(row.data_source)) {
      row.data_source = null;
    }
  }

  private normalizeDate(row: CRMRecord) {
    if (!row.created_at) {
      return;
    }

    const date = new Date(row.created_at);

    if (Number.isNaN(date.getTime())) {
      row.created_at = null;
      return;
    }

    row.created_at = date.toISOString();
  }

  private normalizeEmails(row: CRMRecord) {
    if (!row.email) {
      return;
    }

    const emails = row.email
      .split(/[;,]/)
      .map((x) => x.trim())
      .filter(Boolean);

    if (emails.length <= 1) {
      return;
    }

    row.email = emails[0];

    row.crm_note = this.appendNote(
      row.crm_note,
      `Additional Emails: ${emails.slice(1).join(", ")}`,
    );
  }

  private normalizePhones(row: CRMRecord) {
    if (row.mobile_without_country_code == null) {
      return;
    }
    const phones = String(row.mobile_without_country_code)
      .split(/[;,/]/)
      .map((x) => x.trim())
      .filter(Boolean);
    if (phones.length <= 1) {
      row.mobile_without_country_code = phones[0] ?? "";
      return;
    }
    row.mobile_without_country_code = phones[0];
    row.crm_note = this.appendNote(
      row.crm_note,
      `Additional Phones: ${phones.slice(1).join(", ")}`,
    );
  }

  private normalizeNotes(row: CRMRecord) {
    if (!row.crm_note) {
      return;
    }

    row.crm_note = row.crm_note
      .replace(/\r\n/g, "\\n")
      .replace(/\n/g, "\\n")
      .trim();
  }

  private appendNote(
    existing: string | null | undefined,
    value: string,
  ): string {
    if (!existing) {
      return value;
    }

    return `${existing} | ${value}`;
  }
}
