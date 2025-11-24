import { useState } from 'react';
import { Send } from 'lucide-react';

interface NewEmailFormProps {
  onSubmit: (subject: string, content: string, sender: string) => void;
  isProcessing: boolean;
}

export function NewEmailForm({ onSubmit, isProcessing }: NewEmailFormProps) {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [sender, setSender] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subject.trim() && content.trim() && sender.trim()) {
      onSubmit(subject, content, sender);
      setSubject('');
      setContent('');
      setSender('');
    }
  };

  const quickFillImportant = () => {
    setSubject('URGENT: Client Payment Issue');
    setContent('Hi team, we have a critical payment issue with our largest client. They need a response by tomorrow at 3 PM. Please review the attached invoice and get back to me ASAP.');
    setSender('finance@client.com');
  };

  const quickFillNormal = () => {
    setSubject('Team Newsletter - February Edition');
    setContent('Hello everyone! Here is our monthly newsletter with updates from around the company. Enjoy reading about our latest achievements and upcoming events.');
    setSender('hr@company.com');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Simulate New Email</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={quickFillImportant}
            className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
          >
            Fill Important
          </button>
          <button
            type="button"
            onClick={quickFillNormal}
            className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Fill Normal
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From
          </label>
          <input
            type="text"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            placeholder="sender@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Email content..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          {isProcessing ? 'Processing...' : 'Send Test Email'}
        </button>
      </div>
    </form>
  );
}
