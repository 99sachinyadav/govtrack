const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const sanitizePercent = (value, fallback) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(0, Math.min(100, Math.round(numeric)));
};

const normalizeSeverity = (value, fallback = 'medium') => {
  const allowed = ['low', 'medium', 'high', 'critical'];
  return allowed.includes(value) ? value : fallback;
};

const normalizeList = (value) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item || '').trim())
    .filter(Boolean)
    .slice(0, 4);
};

const extractText = (response) =>
  response?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || '')
    .join('')
    .trim();

export const isGeminiConfigured = () => Boolean(process.env.GEMINI_API_KEY);

export const analyzeProjectUpdate = async ({
  projectTitle,
  contractorName,
  status,
  previousStatus,
  progress,
  expenses,
  budget,
  resourceUsage,
  contractorNote,
  location,
}) => {
  if (!isGeminiConfigured()) {
    return {
      status: 'skipped',
      error: 'Gemini API key is not configured.',
    };
  }

  const prompt = [
    'You are an AI assistant helping government officials understand contractor project update submissions.',
    'Summarize the update into a short official note. Respond strictly as valid JSON with no markdown or extra text.',
    'Required JSON shape:',
    '{',
    '  "summary": "short one-line summary for dashboard card",',
    '  "officialDescription": "formal explanation of what the contractor reported",',
    '  "observations": ["max 4 concise operational observations"]',
    '}',
    `Project: ${projectTitle || 'Untitled project'}`,
    `Contractor: ${contractorName || 'Unassigned contractor'}`,
    `Previous status: ${previousStatus || 'not available'}`,
    `Current status: ${status || 'not provided'}`,
    `Progress: ${Number.isFinite(progress) ? `${progress}%` : 'not provided'}`,
    `Expenses reported: ${Number.isFinite(expenses) ? expenses : 'not provided'}`,
    `Approved budget: ${Number.isFinite(budget) ? budget : 'not provided'}`,
    `Resource usage: ${resourceUsage || 'not provided'}`,
    `Contractor note: ${contractorNote || 'not provided'}`,
    `Location: ${location || 'not provided'}`,
    'The response should help an official quickly understand the operational impact of the update.',
    'Do not invent legal conclusions or compliance outcomes.',
  ].join('\n');

  const response = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini request failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawText = extractText(data);
  if (!rawText) {
    throw new Error('Gemini returned an empty response.');
  }

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    throw new Error(`Gemini returned invalid JSON: ${rawText}`);
  }

  return {
    summary: String(parsed.summary || '').trim(),
    officialDescription: String(parsed.officialDescription || parsed.summary || '').trim(),
    observations: normalizeList(parsed.observations),
    status: 'completed',
    analyzedAt: new Date(),
    model: 'gemini-2.0-flash',
  };
};

export const analyzeComplaintImage = async ({
  imageBuffer,
  mimeType,
  description,
  category,
  projectName,
  location,
}) => {
  if (!imageBuffer || !mimeType) {
    return {
      status: 'skipped',
      error: 'No image provided for AI analysis.',
    };
  }

  if (!isGeminiConfigured()) {
    return {
      status: 'skipped',
      error: 'Gemini API key is not configured.',
    };
  }

  const prompt = [
    'You are an AI assistant helping government officials review citizen grievance evidence images.',
    'Analyze the provided image and the complaint context. Respond strictly as valid JSON with no markdown or extra text.',
    'Required JSON shape:',
    '{',
    '  "summary": "short citizen-friendly summary",',
    '  "officialDescription": "formal official description of visible issue",',
    '  "riskPercentage": 0-100 integer,',
    '  "severity": "low|medium|high|critical",',
    '  "confidence": 0-100 integer,',
    '  "observations": ["max 4 concise observations"],',
    '  "recommendedActions": ["max 4 concise actions"]',
    '}',
    `Category: ${category || 'other'}`,
    `Project: ${projectName || 'General grievance'}`,
    `Location: ${location || 'Not specified'}`,
    `Citizen description: ${description || 'No description provided.'}`,
    'Base the riskPercentage on seriousness and urgency visible in the image plus the text context.',
    'If the image does not clearly prove the issue, lower confidence and mention uncertainty.',
  ].join('\n');

  const response = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: imageBuffer.toString('base64'),
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini request failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawText = extractText(data);
  if (!rawText) {
    throw new Error('Gemini returned an empty response.');
  }

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    throw new Error(`Gemini returned invalid JSON: ${rawText}`);
  }

  return {
    summary: String(parsed.summary || '').trim(),
    officialDescription: String(parsed.officialDescription || parsed.summary || '').trim(),
    riskPercentage: sanitizePercent(parsed.riskPercentage, 50),
    severity: normalizeSeverity(String(parsed.severity || '').trim().toLowerCase(), 'medium'),
    confidence: sanitizePercent(parsed.confidence, 65),
    observations: normalizeList(parsed.observations),
    recommendedActions: normalizeList(parsed.recommendedActions),
    status: 'completed',
    analyzedAt: new Date(),
    model: 'gemini-2.0-flash',
  };
};
