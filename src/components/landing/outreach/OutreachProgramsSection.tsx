import React from 'react';
import { outreachPrograms } from '@/data/outreachData';

/**
 * Outreach Programs — "what we do week to week".
 *
 * The page's community-outreach anchor: icon cards (deliberately photo-free so
 * the section never depends on blob images, and so the Gallery band keeps the
 * photography to itself).
 */
export const OutreachProgramsSection: React.FC = () => {
  return (
    <section id="outreach-programs" className="landing-section outreach-programs-section">
      <div className="landing-container">
        <div className="section-header-center animate-on-scroll">
          <span className="section-label">What We Do</span>
          <h2 className="outreach-programs-title">Our Community Outreach Work</h2>
          <p className="outreach-programs-subtitle">
            The everyday ministry of Gateway Outreach — carried out in the same barangays,
            with the same families, week after week
          </p>
        </div>

        <div className="outreach-programs-grid animate-on-scroll">
          {outreachPrograms.map((program, idx) => (
            <article
              key={program.id}
              className="outreach-program-card"
              style={{ ['--program-card-index' as string]: idx }}
            >
              <div className="outreach-program-icon-wrap" aria-hidden="true">
                <i className={program.icon} />
              </div>
              <h3 className="outreach-program-title">{program.title}</h3>
              <p className="outreach-program-description">{program.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OutreachProgramsSection;
