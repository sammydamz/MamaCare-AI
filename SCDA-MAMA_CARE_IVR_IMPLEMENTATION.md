# MamaCare AI IVR Implementation Plan - SCDA Compliant

## Executive Summary

The current codebase implements a **file-upload based system** using ElevenLabs, but the SCDA grant requires a **real-time IVR system** with language-aware voice interactions using Khaya AI (Ghana NLP) and Africa's Talking. This document outlines the complete implementation roadmap to achieve SCDA compliance.

## 1. Current State vs. SCDA Requirements

### ❌ Current Implementation (Non-Compliant)
```typescript
// File-based processing (ElevenLabs + Gemini)
app.post('/api/voice/upload-recording/:patientId', async (req, res) => {
  const audioPath = req.file.path;
  const result = await processRecordedSession(audioPath, patientId, pool);
});
```

### ✅ SCDA Requirements (Must Implement)
```typescript
// Real-time IVR with Khaya AI + Africa's Talking
// Both outbound (scheduled) and inbound (hotline) voice interactions
// Language-aware interactions in Twi, Fante, Ewe, Ga, Dagbani
```

---

## 2. SCDA Compliance Requirements Analysis

Based on the grant documents, MamaCare AI must provide **4 access channels** with real IVR:

| Requirement | Status | Implementation Type |
|-------------|--------|-------------------|
| **Outbound IVR calls** | ❌ Missing | Scheduled voice calls using Africa's Talking Voice API |
| **Inbound IVR hotline** | ❌ Missing | 24/7 voice interaction for unscheduled concerns |
| **Smart mobile app** | ❌ Missing | Native app with same backend API |
| **USSD short code** | ❌ Missing | Text-based self-service on any phone |

---

## 3. Implementation Architecture Overview

### 3.1 Core Components Required

```
┌─────────────────────────────────────────────────────────────┐
│                    USER REGISTRATION                        │
├─────────────────────────────────────────────────────────────┤
│     Language Selection → Patient Profile → IVR Activation │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   IVR INFRASTRUCTURE                        │
├─────────────────────────────────────────────────────────────┤
│  • Africa's Talking Voice API (Outbound + Inbound)        │
│  • Khaya AI ASR (Speech-to-Text)                          │
│  • DistilBERT with stage prefixes                        │
│  • WebSocket Real-time Updates                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   CLINICAL DASHBOARD                         │
├─────────────────────────────────────────────────────────────┤
│     Risk-sorted patient list + Stage transition controls    │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Required Technical Stack

```yaml
provider: railway  # Cloud deployment
language: multi-backend
databases:
  - primary: PostgreSQL
  - ai: Hugging Face Inference Endpoint

frontend:
  - react (web dashboard)
  - react-native (mobile app)
  - ussd: web-based (feature phones)

backend:
  - node/express
  - socket.io (real-time alerts)
  - africastalking (voice)
  - khaya-ai (asr)

ai:
  - huggingface/distilbert-base-multilingual-cased (fine-tuned)
  - gemini (classification fallback)
```

---

## 4. Implementation Phases

### Phase 1: Foundation (Weeks 1-4)
**Objective:** Build core user registration with language support

#### 4.1 User Registration System

```typescript
// User registration with language preference
app.post('/api/patients/register', async (req, res) => {
  const { name, age, phone, preferredLanguage, careStage, pathway } = req.body;
  
  // Validate language preference
  const validLanguages = ['Twi', 'Fante', 'Ewe', 'Ga', 'Dagbani', 'English'];
  if (!validLanguages.includes(preferredLanguage)) {
    return res.status(400).json({ error: 'Invalid language preference' });
  }
  
  // Create patient profile with language preference
  const patientId = generatePatientId();
  const registrationDate = new Date().toISOString().split('T')[0];
  
  // Update MongoDB/PostgreSQL
  await pool.query(`
    INSERT INTO patients (
      id, name, age, language, preferred_language, 
      care_stage, pathway, phone, registration_date
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  `, [patientId, name, age, preferredLanguage, preferredLanguage, 
      careStage, pathway, phone, registrationDate]);
  
  // Schedule first IVR call based on care stage
  await scheduleIvrCall(patientId, careStage, pathway);
  
  res.status(201).json({ 
    patientId, 
    message: `IVR activation initiated for ${preferredLanguage}-language care` 
  });
});
```

#### 4.2 Language-Aware IVR Activation

```typescript
interface LanguageConfiguration {
  voicePrompt: string;        // Text-to-speech script
  dtmfMapping: {              // Touchtone interaction
    '1': 'Headache & Vision',
    '2': 'Vaginal Bleeding', 
    '3': 'Fetal Movement',
    '4': 'Other Symptoms'
  };
  transcriptionLanguages: string[];  // ['twi', 'fante', 'ewe', 'ga', 'dagbani']
}

const LANGUAGE_CONFIG: Record<string, LanguageConfiguration> = {
  Twi: {
    voicePrompt: 'Mom, ini maame a, gye wo ho kye bi aba.',
    dtmfMapping: { '1': 'Agyare yɛ, Nipa sesi, Ɛbe na wo yewo ano' },
    transcriptionLanguages: ['twi']
  },
  // ... other languages
};
```

---

## 5. SCDA-Specific Implementation Details

### 5.1 Gender-Sensitive Design & TF-GBV Mitigation

```typescript
// TF-GBV (Technology-Facilitated Gender-Based Violence) Mitigation
// Based on actual grant text: women can adjust schedules, reduce frequency, or opt out.
interface GBSafetyMeasures {
  allowScheduleAdjustment: boolean;       // Adjust calling times for privacy
  allowFrequencyReduction: boolean;       // Reduce message frequency
  allowNotificationModification: boolean; // Modify notification preferences
  allowTemporarySuspension: boolean;      // Suspend digital communication
  optOutAvailable: boolean;               // Women retain ability to opt out
}

