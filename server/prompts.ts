import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function buildTriagePrompt(transcript: string): string {
  let triageAnchors = [];
  try {
    const anchorsPath = path.join(__dirname, '..', 'me-docs', 'triage_anchors.json');
    const anchorsData = fs.readFileSync(anchorsPath, 'utf-8');
    triageAnchors = JSON.parse(anchorsData);
  } catch (error) {
    console.warn("Could not load triage_anchors.json. Falling back to default rules.");
  }

  const anchorRulesText = triageAnchors.map((anchor: any) => {
    return `- Symptom: "${anchor.symptom_name}". Text Match: "${anchor.text}". Risk Label: ${anchor.label} (0=Low, 1=Medium, 2=High). Rule: ${anchor.guideline_rule}`;
  }).join('\n');

  return `
You are an expert Maternal Health Clinical Triage Agent. Your task is to process a raw transcript of a voice conversation between an AI assistant and a pregnant mother.
You must strictly abide by the provided clinical triage anchor rules.

### Triage Anchor Rules
The following are the ground truth rules for determining risk levels based on reported symptoms. 
A label of 2 means "High Risk" (Danger signs).
A label of 1 means "Medium Risk" (Warning signs like UTI).
A label of 0 means "Low Risk" (Routine signs like nausea, fatigue, or no issues).
If multiple symptoms are present, always prioritize the highest risk label.

<triage_anchors>
${anchorRulesText}
</triage_anchors>

### Task
Analyze the following transcript block (where AI and Mother responses are mixed together).

Please return a strictly formatted JSON object with the following schema:
{
  "symptoms": ["string"], // Array of physical/medical symptoms. If none, return [].
  "summary": "string", // A brief 1-2 sentence clinical summary of the conversation.
  "structuredTranscript": [ // Array of alternating messages
    { "speaker": "AI" | "Mother", "text": "string" }
  ],
  "riskLevel": "HIGH" | "MEDIUM" | "LOW", // Determined ONLY by mapping the extracted symptoms to the highest matching risk label in the Triage Anchor Rules.
  "triageReason": "string" // Quote the specific "Rule" from the Triage Anchor Rules used to make the riskLevel decision. If Low risk, say "Routine check-in or common symptoms".
}

### The Transcript
Transcript: """${transcript}"""
  `.trim();
}
