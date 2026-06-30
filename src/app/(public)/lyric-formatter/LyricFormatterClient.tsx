'use client';

import 'quill/dist/quill.snow.css';

import { useCallback, useMemo, useState, type FormEvent } from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import type { EditorTextChangeEvent } from 'primereact/editor';

import { LandingHeader, LandingFooter } from '@/components/landing';
import ToastProvider, { showSuccess, showError } from '@/components/ui/Toast';
import { QUERY_KEYS } from '@/lib/query-keys';
import {
  getPlainLyrics,
  formatDuration,
  type LrclibTrack,
  type LyricsSearchResponse,
} from '@/lib/lyrics/lrclib';
import {
  sectionLyrics,
  formatSectionsForEditor,
  chunkLines,
  detectSectionHeader,
  type LyricSection,
} from '@/lib/lyrics/section-lyrics';
import { buildProPresenterFile, proFilename } from '@/lib/lyrics/propresenter';
import { useLyricLabels } from './useLyricLabels';
import LabelSettingsModal from './LabelSettingsModal';

// Quill touches `document` at import, so keep the editor client-only.
const Editor = dynamic(() => import('primereact/editor').then((module) => module.Editor), {
  ssr: false,
  loading: () => <div className="lf-editor-loading">Loading editor…</div>,
});

interface SearchForm {
  title: string;
  artist: string;
  album: string;
  year: string;
}

/** Minimal shape of the Quill instance handed to the Editor's onLoad callback. */
interface QuillLike {
  setContents: (delta: unknown) => void;
  clipboard: { convert: (input: { html: string; text: string }) => unknown };
}

const EMPTY_FORM: SearchForm = { title: '', artist: '', album: '', year: '' };

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Build initial editor HTML: bold section labels, with each section's lines grouped
 * into slide-sized chunks (a blank line between groups) so the editor previews the
 * exported slides one-to-one.
 */
function sectionsToHtml(sections: LyricSection[], linesPerSlide: number): string {
  if (sections.length === 0) return '<p><br></p>';
  return sections
    .map((section) => {
      const label = `<p><strong>${escapeHtml(section.label)}</strong></p>`;
      const groups = chunkLines(section.lines, linesPerSlide)
        .map((group) =>
          group.map((line) => `<p>${escapeHtml(line) || '<br>'}</p>`).join(''),
        )
        .join('<p><br></p>');
      return label + groups;
    })
    .join('<p><br></p>');
}

