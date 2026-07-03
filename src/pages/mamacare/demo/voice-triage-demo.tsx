import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ConversationProvider,
  useConversationControls,
  useConversationStatus,
  useConversationMode,
  useConversationInput,
  useConversationFeedback,
} from '@elevenlabs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const AGENT_ID = import.meta.env.VITE_ELEVENLABS_AGENT_ID;

interface TranscriptMessage {
  role: 'agent' | 'user';
  text: string;
  timestamp: number;
}

function VoiceWaveform({ isActive, color }: { isActive: boolean; color: string }) {
  const bars = 5;
  return (
    <div className="flex items-end gap-1 h-8">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'w-1 rounded-full transition-all duration-150',
            isActive ? 'animate-pulse' : 'h-2',
            color
          )}
          style={
            isActive
              ? {
                  height: `${12 + Math.random() * 20}px`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${0.4 + Math.random() * 0.3}s`,
                }
              : undefined
          }
        />
      ))}
    </div>
  );
}

function StatusRing({ status, mode }: { status: string; mode: string }) {
  const isLive = status === 'connected';
  const isAgentSpeaking = mode === 'speaking';

  return (
    <div className="relative w-32 h-32 mx-auto">
      {/* Outer ring */}
      <div
        className={cn(
          'absolute inset-0 rounded-full transition-all duration-500',
          isLive && isAgentSpeaking && 'ring-4 ring-blue-400/40 scale-105',
          isLive && !isAgentSpeaking && 'ring-4 ring-green-400/30',
          status === 'connecting' && 'ring-4 ring-yellow-400/30 animate-pulse',
          status === 'error' && 'ring-4 ring-red-400/30'
        )}
      />

      {/* Main circle */}
      <div
        className={cn(
          'absolute inset-2 rounded-full flex items-center justify-center transition-all duration-300',
          isLive && isAgentSpeaking && 'bg-blue-50',
          isLive && !isAgentSpeaking && 'bg-green-50',
          status === 'connecting' && 'bg-yellow-50',
          status === 'disconnected' && 'bg-muted',
          status === 'error' && 'bg-red-50'
        )}
      >
        {status === 'connecting' ? (
          <div className="animate-spin">
            <Phone className="h-8 w-8 text-yellow-600" />
          </div>
        ) : isLive && isAgentSpeaking ? (
          <Volume2 className="h-8 w-8 text-blue-600 animate-pulse" />
        ) : isLive && !isAgentSpeaking ? (
          <Mic className="h-8 w-8 text-green-600" />
        ) : status === 'error' ? (
          <AlertCircle className="h-8 w-8 text-red-500" />
        ) : (
          <Phone className="h-8 w-8 text-muted-foreground" />
        )}
      </div>

      {/* Live indicator */}
      {isLive && (
        <div className="absolute -top-1 -right-1">
          <span className="flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500" />
          </span>
        </div>
      )}
    </div>
  );
}

function TranscriptPanel({ messages }: { messages: TranscriptMessage[] }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) return null;

  return (
    <div className="rounded-lg bg-muted/50 max-h-48 overflow-y-auto p-3 space-y-2">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={cn(
            'flex gap-2 text-sm',
            msg.role === 'agent' ? 'justify-start' : 'justify-end'
          )}
        >
          <div
            className={cn(
              'rounded-lg px-3 py-1.5 max-w-[85%]',
              msg.role === 'agent'
                ? 'bg-background text-foreground'
                : 'bg-primary text-primary-foreground'
            )}
          >
            <span className="text-[10px] opacity-60 block mb-0.5">
              {msg.role === 'agent' ? 'Agent' : 'You'}
            </span>
            {msg.text}
          </div>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}

function VoiceTriageInner() {
  const { startSession, endSession, getInputByteFrequencyData, getOutputByteFrequencyData } =
    useConversationControls();
  const { status, message: errorMessage } = useConversationStatus();
  const { isSpeaking, isListening } = useConversationMode();
  const { isMuted, setMuted } = useConversationInput();
  const { canSendFeedback, sendFeedback } = useConversationFeedback();

  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [callEnded, setCallEnded] = useState(false);
  const [inputLevel, setInputLevel] = useState(0);
  const [outputLevel, setOutputLevel] = useState(0);
  const animFrameRef = useRef<number>(0);

  // Audio level meter
  useEffect(() => {
    if (status !== 'connected') {
      setInputLevel(0);
      setOutputLevel(0);
      return;
    }

    const tick = () => {
      try {
        const inData = getInputByteFrequencyData();
        const outData = getOutputByteFrequencyData();

        let inSum = 0;
        for (let i = 0; i < inData.length; i++) inSum += inData[i];
        setInputLevel(inData.length ? inSum / inData.length / 255 : 0);

        let outSum = 0;
        for (let i = 0; i < outData.length; i++) outSum += outData[i];
        setOutputLevel(outData.length ? outSum / outData.length / 255 : 0);
      } catch {}
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [status, getInputByteFrequencyData, getOutputByteFrequencyData]);

  const handleStart = useCallback(async () => {
    setMessages([]);
    setCallEnded(false);
    try {
      await startSession({
        onConnect: () => {
          toast.success('Connected');
        },
        onMessage: (msg: any) => {
          if (msg?.text) {
            setMessages(prev => [
              ...prev,
              { role: msg.source === 'user' ? 'user' : 'agent', text: msg.text, timestamp: Date.now() },
            ]);
          }
        },
        onDisconnect: () => {
          setCallEnded(true);
          setTimeout(() => setCallEnded(false), 10000);
        },
        onError: (err: string) => {
          toast.error(err);
        },
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to start');
    }
  }, [startSession]);

  const statusLabel = {
    disconnected: 'Ready',
    connecting: 'Connecting...',
    connected: isSpeaking ? 'Agent Speaking' : isListening ? 'Listening' : 'Live',
    error: 'Error',
  };

  const statusVariant = {
    disconnected: 'secondary' as const,
    connecting: 'warning' as const,
    connected: 'success' as const,
    error: 'destructive' as const,
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="pt-6 space-y-5">
        {/* Status badge */}
        <div className="flex justify-center">
          <Badge variant={statusVariant[status]}>
            {statusLabel[status]}
          </Badge>
        </div>

        {/* Status ring with icon */}
        <StatusRing status={status} mode={isSpeaking ? 'speaking' : 'listening'} />

        {/* Audio levels */}
        {status === 'connected' && (
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mic className="h-3 w-3" />
              <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-75"
                  style={{ width: `${Math.min(inputLevel * 100, 100)}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Volume2 className="h-3 w-3" />
              <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-75"
                  style={{ width: `${Math.min(outputLevel * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Waveform */}
        <div className="flex justify-center">
          <VoiceWaveform isActive={status === 'connected'} color="bg-primary" />
        </div>

        {/* Transcript */}
        <TranscriptPanel messages={messages} />

        {/* Call ended banner */}
        {callEnded && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>
              Call complete. Results in{' '}
              <Link to="/consultations" className="underline font-medium">Consultations</Link>
              {' '}and{' '}
              <Link to="/notifications" className="underline font-medium">Notifications</Link>.
            </span>
          </div>
        )}

        {/* Error banner */}
        {status === 'error' && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errorMessage || 'Connection failed. Enable microphone.'}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          {status === 'disconnected' || status === 'error' ? (
            <Button onClick={handleStart} size="lg" className="gap-2 px-8">
              <Phone className="h-4 w-4" />
              Start Call
            </Button>
          ) : (
            <>
              <Button
                variant={isMuted ? 'destructive' : 'outline'}
                size="lg"
                onClick={() => setMuted(!isMuted)}
                className="gap-2"
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {isMuted ? 'Unmute' : 'Mute'}
              </Button>

              <Button
                variant="destructive"
                size="lg"
                onClick={endSession}
                className="gap-2"
              >
                <PhoneOff className="h-4 w-4" />
                End
              </Button>
            </>
          )}
        </div>

        {/* Feedback */}
        {canSendFeedback && (
          <div className="flex justify-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => sendFeedback(true)}>
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => sendFeedback(false)}>
              <ThumbsDown className="h-4 w-4" />
            </Button>
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
              Set <code className="text-xs bg-muted px-1 py-0.5 rounded">VITE_ELEVENLABS_AGENT_ID</code> in your .env file.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <div className="w-full max-w-lg px-4">
        <ConversationProvider agentId={AGENT_ID}>
          <VoiceTriageInner />
        </ConversationProvider>
      </div>
    </div>
  );
}
