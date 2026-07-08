export class PromptBuilder {
  static build(
    headers: string[],
    sampleRows: Record<string, unknown>[],
  ): string {
    console.log("PromptBuilder.build initiated");
    return `
You are an expert CRM data ingestion assistant.

Your task is to infer the mapping between uploaded CSV headers and the GrowEasy CRM schema.

The uploaded headers have already been normalized into snake_case.
Do NOT rename or modify the header names.

## Target CRM Schema

- created_at
- name
- email
- country_code
- mobile_without_country_code
- company
- city
- state
- country
- lead_owner
- crm_status
- crm_note
- data_source
- possession_time
- description

## Instructions

- Map each uploaded header to AT MOST one CRM field.
- Use both the header names and the sample values.
- If a mapping is not sufficiently confident, omit the header.
- Never invent new CRM fields.
- Never return explanations.
- Never return markdown.
- Return ONLY valid JSON.
- Keys MUST be the uploaded headers.
- Values MUST be one of the CRM schema fields above.

Examples

Input headers:

lead_name
phone
remarks

Output:

{
  "lead_name": "name",
  "phone": "mobile_without_country_code",
  "remarks": "crm_note"
}

Uploaded Headers

${JSON.stringify(headers, null, 2)}

Sample Rows

${JSON.stringify(sampleRows, null, 2)}
`;
  }
}
