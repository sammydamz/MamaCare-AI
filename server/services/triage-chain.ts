import { ChatGoogle } from '@langchain/google/node';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Zod schema = contract between ElevenLabs transcript and our system ──
export const TriageResultSchema = z.object({
  symptoms: z
    .array(z.string())
    .describe('List of symptoms extracted from the patient report'),
  riskLevel: z
    .enum(['HIGH', 'MEDIUM', 'LOW'])
    .describe('Clinical risk level based on symptom severity'),
  summary: z
    .string()
    .describe('Brief clinical summary of the consultation'),
  triggeredReferral: z
    .boolean()
    .describe('Whether this case needs an immediate referral'),
  triageReason: z
    .string()
    .describe('Short justification for the risk level assigned'),
});

export type TriageResult = z.infer<typeof TriageResultSchema>;

// ── LangChain model with structured output ──
const model = new ChatGoogle({
  model: 'gemini-2.5-flash',
  maxRetries: 2,
});

// Bind the schema — every invoke() returns typed TriageResult
const structuredModel = model.withStructuredOutput(TriageResultSchema, {
  name: 'mamaCareTriage',
});

// ── Load triage anchors from existing docs ──
function loadTriageAnchors(): string {
  try {
    const anchorsPath = path.join(__dirname, '..', '..', 'me-docs', 'triage_anchors.json');
    const anchorsData = fs.readFileSync(anchorsPath, 'utf-8');
    const anchors = JSON.parse(anchorsData);
    return anchors.map((anchor: any) => {
      return `- Symptom: "${anchor.symptom_name}". Text Match: "${anchor.text}". Risk Label: ${anchor.label} (0=Low, 1=Medium, 2=High). Rule: ${anchor.guideline_rule}`;
    }).join('\n');
  } catch {
    return '- Default: Heavy bleeding, severe pain, reduced fetal movement = HIGH\n- Default: Mild headache, fatigue = LOW';
  }
}

// ── Triage prompt ──
const SYSTEM_PROMPT = `You are an expert Maternal Health Clinical Triage Agent for MamaCare in Ghana.
Your task is to process a voice conversation transcript between an AI assistant and a pregnant mother.
You must strictly abide by the provided clinical triage anchor rules.

### Triage Anchor Rules
A label of 2 means "High Risk" (Danger signs).
A label of 1 means "Medium Risk" (Warning signs like UTI).
A label of 0 means "Low Risk" (Routine signs like nausea, fatigue, or no issues).
If multiple symptoms are present, always prioritize the highest risk label.

${loadTriageAnchors()}

### Response Rules
- Extract specific symptoms as individual strings (e.g. "severe headache", "blurred vision")
- Assign riskLevel based on the highest matching risk label from the anchors above
- Write a concise 1-2 sentence clinical summary
- Set triggeredReferral to true if riskLevel is HIGH
- triageReason should quote the specific rule used from the Triage Anchor Rules above
- Do NOT provide medical advice — only extract data and classify risk`;

// ── Public API ──
export async function triageTranscript(
  transcript: string,
  patientName?: string
): Promise<TriageResult> {
  const result = await structuredModel.invoke([
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'user',
      content: `Patient: ${patientName || 'Unknown'}\nTranscript: """${transcript}"""`,
    },
  ]);

  return result;
}
