'use client';

import React from 'react';
import { Toast as PrimeToast } from 'primereact/toast';
import { useDownloadImage } from '@/hooks/useDownloadImage';

/**
 * PrimeReact's Toast defaults to `appendTo: 'self'`, i.e. it renders inside
 * whichever QR card holds the button — and a `position: fixed` toast inside a
 * card that carries a `transform` (the ways-to-give channel cards do, from the
 * scroll-reveal animation) is positioned against THAT CARD, not the viewport.
 * Portalling to the body is what keeps it pinned to the bottom of the screen.
 * Defined at module scope so the memoised Portal isn't re-run every render.
 */
const appendToBody = () => document.body;

interface DownloadQRButtonProps {
    qrCodeUrl: string;
    filename: string;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
}

/**
 * "Download QR" — the one place every QR save on the site goes through
 * (ways-to-give channels, paid-event registration, Life Class and SOD
 * enrollment, gateway outreach/projects).
 *
 * On a phone `useDownloadImage` hands the image to the OS share sheet, and once
 * that sheet closes the page looks exactly as it did before the tap: no
 * download chip, no notification, nothing to say the QR is now in Photos. The
 * toast below is that confirmation. It is deliberately mobile-only — a desktop
 * browser already announces its own download, so a second "saved" there would
 * just be noise — and it only fires when the file genuinely landed, never after
 * a cancelled sheet or a failed fetch.
 *
 * The Toast instance is local rather than a shared `ToastProvider`: these
 * buttons render on public pages that mount no toast host, including the fully
 * server-rendered /give/ways-to-give.
 */
const DownloadQRButton: React.FC<DownloadQRButtonProps> = ({
    qrCodeUrl,
    filename,
    color = '#007DFE',
    className = '',
    style = {},
}) => {
    const { downloadImage, isDownloading } = useDownloadImage();
    const [isHovered, setIsHovered] = React.useState(false);
    const toastRef = React.useRef<PrimeToast>(null);

    const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (isDownloading) return;

        const { outcome, mobile } = await downloadImage(qrCodeUrl, filename);

        // `dismissed` = share sheet cancelled, `failed` = the image only opened
        // in a new tab. Neither put a file on the device, so neither may claim
        // one did.
        if (!mobile || outcome === 'dismissed' || outcome === 'failed') return;

        toastRef.current?.show({
            severity: 'success',
            summary: 'QR code saved',
            // Where it landed depends on which path ran — the share sheet drops
            // it wherever the user chose, the fallback into Downloads.
            detail:
                outcome === 'shared'
                    ? 'Check your Photos or Files app for the QR code.'
                    : 'Check your downloads for the QR code.',
            life: 4000,
        });
    };

    return (
        <>
            <button
                onClick={handleDownload}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                disabled={isDownloading}
                className={`download-qr-btn ${className}`}
                style={{
                    marginTop: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: isHovered ? color : 'transparent',
                    border: `1px solid ${color}`,
                    borderRadius: '50px',
                    padding: '0.5rem 1rem',
                    color: isHovered ? '#ffffff' : color,
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    cursor: isDownloading ? 'wait' : 'pointer',
                    textDecoration: 'none',
                    opacity: isDownloading ? 0.7 : 1,
                    transition: 'all 0.2s ease',
                    boxShadow: isHovered ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                    ...style,
                }}
            >
                <i
                    className={`pi ${isDownloading ? 'pi-spin pi-spinner' : 'pi-download'}`}
                    style={{ fontSize: '0.9rem' }}
                ></i>
                <span style={{ lineHeight: 1 }}>{isDownloading ? 'Saving...' : 'Download QR'}</span>
            </button>

            {/* Bottom-centre so it never covers the QR card that was just tapped. */}
            <PrimeToast
                ref={toastRef}
                position="bottom-center"
                className="qr-save-toast"
                appendTo={appendToBody}
            />
        </>
    );
};

export default DownloadQRButton;
