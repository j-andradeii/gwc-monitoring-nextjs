import { useState, useCallback } from 'react';

/**
 * Detect a real mobile / tablet device (touch phone, Android tablet, or iPad).
 * Desktop browsers — even ones that support the Web Share API (Safari/Edge on
 * macOS/Windows) — return false so they keep the normal file download.
 */
const isMobileDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';

  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return true;
  }

  // iPadOS 13+ Safari reports a desktop ("Macintosh") UA — detect it via touch.
  const isTouchMac =
    /Macintosh/.test(ua) &&
    typeof document !== 'undefined' &&
    'ontouchend' in document &&
    navigator.maxTouchPoints > 1;

  return isTouchMac;
};

/** Classic blob/anchor download used on desktop (and as the mobile fallback). */
const triggerAnchorDownload = (href: string, filename: string, newTab = false) => {
  const link = document.createElement('a');
  link.href = href;
  link.download = filename;
  if (newTab) link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Hook to handle image downloading with blob handling for cross-origin support.
 *
 * On an actual mobile device the image is routed through the native share sheet
 * (`navigator.share({ files })`) so the user can save it straight to their phone
 * Photos / camera roll via the "Save Image" action — the web has no API to write
 * to Photos silently, so the share sheet is the standard one-tap path. Desktop
 * (and any device without file-share support) keeps the normal file download.
 */
export const useDownloadImage = () => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const downloadImage = useCallback(async (url: string, filename: string) => {
        if (!url) return;

        setIsDownloading(true);
        setError(null);

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');

            const blob = await response.blob();

            // Mobile: hand the image to the OS share sheet → "Save Image" to Photos.
            if (
                isMobileDevice() &&
                typeof navigator !== 'undefined' &&
                typeof navigator.canShare === 'function'
            ) {
                const file = new File([blob], filename, {
                    type: blob.type || 'image/jpeg',
                });

                if (navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({ files: [file], title: filename });
                        return; // saved (or sheet handled by the user) — done
                    } catch (shareErr) {
                        // User dismissed the sheet — treat as done, don't fall back.
                        if (shareErr instanceof Error && shareErr.name === 'AbortError') {
                            return;
                        }
                        // Any other share failure → fall through to the blob download.
                    }
                }
            }

            // Desktop (and mobile fallback): download the fetched blob.
            const blobUrl = window.URL.createObjectURL(blob);
            triggerAnchorDownload(blobUrl, filename);
            window.URL.revokeObjectURL(blobUrl);
        } catch (err: unknown) {
            console.error('Download failed:', err);
            setError(err instanceof Error ? err.message : 'Failed to download image');

            // Fallback: try to open/download directly.
            // This helps if CORS blocks fetch but direct access is allowed.
            triggerAnchorDownload(url, filename, true);
        } finally {
            setIsDownloading(false);
        }
    }, []);

    return { downloadImage, isDownloading, error };
};
