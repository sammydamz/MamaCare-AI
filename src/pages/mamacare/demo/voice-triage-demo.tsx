import { useCallback, useEffect, useState } from 'react';
import { ConversationProvider, useConversation } from '@elevenlabs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Phone, Mic, MicOff, PhoneOff } from 'lucide-react';

const AGENT_ID = import.meta.env.VITE_ELEVENLABS_AGENT_ID;

function VoiceTriageInner() {
  const { status, startSession, endSession, isMuted, setMuted } = useConversation();
  const [callEnded, setCallEnded] = useState(false);

  useEffect(() => {
    if (status === 'disconnected' && callEnded === false) {
      // Don't reset on initial mount
    }
  }, [status, callEnded]);

  const handleStart = useCallback(async () => {
    setCallEnded(false);
    try {
      await startSession({
        onConnect: () => toast.success('Connected'),
        onDisconnect: () => {
          setCallEnded(true);
          setTimeout(() => setCallEnded(false), 10000);
        },
        onError: (err) => toast.error(err),
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to start');
    }
  }, [startSession]);

  const statusBadge = {
    disconnected: { label: 'Ready', variant: 'secondary' as const },
    connecting: { label: 'Connecting...', variant: 'warning' as const },
    connected: { label: 'Live', variant: 'success' as const },
    error: { label: 'Error', variant: 'destructive' as const },
  }[status];

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-start justify-between pb-4">
        <div className="space-y-1.5 text-left">
          <CardTitle>Voice Triage</CardTitle>
          <CardDescription>Speak with the AI agent to report symptoms.</CardDescription>
        </div>
        <Badge variant={statusBadge.variant} className="mt-1 shrink-0">
          {statusBadge.label}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'connected' && (
          <div className="flex animate-pulse justify-center">
            <div className="flex items-end gap-1 h-8">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="w-1.5 bg-primary rounded-full h-full" style={{ animationDelay: `${i*0.1}s` }} />
              ))}
            </div>
          </div>
        )}

        {status === 'disconnected' || status === 'error' ? (
          <Button onClick={handleStart} className="w-full gap-2" size="lg">
            <Phone className="h-4 w-4" />
            Start Call
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant={isMuted ? 'destructive' : 'outline'}
              onClick={() => setMuted(!isMuted)}
              className="flex-1 gap-2"
              size="lg"
            >
              {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {isMuted ? 'Unmute' : 'Mute'}
            </Button>
            <Button
              variant="destructive"
              onClick={endSession}
              className="flex-1 gap-2"
              size="lg"
            >
              <PhoneOff className="h-4 w-4" />
              End
            </Button>
          </div>
        )}

        {callEnded && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 text-center">
            Call complete. Results in{' '}
            <Link to="/sessions" className="underline font-medium">Sessions</Link>.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function VoiceTriageDemo() {
  if (!AGENT_ID) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-destructive font-medium">Missing Agent ID</p>
            <p className="text-sm text-muted-foreground mt-1">
              Set <code className="text-xs bg-muted px-1 py-0.5 rounded">VITE_ELEVENLABS_AGENT_ID</code> in .env.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <div className="w-full max-w-md px-4">
        <ConversationProvider agentId={AGENT_ID}>
          <VoiceTriageInner />
        </ConversationProvider>
      </div>
    </div>
  );
}
