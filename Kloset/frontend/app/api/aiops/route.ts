import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, metrics, question } = body;

    if (!GEMINI_API_KEY) {
      const fallback = type === 'briefing'
        ? 'Diagnostics complete. All systems nominal. Platform operating within normal parameters.'
        : 'I am running in offline demo mode. Gemini API is not configured. Set GEMINI_API_KEY in your environment.';
      return NextResponse.json({ content: fallback });
    }

    const systemPrompt = type === 'briefing'
      ? 'You are Jarvis, an AI operations assistant for Kloset, a luxury fashion rental marketplace. Analyze the following platform metrics and provide a concise 2-sentence status briefing. Use a confident, technical tone. Highlight any anomalies or issues if present.'
      : 'You are Jarvis, an AI operations assistant for Kloset marketplace. Answer the admin\'s question based on the platform data provided. Be concise and data-driven.';

    const userMessage = type === 'briefing'
      ? `Platform Metrics:\n${JSON.stringify(metrics, null, 2)}\n\nProvide a 2-sentence status briefing.`
      : question || '';

    const prompt = `${systemPrompt}\n\n${userMessage}`;

    const response = await fetch(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', response.status, errText);
      return NextResponse.json(
        { content: `Gemini API error: ${response.status}. Running in offline mode.` }
      );
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No response from AI.';

    return NextResponse.json({ content: text });
  } catch (error) {
    console.error('AI Ops API error:', error);
    return NextResponse.json(
      { content: 'System diagnostics unavailable. Running in offline mode.' }
    );
  }
}
