'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_CANONICAL_LABELS,
  type CanonicalLabels,
} from '@/lib/lyrics/section-lyrics';

const LABELS_KEY = 'gwc:lyric-formatter:labels';
const LINES_KEY = 'gwc:lyric-formatter:lines-per-slide';
const AI_KEY = 'gwc:lyric-formatter:use-ai';
const MAX_CHARS_KEY = 'gwc:lyric-formatter:max-chars';
const WRAP_LONG_KEY = 'gwc:lyric-formatter:wrap-long';
const DEFAULT_LINES_PER_SLIDE = 2;
const DEFAULT_USE_AI = true;
const DEFAULT_MAX_CHARS_PER_LINE = 30;
const DEFAULT_WRAP_LONG_LINES = true;

/**
 * Label values renamed in a release, applied to older persisted settings so they
 * adopt the current default naming without a manual "Reset to defaults".
 */
const LABEL_VALUE_RENAMES: Record<string, string> = {
  'Pre-Chorus': 'PreChorus',
  'Post-Chorus': 'PostChorus',
};

/** Rewrite any renamed label values in place; returns true if something changed. */
function migrateLabelValues(labels: CanonicalLabels): boolean {
  let changed = false;
  for (const key of Object.keys(labels)) {
    const next = LABEL_VALUE_RENAMES[labels[key]];
    if (next && next !== labels[key]) {
      labels[key] = next;
      changed = true;
    }
  }
  return changed;
}

/**
 * localStorage-backed Lyric Formatter settings: the section-label vocabulary, the
 * ProPresenter lines-per-slide default, and whether to use AI (Gemini) section
 * detection. Starts from the built-ins (also used for SSR), then hydrates saved
 * values on mount. Each setting persists independently so all survive a reload.
 */
export function useLyricLabels() {
  const [labels, setLabelsState] = useState<CanonicalLabels>(DEFAULT_CANONICAL_LABELS);
  const [linesPerSlide, setLinesPerSlideState] = useState(DEFAULT_LINES_PER_SLIDE);
  const [useAi, setUseAiState] = useState(DEFAULT_USE_AI);
  const [maxCharsPerLine, setMaxCharsPerLineState] = useState(DEFAULT_MAX_CHARS_PER_LINE);
  const [wrapLongLines, setWrapLongLinesState] = useState(DEFAULT_WRAP_LONG_LINES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let restoredLabels: CanonicalLabels | null = null;
    let restoredLines: number | null = null;
    let restoredUseAi: boolean | null = null;
    let restoredMaxChars: number | null = null;
    let restoredWrapLong: boolean | null = null;
    try {
      const stored = window.localStorage.getItem(LABELS_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          restoredLabels = parsed as CanonicalLabels;
          // Upgrade older saved labels to the current default naming (e.g.
          // Pre-Chorus → PreChorus) and re-persist so the change sticks.
          if (migrateLabelValues(restoredLabels)) {
            window.localStorage.setItem(LABELS_KEY, JSON.stringify(restoredLabels));
          }
        }
      }
    } catch {
      // Corrupt/blocked storage — fall back to defaults silently.
    }
    try {
      const storedLines = window.localStorage.getItem(LINES_KEY);
      if (storedLines) {
        const n = Number(storedLines);
        if (Number.isFinite(n) && n >= 1 && n <= 6) restoredLines = n;
      }
    } catch {
      // Ignore.
    }
    try {
      const storedAi = window.localStorage.getItem(AI_KEY);
      if (storedAi === 'true' || storedAi === 'false') restoredUseAi = storedAi === 'true';
    } catch {
      // Ignore.
    }
    try {
      const storedMaxChars = window.localStorage.getItem(MAX_CHARS_KEY);
      if (storedMaxChars) {
        const n = Number(storedMaxChars);
        if (Number.isFinite(n) && n >= 10 && n <= 80) restoredMaxChars = n;
      }
    } catch {
      // Ignore.
    }
    try {
      const storedWrapLong = window.localStorage.getItem(WRAP_LONG_KEY);
      if (storedWrapLong === 'true' || storedWrapLong === 'false') {
        restoredWrapLong = storedWrapLong === 'true';
      }
    } catch {
      // Ignore.
    }
    // Defer state updates out of the effect body (repo lint rule + avoids any SSR
    // hydration mismatch since the first render matches the server's defaults).
    const timer = setTimeout(() => {
      if (restoredLabels) setLabelsState(restoredLabels);
      if (restoredLines) setLinesPerSlideState(restoredLines);
      if (restoredUseAi !== null) setUseAiState(restoredUseAi);
      if (restoredMaxChars !== null) setMaxCharsPerLineState(restoredMaxChars);
      if (restoredWrapLong !== null) setWrapLongLinesState(restoredWrapLong);
      setIsLoaded(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const setLabels = useCallback((next: CanonicalLabels) => {
    setLabelsState(next);
    try {
      window.localStorage.setItem(LABELS_KEY, JSON.stringify(next));
    } catch {
      // Ignore persistence failures (private mode, quota, etc.).
    }
  }, []);

  const setLinesPerSlide = useCallback((next: number) => {
    setLinesPerSlideState(next);
    try {
      window.localStorage.setItem(LINES_KEY, String(next));
    } catch {
      // Ignore.
    }
  }, []);

  const setUseAi = useCallback((next: boolean) => {
    setUseAiState(next);
    try {
      window.localStorage.setItem(AI_KEY, String(next));
    } catch {
      // Ignore.
    }
  }, []);

  const setMaxCharsPerLine = useCallback((next: number) => {
    setMaxCharsPerLineState(next);
    try {
      window.localStorage.setItem(MAX_CHARS_KEY, String(next));
    } catch {
      // Ignore.
    }
  }, []);

  const setWrapLongLines = useCallback((next: boolean) => {
    setWrapLongLinesState(next);
    try {
      window.localStorage.setItem(WRAP_LONG_KEY, String(next));
    } catch {
      // Ignore.
    }
  }, []);

  const resetSettings = useCallback(() => {
    setLabelsState(DEFAULT_CANONICAL_LABELS);
    setLinesPerSlideState(DEFAULT_LINES_PER_SLIDE);
    setUseAiState(DEFAULT_USE_AI);
    setMaxCharsPerLineState(DEFAULT_MAX_CHARS_PER_LINE);
    setWrapLongLinesState(DEFAULT_WRAP_LONG_LINES);
    try {
      window.localStorage.removeItem(LABELS_KEY);
      window.localStorage.removeItem(LINES_KEY);
      window.localStorage.removeItem(AI_KEY);
      window.localStorage.removeItem(MAX_CHARS_KEY);
      window.localStorage.removeItem(WRAP_LONG_KEY);
    } catch {
      // Ignore.
    }
  }, []);

  return {
    labels,
    setLabels,
    linesPerSlide,
    setLinesPerSlide,
    useAi,
    setUseAi,
    maxCharsPerLine,
    setMaxCharsPerLine,
    wrapLongLines,
    setWrapLongLines,
    resetSettings,
    isLoaded,
  };
}
