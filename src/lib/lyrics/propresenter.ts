/**
 * ProPresenter 7 `.pro` exporter.
 *
 * A `.pro` file is a single serialized `rv.data.Presentation` protobuf message.
 * Rather than pull in the entire reverse-engineered proto import graph (font,
 * effects, background, ...) or ship protobuf.js to the client, we hand-encode the
 * protobuf wire format directly — the bytes depend only on field NUMBERS and wire
 * types, not on message/field names. All field numbers below come verbatim from the
 * reverse-engineered schema (greyshirtguy/ProPresenter7-Proto, Proto7.16.2):
 *
 *   Presentation        application_info=1 uuid=2 name=3 category=6 cue_groups=12 cues=13
 *   CueGroup            group=1 cue_identifiers=2
 *   Group               uuid=1 name=2 color=3
 *   Cue                 uuid=1 name=2 actions=10 isEnabled=12
 *   Action              uuid=1 isEnabled=6 type=9 slide=23   (ActionType.PRESENTATION_SLIDE=11)
 *   Action.SlideType    presentation=2
 *   PresentationSlide   base_slide=1
 *   Slide               elements=1 draws_background_color=4 background_color=5 size=6 uuid=7
 *   Slide.Element       element=1 info=4                     (Info.IS_TEXT_ELEMENT=2)
 *   Graphics.Element    uuid=1 name=2 bounds=3 opacity=5 text=13
 *   Graphics.Rect       origin=1 size=2   Graphics.Size width=1 height=2
 *   Graphics.Text       attributes=3 rtf_data=5 vertical_alignment=6 scale_behavior=7
 *   Color               red=1 green=2 blue=3 alpha=4   UUID string=1
 *   ApplicationInfo     platform=1 application=3 application_version=4   Version major=1 minor=2 patch=3
 *
 * NOTE: this targets PP7 but cannot be import-tested in this environment, so it may
 * need a tweak round against a live ProPresenter. Slides are intentionally generic
 * (white centred text on black), grouped by section name.
 */

import { chunkLines, type LyricSection } from './section-lyrics';

const SLIDE_WIDTH = 1920;
const SLIDE_HEIGHT = 1080;
const DEFAULT_LINES_PER_SLIDE = 2;
const FONT_SIZE_HALF_POINTS = 168; // RTF \fs is half-points → 84pt

/** Minimal protobuf wire-format writer (proto3 semantics: zero/empty omitted). */
class ProtoWriter {
  private chunks: Uint8Array[] = [];
  private byteLength = 0;

  private add(bytes: Uint8Array): void {
    this.chunks.push(bytes);
    this.byteLength += bytes.length;
  }

  private static varint(value: number): Uint8Array {
    const out: number[] = [];
    let v = value;
    while (v > 0x7f) {
      out.push((v & 0x7f) | 0x80);
      v = Math.floor(v / 128);
    }
    out.push(v & 0x7f);
    return Uint8Array.from(out);
  }

  private tag(field: number, wireType: number): void {
    this.add(ProtoWriter.varint(field * 8 + wireType));
  }

  private lengthDelimited(field: number, bytes: Uint8Array): void {
    this.tag(field, 2);
    this.add(ProtoWriter.varint(bytes.length));
    this.add(bytes);
  }

  uint32(field: number, value: number): void {
    if (!value) return;
    this.tag(field, 0);
    this.add(ProtoWriter.varint(value));
  }

  bool(field: number, value: boolean): void {
    if (!value) return;
    this.tag(field, 0);
    this.add(Uint8Array.from([1]));
  }

  double(field: number, value: number): void {
    if (!value) return;
    this.tag(field, 1);
    const buffer = new ArrayBuffer(8);
    new DataView(buffer).setFloat64(0, value, true);
    this.add(new Uint8Array(buffer));
  }

  float(field: number, value: number): void {
    if (!value) return;
    this.tag(field, 5);
    const buffer = new ArrayBuffer(4);
    new DataView(buffer).setFloat32(0, value, true);
    this.add(new Uint8Array(buffer));
  }

  string(field: number, value: string): void {
    if (!value) return;
    this.lengthDelimited(field, new TextEncoder().encode(value));
  }

  bytes(field: number, value: Uint8Array): void {
    if (!value || value.length === 0) return;
    this.lengthDelimited(field, value);
  }

