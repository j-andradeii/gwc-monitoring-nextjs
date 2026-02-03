'use client';

import React from 'react';

export const InProgressSection: React.FC = () => {
    return (
        <section className="landing-section">
            <div className="landing-container">
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div className="section-label">Coming Soon</div>
                    <h2 className="section-title">Work in Progress</h2>
                    <p className="section-description" style={{ margin: '0 auto', maxWidth: '600px' }}>
                        We are currently working on this section to bring you the best experience.
                        Stay tuned for updates and new opportunities to get involved.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default InProgressSection;
