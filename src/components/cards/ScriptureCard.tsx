'use client';

import React from 'react';

interface ScriptureCardProps {
    verse: string;
    text: string;
    className?: string;
}

export const ScriptureCard: React.FC<ScriptureCardProps> = ({ verse, text, className = '' }) => {
    return (
        <div className={`scripture-card enhanced-scripture ${className}`}>
            <span className="scripture-verse-pill">{verse}</span>
            <blockquote className="scripture-quote">
                &ldquo;{text}&rdquo;
            </blockquote>
        </div>
    );
};
