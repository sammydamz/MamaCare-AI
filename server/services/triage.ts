import { HfInference } from '@huggingface/inference';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Hugging Face
const hf = new HfInference(process.env.HF_TOKEN);

// Initialize Gemini (Fallback)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function triageSymptoms(careStage: string, transcribedText: string) {
  const prefixedText = `[${careStage.toUpperCase()}] ${transcribedText}`;
  let riskLevel = 'LOW';

  try {
    // Attempt Hugging Face Inference
    const result = await hf.textClassification({
      model: 'sammydamz/mamacare-triage-model',
      inputs: prefixedText
    });

    if (result && result.length > 0) {
      // Return highest scored label
      const highestScore = result.reduce((prev, current) => (prev.score > current.score) ? prev : current);
      riskLevel = highestScore.label.toUpperCase();
      return { riskLevel, source: 'huggingface' };
    }
  } catch (error) {
    console.error('Hugging Face model failed, falling back to Gemini:', error);
    
    try {
      // Fallback to Gemini
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        You are a clinical triage AI for MamaCare in Ghana.
        Analyze the following symptom report and classify the risk level as strictly one of: HIGH, MEDIUM, LOW.
        Report: "${prefixedText}"
        Respond with ONLY the risk level (e.g. "HIGH").
      `;
      const result = await model.generateContent(prompt);
      riskLevel = result.response.text().trim().toUpperCase();
      
      if (!['HIGH', 'MEDIUM', 'LOW'].includes(riskLevel)) {
        riskLevel = 'MEDIUM'; // fallback safety
      }
      return { riskLevel, source: 'gemini-fallback' };
    } catch (fallbackError) {
      console.error('Gemini fallback failed:', fallbackError);
      return { riskLevel: 'MEDIUM', source: 'default-fallback' };
    }
  }

  return { riskLevel, source: 'unknown' };
}
