import { NextResponse } from 'next/server';
import { splitLongLine } from '@/lib/lyrics/section-lyrics';

/**
 * AI line-break suggestions for overly-long lyric lines ("smart long-line handling",
 * rule 2 — wrapping a too-long line into two display rows for a ProPresenter slide).
 *
 * Mirrors `/api/lyrics/section`: Gemini proposes the natural break point, validated
 * to be VERBATIM (same words, same order — only one break inserted), and falls back
 * to the deterministic {@link splitLongLine} heuristic whenever the key is missing,
 * the API errors/times out, or a returned break fails verbatim validation — so the
 * endpoint always returns usable JSON and never throws to the client.
 *
 * Requires `GEMINI_API_KEY` (server-only). Model via `GEMINI_MODEL` (default
 * gemini-2.5-flash).
 */

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const PROMPT = `You break overly-long worship-lyric lines for projection slides. For EACH line below, split it into EXACTLY TWO lines at the most natural, singable phrase boundary (prefer a comma/semicolon/clause boundary near the middle). Keep every word VERBATIM and in order — do NOT add, remove, reorder, translate, or re-spell any word; only insert ONE break. If a line genuinely should not be broken, omit it. Return only the broken lines.`;

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    breaks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          original: { type: 'string' },
          rows: { type: 'array', items: { type: 'string' } },
        },
        required: ['original', 'rows'],
      },
    },
  },
  required: ['breaks'],
};

interface LineBreak {
  original: string;
  rows: string[];
}

interface RawBreak {
  original?: unknown;
  rows?: unknown;
}

function normalize(text: string): string {
  return text.replace(/\s+/g, ' ').trim().toLowerCase();
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

/** Deterministic fallback: split every candidate via {@link splitLongLine}. */
function heuristicBreaks(candidates: string[], maxChars: number): LineBreak[] {
  const breaks: LineBreak[] = [];
  for (const original of candidates) {
    const rows = splitLongLine(original, maxChars);
    if (rows.length === 2) breaks.push({ original, rows });
  }
  return breaks;
}

function jsonResponse(breaks: LineBreak[], source: string) {
  return NextResponse.json({ breaks, source });
}

export async function POST(request: Request) {
  let lines: string[] = [];
  let maxCharsInput: unknown;
  try {
    const body = await request.json();
    const rawLines = (body as { lines?: unknown })?.lines;
    lines = Array.isArray(rawLines) ? rawLines.map((line) => String(line)) : [];
    maxCharsInput = (body as { maxChars?: unknown })?.maxChars;
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const maxChars = clamp(Number(maxCharsInput) || 30, 10, 80);
  const wrapWidth = Math.max(40, maxChars * 2);

  const candidates = lines.map((line) => line.trim()).filter((line) => line.length > wrapWidth);
  if (candidates.length === 0) {
    return jsonResponse([], 'none');
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return jsonResponse(heuristicBreaks(candidates, maxChars), 'heuristic');
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: 'POST',
        headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: `${PROMPT}\n\nLines:\n${candidates.join('\n')}` }] },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: RESPONSE_SCHEMA,
            temperature: 0.2,
          },
        }),
        signal: AbortSignal.timeout(20000),
      },
    );

    if (!response.ok) {
      console.error('Gemini line-break HTTP', response.status);
      return jsonResponse(heuristicBreaks(candidates, maxChars), `gemini-${response.status}`);
    }

    const data = await response.json();
    const text: unknown = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = typeof text === 'string' ? JSON.parse(text) : null;
    const rawBreaks: RawBreak[] = Array.isArray(parsed?.breaks) ? parsed.breaks : [];

    const candidateSet = new Set(candidates);
    const handled = new Set<string>();
    const breaks: LineBreak[] = [];

    for (const raw of rawBreaks) {
      const original = typeof raw.original === 'string' ? raw.original.trim() : '';
      if (!original || !candidateSet.has(original) || handled.has(original)) continue;

      const rows = Array.isArray(raw.rows)
        ? raw.rows.map((row) => String(row).trim()).filter(Boolean)
        : [];

      const isVerbatim =
        rows.length === 2 &&
        rows[0].length > 0 &&
        rows[1].length > 0 &&
        normalize(rows.join(' ')) === normalize(original);

      if (isVerbatim) {
        breaks.push({ original, rows });
      } else {
        const fallbackRows = splitLongLine(original, maxChars);
        if (fallbackRows.length === 2) breaks.push({ original, rows: fallbackRows });
      }
      handled.add(original);
    }

    return jsonResponse(breaks, 'ai');
  } catch (error) {
    console.error('Gemini line-break failed:', error);
    return jsonResponse(heuristicBreaks(candidates, maxChars), 'exception');
  }
}
