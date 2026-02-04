'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { config } from '@/core/config';

import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    WhatsappShareButton,
    EmailShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    WhatsappIcon,
    EmailIcon,
} from 'react-share';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    excerpt: string;
}

export function ShareModal({ isOpen, onClose, title, excerpt }: ShareModalProps) {
    if (!isOpen) return null;

    const APP_URI = config.app.url;

    const pathname = usePathname();
    const shareUrl = `${config.app.url}${pathname}`;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '20px',
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '32px',
                    width: '100%',
                    maxWidth: '500px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    transform: 'scale(1)',
                    animation: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>
                        Share Sermon
                    </h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                        <i className="pi pi-times" style={{ fontSize: '18px' }} />
                    </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
                    {/* Facebook */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <FacebookShareButton url={shareUrl} hashtag="#GatewayChurch">
                            <FacebookIcon size={48} round />
                        </FacebookShareButton>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Facebook</span>
                    </div>

                    {/* Twitter */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <TwitterShareButton url={shareUrl} title={title}>
                            <TwitterIcon size={48} round />
                        </TwitterShareButton>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Twitter</span>
                    </div>

                    {/* WhatsApp */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <WhatsappShareButton url={shareUrl} title={title} separator=" - ">
                            <WhatsappIcon size={48} round />
                        </WhatsappShareButton>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>WhatsApp</span>
                    </div>

                    {/* LinkedIn */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <LinkedinShareButton url={shareUrl} title={title} summary={excerpt} source="Gateway Church">
                            <LinkedinIcon size={48} round />
                        </LinkedinShareButton>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>LinkedIn</span>
                    </div>

                    {/* Email */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <EmailShareButton url={shareUrl} subject={title} body={`Check out this sermon: ${title}\n\n${excerpt}\n\n`}>
                            <EmailIcon size={48} round />
                        </EmailShareButton>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Email</span>
                    </div>
                </div>

                {/* Copy Link */}
                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        readOnly
                        value={shareUrl}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            paddingRight: '100px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: '#f8fafc',
                            color: 'var(--text-secondary)',
                            fontSize: '14px',
                            outline: 'none',
                        }}
                    />
                    <button
                        onClick={(e) => {
                            const btn = e.currentTarget;
                            navigator.clipboard.writeText(shareUrl);
                            const originalText = btn.innerText;
                            btn.innerText = 'Copied!';
                            setTimeout(() => {
                                btn.innerText = originalText;
                            }, 2000);
                        }}
                        style={{
                            position: 'absolute',
                            right: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            padding: '6px 12px',
                            backgroundColor: 'white',
                            border: '1px solid var(--border-color)',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--primary-gold-accent)';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.borderColor = 'var(--primary-gold-accent)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.color = 'var(--text-primary)';
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                        }}
                    >
                        Copy Link
                    </button>
                </div>
            </div>
        </div>
    );
}
