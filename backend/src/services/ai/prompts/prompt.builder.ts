export class PromptBuilder {
  static build(
    headers: string[],
    sampleRows: Record<string, unknown>[],
  ): string {
    console.log("PromptBuilder.build initiated");

    return `
You are mapping uploaded CSV headers to a CRM schema.

Available CRM fields:

created_at
name
email
country_code
mobile_without_country_code
company
city
state
country
lead_owner
crm_status
crm_note
data_source
possession_time
description

Rules:

- Only map when confidence is high.
- Never invent CRM fields.
- If no mapping exists, set crmField to null.
- Use sample values to infer meaning.
- Return every input header exactly once.

Uploaded Headers:
${JSON.stringify(headers)}

Sample Rows(context):
${JSON.stringify(sampleRows, null, 2)}

Sample Output Format for reference: 
{
  "mappings": [
    {
      "csvHeader": "work_email",
      "crmField": "email"
    },
    {
      "csvHeader": "organisation",
      "crmField": "company"
    },
  ]
}
`;
  }
}
