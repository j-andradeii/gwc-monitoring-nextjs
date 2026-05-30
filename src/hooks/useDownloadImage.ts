import { useState, useCallback } from 'react';

/**
 * Hook to handle image downloading with blob handling for cross-origin support
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
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up
            window.URL.revokeObjectURL(blobUrl);
        } catch (err: unknown) {
            console.error('Download failed:', err);
            setError(err instanceof Error ? err.message : 'Failed to download image');

            // Fallback: Try to open in new tab/download directly
            // This helps if CORS blocks fetch but direct access is allowed
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } finally {
            setIsDownloading(false);
        }
    }, []);

    return { downloadImage, isDownloading, error };
};
