'use client';

import { useCallback, useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import {
  DEFAULT_CANONICAL_LABELS,
  normalizeLabelKey,
  type CanonicalLabels,
} from '@/lib/lyrics/section-lyrics';

const DEFAULT_LINES_PER_SLIDE = 2;
const DEFAULT_USE_AI = true;
const DEFAULT_MAX_CHARS_PER_LINE = 30;
const DEFAULT_WRAP_LONG_LINES = true;

interface LabelRow {
  id: string;
  key: string;
  label: string;
}

interface LabelSettingsModalProps {
  visible: boolean;
  onHide: () => void;
  labels: CanonicalLabels;
  linesPerSlide: number;
  useAi: boolean;
  maxCharsPerLine: number;
  wrapLongLines: boolean;
  onSave: (
    labels: CanonicalLabels,
    linesPerSlide: number,
    useAi: boolean,
    maxCharsPerLine: number,
    wrapLongLines: boolean,
  ) => void;
  onReset: () => void;
}

/**
 * Lyric Formatter settings: the ProPresenter lines-per-slide default plus the
 * section-label vocabulary ({@link CanonicalLabels}). Each label row maps a keyword
 * (how a section appears in lyrics, e.g. "prechorus") to the label shown and used as
 * the ProPresenter group name (e.g. "PreChorus").
 */
export default function LabelSettingsModal({
  visible,
  onHide,
  labels,
  linesPerSlide,
  useAi,
  maxCharsPerLine,
  wrapLongLines,
  onSave,
  onReset,
}: LabelSettingsModalProps) {
  const idRef = useRef(0);
  const [rows, setRows] = useState<LabelRow[]>([]);
  const [lines, setLines] = useState(linesPerSlide);
  const [aiEnabled, setAiEnabled] = useState(useAi);
  const [maxChars, setMaxChars] = useState(maxCharsPerLine);
  const [wrapLong, setWrapLong] = useState(wrapLongLines);

  const buildRows = useCallback(
    (map: CanonicalLabels): LabelRow[] =>
      Object.entries(map).map(([key, label]) => {
        idRef.current += 1;
        return { id: `row-${idRef.current}`, key, label };
      }),
    [],
  );

  const updateRow = (id: string, field: 'key' | 'label', value: string) => {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const removeRow = (id: string) => {
    setRows((current) => current.filter((row) => row.id !== id));
  };

  const addRow = () => {
    idRef.current += 1;
    setRows((current) => [...current, { id: `row-${idRef.current}`, key: '', label: '' }]);
  };

  const handleSave = () => {
    const map: CanonicalLabels = {};
    for (const row of rows) {
      const key = normalizeLabelKey(row.key);
      const label = row.label.trim();
      if (key && label) map[key] = label;
    }
    onSave(map, lines, aiEnabled, maxChars, wrapLong);
    onHide();
  };

  const handleReset = () => {
    onReset();
    setRows(buildRows(DEFAULT_CANONICAL_LABELS));
    setLines(DEFAULT_LINES_PER_SLIDE);
    setAiEnabled(DEFAULT_USE_AI);
    setMaxChars(DEFAULT_MAX_CHARS_PER_LINE);
    setWrapLong(DEFAULT_WRAP_LONG_LINES);
  };

  const footer = (
    <div className="lf-settings-footer">
      <Button
        type="button"
        label="Reset to defaults"
        icon="pi pi-refresh"
        text
        severity="secondary"
        onClick={handleReset}
      />
      <span className="lf-settings-footer-actions">
        <Button type="button" label="Cancel" text onClick={onHide} />
        <Button type="button" label="Save" icon="pi pi-check" onClick={handleSave} />
      </span>
    </div>
  );

  return (
    <Dialog
      header="Formatter settings"
      visible={visible}
      onHide={onHide}
      onShow={() => {
        setRows(buildRows(labels));
        setLines(linesPerSlide);
        setAiEnabled(useAi);
        setMaxChars(maxCharsPerLine);
        setWrapLong(wrapLongLines);
      }}
      footer={footer}
      dismissableMask
      className="lf-settings-dialog"
      style={{ width: '92vw', maxWidth: '640px' }}
    >
      <div className="lf-settings-section">
        <label htmlFor="lf-settings-lines" className="lf-settings-section-label">
          Lines per slide
          <span className="lf-settings-sub">ProPresenter (.pro) export</span>
        </label>
        <select
          id="lf-settings-lines"
          className="lf-lines-select"
          value={lines}
          onChange={(event) => setLines(Number(event.target.value))}
        >
          <option value={1}>1 line</option>
          <option value={2}>2 lines</option>
          <option value={3}>3 lines</option>
          <option value={4}>4 lines</option>
        </select>
      </div>

      <div className="lf-settings-section">
        <label htmlFor="lf-settings-max-chars" className="lf-settings-section-label">
          Max characters per line
          <span className="lf-settings-sub">A line at/above this gets its own slide</span>
        </label>
        <select
          id="lf-settings-max-chars"
          className="lf-lines-select"
          value={maxChars}
          onChange={(event) => setMaxChars(Number(event.target.value))}
        >
          <option value={20}>20</option>
          <option value={25}>25</option>
          <option value={30}>30</option>
          <option value={35}>35</option>
          <option value={40}>40</option>
        </select>
      </div>

      <div className="lf-settings-section">
        <label htmlFor="lf-settings-wrap-long" className="lf-settings-section-label">
          Break long lines
          <span className="lf-settings-sub">
            Split a very long line into two on the ProPresenter export
          </span>
        </label>
        <InputSwitch
          inputId="lf-settings-wrap-long"
          checked={wrapLong}
          onChange={(event) => setWrapLong(event.value)}
        />
      </div>

      <div className="lf-settings-section">
        <label htmlFor="lf-settings-ai" className="lf-settings-section-label">
          AI section detection
          <span className="lf-settings-sub">Gemini — smarter Verse / Chorus / Bridge labels</span>
        </label>
        <InputSwitch
          inputId="lf-settings-ai"
          checked={aiEnabled}
          onChange={(event) => setAiEnabled(event.value)}
        />
      </div>

      <hr className="lf-settings-divider" />

      <p className="lf-settings-subhead">Section labels</p>
      <p className="lf-settings-help">
        Map a <strong>keyword</strong> (how a section is written in lyrics, e.g.{' '}
        <code>prechorus</code>) to the <strong>label</strong> shown here and used as the
        ProPresenter group name (e.g. <code>PreChorus</code>). The <code>verse</code>,{' '}
        <code>chorus</code>, and <code>bridge</code> labels also rename what
        auto-detection produces.
      </p>

      <div className="lf-settings-grid-head">
        <span>Keyword</span>
        <span>Label</span>
        <span aria-hidden="true" />
      </div>

      <div className="lf-settings-rows">
        {rows.map((row) => (
          <div className="lf-settings-row" key={row.id}>
            <InputText
              value={row.key}
              onChange={(event) => updateRow(row.id, 'key', event.target.value)}
              placeholder="prechorus"
              aria-label="Keyword"
            />
            <InputText
              value={row.label}
              onChange={(event) => updateRow(row.id, 'label', event.target.value)}
              placeholder="PreChorus"
              aria-label="Label"
            />
            <Button
              type="button"
              icon="pi pi-trash"
              text
              severity="danger"
              onClick={() => removeRow(row.id)}
              aria-label={`Remove ${row.label || 'mapping'}`}
            />
          </div>
        ))}
        {rows.length === 0 && (
          <p className="lf-settings-empty">No mappings — add one or reset to defaults.</p>
        )}
      </div>

      <Button
        type="button"
        label="Add mapping"
        icon="pi pi-plus"
        text
        className="lf-settings-add"
        onClick={addRow}
      />
    </Dialog>
  );
}
