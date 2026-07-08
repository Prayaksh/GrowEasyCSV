export class PromptBuilder {
  static build(
    headers: string[],
    sampleRows: Record<string, unknown>[],
  ): string {
    console.log("PromptBuilder.build initiated");

    return `You are an expert CRM data ingestion AI. Your sole task is to map uploaded CSV headers to the strict target CRM schema provided below.

=== TARGET CRM SCHEMA ===
Allowed CRM Fields:
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

=== CRITICAL INSTRUCTIONS ===
1. Map each uploaded header to EXACTLY ONE or ZERO target CRM fields.
2. Use BOTH the header names and the sample row data to infer the correct mapping context.
3. If a mapping is uncertain or low-confidence, OMIT the header from the final JSON object.
4. Do NOT invent, hallucinate, or modify target CRM fields.
5. Do NOT rename or modify the uploaded header names (keys).
6. OUTPUT CONSTRAINT: Return ONLY a raw, valid JSON object. Do NOT wrap the response in markdown code blocks (e.g., do not use \`\`\`json). No conversational text, no explanations.

=== VALID EXAMPLE ===
Input Headers: ["lead_name", "phone", "remarks"]
Output: {"lead_name": "name", "phone": "mobile_without_country_code", "remarks": "crm_note"}

=== DATA TO PROCESS ===
Uploaded Headers:
${JSON.stringify(headers)}

Sample Rows (Context):
${JSON.stringify(sampleRows, null, 2)}

=== RESPONSE ===
`;
  }
}
