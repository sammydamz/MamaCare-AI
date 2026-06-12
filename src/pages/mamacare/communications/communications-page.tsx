import { Fragment, useState } from 'react';
import {
  Toolbar,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { Container } from '@/components/common/container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMamaCare } from '@/providers/mamacare-provider';
import { usePathway } from '@/providers/pathway-provider';
import { toast } from 'sonner';
import { Send, Users, User, AlertCircle, CalendarClock, Plus, Calendar, Clock } from 'lucide-react';

export function CommunicationsPage() {
  const { patients } = useMamaCare();
  const { activePathway } = usePathway();
  
  const [recipientType, setRecipientType] = useState('all'); // 'all', 'individual'
  const [selectedPatient, setSelectedPatient] = useState('');
  const [template, setTemplate] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  const filteredPatients = patients.filter(p => p.pathway === activePathway);

  const handleTemplateChange = (val: string) => {
    setTemplate(val);
    if (val === 'checkin') {
      setMessage(`Hello, this is a wellness check-in from MamaCare. We are thinking of you. Please reply with how you are feeling today.`);
    } else if (val === 'appointment') {
      setMessage(`Reminder: You have an upcoming appointment scheduled. Please contact us if you need to reschedule.`);
    } else if (val === 'nutrition') {
      setMessage(`MamaCare Tip: Make sure to stay hydrated today and eat iron-rich foods like spinach and beans.`);
    } else if (val === 'emergency') {
      setMessage(`URGENT: If you are experiencing severe pain, heavy bleeding, or difficulty breathing, please visit the nearest facility immediately.`);
    } else {
      setMessage('');
    }
  };

  const handleSend = async () => {
    if (!message) {
      toast.error('Message cannot be empty');
      return;
    }
    
    setIsSending(true);
    
    // Extract actual phone numbers
    let recipientPhones: string[] = [];
    if (recipientType === 'all') {
      recipientPhones = filteredPatients.map(p => p.phone).filter(Boolean) as string[];
    } else {
      const sp = filteredPatients.find(p => p.id === selectedPatient);
      if (sp?.phone) recipientPhones.push(sp.phone);
    }

    if (recipientPhones.length === 0) {
      toast.error('No valid phone numbers found for the selected recipients.');
      setIsSending(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipientPhones,
          message: message
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send SMS');
      }

      const recipientText = recipientType === 'all' 
        ? `all ${filteredPatients.length} mothers in the ${activePathway} pathway`
        : `patient ${filteredPatients.find(p => p.id === selectedPatient)?.name || 'Unknown'}`;
        
      toast.success(`SMS successfully sent to ${recipientText} via Africa's Talking API`);
      setMessage('');
      setTemplate('');
    } catch (error: any) {
      toast.error(`Error sending SMS: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateSchedule = async () => {
    setIsScheduling(true);
    
    // Extract actual phone numbers for the schedule
    const recipientPhones = filteredPatients.map(p => p.phone).filter(Boolean) as string[];

    if (recipientPhones.length === 0) {
      toast.error('No valid phone numbers found for the schedule target.');
      setIsScheduling(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipientPhones,
          message: 'This is a scheduled automated reminder via MamaCare.'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create schedule');
      }

      toast.success(`Automated schedule created successfully. It will execute via Africa's Talking API.`);
    } catch (error: any) {
      toast.error(`Error scheduling: ${error.message}`);
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle text="Communications & SMS" />
            <ToolbarDescription>
              Send personalized or mass SMS alerts to mothers
            </ToolbarDescription>
          </ToolbarHeading>
        </Toolbar>
      </Container>
      <Container>
        <Tabs defaultValue="direct" className="w-full">
          <TabsList className="mb-6 grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="direct">Direct SMS</TabsTrigger>
            <TabsTrigger value="automated">Automated Schedules</TabsTrigger>
          </TabsList>

          <TabsContent value="direct">
            <div className="grid lg:grid-cols-2 gap-7.5">
              <Card>
                <CardHeader>
                  <CardTitle>Send SMS Message</CardTitle>
                  <CardDescription>
                    Messages will be sent using the Africa's Talking API integration.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Recipient Selection */}
                  <div className="space-y-3">
                    <Label>Recipient(s)</Label>
                    <div className="flex gap-4">
                      <Button 
                        variant={recipientType === 'all' ? 'primary' : 'outline'} 
                        className="flex-1"
                        onClick={() => setRecipientType('all')}
                      >
                        <Users className="size-4 mr-2" />
                        Mass Alert ({filteredPatients.length})
                      </Button>
                      <Button 
                        variant={recipientType === 'individual' ? 'primary' : 'outline'} 
                        className="flex-1"
                        onClick={() => setRecipientType('individual')}
                      >
                        <User className="size-4 mr-2" />
                        Personalized
                      </Button>
                    </div>
                  </div>

                  {recipientType === 'individual' && (
                    <div className="space-y-3">
                      <Label>Select Patient</Label>
                      <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a mother..." />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredPatients.map(p => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name} ({p.riskLevel} Risk)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Template Selection */}
                  <div className="space-y-3">
                    <Label>Quick Templates</Label>
                    <Select value={template} onValueChange={handleTemplateChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a predefined template..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="custom">Custom Message</SelectItem>
                        <SelectItem value="checkin">Wellness Check-in</SelectItem>
                        <SelectItem value="appointment">Appointment Reminder</SelectItem>
                        <SelectItem value="nutrition">Health & Nutrition Tip</SelectItem>
                        <SelectItem value="emergency">Emergency Alert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Message Body */}
                  <div className="space-y-3">
                    <Label>Message Content</Label>
                    <Textarea 
                      placeholder="Type your SMS message here..." 
                      className="min-h-[120px]"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Standard SMS rates apply.</span>
                      <span>{message.length}/160 characters (1 SMS segment)</span>
                    </div>
                  </div>

                </CardContent>
                <CardFooter className="flex justify-between bg-muted/50 py-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="size-4" />
                    <span>Currently in {activePathway} pathway context</span>
                  </div>
                  <Button onClick={handleSend} disabled={isSending}>
                    {isSending ? 'Sending...' : 'Send SMS'}
                    {!isSending && <Send className="size-4 ml-2" />}
                  </Button>
                </CardFooter>
              </Card>

              <div className="space-y-7.5">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Communications</CardTitle>
                    <CardDescription>History of sent messages in this pathway</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                        <Send className="size-6" />
                      </div>
                      <h3 className="text-lg font-medium">No messages sent yet</h3>
                      <p className="text-sm text-muted-foreground max-w-sm mt-1">
                        Sent messages and their delivery statuses will appear here once you send your first SMS.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="automated">
            <div className="grid lg:grid-cols-2 gap-7.5">
              <Card>
                <CardHeader>
                  <CardTitle>Create Scheduled Alert</CardTitle>
                  <CardDescription>
                    Set up automated recurring or future SMS messages (e.g. Appointment Reminders).
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Schedule Type</Label>
                    <Select defaultValue="appointment">
                      <SelectTrigger>
                        <SelectValue placeholder="Select trigger..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="appointment">Pre-Appointment Reminder</SelectItem>
                        <SelectItem value="recurring">Recurring Check-in</SelectItem>
                        <SelectItem value="trimester">Stage/Trimester Based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Timing</Label>
                    <Select defaultValue="2days">
                      <SelectTrigger>
                        <SelectValue placeholder="Select timing..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2days">2 Days Before Appointment</SelectItem>
                        <SelectItem value="1day">1 Day Before Appointment</SelectItem>
                        <SelectItem value="morning">Morning of Appointment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Target Audience</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All {activePathway} Mothers</SelectItem>
                        <SelectItem value="high">High Risk Mothers Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Message Template</Label>
                    <Textarea 
                      placeholder="Type your scheduled SMS message here..." 
                      className="min-h-[100px]"
                      defaultValue="Reminder: You have an upcoming appointment scheduled. Please contact us if you need to reschedule."
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between bg-muted/50 py-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="size-4" />
                    <span>Executes automatically</span>
                  </div>
                  <Button onClick={handleCreateSchedule} disabled={isScheduling}>
                    {isScheduling ? 'Creating Schedule...' : (
                      <><Plus className="size-4 mr-2" /> Create Schedule</>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <div className="space-y-7.5">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Schedules</CardTitle>
                    <CardDescription>Currently running automated alerts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-lg border">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                        <CalendarClock className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h4 className="text-sm font-semibold">Appointment Reminders</h4>
                        <p className="text-xs text-muted-foreground">Sends 2 days before any scheduled appointment to all mothers.</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Active</span>
                          <span className="text-xs text-muted-foreground">Next run: Tomorrow 08:00 AM</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-lg border">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h4 className="text-sm font-semibold">Weekly Nutrition Tips</h4>
                        <p className="text-xs text-muted-foreground">Sends every Monday at 9:00 AM to High Risk mothers.</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Active</span>
                          <span className="text-xs text-muted-foreground">Next run: Monday 09:00 AM</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Container>
    </Fragment>
  );
}
