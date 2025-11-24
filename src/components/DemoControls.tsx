import { Settings, Zap } from 'lucide-react';

interface DemoControlsProps {
  delaySeconds: number;
  onDelayChange: (seconds: number) => void;
}

export function DemoControls({ delaySeconds, onDelayChange }: DemoControlsProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Demo Controls</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            Reminder Delay (seconds)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={delaySeconds}
              onChange={(e) => onDelayChange(Number(e.target.value))}
              className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-lg font-semibold text-blue-600 min-w-[60px] text-right">
              {delaySeconds}s
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            In production: 24 hours. For demo: {delaySeconds} seconds
          </p>
        </div>

        <div className="bg-white rounded-lg border border-blue-200 p-3">
          <h3 className="text-sm font-medium text-gray-900 mb-2">How it works:</h3>
          <ol className="text-xs text-gray-700 space-y-1 list-decimal list-inside">
            <li>Send a test email using the form</li>
            <li>AI classifies importance in real-time</li>
            <li>Important emails start a timer</li>
            <li>If no reply after delay, reminder appears</li>
            <li>Slack-style notification shown on screen</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
