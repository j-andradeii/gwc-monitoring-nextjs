import React from 'react';
import { useDownloadImage } from '@/hooks/useDownloadImage';

interface DownloadQRButtonProps {
    qrCodeUrl: string;
    filename: string;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
}

const DownloadQRButton: React.FC<DownloadQRButtonProps> = ({
    qrCodeUrl,
    filename,
    color = '#007DFE',
    className = '',
    style = {},
}) => {
    const { downloadImage, isDownloading } = useDownloadImage();
    const [isHovered, setIsHovered] = React.useState(false);

    const handleDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!isDownloading) {
            downloadImage(qrCodeUrl, filename);
        }
    };

    return (
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
    );
};

export default DownloadQRButton;
