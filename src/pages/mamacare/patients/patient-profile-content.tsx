import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RISK_COLORS, REFERRAL_STATUS_COLORS } from '@/lib/mamacare/constants';
import type { Patient, RiskLevel, ReferralStatus, Consultation } from '@/lib/mamacare/types';
import { useMamaCare } from '@/providers/mamacare-provider';
import { RiskTrendChart } from './components/risk-trend-chart';
import { ActionLog } from './components/action-log';
import {
  ArrowRightLeft,
  ChevronDown,
  Activity,
  Heart,
  Moon,
  Droplets,
} from 'lucide-react';

const RISK_BADGE_VARIANT: Record<RiskLevel, BadgeProps['variant']> = {
  HIGH: RISK_COLORS.HIGH as BadgeProps['variant'],
  MEDIUM: RISK_COLORS.MEDIUM as BadgeProps['variant'],
  LOW: RISK_COLORS.LOW as BadgeProps['variant'],
};

const REFERRAL_BADGE_VARIANT: Record<ReferralStatus, BadgeProps['variant']> = {
  Pending: REFERRAL_STATUS_COLORS.Pending as BadgeProps['variant'],
  'In Transit': REFERRAL_STATUS_COLORS['In Transit'] as BadgeProps['variant'],
  Admitted: REFERRAL_STATUS_COLORS.Admitted as BadgeProps['variant'],
  Resolved: REFERRAL_STATUS_COLORS.Resolved as BadgeProps['variant'],
  'Lost to Follow-up': REFERRAL_STATUS_COLORS['Lost to Follow-up'] as BadgeProps['variant'],
};

