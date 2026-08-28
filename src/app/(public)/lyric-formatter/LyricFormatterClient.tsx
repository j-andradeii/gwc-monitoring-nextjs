'use client';

import 'quill/dist/quill.snow.css';

import { useCallback, useMemo, useState, type FormEvent } from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
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
  buildSlides,
  detectSectionHeader,
  stripAdLibs,
  type LyricSection,
  type SlideLayoutOptions,
} from '@/lib/lyrics/section-lyrics';
import { buildProPresenterFile, proFilename } from '@/lib/lyrics/propresenter';
import { useLyricLabels } from './useLyricLabels';
import LabelSettingsModal from './LabelSettingsModal';

// Quill touches `document` at import, so keep the editor client-only.
const Editor = dynamic(() => import('primereact/editor').then((module) => module.Editor), {
  ssr: false,
  loading: () => <div className="lf-editor-loading">Loading editor…</div>,
});

type SearchTab = 'details' | 'lyrics' | 'manual';

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
 * into slides via {@link buildSlides} (a blank line between slides) so the editor
 * previews the exported slide COUNT/grouping one-to-one. `wrapLongLines` is forced
 * off here — see the fixed-point note on `formatSectionsForEditor`.
 */
function sectionsToHtml(sections: LyricSection[], options: SlideLayoutOptions): string {
  if (sections.length === 0) return '<p><br></p>';
  return sections
    .map((section) => {
      const label = `<p><strong>${escapeHtml(section.label)}</strong></p>`;
      const groups = buildSlides(section.lines, { ...options, wrapLongLines: false })
        .map((rows) =>
          rows.map((row) => `<p>${escapeHtml(row) || '<br>'}</p>`).join(''),
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
  const {
    labels,
    setLabels,
    resetSettings,
    linesPerSlide,
    setLinesPerSlide,
    useAi,
    setUseAi,
    maxCharsPerLine,
    setMaxCharsPerLine,
    wrapLongLines,
    setWrapLongLines,
  } = useLyricLabels();

  const [activeTab, setActiveTab] = useState<SearchTab>('details');

  const [form, setForm] = useState<SearchForm>(EMPTY_FORM);
  const [committed, setCommitted] = useState<SearchForm | null>(null);

  const [lyricInput, setLyricInput] = useState('');
  const [lyricCommitted, setLyricCommitted] = useState<string | null>(null);

  const [manualLyrics, setManualLyrics] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [manualDialogOpen, setManualDialogOpen] = useState(false);

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

  const {
    data,
    isFetching: detailsFetching,
    isError: detailsIsError,
    error: detailsError,
  } = useQuery({
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

  // Lyric search: a snippet is sent to /api/lyrics/identify, which web-searches to
  // identify the song, then queries LRCLIB and returns the matching versions.
  const lyricQuery = lyricCommitted?.trim() ?? '';
  const {
    data: lyricData,
    isFetching: lyricFetching,
    isError: lyricIsError,
    error: lyricError,
  } = useQuery({
    queryKey: QUERY_KEYS.lyricsIdentify(lyricQuery),
    queryFn: async (): Promise<LyricsSearchResponse> => {
      const response = await fetch('/api/lyrics/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lyrics: lyricQuery }),
      });
      if (!response.ok) {
        const body: unknown = await response.json().catch(() => ({}));
        const message = (body as { error?: string }).error ?? 'Search failed.';
        throw new Error(message);
      }
      return response.json() as Promise<LyricsSearchResponse>;
    },
    enabled: lyricQuery.length > 0,
    staleTime: 60_000,
  });

  const detailResults = useMemo(() => (data?.results ?? []).slice(0, 3), [data]);
  const lyricResults = useMemo(() => (lyricData?.results ?? []).slice(0, 5), [lyricData]);

  // Unify the two searches so the results area + modal serve whichever tab is active.
  const isLyricTab = activeTab === 'lyrics';
  const isManualTab = activeTab === 'manual';
  const results = isLyricTab ? lyricResults : detailResults;
  const isFetching = isLyricTab ? lyricFetching : detailsFetching;
  const isError = isLyricTab ? lyricIsError : detailsIsError;
  const error = isLyricTab ? lyricError : detailsError;
  const hasCommitted = isLyricTab ? lyricCommitted !== null : committed !== null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const hasInput = Object.values(form).some((value) => value.trim().length > 0);
    if (!hasInput) {
      showError('Nothing to search', 'Enter a song title, artist, or album.');
      return;
    }
    setCommitted({ ...form });
  };

  const handleLyricSubmit = (event: FormEvent) => {
    event.preventDefault();
    const text = lyricInput.trim();
    if (text.length < 4) {
      showError('Enter more lyrics', 'Type or paste a line or two from the song.');
      return;
    }
    setLyricCommitted(text);
  };

  const handleManualFormat = (event: FormEvent) => {
    event.preventDefault();
    const text = manualLyrics.trim();
    if (text.length < 4) {
      showError('Nothing to format', 'Paste the full lyrics first.');
      return;
    }
    setSelectedTrack(null);
    setOriginalPlain(text);
    setManualDialogOpen(true);
    void detectAndApply(text);
  };

  const renderSections = useCallback(
    (sections: LyricSection[]) => {
      const options: SlideLayoutOptions = { linesPerSlide, maxCharsPerLine };
      setEditorHtml(sectionsToHtml(sections, options));
      setEditorText(formatSectionsForEditor(sections, options));
      setEditorKey((key) => key + 1);
    },
    [linesPerSlide, maxCharsPerLine],
  );

  /** Section the lyrics via Gemini (if enabled) with a heuristic fallback. */
  const detectAndApply = useCallback(
    async (plain: string) => {
      // Drop parenthetical ad-libs / backing-vocal asides before sectioning so they
      // never reach the editor, slides, copy, or export.
      const clean = stripAdLibs(plain, labels);
      if (!useAi) {
        renderSections(sectionLyrics(clean, labels));
        return;
      }
      setSectioning(true);
      try {
        const response = await fetch('/api/lyrics/section', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plainLyrics: clean }),
        });
        if (!response.ok) {
          renderSections(sectionLyrics(clean, labels));
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
        renderSections(sections.length ? sections : sectionLyrics(clean, labels));
      } catch {
        renderSections(sectionLyrics(clean, labels));
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
    const title = selectedTrack?.trackName ?? (manualTitle.trim() || 'Lyrics');
    // Line wrapping (rule 2) uses the deterministic splitLongLine algorithm — the
    // Gemini /api/lyrics/linebreaks route is intentionally NOT called (no breakHints).
    const bytes = buildProPresenterFile(title, sections, {
      linesPerSlide,
      maxCharsPerLine,
      wrapLongLines,
    });
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
    const base =
      (selectedTrack?.trackName ?? (manualTitle.trim() || 'lyrics')).replace(
        /[/\\:*?"<>|]+/g,
        '',
      ) || 'lyrics';
    downloadBlob(text, `${base}.txt`, 'text/plain;charset=utf-8');
    showSuccess('Text file downloaded');
  };

  const songTitle = selectedTrack
    ? `${selectedTrack.trackName}${selectedTrack.artistName ? ` · ${selectedTrack.artistName}` : ''}`
    : manualDialogOpen
      ? manualTitle.trim() || 'Lyrics'
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
          <div className="lf-tabs" role="tablist" aria-label="Search mode">
            <button
              type="button"
              role="tab"
              id="lf-tab-details"
              aria-selected={!isLyricTab && !isManualTab}
              aria-controls="lf-search-panel"
              className={`lf-tab${!isLyricTab && !isManualTab ? ' is-active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              <i className="pi pi-list lf-tab-icon" aria-hidden="true" />
              <span>By song details</span>
            </button>
            <button
              type="button"
              role="tab"
              id="lf-tab-lyrics"
              aria-selected={isLyricTab}
              aria-controls="lf-search-panel"
              className={`lf-tab${isLyricTab ? ' is-active' : ''}`}
              onClick={() => setActiveTab('lyrics')}
            >
              <i className="pi pi-sparkles lf-tab-icon" aria-hidden="true" />
              <span>By lyrics</span>
            </button>
            <button
              type="button"
              role="tab"
              id="lf-tab-manual"
              aria-selected={isManualTab}
              aria-controls="lf-search-panel"
              className={`lf-tab${isManualTab ? ' is-active' : ''}`}
              onClick={() => setActiveTab('manual')}
            >
              <i className="pi pi-pencil lf-tab-icon" aria-hidden="true" />
              <span>Manual format</span>
            </button>
          </div>

          <div
            id="lf-search-panel"
            role="tabpanel"
            aria-labelledby={
              isLyricTab ? 'lf-tab-lyrics' : isManualTab ? 'lf-tab-manual' : 'lf-tab-details'
            }
          >
            {isLyricTab ? (
              <form className="lf-lyric-form" onSubmit={handleLyricSubmit}>
                <div className="lf-field">
                  <label htmlFor="lf-lyric">Lyrics or a memorable line</label>
                  <InputTextarea
                    id="lf-lyric"
                    value={lyricInput}
                    onChange={(event) => setLyricInput(event.target.value)}
                    rows={4}
                    autoResize
                    className="lf-lyric-input"
                    placeholder={'e.g. "Oh the overwhelming, never-ending, reckless love of God"'}
                  />
                </div>
                <div className="lf-lyric-actions">
                  <Button
                    type="submit"
                    icon="pi pi-search"
                    label="Find song"
                    className="lf-search-btn"
                    loading={lyricFetching}
                    disabled={lyricFetching}
                  />
                </div>
              </form>
            ) : isManualTab ? (
              <form className="lf-lyric-form" onSubmit={handleManualFormat}>
                <div className="lf-field">
                  <label htmlFor="lf-manual-title">Song title (optional)</label>
                  <InputText
                    id="lf-manual-title"
                    value={manualTitle}
                    onChange={(event) => setManualTitle(event.target.value)}
                    placeholder="Only used to name the exported file"
                  />
                </div>
                <div className="lf-field">
                  <label htmlFor="lf-manual-lyrics">Paste the full lyrics</label>
                  <InputTextarea
                    id="lf-manual-lyrics"
                    value={manualLyrics}
                    onChange={(event) => setManualLyrics(event.target.value)}
                    rows={14}
                    autoResize
                    className="lf-lyric-input lf-manual-input"
                    placeholder={'Paste the whole song: verses, chorus, bridge, etc.'}
                  />
                </div>
                <div className="lf-lyric-actions">
                  <Button
                    type="submit"
                    icon="pi pi-sparkles"
                    label="Format"
                    className="lf-search-btn"
                    loading={sectioning}
                    disabled={sectioning}
                  />
                </div>
              </form>
            ) : (
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
                  loading={detailsFetching}
                  disabled={detailsFetching}
                />
              </form>
            )}
          </div>

          <p className="lf-hint">
            {isLyricTab
              ? 'Paste a line or two of the lyrics. A web search identifies the song, then pulls every available version from LRCLIB. Pick a result to auto-section and edit.'
              : isManualTab
                ? 'For songs LRCLIB doesn’t have. Section detection uses AI (Gemini) or the heuristic grouping, per the "AI section detection" toggle in Settings. Title is optional. It only names the exported file.'
                : 'Lyrics via LRCLIB. Year refines the text search only (LRCLIB has no year filter). Section labels are auto-detected. Fix anything in the editor, or tune the vocabulary in Label settings.'}
          </p>

          {!isManualTab && (
          <div className="lf-results" aria-live="polite">
            {isFetching && (
              <div className="lf-status lf-status-loading">
                <span className="lf-spinner" aria-hidden="true" />
                <span className="lf-status-label">
                  {isLyricTab ? 'Searching the web for the song…' : 'Searching…'}
                </span>
              </div>
            )}

            {isError && !isFetching && (
              <div className="lf-status lf-status-error">
                {(error as Error)?.message ?? 'Search failed.'}
              </div>
            )}

            {!isFetching && !isError && hasCommitted && results.length === 0 && (
              <div className="lf-status">
                {isLyricTab
                  ? 'No match found. Try a different or longer line of the lyrics.'
                  : 'No matches. Try fewer or different words.'}
              </div>
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

            {!hasCommitted && (
              <div className="lf-empty-hint">
                <i className={isLyricTab ? 'pi pi-sparkles' : 'pi pi-search'} />
                <span>
                  {isLyricTab
                    ? 'Paste a line of lyrics to find the song.'
                    : 'Search for a song to get started.'}
                </span>
              </div>
            )}
          </div>
          )}
        </section>
      </main>

      <LandingFooter />

      <Dialog
        header={songTitle}
        visible={selectedTrack !== null || manualDialogOpen}
        onHide={() => {
          setSelectedTrack(null);
          setManualDialogOpen(false);
        }}
        dismissableMask
        className="lf-song-dialog"
        style={{ width: '94vw', maxWidth: '880px' }}
      >
        {(selectedTrack || manualDialogOpen) && (
          <div className="lf-song">
            <div className="lf-song-toolbar">
              <span className="lf-song-hint">
                Section labels sit on their own line. Edit freely. Copy &amp; export use
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
                <span className="lf-loading-orb" aria-hidden="true">
                  <span className="lf-spinner lf-spinner-lg" />
                </span>
                <div className="lf-loading-copy">
                  <span className="lf-loading-title">Detecting sections with AI…</span>
                  <span className="lf-loading-caption">
                    Grouping verses, chorus &amp; bridge with Gemini
                  </span>
                </div>
                <div className="lf-loading-skeleton" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
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

            <p className="lf-copy-notice">
              <i className="pi pi-info-circle" aria-hidden="true" />
              <span>
                Use the <strong>Copy</strong> button below to keep the formatting.
                Selecting the lyrics and pressing <kbd className="lf-kbd">⌘</kbd> /{' '}
                <kbd className="lf-kbd">Ctrl</kbd> + <kbd className="lf-kbd">C</kbd> (or
                right-click → Copy) will not preserve it.
              </span>
            </p>

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
        maxCharsPerLine={maxCharsPerLine}
        wrapLongLines={wrapLongLines}
        onSave={(nextLabels, nextLines, nextUseAi, nextMaxChars, nextWrapLong) => {
          setLabels(nextLabels);
          setLinesPerSlide(nextLines);
          setUseAi(nextUseAi);
          setMaxCharsPerLine(nextMaxChars);
          setWrapLongLines(nextWrapLong);
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
