'use client';

import DownloadQRButton from '@/components/ui/DownloadQRButton';

/**
 * The BPI + GCash payment QR codes for paid-event registration.
 * Rendered both inside the registration form and inside the "Complete your
 * registration" dialog, so a registrant who skipped payment the first time
 * still gets the same codes when they come back with their reference number.
 */
const PAYMENT_METHODS = [
  {
    bank: 'BPI',
    icon: 'pi-credit-card',
    qrCodeUrl: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/sod-payment/kc_bpi.png',
    filename: 'gateway-event-bpi-qr.png',
    alt: 'BPI payment QR code for Gateway event registration',
  },
  {
    bank: 'GCash',
    icon: 'pi-wallet',
    qrCodeUrl: 'https://gtxngthtpisigkys.public.blob.vercel-storage.com/sod-payment/kc_gcash.png',
    filename: 'gateway-event-gcash-qr.png',
    alt: 'GCash payment QR code for Gateway event registration',
  },
] as const;

export default function EventPaymentQrGrid() {
  return (
    <div className="sod-payment-grid">
      {PAYMENT_METHODS.map((method) => (
        <div className="sod-payment-card" key={method.bank}>
          <span className="sod-payment-bank">
            <i className={`pi ${method.icon}`} aria-hidden="true"></i>
            {method.bank}
          </span>
          <span className="sod-payment-qr-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={method.qrCodeUrl}
              alt={method.alt}
              className="sod-payment-qr"
              loading="lazy"
            />
          </span>
          <span className="sod-payment-scan">
            <i className="pi pi-qrcode" aria-hidden="true"></i>
            Scan to pay
          </span>
          <DownloadQRButton
            qrCodeUrl={method.qrCodeUrl}
            filename={method.filename}
            color="var(--color-primary)"
            className="sod-payment-download"
            style={{
              marginTop: '0.15rem',
              padding: '0.38rem 0.75rem',
              fontSize: '0.72rem',
              fontWeight: 700,
            }}
          />
        </div>
      ))}
    </div>
  );
}
