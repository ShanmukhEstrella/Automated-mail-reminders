import { Bell, X } from 'lucide-react';
import { Reminder, Email } from '../lib/supabase';

interface ReminderWithEmail extends Reminder {
  email?: Email;
}

interface ReminderNotificationsProps {
  reminders: ReminderWithEmail[];
  onDismiss: (reminderId: string) => void;
}

export function ReminderNotifications({ reminders, onDismiss }: ReminderNotificationsProps) {
  if (reminders.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 w-96 max-h-[80vh] overflow-y-auto space-y-3 z-50">
      {reminders.map((reminder) => (
        <div
          key={reminder.id}
          className="bg-red-50 border-2 border-red-300 rounded-lg p-4 shadow-lg animate-slide-in"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-red-600 animate-pulse" />
              <h3 className="font-semibold text-red-900">Follow-Up Required</h3>
            </div>
            <button
              onClick={() => onDismiss(reminder.id)}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm text-red-800 mb-2">{reminder.message}</p>

          {reminder.email && (
            <div className="bg-white rounded p-2 border border-red-200">
              <p className="text-xs font-medium text-gray-900">{reminder.email.subject}</p>
              <p className="text-xs text-gray-600 mt-1">From: {reminder.email.sender}</p>
            </div>
          )}

          <div className="mt-2 text-xs text-red-600">
            Sent: {new Date(reminder.sent_at).toLocaleTimeString()}
          </div>
        </div>
      ))}
    </div>
  );
}
