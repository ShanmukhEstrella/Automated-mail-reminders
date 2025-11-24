export interface ClassificationResult {
  isImportant: boolean;
  reason: string;
}

export async function classifyEmail(
  subject: string,
  content: string
): Promise<ClassificationResult> {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const keywords = {
    urgent: ['urgent', 'asap', 'important', 'critical', 'emergency', 'immediate'],
    action: ['please review', 'need response', 'requires action', 'waiting for', 'deadline'],
    business: ['invoice', 'payment', 'contract', 'proposal', 'meeting', 'client']
  };

  const fullText = `${subject} ${content}`.toLowerCase();

  let score = 0;
  const reasons: string[] = [];

  for (const [category, words] of Object.entries(keywords)) {
    const matches = words.filter(word => fullText.includes(word));
    if (matches.length > 0) {
      score += matches.length;
      reasons.push(`Contains ${category} keywords: ${matches.join(', ')}`);
    }
  }

  if (fullText.includes('?') && fullText.split('?').length > 2) {
    score += 2;
    reasons.push('Multiple questions requiring answers');
  }

  const hasDeadline = /\d{1,2}\/\d{1,2}|\d{1,2}:\d{2}|today|tomorrow|this week/i.test(fullText);
  if (hasDeadline) {
    score += 3;
    reasons.push('Contains time-sensitive information');
  }

  const isImportant = score >= 2;

  return {
    isImportant,
    reason: isImportant
      ? reasons.join('. ')
      : 'No urgent keywords or action items detected. Appears to be informational or low priority.'
  };
}
