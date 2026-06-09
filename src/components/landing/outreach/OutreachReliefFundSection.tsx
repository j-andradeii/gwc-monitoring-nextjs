import React from 'react';
import { outreachReliefFund, outreachReliefItems } from '@/data/outreachData';

export const OutreachReliefFundSection: React.FC = () => {
  const {
    goalAmount,
    currentAmount,
    targetFamilies,
    targetFamiliesCaption,
    label,
    heading,
    description,
    goalCaption,
  } = outreachReliefFund;
  const pct = Math.min(100, Math.round((currentAmount / goalAmount) * 100));
  const remaining = Math.max(0, goalAmount - currentAmount);

  return (
    <section
      id="outreach-relief-fund"
      className="landing-section outreach-relief-section"
    >
      <div className="landing-container">
        {/* Section header */}
        <div className="section-header-center animate-on-scroll">
          <span className="section-label">{label}</span>
          <h2 className="outreach-relief-title">{heading}</h2>
          <p className="outreach-relief-subtitle">{description}</p>
        </div>

        {/* Design-system dark glass goal panel */}
        <div className="premium-stat-card outreach-relief-goal-card animate-on-scroll">
          <div className="outreach-relief-goal-blur" aria-hidden="true" />
          <div className="outreach-relief-goal-top">
            <div
              className="outreach-relief-target-hero"
              aria-label={`Target ${targetFamilies.toLocaleString()} families`}
            >
              <span className="outreach-relief-target-eyebrow">
                Target Families
              </span>
              <span className="outreach-relief-target-number">
                {targetFamilies.toLocaleString()}
              </span>
              <span className="outreach-relief-target-unit">families</span>
              <span className="outreach-relief-target-caption">
                {targetFamiliesCaption}
              </span>
            </div>

            <div className="outreach-relief-goal-summary">
              <div className="outreach-relief-goal-summary-top">
                <div className="outreach-relief-goal-headline">
                  <span className="outreach-relief-goal-eyebrow">
                    Relief Fund Goal
                  </span>
                  <span className="outreach-relief-goal-amount">
                    &#8369;{goalAmount.toLocaleString()}
                  </span>
                  <span className="outreach-relief-goal-caption">
                    {goalCaption}
                  </span>
                </div>

                <div className="outreach-relief-goal-pct">
                  <span className="outreach-relief-goal-pct-value">{pct}%</span>
                  <span className="outreach-relief-goal-pct-label">Raised</span>
                </div>
              </div>

              <div
                className="outreach-relief-progress"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Relief fund ${pct} percent raised toward ${targetFamilies.toLocaleString()} target families`}
              >
                <div className="outreach-relief-progress-track">
                  <div
                    className="outreach-relief-progress-fill"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="outreach-relief-goal-stats">
            <div className="outreach-relief-stat">
              <span className="outreach-relief-stat-icon">
                <i className="pi pi-wallet" aria-hidden="true" />
              </span>
              <span className="outreach-relief-stat-text">
                <span className="outreach-relief-stat-label">Raised So Far</span>
                <span className="outreach-relief-stat-value">
                  &#8369;{currentAmount.toLocaleString()}
                </span>
              </span>
            </div>

            <div className="outreach-relief-stat">
              <span className="outreach-relief-stat-icon">
                <i className="pi pi-chart-line" aria-hidden="true" />
              </span>
              <span className="outreach-relief-stat-text">
                <span className="outreach-relief-stat-label">Still Needed</span>
                <span className="outreach-relief-stat-value">
                  &#8369;{remaining.toLocaleString()}
                </span>
              </span>
            </div>

            <div className="outreach-relief-stat">
              <span className="outreach-relief-stat-icon">
                <i className="pi pi-bullseye" aria-hidden="true" />
              </span>
              <span className="outreach-relief-stat-text">
                <span className="outreach-relief-stat-label">Goal Amount</span>
                <span className="outreach-relief-stat-value">
                  &#8369;{goalAmount.toLocaleString()}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* What your gift provides */}
        <div className="outreach-relief-items-head animate-on-scroll">
          <h3 className="outreach-relief-items-title">What Your Gift Provides</h3>
          <p className="outreach-relief-items-sub">
            Every peso is turned into tangible relief for families in crisis.
          </p>
        </div>

        <div
          className="outreach-relief-items-grid animate-on-scroll"
          role="list"
        >
          {outreachReliefItems.map((item) => (
            <article
              key={item.label}
              className="outreach-relief-item-card"
              role="listitem"
            >
              <div className="outreach-relief-item-icon">
                <i className={item.icon} aria-hidden="true" />
              </div>
              <div className="outreach-relief-item-body">
                <h4 className="outreach-relief-item-label">{item.label}</h4>
                <p className="outreach-relief-item-desc">{item.description}</p>
              </div>
              <div className="outreach-relief-item-cost">
                <span className="outreach-relief-item-cost-value">
                  &#8369;{item.unitCost.toLocaleString()}
                </span>
                <span className="outreach-relief-item-cost-unit">per kit</span>
              </div>
            </article>
          ))}
        </div>

        <div className="outreach-relief-cta animate-on-scroll">
          <a
            href="#outreach-give"
            className="landing-btn landing-btn-primary outreach-relief-cta-btn"
          >
            Give to the Relief Fund
          </a>
        </div>
      </div>
    </section>
  );
};

export default OutreachReliefFundSection;
