import { CRMRecord } from "../types/types.js";

export interface IValidator<T> {
  isValid(row: T): boolean;
}

export class CRMValidator implements IValidator<CRMRecord> {
  isValid(row: CRMRecord): boolean {
    const hasEmail =
      typeof row.email === "string" && row.email.trim().length > 0;

    const hasPhone =
      typeof row.mobile_without_country_code === "string" &&
      row.mobile_without_country_code.trim().length > 0;

    return hasEmail || hasPhone;
  }
}