const GB_SAFETY_CONFIG: GBSafetyMeasures = {
  allowScheduleAdjustment: true,
  allowFrequencyReduction: true,
  allowNotificationModification: true,
  allowTemporarySuspension: true,
  optOutAvailable: true
};
```

### 5.2 API Endpoints for IVR System

```typescript
// IVR System API Endpoints
app.post('/api/ivr/outbound', authorize, async (req, res) => {
  const { patientId, stage, language } = req.body;
  await ivrService.scheduleOutboundCall(patientId, stage, language);
  res.json({ message: 'IVR call scheduled', estimatedDelivery: '2-5 minutes' });
});

app.post('/api/ivr/inbound/:phone', async (req, res) => {
  const { phone } = req.params;
  const recording = req.body.audio;  // Base64 encoded
  await processInboundIVR(phone, recording);
  res.json({ status: 'received' });
});

// REAL-TIME IVR CALLBACK (from Africa's Talking)
app.post('/api/ivr/callback/:patientId', async (req, res) => {
  const { patientId } = req.params;
  const { call_status, recording_url, duration, dtmf } = req.body;
  
  if (call_status === 'completed' && recording_url) {
    const audioBuffer = await downloadRecording(recording_url);
    await processCompletedCall(patientId, audioBuffer, dtmf);
  }
  
  res.json({ received: true });
});
```

---

## 6. Risk Mitigation & Contingencies

### 6.1 Language Fallback Strategy

```typescript
// Standard Khaya AI ASR integration pipeline
class AsrTranscriptionService {
  async transcribeAudio(
    audioBuffer: Buffer, 
    preferredLanguage: string
  ): Promise<TranscribedResult> {
    try {
      // Khaya AI transcribes and translates local language audio to English text
      const result = await khayaASR.transcribeAndTranslate(audioBuffer, preferredLanguage);
      
      return {
        text: result.text, // English text
        language: preferredLanguage
      };
    } catch (error) {
      console.error(`ASR Transcription failed for ${preferredLanguage}:`, error);
      throw error;
    }
  }
}
```

---

## 7. Quality Assurance & Testing

### 7.1 IVR Testing Framework

```javascript
// Test suite for IVR compliance
describe('IVR System Tests', () => {
  test('Outbound call for pregnant patient', async () => {
    const patient = await createPatient({
      language: 'Twi',
      stage: 'prenatal',
      gestationalAge: 20
    });
    
    const call = await ivrService.scheduleOutboundCall(patient.id, 'prenatal', 'Twi');
    expect(call.status).toBe('scheduled');
    expect(call.language).toBe('Twi');
    expect(call.stage).toBe('prenatal');
  });
});
```

---

## 8. SCDA Compliance Checklist

### ✅ Must-Have Features (Current Status)
- [x] User registration with language preference
- [x] Stage-aware care (prenatal/postpartum/bereavement)
- [ ] Khaya AI integration for local languages
- [ ] AI classification with stage prefixes
- [ ] Risk-based alert system
- [ ] Dashboard with stage transition controls

### ❌ Critical Implementation Needed
- [ ] Africa's Talking Voice API for outbound IVR
- [ ] Inbound IVR hotline setup  
- [ ] USSD short code implementation
- [ ] Smart app development
- [ ] TF-GBV safety protocols
- [ ] Complete language support (5 Ghanaian languages)

### 📊 SCDA Evaluation Criteria Alignment

| Criterion | Current Status | Target |
|-----------|----------------|--------|
| Digital Technology Integration | 🔴 Partial (file-based only) | ✅ Full IVR system |
| Inclusive Design & Safe Use | 🔴 Limited | ✅ Robust TF-GBV protection |
| Partnership Networks | ✅ Established | ✅ Expand Khaya AI integration |
| Credible Pathway to Scale | 🟡 Prototype only | ✅ 50K+ women capable |

---

## 9. Next Steps & Immediate Actions

### **Immediate (Weeks 1-4)**
1. **Deploy Africa's Talking Voice API** for basic outbound IVR
2. **Integrate Khaya AI** for initial language support (Twi)
3. **Implement stage-aware prefixes** in classification model
4. **Set up basic IVR logging** and monitoring

### **Short-term (Weeks 5-12)**
1. **Add Inbound IVR Hotline** for symptom reporting
2. **Develop USSD short code system** for feature phone access
3. **Create Smart App** for smartphone users
4. **Implement TF-GBV safety protocols**

---

## Summary

The current system requires a **major pivot** from file-based processing to real-time IVR to meet SCDA requirements. This involves:

1. **Integrating Khaya AI** for local language speech recognition
2. **Setting up Africa's Talking IVR** for voice interactions  
3. **Implementing stage-aware classification** with care-stage prefixes
4. **Building comprehensive safety protocols** for TF-GBV
5. **Developing full language support** across all 5 Ghanaian languages

The implementation follows a **phased approach** that allows for gradual compliance while building the complete system needed for SCDA approval.