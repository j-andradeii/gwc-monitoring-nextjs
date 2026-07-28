/**
 * Registration receipt image
 *
 * Draws the post-submission confirmation (reference number, timestamp and every
 * registered name) onto a canvas and returns it as a PNG blob so the registrant
 * can save it to their phone / desktop as proof of registration.
 *
 * Canvas is used instead of a DOM-to-image library so the receipt renders
 * identically everywhere and the app keeps its dependency footprint.
 */

export interface RegistrationReceiptData {
  eventTitle: string;
  eventDate: string;
  referenceNumber: string;
  timestamp: string;
  /** Primary registrant first, then everyone covered by the same payment. */
  names: string[];
}

const NAVY = '#1a2744';
const GOLD = '#d4a84b';
const CREAM = '#f5f0e6';
const IVORY = '#faf8f3';
const MUTED = '#6b7a90';
const BORDER = '#e3dccc';

const SANS = "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const MONO = "'SFMono-Regular', Consolas, 'Courier New', monospace";

const WIDTH = 900;
const PADDING = 56;
const CARD_INSET = 28;
const NAME_ROW_HEIGHT = 46;

/** roundRect isn't in older Safari — fall back to a manual path. */
function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, width, height, radius);
    return;
  }
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

/** Manual letter-spacing — ctx.letterSpacing is still too new to rely on. */
function drawTrackedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  tracking: number
) {
  let cursor = x;
  for (const char of text) {
    ctx.fillText(char, cursor, y);
    cursor += ctx.measureText(char).width + tracking;
  }
}

/** Wrap to at most `maxLines`, ellipsising the last line when it overflows. */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth || !current) {
      current = candidate;
      continue;
    }
    lines.push(current);
    current = word;
    if (lines.length === maxLines) break;
  }

  if (lines.length < maxLines && current) lines.push(current);

  if (lines.length === maxLines) {
    let last = lines[maxLines - 1];
    const consumed = lines.join(' ');
    if (consumed.length < text.length) {
      while (last.length > 1 && ctx.measureText(`${last}…`).width > maxWidth) {
        last = last.slice(0, -1);
      }
      lines[maxLines - 1] = `${last}…`;
    }
  }

  return lines.length > 0 ? lines : [text];
}

/**
 * Render the receipt and hand back a PNG blob.
 * Rendered at 2x for crisp text on retina screens and when zoomed.
 */
