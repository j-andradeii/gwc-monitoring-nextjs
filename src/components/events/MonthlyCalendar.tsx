'use client';

import React from 'react';
import { Image } from 'primereact/image';

interface MonthlyCalendarProps {
    imageSrc: string;
}

export const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
    imageSrc
}) => {
    return (
        <section className="monthly-calendar-section" style={{ padding: '80px 0 20px' }}>
            <div className="landing-container">
                <div className="section-header-center" style={{ textAlign: 'left', marginBottom: '32px' }}>
                    <span className="section-label">Monthly Schedule</span>
                    <h2>Calendar of Activities</h2>
                </div>

                <div className="calendar-preview-container premium-glass-card" style={{
                    padding: '24px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.5)'
                }}>
                    <div style={{ width: '100%', borderRadius: '16px', overflow: 'hidden' }}>
                        <Image
                            src={imageSrc}
                            alt="Monthly Calendar"
                            preview
                            width="100%"
                            style={{ display: 'block' }}
                            pt={{
                                image: { style: { width: '100%', height: 'auto', display: 'block' } }
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
