import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMamaCare } from '@/providers/mamacare-provider';

interface TranscriptLine {
  speaker: 'AI' | 'Mother';
  text: string;
}

const PRESET_SCENARIOS = {
  bleeding: {
    label: 'Vaginal Bleeding (HIGH)',
    transcript: [
      { speaker: 'AI', text: 'Hello, thank you for checking in with MamaCare-AI. How are you feeling today?' },
      { speaker: 'Mother', text: 'I noticed some vaginal bleeding in my underwear since this morning, it is quite heavy.' }
    ]
  },
  movements: {
    label: 'Fetal Movement Loss (HIGH)',
    transcript: [
      { speaker: 'AI', text: 'Hello, how is your pregnancy going today?' },
      { speaker: 'Mother', text: 'I am very worried. I can\'t feel the baby kicking today, she has been quiet.' }
    ]
  },
  uti: {
    label: 'Urinary Burning/UTI Symptoms (MEDIUM)',
    transcript: [
      { speaker: 'AI', text: 'Are you experiencing any physical discomfort today?' },
      { speaker: 'Mother', text: 'Yes, it really burns when I urinate and I have a mild fever.' }
    ]
  },
  healthy: {
    label: 'Healthy Pregnancy Check-in (LOW)',
    transcript: [
      { speaker: 'AI', text: 'How are you feeling today, mother?' },
      { speaker: 'Mother', text: 'I am feeling very strong and healthy today, no pain or bleeding.' }
    ]
  },
  custom: {
    label: 'Custom Transcript',
    transcript: [
      { speaker: 'AI', text: 'How are you feeling today?' },
      { speaker: 'Mother', text: '' }
    ]
  }
};

export function SimulateConsultationDialog() {
  const [open, setOpen] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [language, setLanguage] = useState('English');
  const [scenarioKey, setScenarioKey] = useState<keyof typeof PRESET_SCENARIOS>('healthy');
  const [customText, setCustomText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { patients, recordConsultation } = useMamaCare();

  const handleScenarioChange = (key: string) => {
    const k = key as keyof typeof PRESET_SCENARIOS;
    setScenarioKey(k);
    if (k !== 'custom') {
      const motherTurn = PRESET_SCENARIOS[k].transcript.find(t => t.speaker === 'Mother')?.text || '';
      setCustomText(motherTurn);
    } else {
      setCustomText('');
    }
  };

  const handleRunTriage = async () => {
    if (!patientId || !customText.trim()) return;

    setIsSubmitting(true);
    try {
      // Build transcript array
      const aiTurn = PRESET_SCENARIOS[scenarioKey]?.transcript.find(t => t.speaker === 'AI')?.text || 'Hello, how are you feeling?';
      const transcript: TranscriptLine[] = [
        { speaker: 'AI', text: aiTurn },
        { speaker: 'Mother', text: customText.trim() }
      ];

      await recordConsultation({
        patientId,
        transcript,
        language
      });

      setOpen(false);
      setPatientId('');
      setCustomText('');
      setScenarioKey('healthy');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPresetText = scenarioKey !== 'custom' ? PRESET_SCENARIOS[scenarioKey].transcript.find(t => t.speaker === 'Mother')?.text || '' : '';
  const currentTextValue = scenarioKey === 'custom' ? customText : selectedPresetText;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" size="sm">
          Simulate Voice Call
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Simulate AI Voice Triage Call</DialogTitle>
          <DialogDescription>
            Simulate a patient's call transcript to assess risk using the Gemini model and clinical triage anchors.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          {/* Select Patient */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Select Patient</label>
            <Select value={patientId} onValueChange={setPatientId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} ({p.pathway} - {p.riskLevel} Risk)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Select Language */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Language</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Choose language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Twi">Twi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preset Scenarios */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Scenario Preset</label>
            <Select value={scenarioKey} onValueChange={handleScenarioChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose preset scenario" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PRESET_SCENARIOS).map(([key, item]) => (
                  <SelectItem key={key} value={key}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dialogue Text Area */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Mother's Verbal Response</label>
            <Textarea
              rows={3}
              placeholder="e.g. I am bleeding heavily..."
              value={scenarioKey === 'custom' ? customText : currentTextValue}
              onChange={(e) => {
                if (scenarioKey === 'custom') {
                  setCustomText(e.target.value);
                } else {
                  // If they start editing a preset, switch to custom mode
                  setScenarioKey('custom');
                  setCustomText(e.target.value);
                }
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleRunTriage}
              disabled={isSubmitting || !patientId || !currentTextValue.trim()}
            >
              {isSubmitting ? 'Running Triage...' : 'Run Triage Call'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