export async function createRegistrationReceiptImage(
  data: RegistrationReceiptData
): Promise<Blob> {
  // Webfonts must be resolved before measuring/drawing or the canvas silently
  // falls back to a different metric than the page.
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // Non-fatal — fall through with whatever font is available.
    }
  }

  const measure = document.createElement('canvas').getContext('2d');
  if (!measure) throw new Error('Canvas is not supported on this device');

  const contentWidth = WIDTH - PADDING * 2;

  measure.font = `700 30px ${SANS}`;
  const titleLines = wrapText(measure, data.eventTitle, contentWidth, 2);

  const namesCount = data.names.length;
  const headerHeight = 250 + titleLines.length * 38;
  const referenceHeight = 132;
  const namesHeight = 54 + namesCount * NAME_ROW_HEIGHT;
  const footerHeight = 96;
  const height = headerHeight + referenceHeight + namesHeight + footerHeight;

  const scale = 2;
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not supported on this device');
  ctx.scale(scale, scale);

  // Backdrop + card
  ctx.fillStyle = IVORY;
  ctx.fillRect(0, 0, WIDTH, height);

  ctx.fillStyle = '#ffffff';
  roundedRect(ctx, CARD_INSET, CARD_INSET, WIDTH - CARD_INSET * 2, height - CARD_INSET * 2, 28);
  ctx.fill();
  ctx.strokeStyle = BORDER;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Gold accent bar along the top of the card
  ctx.save();
  roundedRect(ctx, CARD_INSET, CARD_INSET, WIDTH - CARD_INSET * 2, height - CARD_INSET * 2, 28);
  ctx.clip();
  ctx.fillStyle = GOLD;
  ctx.fillRect(CARD_INSET, CARD_INSET, WIDTH - CARD_INSET * 2, 8);
  ctx.restore();

  let y = CARD_INSET + 74;

  // Brand line
  ctx.fillStyle = GOLD;
  ctx.font = `800 15px ${SANS}`;
  ctx.textBaseline = 'alphabetic';
  drawTrackedText(ctx, 'GATEWAY CHURCH', PADDING, y, 2.6);

  // Headline
  y += 52;
  ctx.fillStyle = NAVY;
  ctx.font = `800 42px ${SANS}`;
  ctx.fillText('Registration Confirmed', PADDING, y);

  // Event
  y += 50;
  ctx.fillStyle = NAVY;
  ctx.font = `700 30px ${SANS}`;
  for (const line of titleLines) {
    ctx.fillText(line, PADDING, y);
    y += 38;
  }

  ctx.fillStyle = MUTED;
  ctx.font = `500 20px ${SANS}`;
  ctx.fillText(data.eventDate, PADDING, y);
  y += 34;

  // Reference block
  const refBoxHeight = 96;
  ctx.fillStyle = CREAM;
  roundedRect(ctx, PADDING, y, contentWidth, refBoxHeight, 16);
  ctx.fill();

  ctx.fillStyle = MUTED;
  ctx.font = `700 13px ${SANS}`;
  drawTrackedText(ctx, 'REFERENCE NO.', PADDING + 24, y + 32, 1.8);

  ctx.fillStyle = NAVY;
  ctx.font = `700 32px ${MONO}`;
  ctx.fillText(data.referenceNumber, PADDING + 24, y + 72);

  y += refBoxHeight + 36;

  // Registrants
  ctx.fillStyle = MUTED;
  ctx.font = `700 13px ${SANS}`;
  drawTrackedText(
    ctx,
    namesCount > 1 ? `REGISTRANTS (${namesCount})` : 'REGISTRANT',
    PADDING,
    y,
    1.8
  );
  y += 26;

  data.names.forEach((name, index) => {
    const rowY = y + index * NAME_ROW_HEIGHT;

    ctx.fillStyle = 'rgba(212, 168, 75, 0.14)';
    roundedRect(ctx, PADDING, rowY, 30, 30, 9);
    ctx.fill();

    ctx.fillStyle = '#b8923f';
    ctx.font = `800 15px ${SANS}`;
    ctx.textAlign = 'center';
    ctx.fillText(String(index + 1), PADDING + 15, rowY + 21);
    ctx.textAlign = 'left';

    ctx.fillStyle = NAVY;
    ctx.font = `600 22px ${SANS}`;
    const nameLines = wrapText(ctx, name, contentWidth - 52, 1);
    ctx.fillText(nameLines[0], PADDING + 46, rowY + 22);

    if (index < data.names.length - 1) {
      ctx.strokeStyle = '#eef0f4';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(PADDING, rowY + NAME_ROW_HEIGHT - 8);
      ctx.lineTo(PADDING + contentWidth, rowY + NAME_ROW_HEIGHT - 8);
      ctx.stroke();
    }
  });

  y += namesCount * NAME_ROW_HEIGHT + 22;

  // Footer
  ctx.strokeStyle = BORDER;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PADDING, y);
  ctx.lineTo(PADDING + contentWidth, y);
  ctx.stroke();
  y += 30;

  ctx.fillStyle = MUTED;
  ctx.font = `500 17px ${SANS}`;
  ctx.fillText(`Submitted ${data.timestamp}`, PADDING, y);
  y += 26;
  ctx.fillText('Your slot is confirmed once we verify your payment.', PADDING, y);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Could not create the receipt image'));
    }, 'image/png');
  });
}