function StatCard({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children?: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{value}</span>
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

function OverviewTab({ patient }: { patient: Patient }) {
  const { referrals, actionLogs } = useMamaCare();
  const patientReferrals = referrals.filter(
    (r) => r.patientId === patient.id,
  );
  const patientActions = actionLogs.filter(
    (a) => a.patientId === patient.id,
  );
  const sortedActions = [...patientActions].sort(
    (a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  const timelineSteps = [
    {
      label: 'Registration',
      date: patient.registrationDate,
      note: `Registered for MamaCare - ${patient.pathway} pathway`,
    },
    ...sortedActions
      .filter((a) => a.type !== 'Registration')
      .map((a) => ({
        label: a.type,
        date: a.timestamp,
        note: a.description,
      })),
  ];

  const initials = patient.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Demographics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="size-14">
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{patient.name}</p>
              <p className="text-sm text-muted-foreground">
                Age {patient.age} · {patient.language}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
            <div>
              <span className="text-muted-foreground">Pathway</span>
              <p className="font-medium">{patient.pathway}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Stage</span>
              <p className="font-medium">{patient.stage}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Language</span>
              <p className="font-medium">{patient.language}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Registered</span>
              <p className="font-medium">
                {new Date(patient.registrationDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Assigned CHW</span>
              <p className="font-medium">{patient.assignedChw}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Risk Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <RiskTrendChart riskHistory={patient.riskHistory} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Language &amp; Communication</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">
            Primary language: <span className="font-medium text-foreground">{patient.language}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            AI consultations are conducted in {patient.language}. Transcripts and summaries are translated for provider review.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          {patientReferrals.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active referrals</p>
          ) : (
            <div className="flex flex-col gap-3">
              {patientReferrals.map((ref) => (
                <div
                  key={ref.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{ref.facilityName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(ref.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <Badge
                    variant={REFERRAL_BADGE_VARIANT[ref.status]}
                    size="sm"
                  >
                    {ref.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Care Loop Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-96">
            <div className="flex flex-col">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-4 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex size-7 shrink-0 items-center justify-center rounded-full ${
                        idx === timelineSteps.length - 1
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-accent text-accent-foreground'
                      }`}
                    >
                      <span className="text-xs font-medium">{idx + 1}</span>
                    </div>
                    {idx < timelineSteps.length - 1 && (
                      <div className="w-px flex-1 bg-border min-h-6" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{step.label}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(step.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {step.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

function ConsultationsTab({ patient }: { patient: Patient }) {
  const { consultations } = useMamaCare();
  const patientConsultations = consultations
    .filter((c) => c.patientId === patient.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const [openRows, setOpenRows] = useState<Set<string>>(new Set());

  function toggleRow(id: string) {
    setOpenRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Language</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Symptoms</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Risk</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Summary</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Referral</th>
                <th className="w-10 p-4" />
              </tr>
            </thead>
            <tbody>
              {patientConsultations.map((c) => (
                <ConsultationRow
                  key={c.id}
                  consultation={c}
                  isOpen={openRows.has(c.id)}
                  onToggle={() => toggleRow(c.id)}
                />
              ))}
              {patientConsultations.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-muted-foreground">
                    No consultations recorded
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function ConsultationRow({
  consultation,
  isOpen,
  onToggle,
}: {
  consultation: Consultation;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr className="border-b hover:bg-accent/50 cursor-pointer" onClick={onToggle}>
        <td className="p-4">
          {new Date(consultation.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </td>
        <td className="p-4">{consultation.language}</td>
        <td className="p-4 max-w-48">
          <span className="truncate block">{consultation.symptoms.join(', ')}</span>
        </td>
        <td className="p-4">
          <Badge
            variant={RISK_BADGE_VARIANT[consultation.riskLevel]}
            size="sm"
          >
            {consultation.riskLevel}
          </Badge>
        </td>
        <td className="p-4 max-w-64">
          <span className="line-clamp-2 text-muted-foreground">
            {consultation.aiSummary}
          </span>
        </td>
        <td className="p-4">
          {consultation.triggeredReferral && (
            <ArrowRightLeft className="size-4 text-destructive" />
          )}
        </td>
        <td className="p-4">
          <ChevronDown
            className={`size-4 text-muted-foreground transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </td>
      </tr>
      {isOpen && (
        <tr className="border-b bg-accent/20">
          <td colSpan={7} className="p-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Transcript</p>
              <div className="flex flex-col gap-2">
                {consultation.transcript.map((line, i) => (
                  <div
                    key={i}
                    className={`flex gap-2 text-sm ${
                      line.speaker === 'AI' ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-3 py-2 ${
                        line.speaker === 'AI'
                          ? 'bg-accent'
                          : 'bg-primary/10'
                      }`}
                    >
                      <span className="text-xs font-medium text-muted-foreground block mb-0.5">
                        {line.speaker === 'AI' ? 'AI' : 'Mother'}
                      </span>
                      {line.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function VitalsRecoveryTab({ patient }: { patient: Patient }) {
  if (patient.pathway === 'Pregnancy') {
    return <PregnancyVitals patient={patient} />;
  }
  return <PostLossVitals patient={patient} />;
}

function PregnancyVitals({ patient }: { patient: Patient }) {
  const bpData = [
    { date: 'Week 12', systolic: 110, diastolic: 70 },
    { date: 'Week 20', systolic: 118, diastolic: 76 },
    { date: 'Week 28', systolic: 135, diastolic: 88 },
    { date: 'Current', systolic: parseInt(patient.bloodPressure?.split('/')[0] ?? '120'), diastolic: parseInt(patient.bloodPressure?.split('/')[1]?.replace(/\D/g, '') ?? '80') },
  ];

  const kickData = [
    { date: 'Week 24', count: 14 },
    { date: 'Week 28', count: 12 },
    { date: 'Week 30', count: 10 },
    { date: 'Current', count: patient.kickCount ?? 0 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="size-4" />
            Blood Pressure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bpData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={35} />
                <Tooltip />
                <Line type="monotone" dataKey="systolic" stroke="hsl(var(--color-destructive, var(--color-red-500)))" strokeWidth={2} dot={{ r: 4 }} name="Systolic" />
                <Line type="monotone" dataKey="diastolic" stroke="hsl(var(--color-primary-accent, var(--color-blue-600)))" strokeWidth={2} dot={{ r: 4 }} name="Diastolic" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Current: <span className="font-medium text-foreground">{patient.bloodPressure ?? 'N/A'}</span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="size-4" />
            Kick Count
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kickData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={35} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--color-primary-accent, var(--color-blue-600)))" radius={[4, 4, 0, 0]} name="Kicks/hr" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Current: <span className="font-medium text-foreground">{patient.kickCount ?? 'N/A'} kicks/hr</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function PostLossVitals({ patient }: { patient: Patient }) {
  const copingData = [
    { date: 'Month 1', index: 3 },
    { date: 'Month 2', index: 4 },
    { date: 'Month 3', index: 5 },
    { date: 'Current', index: patient.copingIndex ?? 5 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="size-4" />
            Coping Index
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={copingData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={35} />
                <Tooltip />
                <Line type="monotone" dataKey="index" stroke="hsl(var(--color-primary-accent, var(--color-blue-600)))" strokeWidth={2} dot={{ r: 4 }} name="Coping Index" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Current: <span className="font-medium text-foreground">{patient.copingIndex ?? 'N/A'}/10</span>
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="size-4" />
              Sleep Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Badge
                variant={
                  patient.sleepQuality === 'Good'
                    ? 'success'
                    : patient.sleepQuality === 'Fair'
                      ? 'warning'
                      : 'destructive'
                }
                size="lg"
              >
                {patient.sleepQuality ?? 'N/A'}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Self-reported sleep quality
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="size-4" />
              Bleeding Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant={patient.bleedingStatus === 'None' ? 'success' : 'destructive'}
              size="lg"
            >
              {patient.bleedingStatus ?? 'N/A'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grief Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Initial grief counselling</span>
                <Badge variant="success" size="sm">Completed</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Community support group</span>
                <Badge variant="success" size="sm">Completed</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Quarterly review transition</span>
                <Badge variant="secondary" size="sm">
                  {(patient.copingIndex ?? 0) >= 7 ? 'Completed' : 'In Progress'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ReferralsTab({ patient }: { patient: Patient }) {
  const { referrals } = useMamaCare();
  const patientReferrals = referrals
    .filter((r) => r.patientId === patient.id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return (
    <div className="flex flex-col gap-4">
      {patientReferrals.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No referrals for this patient
          </CardContent>
        </Card>
      )}
      {patientReferrals.map((ref) => (
        <Card key={ref.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{ref.facilityName}</CardTitle>
              <Badge
                variant={REFERRAL_BADGE_VARIANT[ref.status]}
                size="md"
              >
                {ref.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Risk: </span>
                  <Badge
                    variant={RISK_BADGE_VARIANT[ref.riskLevel]}
                    size="sm"
                  >
                    {ref.riskLevel}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">CHW: </span>
                  <span className="font-medium">{ref.assignedChw}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Created: </span>
                  <span className="font-medium">
                    {new Date(ref.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {ref.outcome && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Outcome: </span>
                  <span>{ref.outcome}</span>
                </div>
              )}

              <div>
                <p className="text-sm font-medium mb-2">Timeline</p>
                <div className="flex flex-col">
                  {ref.timeline.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 pb-3 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <span className="text-[10px]">{idx + 1}</span>
                        </div>
                        {idx < ref.timeline.length - 1 && (
                          <div className="w-px flex-1 bg-border min-h-4" />
                        )}
                      </div>
                      <div className="pt-0.5">
                        <p className="text-sm font-medium">{step.stage}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(step.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        {step.note && (
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {step.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ActionLogTab({ patient }: { patient: Patient }) {
  const { actionLogs } = useMamaCare();
  const patientActions = actionLogs.filter(
    (a) => a.patientId === patient.id,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Full Action Log</CardTitle>
      </CardHeader>
      <CardContent>
        <ActionLog entries={patientActions} />
      </CardContent>
    </Card>
  );
}

export function PatientProfileContent({
  patient,
}: {
  patient: Patient;
}) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Risk Level"
          value={patient.riskLevel}
        >
          <Badge
            variant={RISK_BADGE_VARIANT[patient.riskLevel]}
            size="sm"
          />
        </StatCard>
        <StatCard label="Stage" value={patient.stage ?? 'N/A'} />
        <StatCard
          label="Last Call"
          value={new Date(patient.lastCallDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        />
        <StatCard label="Assigned CHW" value={patient.assignedChw} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="vitals">Vitals &amp; Recovery</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="action-log">Action Log</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <OverviewTab patient={patient} />
        </TabsContent>
        <TabsContent value="consultations">
          <ConsultationsTab patient={patient} />
        </TabsContent>
        <TabsContent value="vitals">
          <VitalsRecoveryTab patient={patient} />
        </TabsContent>
        <TabsContent value="referrals">
          <ReferralsTab patient={patient} />
        </TabsContent>
        <TabsContent value="action-log">
          <ActionLogTab patient={patient} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
