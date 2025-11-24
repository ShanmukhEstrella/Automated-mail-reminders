import { Mail, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Email } from '../lib/supabase';

interface EmailInboxProps {
  emails: Email[];
  onReplyEmail: (emailId: string) => void;
}

export function EmailInbox({ emails, onReplyEmail }: EmailInboxProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'replied':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'reminded':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'replied':
        return <CheckCircle className="w-4 h-4" />;
      case 'reminded':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-3">
      {emails.map((email) => (
        <div
          key={email.id}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <h3 className="font-semibold text-gray-900">{email.subject}</h3>
                <p className="text-sm text-gray-500">{email.sender}</p>
              </div>
            </div>
            <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${getStatusColor(email.status)}`}>
              {getStatusIcon(email.status)}
              <span className="capitalize">{email.status}</span>
            </div>
          </div>

          <p className="text-sm text-gray-700 mb-3 line-clamp-2">{email.content}</p>

          {email.is_important && email.importance_reason && (
            <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-blue-900">AI Classification: Important</p>
                  <p className="text-xs text-blue-700 mt-0.5">{email.importance_reason}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Received: {new Date(email.created_at).toLocaleString()}</span>
            {email.status === 'pending' && (
              <button
                onClick={() => onReplyEmail(email.id)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Mark as Replied
              </button>
            )}
          </div>

          {email.reminder_sent_at && (
            <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-red-600">
              ⚠️ Reminder sent: {new Date(email.reminder_sent_at).toLocaleString()}
            </div>
          )}
        </div>
      ))}

      {emails.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No emails yet. Send a test email to get started.</p>
        </div>
      )}
    </div>
  );
}
