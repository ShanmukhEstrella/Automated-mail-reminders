import { useState, useEffect } from 'react';
import { supabase, Email, Reminder } from './lib/supabase';
import { classifyEmail } from './services/emailClassifier';
import { EmailInbox } from './components/EmailInbox';
import { NewEmailForm } from './components/NewEmailForm';
import { ReminderNotifications } from './components/ReminderNotifications';
import { DemoControls } from './components/DemoControls';
import { Mail } from 'lucide-react';

function App() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [delaySeconds, setDelaySeconds] = useState(10);
  const [activeTimers, setActiveTimers] = useState<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    loadEmails();
    loadReminders();

    const emailSubscription = supabase
      .channel('emails-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'emails' }, () => {
        loadEmails();
      })
      .subscribe();

    const reminderSubscription = supabase
      .channel('reminders-channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reminders' }, () => {
        loadReminders();
      })
      .subscribe();

    return () => {
      emailSubscription.unsubscribe();
      reminderSubscription.unsubscribe();
      activeTimers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  const loadEmails = async () => {
    const { data } = await supabase
      .from('emails')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setEmails(data);
    }
  };

  const loadReminders = async () => {
    const { data } = await supabase
      .from('reminders')
      .select('*')
      .order('sent_at', { ascending: false });

    if (data) {
      setReminders(data);
    }
  };

  const handleNewEmail = async (subject: string, content: string, sender: string) => {
    setIsProcessing(true);

    try {
      const classification = await classifyEmail(subject, content);

      const { data: email, error } = await supabase
        .from('emails')
        .insert({
          subject,
          content,
          sender,
          is_important: classification.isImportant,
          importance_reason: classification.reason,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      if (email && classification.isImportant) {
        scheduleReminder(email.id, subject, sender);
      }
    } catch (error) {
      console.error('Error processing email:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const scheduleReminder = (emailId: string, subject: string, sender: string) => {
    const timer = setTimeout(async () => {
      const { data: email } = await supabase
        .from('emails')
        .select('*')
        .eq('id', emailId)
        .single();

      if (email && email.status === 'pending') {
        await supabase
          .from('emails')
          .update({
            status: 'reminded',
            reminder_sent_at: new Date().toISOString()
          })
          .eq('id', emailId);

        await supabase
          .from('reminders')
          .insert({
            email_id: emailId,
            message: `No response received for email: "${subject}" from ${sender}. This requires follow-up action.`
          });
      }

      setActiveTimers(prev => {
        const newMap = new Map(prev);
        newMap.delete(emailId);
        return newMap;
      });
    }, delaySeconds * 1000);

    setActiveTimers(prev => new Map(prev).set(emailId, timer));
  };

  const handleReplyEmail = async (emailId: string) => {
    const timer = activeTimers.get(emailId);
    if (timer) {
      clearTimeout(timer);
      setActiveTimers(prev => {
        const newMap = new Map(prev);
        newMap.delete(emailId);
        return newMap;
      });
    }

    await supabase
      .from('emails')
      .update({
        status: 'replied',
        replied_at: new Date().toISOString()
      })
      .eq('id', emailId);
  };

  const handleDismissReminder = async (reminderId: string) => {
    setReminders(prev => prev.filter(r => r.id !== reminderId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ReminderNotifications
        reminders={reminders.map(r => ({
          ...r,
          email: emails.find(e => e.id === r.email_id)
        }))}
        onDismiss={handleDismissReminder}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Mail className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              AI Email Follow-Up System
            </h1>
          </div>
          <p className="text-gray-600">
            Automated reminders for important emails that need responses
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <NewEmailForm
              onSubmit={handleNewEmail}
              isProcessing={isProcessing}
            />
            <DemoControls
              delaySeconds={delaySeconds}
              onDelayChange={setDelaySeconds}
            />
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Shared Inbox ({emails.length})
              </h2>
              <EmailInbox
                emails={emails}
                onReplyEmail={handleReplyEmail}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