function downloadBlob(data: BlobPart, filename: string, mime: string): void {
  const url = URL.createObjectURL(new Blob([data], { type: mime }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const editorHeader = (
  <span className="ql-formats">
    <button type="button" className="ql-bold" aria-label="Bold" />
    <button type="button" className="ql-italic" aria-label="Italic" />
    <button type="button" className="ql-clean" aria-label="Clear formatting" />
  </span>
);

function LyricFormatter() {
  const { labels, setLabels, resetSettings, linesPerSlide, setLinesPerSlide, useAi, setUseAi } =
    useLyricLabels();

  const [form, setForm] = useState<SearchForm>(EMPTY_FORM);
  const [committed, setCommitted] = useState<SearchForm | null>(null);

  const [selectedTrack, setSelectedTrack] = useState<LrclibTrack | null>(null);
  const [originalPlain, setOriginalPlain] = useState('');
  const [editorHtml, setEditorHtml] = useState('');
  const [editorText, setEditorText] = useState('');
  const [editorKey, setEditorKey] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sectioning, setSectioning] = useState(false);

  const searchQuery = useMemo(() => {
    if (!committed) return '';
    const params = new URLSearchParams();
    if (committed.title.trim()) {
      params.set('title', committed.title.trim());
      if (committed.artist.trim()) params.set('artist', committed.artist.trim());
      if (committed.album.trim()) params.set('album', committed.album.trim());
    } else {
      const q = [committed.artist, committed.album, committed.year]
        .map((value) => value.trim())
        .filter(Boolean)
        .join(' ');
      if (q) params.set('q', q);
    }
    return params.toString();
  }, [committed]);

  const { data, isFetching, isError, error } = useQuery({
    queryKey: QUERY_KEYS.lyricsSearch({ q: searchQuery }),
    queryFn: async (): Promise<LyricsSearchResponse> => {
      const response = await fetch(`/api/lyrics/search?${searchQuery}`);
      if (!response.ok) {
        const body: unknown = await response.json().catch(() => ({}));
        const message = (body as { error?: string }).error ?? 'Search failed.';
        throw new Error(message);
      }
      return response.json() as Promise<LyricsSearchResponse>;
    },
    enabled: searchQuery.length > 0,
    staleTime: 60_000,
  });

  const results = useMemo(() => (data?.results ?? []).slice(0, 3), [data]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const hasInput = Object.values(form).some((value) => value.trim().length > 0);
    if (!hasInput) {
      showError('Nothing to search', 'Enter a song title, artist, or album.');
      return;
    }
    setCommitted({ ...form });
  };

  const renderSections = useCallback(
    (sections: LyricSection[]) => {
      setEditorHtml(sectionsToHtml(sections, linesPerSlide));
      setEditorText(formatSectionsForEditor(sections, linesPerSlide));
      setEditorKey((key) => key + 1);
    },
    [linesPerSlide],
  );

  /** Section the lyrics via Gemini (if enabled) with a heuristic fallback. */
  const detectAndApply = useCallback(
    async (plain: string) => {
      if (!useAi) {
        renderSections(sectionLyrics(plain, labels));
        return;
      }
      setSectioning(true);
      try {
        const response = await fetch('/api/lyrics/section', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plainLyrics: plain }),
        });
        if (!response.ok) {
          renderSections(sectionLyrics(plain, labels));
          return;
        }
        const data = (await response.json()) as {
          sections?: { label?: string; lines?: string[] }[];
        };
        const sections: LyricSection[] = (data.sections ?? [])
          .map((section) => ({
            // Run AI labels through the user's vocabulary so custom renames apply.
            label:
              detectSectionHeader(String(section.label ?? ''), labels) ??
              String(section.label ?? 'Section').trim(),
            lines: Array.isArray(section.lines) ? section.lines : [],
          }))
          .filter((section) => section.lines.length > 0);
        renderSections(sections.length ? sections : sectionLyrics(plain, labels));
      } catch {
        renderSections(sectionLyrics(plain, labels));
      } finally {
        setSectioning(false);
      }
    },
    [useAi, labels, renderSections],
  );

  const openTrack = (track: LrclibTrack) => {
    const plain = getPlainLyrics(track);
    setOriginalPlain(plain);
    setSelectedTrack(track);
    void detectAndApply(plain);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editorText.trim());
      showSuccess('Copied', 'Formatted lyrics copied to clipboard.');
    } catch {
      showError('Copy failed', 'Your browser blocked clipboard access.');
    }
  };

  const handleDownloadPro = () => {
    const sections = sectionLyrics(editorText, labels);
    if (sections.length === 0) {
      showError('Nothing to export', 'No lyrics to build slides from.');
      return;
    }
    const title = selectedTrack?.trackName ?? 'Lyrics';
    const bytes = buildProPresenterFile(title, sections, linesPerSlide);
    downloadBlob(bytes, proFilename(title), 'application/octet-stream');
    showSuccess(
      'ProPresenter file ready',
      `${sections.length} section${sections.length === 1 ? '' : 's'} exported.`,
    );
  };

  const handleDownloadTxt = () => {
    const text = editorText.trim();
    if (!text) {
      showError('Nothing to export', 'No lyrics to save.');
      return;
    }
    const base = (selectedTrack?.trackName ?? 'lyrics').replace(/[/\\:*?"<>|]+/g, '') || 'lyrics';
    downloadBlob(text, `${base}.txt`, 'text/plain;charset=utf-8');
    showSuccess('Text file downloaded');
  };

  const songTitle = selectedTrack
    ? `${selectedTrack.trackName}${selectedTrack.artistName ? ` — ${selectedTrack.artistName}` : ''}`
    : '';

  return (
    <>
      <LandingHeader />

      <main className="lyric-formatter-page">
        <section className="lf-hero">
          <div className="lf-hero-inner">
            <div className="lf-hero-text">
              <span className="lf-eyebrow">Worship Tools</span>
              <h1 className="lf-title">
                Lyric <span className="lf-title-accent">Formatter</span>
              </h1>
              <p className="lf-subtitle">
                Search song lyrics, auto-group them into sections, edit, then copy or
                export to ProPresenter.
              </p>
            </div>
            <Button
              type="button"
              icon="pi pi-cog"
              label="Settings"
              outlined
              className="lf-settings-btn"
              onClick={() => setSettingsOpen(true)}
            />
          </div>
        </section>

        <section className="lf-search">
          <form className="lf-search-form" onSubmit={handleSubmit}>
            <div className="lf-field">
              <label htmlFor="lf-title">Song title</label>
              <InputText
                id="lf-title"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="e.g. Goodness of God"
              />
            </div>
            <div className="lf-field">
              <label htmlFor="lf-artist">Artist</label>
              <InputText
                id="lf-artist"
                value={form.artist}
                onChange={(event) => setForm((prev) => ({ ...prev, artist: event.target.value }))}
                placeholder="e.g. Bethel Music"
              />
            </div>
            <div className="lf-field">
              <label htmlFor="lf-album">Album</label>
              <InputText
                id="lf-album"
                value={form.album}
                onChange={(event) => setForm((prev) => ({ ...prev, album: event.target.value }))}
                placeholder="optional"
              />
            </div>
            <div className="lf-field lf-field-year">
              <label htmlFor="lf-year">Year</label>
              <InputText
                id="lf-year"
                value={form.year}
                inputMode="numeric"
                onChange={(event) => setForm((prev) => ({ ...prev, year: event.target.value }))}
                placeholder="optional"
              />
            </div>
            <Button
              type="submit"
              icon="pi pi-search"
              label="Search"
              className="lf-search-btn"
              loading={isFetching}
            />
          </form>

          <p className="lf-hint">
            Lyrics via LRCLIB. Year refines the text search only (LRCLIB has no year
            filter). Section labels are auto-detected — fix anything in the editor, or
            tune the vocabulary in Label settings.
          </p>

          <div className="lf-results" aria-live="polite">
            {isFetching && (
              <div className="lf-status">
                <ProgressSpinner style={{ width: '40px', height: '40px' }} strokeWidth="4" />
                <span>Searching…</span>
              </div>
            )}

            {isError && !isFetching && (
              <div className="lf-status lf-status-error">
                {(error as Error)?.message ?? 'Search failed.'}
              </div>
            )}

            {!isFetching && !isError && committed && results.length === 0 && (
              <div className="lf-status">No matches. Try fewer or different words.</div>
            )}

            {!isFetching && results.length > 0 && (
              <ul className="lf-result-list">
                {results.map((track) => (
                  <li key={track.id}>
                    <button
                      type="button"
                      className="lf-result-card"
                      onClick={() => openTrack(track)}
                    >
                      <span className="lf-result-title">{track.trackName}</span>
                      <span className="lf-result-meta">
                        <span className="lf-result-artist">{track.artistName}</span>
                        {track.albumName && (
                          <span className="lf-result-album">{track.albumName}</span>
                        )}
                        {formatDuration(track.duration) && (
                          <span className="lf-result-duration">
                            <i className="pi pi-clock" /> {formatDuration(track.duration)}
                          </span>
                        )}
                      </span>
                      <span className="lf-result-open" aria-hidden="true">
                        <i className="pi pi-arrow-right" />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {!committed && (
              <div className="lf-empty-hint">
                <i className="pi pi-search" />
                <span>Search for a song to get started.</span>
              </div>
            )}
          </div>
        </section>
      </main>

      <LandingFooter />

      <Dialog
        header={songTitle}
        visible={selectedTrack !== null}
        onHide={() => setSelectedTrack(null)}
        dismissableMask
        className="lf-song-dialog"
        style={{ width: '94vw', maxWidth: '880px' }}
      >
        {selectedTrack && (
          <div className="lf-song">
            <div className="lf-song-toolbar">
              <span className="lf-song-hint">
                Section labels sit on their own line. Edit freely — copy &amp; export use
                what you see here.
              </span>
              <div className="lf-song-toolbar-right">
                <Button
                  type="button"
                  icon="pi pi-sync"
                  label="Re-detect"
                  text
                  size="small"
                  disabled={sectioning}
                  onClick={() => void detectAndApply(originalPlain)}
                />
              </div>
            </div>

            {sectioning ? (
              <div className="lf-song-loading">
                <ProgressSpinner style={{ width: '42px', height: '42px' }} strokeWidth="4" />
                <span>Detecting sections with AI…</span>
              </div>
            ) : (
              <Editor
                key={editorKey}
                onLoad={(quill: QuillLike) => {
                  // PrimeReact's own initial-value path races our dynamic import +
                  // key-remount, so set the content explicitly once Quill is ready.
                  if (editorHtml) {
                    quill.setContents(quill.clipboard.convert({ html: editorHtml, text: '' }));
                  }
                }}
                headerTemplate={editorHeader}
                onTextChange={(event: EditorTextChangeEvent) => setEditorText(event.textValue ?? '')}
                className="lf-editor"
                style={{ height: '46vh', minHeight: '280px' }}
              />
            )}

            <div className="lf-song-actions">
              <Button type="button" icon="pi pi-copy" label="Copy" outlined onClick={handleCopy} />
              <Button
                type="button"
                icon="pi pi-file"
                label="Download .txt"
                outlined
                onClick={handleDownloadTxt}
              />
              <Button
                type="button"
                icon="pi pi-download"
                label="Download .pro"
                onClick={handleDownloadPro}
              />
            </div>
          </div>
        )}
      </Dialog>

      <LabelSettingsModal
        visible={settingsOpen}
        onHide={() => setSettingsOpen(false)}
        labels={labels}
        linesPerSlide={linesPerSlide}
        useAi={useAi}
        onSave={(nextLabels, nextLines, nextUseAi) => {
          setLabels(nextLabels);
          setLinesPerSlide(nextLines);
          setUseAi(nextUseAi);
        }}
        onReset={resetSettings}
      />
    </>
  );
}

export default function LyricFormatterClient() {
  return (
    <ToastProvider>
      <LyricFormatter />
    </ToastProvider>
  );
}
