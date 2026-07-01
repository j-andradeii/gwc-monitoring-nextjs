import { NextResponse } from 'next/server';
import { sectionLyrics, type LyricSection } from '@/lib/lyrics/section-lyrics';

/**
 * AI section detection for lyrics.
 *
 * Uses Gemini to group raw lyrics into accurately-labelled musical sections
 * (Verse 1, Chorus, PreChorus, Bridge, ...), which the blank-line heuristic can't
 * reliably do. Falls back to the heuristic (`sectionLyrics`) whenever the key is
 * missing, the API errors/times out, or the model returns implausible output — so
 * the endpoint always returns usable sections.
 *
 * Requires `GEMINI_API_KEY` (server-only). Model via `GEMINI_MODEL` (default
 * gemini-2.5-flash). The key lives in `.env.local` (gitignored).
 */

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const PROMPT = `You label the sections of song lyrics for worship presentation software (like ProPresenter / MultiTracks). Group the lyrics below into their musical sections and give each an accurate label such as: Intro, Verse 1, Verse 2, PreChorus, Chorus, Bridge, Tag, Instrumental, Interlude, Outro, Ending.

Rules:
- Keep every line EXACTLY as given — verbatim. Do NOT paraphrase, translate, fix spelling, add, merge, or remove words.
- Preserve the original order of the lines.
- When a block of lyrics repeats, give it the SAME label each time it appears (the recurring hook is "Chorus" every time it returns).
- Number distinct repeated section types sequentially (Verse 1, Verse 2, ...).
- If the lyrics already contain section markers, respect them.
- Ignore non-lyric metadata lines (song credits, CCLI numbers, contributor names).
- Do not output blank lines as entries.
Return only the structured sections.`;

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    sections: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          lines: { type: 'array', items: { type: 'string' } },
        },
        required: ['label', 'lines'],
      },
    },
  },
  required: ['sections'],
};

interface RawSection {
  label?: unknown;
  lines?: unknown;
}

function heuristic(plainLyrics: string, reason?: string) {
  return NextResponse.json({
    sections: sectionLyrics(plainLyrics),
    source: 'heuristic',
    ...(reason ? { reason } : {}),
  });
}

export async function POST(request: Request) {
  let plainLyrics = '';
  try {
    const body = await request.json();
    plainLyrics = String((body as { plainLyrics?: unknown })?.plainLyrics ?? '');
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!plainLyrics.trim()) {
    return NextResponse.json({ error: 'No lyrics provided.' }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return heuristic(plainLyrics, 'no-api-key');

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: 'POST',
        headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `${PROMPT}\n\nLyrics:\n${plainLyrics}` }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: RESPONSE_SCHEMA,
            temperature: 0.2,
          },
        }),
        signal: AbortSignal.timeout(40000),
      },
    );

    if (!response.ok) {
      console.error('Gemini sectioning HTTP', response.status);
      return heuristic(plainLyrics, `gemini-${response.status}`);
    }

    const data = await response.json();
    const text: unknown = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = typeof text === 'string' ? JSON.parse(text) : null;
    const rawSections: RawSection[] = Array.isArray(parsed?.sections) ? parsed.sections : [];

    const sections: LyricSection[] = rawSections
      .map((section) => ({
        label:
          typeof section.label === 'string' && section.label.trim()
            ? section.label.trim()
            : 'Section',
        lines: Array.isArray(section.lines)
          ? section.lines.map((line) => String(line).trim()).filter(Boolean)
          : [],
      }))
      .filter((section) => section.lines.length > 0);

    // Sanity guard: if the model dropped most of the lyrics, trust the heuristic instead.
    const inputLines = plainLyrics.split('\n').map((l) => l.trim()).filter(Boolean).length;
    const aiLines = sections.reduce((total, section) => total + section.lines.length, 0);
    if (sections.length === 0 || aiLines < inputLines * 0.6) {
      return heuristic(plainLyrics, 'low-coverage');
    }

    return NextResponse.json({ sections, source: 'ai' });
  } catch (error) {
    console.error('Gemini sectioning failed:', error);
    return heuristic(plainLyrics, 'exception');
  }
}
