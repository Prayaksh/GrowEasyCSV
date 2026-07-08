export type Row = Record<string, unknown>;

export interface HeaderMapping {
  [header: string]: string;
}

export interface MatchResult {
  mapping: Record<string, string>;
  unmatched: string[];
}

export interface CRMRecord {
  created_at?: string | null;
  name?: string | null;
  email?: string | null;
  country_code?: string | null;
  mobile_without_country_code?: string | null;
  company?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  lead_owner?: string | null;
  crm_status?: string | null;
  crm_note?: string | null;
  data_source?: string | null;
  possession_time?: string | null;
  description?: string | null;
}

export const ALLOWED_CRM_STATUS = new Set([
  "GOOD_LEAD_FOLLOW_UP",
  "DID_NOT_CONNECT",
  "BAD_LEAD",
  "SALE_DONE",
]);

export const ALLOWED_DATA_SOURCES = new Set([
  "leads_on_demand",
  "meridian_tower",
  "eden_park",
  "varah_swamy",
  "sarjapur_plots",
]);