  message(field: number, writer: ProtoWriter): void {
    this.lengthDelimited(field, writer.finish());
  }

  finish(): Uint8Array<ArrayBuffer> {
    const out = new Uint8Array(this.byteLength);
    let offset = 0;
    for (const chunk of this.chunks) {
      out.set(chunk, offset);
      offset += chunk.length;
    }
    return out;
  }
}

/** Uppercase RFC-4122 v4 UUID (ProPresenter stores UUIDs uppercase). */
function generateUuid(): string {
  const cryptoObj = globalThis.crypto;
  if (cryptoObj?.randomUUID) return cryptoObj.randomUUID().toUpperCase();

  const bytes = new Uint8Array(16);
  if (cryptoObj?.getRandomValues) {
    cryptoObj.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`.toUpperCase();
}

function uuidWriter(value: string): ProtoWriter {
  const writer = new ProtoWriter();
  writer.string(1, value);
  return writer;
}

function colorWriter(red: number, green: number, blue: number, alpha: number): ProtoWriter {
  const writer = new ProtoWriter();
  writer.float(1, red);
  writer.float(2, green);
  writer.float(3, blue);
  writer.float(4, alpha);
  return writer;
}

/** Group accent colour by section type — mirrors ProPresenter/MultiTracks conventions. */
function groupColor(label: string): [number, number, number] {
  const key = label.toLowerCase();
  if (key.startsWith('verse')) return [0.16, 0.41, 0.8]; // blue
  if (key.startsWith('pre') || key.startsWith('post')) return [0.0, 0.6, 0.6]; // teal
  if (key.startsWith('chorus')) return [0.78, 0.16, 0.16]; // red
  if (key.startsWith('bridge')) return [0.5, 0.25, 0.7]; // purple
  if (key.startsWith('tag') || key.startsWith('refrain')) return [0.85, 0.55, 0.1]; // gold
  if (key.startsWith('intro') || key.startsWith('outro') || key.startsWith('ending')) {
    return [0.4, 0.4, 0.4]; // grey
  }
  return [0.45, 0.45, 0.45];
}

/** RTF \uN takes a SIGNED 16-bit code unit; values > 32767 wrap negative. */
function rtfUnicode(codeUnit: number): string {
  const signed = codeUnit <= 32767 ? codeUnit : codeUnit - 65536;
  return `\\u${signed}?`;
}

function escapeRtf(text: string): string {
  let out = '';
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0;
    if (char === '\\') out += '\\\\';
    else if (char === '{') out += '\\{';
    else if (char === '}') out += '\\}';
    else if (code < 0x80) out += char;
    else if (code <= 0xffff) out += rtfUnicode(code);
    else {
      // Astral plane → UTF-16 surrogate pair, each emitted as \uN?.
      const c = code - 0x10000;
      out += rtfUnicode(0xd800 + (c >> 10));
      out += rtfUnicode(0xdc00 + (c & 0x3ff));
    }
  }
  return out;
}

/** Build the RTF byte payload for one slide (white, centred Arial). */
function buildSlideRtf(lines: string[]): Uint8Array {
  const body = lines.map(escapeRtf).join('\\line ');
  const rtf =
    '{\\rtf1\\ansi\\ansicpg1252\\deff0' +
    '{\\fonttbl{\\f0\\fswiss\\fcharset0 Arial;}}' +
    '{\\colortbl;\\red255\\green255\\blue255;}' +
    `\\pard\\qc\\f0\\fs${FONT_SIZE_HALF_POINTS}\\cf1 ${body}}`;
  return new TextEncoder().encode(rtf);
}

/** Build one Cue (a single slide presenting `lines`). */
function buildCue(cueId: string, label: string, lines: string[]): ProtoWriter {
  // Graphics.Text
  const text = new ProtoWriter();
  text.bytes(5, buildSlideRtf(lines)); // rtf_data
  text.uint32(6, 1); // vertical_alignment = MIDDLE
  text.uint32(7, 2); // scale_behavior = SCALE_FONT_DOWN

  // Graphics.Rect → only size; origin defaults to {0,0}
  const size = new ProtoWriter();
  size.double(1, SLIDE_WIDTH);
  size.double(2, SLIDE_HEIGHT);
  const bounds = new ProtoWriter();
  bounds.message(2, size);

  // Graphics.Element
  const element = new ProtoWriter();
  element.message(1, uuidWriter(generateUuid())); // uuid
  element.string(2, 'TextElement'); // name
  element.message(3, bounds); // bounds
  element.double(5, 1); // opacity
  element.message(13, text); // text

  // Slide.Element
  const slideElement = new ProtoWriter();
  slideElement.message(1, element); // element
  slideElement.uint32(4, 2); // info = IS_TEXT_ELEMENT

  // Slide
  const slideSize = new ProtoWriter();
  slideSize.double(1, SLIDE_WIDTH);
  slideSize.double(2, SLIDE_HEIGHT);
  const slide = new ProtoWriter();
  slide.message(1, slideElement); // elements (repeated)
  slide.bool(4, true); // draws_background_color
  slide.message(5, colorWriter(0, 0, 0, 1)); // background_color = black
  slide.message(6, slideSize); // size
  slide.message(7, uuidWriter(generateUuid())); // uuid

  // PresentationSlide → Action.SlideType → Action
  const presentationSlide = new ProtoWriter();
  presentationSlide.message(1, slide); // base_slide

  const slideType = new ProtoWriter();
  slideType.message(2, presentationSlide); // presentation

  const action = new ProtoWriter();
  action.message(1, uuidWriter(generateUuid())); // uuid
  action.bool(6, true); // isEnabled
  action.uint32(9, 11); // type = ACTION_TYPE_PRESENTATION_SLIDE
  action.message(23, slideType); // slide

  // Cue
  const cue = new ProtoWriter();
  cue.message(1, uuidWriter(cueId)); // uuid
  cue.string(2, label); // name
  cue.message(10, action); // actions (repeated)
  cue.bool(12, true); // isEnabled
  return cue;
}

/**
 * Serialize sections into a ProPresenter 7 `.pro` file. Each section becomes a
 * named, colour-coded slide group; sections are split into `linesPerSlide`-line
 * slides (default 2) via {@link chunkLines}.
 */
export function buildProPresenterFile(
  title: string,
  sections: LyricSection[],
  linesPerSlide: number = DEFAULT_LINES_PER_SLIDE,
): Uint8Array<ArrayBuffer> {
  const presentation = new ProtoWriter();

  // ApplicationInfo — identify as ProPresenter 7.16.2 on macOS.
  const appInfo = new ProtoWriter();
  appInfo.uint32(1, 1); // platform = MACOS
  appInfo.uint32(3, 1); // application = PROPRESENTER
  const version = new ProtoWriter();
  version.uint32(1, 7);
  version.uint32(2, 16);
  version.uint32(3, 2);
  appInfo.message(4, version); // application_version
  presentation.message(1, appInfo);

  presentation.message(2, uuidWriter(generateUuid())); // uuid
  presentation.string(3, title.trim() || 'Untitled'); // name
  presentation.string(6, 'Song'); // category

  const cueWriters: ProtoWriter[] = [];
  const cueGroupWriters: ProtoWriter[] = [];

  for (const section of sections) {
    const lines = section.lines.map((line) => line.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    const cueIds: string[] = [];
    for (const slideLines of chunkLines(lines, linesPerSlide)) {
      const cueId = generateUuid();
      cueIds.push(cueId);
      cueWriters.push(buildCue(cueId, section.label, slideLines));
    }

    // CueGroup → Group{uuid,name,color}
    const group = new ProtoWriter();
    group.message(1, uuidWriter(generateUuid())); // uuid
    group.string(2, section.label); // name
    const [red, green, blue] = groupColor(section.label);
    group.message(3, colorWriter(red, green, blue, 1)); // color

    const cueGroup = new ProtoWriter();
    cueGroup.message(1, group); // group
    for (const cueId of cueIds) cueGroup.message(2, uuidWriter(cueId)); // cue_identifiers
    cueGroupWriters.push(cueGroup);
  }

  for (const cueGroup of cueGroupWriters) presentation.message(12, cueGroup); // cue_groups
  for (const cue of cueWriters) presentation.message(13, cue); // cues

  return presentation.finish();
}

/** Filesystem-safe `.pro` filename from a song title. */
export function proFilename(title: string): string {
  const base =
    (title || 'lyrics')
      .trim()
      .replace(/[/\\:*?"<>|]+/g, '')
      .replace(/\s+/g, ' ')
      .slice(0, 80)
      .trim() || 'lyrics';
  return `${base}.pro`;
}
