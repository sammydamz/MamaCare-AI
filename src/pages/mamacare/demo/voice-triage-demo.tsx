import { useEffect, useState } from 'react';
import {
  ConversationProvider,
  useConversationControls,
  useConversationStatus,
} from '@elevenlabs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Phone, PhoneOff, Mic, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AGENT_ID = import.meta.env.VITE_ELEVENLABS_AGENT_ID;

function TriageCallPanel() {
  const { startSession, endSession } = useConversationControls();
  const { status } = useConversationStatus();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [callEnded, setCallEnded] = useState(false);

  useEffect(() => {
    if (conversationId && status === 'disconnected') {
      setCallEnded(true);
      const timer = setTimeout(() => setCallEnded(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [conversationId, status]);

  const handleStart = async () => {
    try {
      setCallEnded(false);
      await startSession({
        onConnect: ({ conversationId }) => {
          setConversationId(conversationId);
        },
        onError: (message) => {
          toast.error(message);
        },
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to start call');
    }
  };

  const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'success' | 'warning' }> = {
    disconnected: { label: 'Ready', variant: 'secondary' },
    connecting: { label: 'Connecting...', variant: 'warning' },
    connected: { label: 'In Call', variant: 'success' },
    error: { label: 'Error', variant: 'default' },
  };

  const s = statusMap[status] || { label: status, variant: 'secondary' };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Voice Triage
              </CardTitle>
              <CardDescription className="mt-1">
                Speak with the AI agent to report symptoms.
              </CardDescription>
            </div>
            <Badge variant={s.variant}>{s.label}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3">
              <Button
                onClick={handleStart}
                disabled={status === 'connected' || status === 'connecting'}
                className="gap-2"
              >
                <Mic className="h-4 w-4" />
                Start Call
              </Button>
              <Button
                variant="outline"
                onClick={endSession}
                disabled={status !== 'connected'}
                className="gap-2"
              >
                <PhoneOff className="h-4 w-4" />
                End Call
              </Button>
            </div>

            {callEnded && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Call complete. Results will appear in{' '}
                <Link to="/consultations" className="underline font-medium">Consultations</Link>.
              </div>
            )}

            {status === 'error' && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Failed to connect. Make sure you have microphone access enabled.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function VoiceTriageDemo() {
  if (!AGENT_ID) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Missing Agent ID</CardTitle>
            <CardDescription>
              Set <code className="text-xs bg-muted px-1 py-0.5 rounded">VITE_ELEVENLABS_AGENT_ID</code> in your .env file.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Voice Triage</h1>
      <ConversationProvider agentId={AGENT_ID}>
        <TriageCallPanel />
      </ConversationProvider>
    </div>
  );
}
