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

import { cn } from '@/lib/utils';

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
    <Card className="shadow-lg">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-3">
          <div className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center mx-auto transition-colors',
            status === 'connected' ? 'bg-green-100 animate-pulse' : status === 'connecting' ? 'bg-yellow-100' : 'bg-muted'
          )}>
            <Phone className={cn(
              'h-7 w-7',
              status === 'connected' ? 'text-green-600' : status === 'connecting' ? 'text-yellow-600' : 'text-muted-foreground'
            )} />
          </div>
        </div>
        <CardTitle>Voice Triage</CardTitle>
        <CardDescription>Speak with the AI agent to report symptoms.</CardDescription>
        <div className="flex justify-center pt-2">
          <Badge variant={s.variant}>{s.label}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleStart}
              disabled={status === 'connected' || status === 'connecting'}
              className="gap-2"
              size="lg"
            >
              <Mic className="h-4 w-4" />
              Start Call
            </Button>
            <Button
              variant="outline"
              onClick={endSession}
              disabled={status !== 'connected'}
              className="gap-2"
              size="lg"
            >
              <PhoneOff className="h-4 w-4" />
              End Call
            </Button>
          </div>

          {callEnded && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>
                Call complete. Results in{' '}
                <Link to="/consultations" className="underline font-medium">Consultations</Link>
                {' '}and{' '}
                <Link to="/referrals" className="underline font-medium">Notifications</Link>.
              </span>
            </div>
          )}

          {status === 'error' && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Failed to connect. Enable microphone access.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
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
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <div className="w-full max-w-lg px-4">
        <ConversationProvider agentId={AGENT_ID}>
          <TriageCallPanel />
        </ConversationProvider>
      </div>
    </div>
  );
}
