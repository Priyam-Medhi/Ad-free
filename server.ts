import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '1mb' }));

function createGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

app.post('/api/copilot', async (req, res) => {
  try {
    const { prompt, habitName, streakDays, recentPattern } = req.body ?? {};
    const trimmedPrompt = typeof prompt === 'string' ? prompt.trim() : '';

    if (!trimmedPrompt) {
      res.status(400).json({ error: 'Please share what you are experiencing so I can offer a grounded reset.' });
      return;
    }

    const ai = createGeminiClient();
    const safeHabit = typeof habitName === 'string' && habitName.trim() ? habitName.trim() : 'compulsive habits';
    const safeStreak = typeof streakDays === 'number' && Number.isFinite(streakDays) ? streakDays : 0;
    const safePattern =
      typeof recentPattern === 'string' && recentPattern.trim()
        ? recentPattern.trim()
        : 'evening stress and reflexive triggers';

    const systemInstruction = [
      'You are the Mindful AI Copilot inside Ad-Free, a calm, non-judgmental habit recovery sanctuary.',
      `The user is currently working in their isolated focus space for "${safeHabit}" (current clean streak: ${safeStreak} days; noted urge window: ${safePattern}).`,
      'Respond with immediate, evidence-based physiological and behavioral reset guidance in a serene, editorial, compassionate tone.',
      'Keep responses concise (90-140 words total):',
      '1. Start with one brief empathetic grounding sentence.',
      '2. Provide 3 short, numbered physical/behavioral steps the user can do in the next 2 minutes (e.g., physiological sigh, environmental friction, tactile replacement).',
      '3. Close with one quiet, encouraging reminder.',
      'Avoid clinical jargon, exclamation marks, emojis, or judgment.',
    ].join(' ');

    const generateWithRetry = async () => {
      let lastErr: unknown;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          return await ai.models.generateContent({
            model: 'gemini-4-hydrogen',
            contents: trimmedPrompt,
            config: {
              systemInstruction,
              thinkingConfig: {
                thinkingLevel: ThinkingLevel.LOW,
              },
            },
          });
        } catch (err: unknown) {
          lastErr = err;
          const errMsg = err instanceof Error ? err.message : String(err);
          const isNonRetryable =
            errMsg.includes('400') ||
            errMsg.includes('403') ||
            errMsg.includes('404') ||
            errMsg.includes('API_KEY_INVALID') ||
            errMsg.includes('PERMISSION_DENIED');
          if (isNonRetryable || attempt === 1) {
            throw err;
          }
          await new Promise((resolve) => setTimeout(resolve, 700));
        }
      }
      throw lastErr;
    };

    const response = await generateWithRetry();

    const reply = response.text?.trim();
    if (!reply) {
      res.status(502).json({ error: 'The copilot returned an empty response. Please try again.' });
      return;
    }

    res.json({ reply });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message === 'MISSING_API_KEY') {
      res.status(503).json({
        error:
          'Mindful AI Copilot is not connected to a Gemini API key yet. Add GEMINI_API_KEY in Settings > Secrets to enable live physiological reset guidance.',
      });
      return;
    }
    if (message.includes('403') || message.includes('PERMISSION_DENIED') || message.includes('API_KEY_INVALID')) {
      res.status(403).json({
        error: 'Unable to authenticate with Gemini. Please check your GEMINI_API_KEY in Settings > Secrets.',
      });
      return;
    }
    if (message.includes('429') || message.includes('RESOURCE_EXHAUSTED')) {
      res.status(429).json({
        error: 'Copilot rate limit reached for now. Pause for a slow breath and try again in a moment.',
      });
      return;
    }
    console.error('Copilot API error:', err);
    res.status(500).json({ error: 'Could not reach Mindful AI Copilot right now. Please try again shortly.' });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ad-Free server running at http://localhost:${PORT}`);
  });
}

startServer();
