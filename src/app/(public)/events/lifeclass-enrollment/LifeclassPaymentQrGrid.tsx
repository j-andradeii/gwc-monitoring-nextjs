'use client';

import DownloadQRButton from '@/components/ui/DownloadQRButton';

/**
 * The BPI + GCash payment QR codes for Life Class enrollment.
 *
 * Rendered twice — inside section 03 of the enrollment form, and inside the
 * "Already enrolled?" dialog — so someone who skipped payment the first time
 * gets the same codes when they come back with their reference number. Sizing
 * lives here rather than on either caller for the same reason.
 *
 * Currently the same account the SOD enrollment uses; swap these if Life Class
 * fees are ever collected through a different one.
 */
export const LIFECLASS_PAYMENT_QRS = [
  {
    bank: 'BPI',
    icon: 'pi pi-credit-card',
    src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/sod-payment/kc_bpi.png',
    filename: 'gateway-lifeclass-bpi-qr.png',
  },
  {
    bank: 'GCash',
    icon: 'pi pi-wallet',
    src: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/sod-payment/kc_gcash.png',
    filename: 'gateway-lifeclass-gcash-qr.png',
  },
] as const;

/**
 * The shared `.sod-payment-grid` is `1fr 1fr`, which centres these narrower
 * cards inside over-wide columns. Sizing the tracks to the card and packing
 * them left lines the pair up with the section text instead.
 *
 * TWO TRACKS ALWAYS, matching the paid-event registration section
 * (`.event-register-section .sod-payment-grid` in vip-form.css): `minmax(0,
 * 196px)` lets both tracks shrink below the cap on a phone, so the pair stays
 * on one row instead of stacking into a tall scroll. `auto-fit` was doing the
 * latter: a 196px minimum cannot fit twice on a 360px screen, so it collapsed
 * to a single column. The mobile `grid-template-columns: 1fr` in vip-form.css
 * is overridden by this inline style, as it is for the event section.
 */
const GRID_STYLE = {
  gridTemplateColumns: 'repeat(2, minmax(0, 196px))',
  justifyContent: 'start',
} as const;

/** Page-local override of the shared SOD card sizing: hug the smaller QR. */
const CARD_STYLE = { maxWidth: '196px', padding: '12px' } as const;

/**
 * 160px is the smallest these dense InstaPay codes stay comfortably scannable
 * off a screen (the shared default is 240px); anyone who needs it bigger taps
 * Download QR for the full-resolution image.
 */
const FRAME_STYLE = { maxWidth: '160px', padding: '6px' } as const;

export default function LifeclassPaymentQrGrid() {
  return (
    <div className="sod-payment-grid" style={GRID_STYLE}>
      {LIFECLASS_PAYMENT_QRS.map((qr) => (
        <div className="sod-payment-card" key={qr.bank} style={CARD_STYLE}>
          <span className="sod-payment-bank">
            <i className={qr.icon} aria-hidden="true"></i>
            {qr.bank}
          </span>
          <span className="sod-payment-qr-frame" style={FRAME_STYLE}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qr.src}
              alt={`${qr.bank} payment QR code for Life Class enrollment`}
              className="sod-payment-qr"
              loading="lazy"
            />
          </span>
          <span className="sod-payment-scan">
            <i className="pi pi-qrcode" aria-hidden="true"></i>
            Scan to pay
          </span>
          <DownloadQRButton
            qrCodeUrl={qr.src}
            filename={qr.filename}
            color="var(--color-primary)"
            className="sod-payment-download"
            /* Same compact scale as the event section (EventPaymentQrGrid):
               with two tracks on a phone each card is ~140px wide, and the
               roomier padding pushed "Download QR" past the card edge. */
            style={{
              marginTop: '0.15rem',
              padding: '0.38rem 0.75rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              maxWidth: '100%',
            }}
          />
        </div>
      ))}
    </div>
  );
}
