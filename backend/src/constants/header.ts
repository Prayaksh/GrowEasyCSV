export const HEADER_ALIASES: Record<string, string[]> = {
  created_at: [
    "created_at",
    "created at",
    "created date",
    "lead creation date",
    "creation date",
  ],

  name: ["name", "lead name", "customer name", "full name"],

  email: ["email", "email address", "mail", "primary email"],

  mobile_without_country_code: [
    "phone",
    "phone number",
    "mobile",
    "mobile number",
    "mobile_without_country_code",
    "contact",
    "contact number",
  ],

  country_code: ["country_code", "country code", "isd code"],

  company: ["company", "company name", "organization"],

  city: ["city"],

  state: ["state"],

  country: ["country"],

  lead_owner: ["lead owner", "owner", "assigned to"],

  crm_status: ["crm status", "lead status", "status"],

  crm_note: ["crm note", "note", "notes", "remarks", "comment"],

  data_source: ["data source", "source", "lead source"],

  possession_time: ["possession", "possession time"],

  description: ["description", "details", "additional description"],
};
