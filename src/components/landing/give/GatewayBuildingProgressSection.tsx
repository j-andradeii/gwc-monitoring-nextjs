'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gatewayProjectsData } from '@/data/giveData';

type StepStatus = 'complete' | 'current' | 'upcoming';

const STEP_STATUS_LABEL: Record<StepStatus, string> = {
  complete: 'Complete',
  current: 'In Progress',
  upcoming: 'Upcoming',
};

const STEP_STATUS_ICON: Record<StepStatus, string> = {
  complete: 'pi pi-check-circle',
  current: 'pi pi-wrench',
  upcoming: 'pi pi-clock',
};

/** Ease-out cubic — same feel as the OutreachImpactSection count-up */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

const formatPeso = (amount: number): string => `₱${amount.toLocaleString('en-PH')}`;

export const GatewayBuildingProgressSection: React.FC = () => {
  const { currentAmount, goalAmount, milestones } = gatewayProjectsData;

  const rawPercentage = goalAmount > 0 ? (currentAmount / goalAmount) * 100 : 0;
  const progressPercentage = Math.min(100, Math.max(0, rawPercentage));
  const roundedPercentage = Math.round(progressPercentage);
  const remainingAmount = Math.max(0, goalAmount - currentAmount);

  const completedCount = milestones.filter((m) => m.completed).length;
  const currentPhaseIndex = milestones.findIndex((m) => !m.completed);

  const getStepStatus = (index: number): StepStatus => {
    if (milestones[index].completed) return 'complete';
    if (index === currentPhaseIndex) return 'current';
    return 'upcoming';
  };

  // Reveal-on-view: the ring/bar fills animate and the percentage counts up
  // once the card scrolls into view. SSR renders the final number so the
  // content is meaningful without JS; fills stay hidden until revealed.
  const cardRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [inView, setInView] = useState(false);
  const [displayedPercentage, setDisplayedPercentage] = useState(roundedPercentage);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();

        const duration = prefersReduced ? 0 : 1400;
        const startTime = performance.now();

        const tick = (now: number) => {
          const progress = duration === 0 ? 1 : Math.min((now - startTime) / duration, 1);
          setDisplayedPercentage(Math.round(easeOut(progress) * roundedPercentage));
          if (progress < 1) {
            rafRef.current = requestAnimationFrame(tick);
          }
        };

        rafRef.current = requestAnimationFrame((now) => {
          setInView(true);
          tick(now);
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [roundedPercentage]);

  return (
    <section
      id="gateway-progress"
      className="landing-section building-progress-section"
      aria-labelledby="gateway-progress-title"
      style={{
        backgroundImage: "url('https://gtxngthtpisigkys.public.blob.vercel-storage.com/center.jpg')",
      }}
    >
      <div className="building-progress-overlay" aria-hidden="true" />
      <div className="landing-container">
        {/* Section Header */}
        <div className="section-header-center animate-on-scroll">
          <span className="section-label">Roadmap</span>
          <h2 id="gateway-progress-title">Project Milestones</h2>
          <p className="building-progress-section-description">
            Track our journey to completing the ministry center
          </p>
        </div>

        <div className="building-progress-grid">
          {/* Left Column: Fundraising Card */}
          <article className="bp-fund-card" ref={cardRef}>
            <div className="bp-fund-glow" aria-hidden="true" />

            {/* Top: Ring + Headline */}
            <div className="bp-fund-header">
              <div
                className="bp-ring"
                role="progressbar"
                aria-label="Fundraising progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={roundedPercentage}
                aria-valuetext={`${roundedPercentage}% raised — ${formatPeso(currentAmount)} of ${formatPeso(goalAmount)}`}
              >
                <svg className="bp-ring-svg" viewBox="0 0 36 36" aria-hidden="true" focusable="false">
                  <defs>
                    <linearGradient id="bpGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#e5c47a" />
                      <stop offset="100%" stopColor="#b8923f" />
                    </linearGradient>
                    <filter id="bpRingGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="1.6" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <path
                    className="bp-ring-track"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="2.5"
                  />
                  <path
                    className="bp-ring-fill"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#bpGoldGradient)"
                    strokeWidth="2.5"
                    strokeDasharray={`${inView ? progressPercentage : 0}, 100`}
                    strokeLinecap="round"
                    filter="url(#bpRingGlow)"
                    style={{ opacity: inView ? 1 : 0 }}
                  />
                </svg>
                <div className="bp-ring-text" aria-hidden="true">
                  <span className="bp-ring-pct">{displayedPercentage}%</span>
                  <span className="bp-ring-label">Raised</span>
                </div>
              </div>

              <div className="bp-fund-headline">
                <h3>
                  Together We&apos;re
                  <br />
                  Building
                </h3>
                <p>Your generosity is making a difference</p>
              </div>
            </div>

            {/* Middle: Progress Bar (visual duplicate of the ring) */}
            <div className="bp-bar" aria-hidden="true">
              <div className="bp-bar-labels">
                <span>Start</span>
                <span>Goal</span>
              </div>
              <div className="bp-bar-track">
                <div
                  className="bp-bar-fill"
                  style={{ width: `${inView ? progressPercentage : 0}%`, opacity: inView ? 1 : 0 }}
                />
              </div>
            </div>

            {/* Bottom: Stats */}
            <dl className="bp-stats">
              <div className="bp-stat">
                <dt className="bp-stat-header">
                  <i className="pi pi-wallet" aria-hidden="true" />
                  <span>Raised So Far</span>
                </dt>
                <dd className="bp-stat-value">{formatPeso(currentAmount)}</dd>
              </div>
              <div className="bp-stat">
                <dt className="bp-stat-header">
                  <i className="pi pi-chart-line" aria-hidden="true" />
                  <span>Still Needed</span>
                </dt>
                <dd className="bp-stat-value">{formatPeso(remainingAmount)}</dd>
              </div>
              <div className="bp-stat">
                <dt className="bp-stat-header">
                  <i className="pi pi-bullseye" aria-hidden="true" />
                  <span>Goal Amount</span>
                </dt>
                <dd className="bp-stat-value">{formatPeso(goalAmount)}</dd>
              </div>
            </dl>

            <div className="bp-cta-row">
              <a
                href="#gateway-give"
                className="landing-btn landing-btn-light bp-cta"
                aria-label="Go to the Give to Gateway Projects section"
              >
                Sow Toward the Next Phase
              </a>
            </div>
          </article>

          {/* Right Column: Phase Timeline */}
          <div className="bp-timeline">
            <div className="bp-timeline-head">
              <h3 className="bp-timeline-title">Phase Timeline</h3>
              <span className="bp-timeline-count">
                {completedCount} of {milestones.length} complete
              </span>
            </div>

            <ol className="bp-steps">
              {milestones.map((milestone, index) => {
                const status = getStepStatus(index);
                return (
                  <li key={milestone.label} className={`bp-step is-${status}`}>
                    <div className="bp-step-node" aria-hidden="true">
                      {status === 'complete' ? <i className="pi pi-check" /> : <span>{index + 1}</span>}
                    </div>
                    <div className="bp-step-card">
                      <div className="bp-step-top">
                        <span className="bp-step-phase">Phase {index + 1}</span>
                        <span className="bp-step-status">
                          <i className={STEP_STATUS_ICON[status]} aria-hidden="true" />
                          {STEP_STATUS_LABEL[status]}
                        </span>
                      </div>
                      <h4 className="bp-step-title">{milestone.label.replace(/^Phase \d+: /, '')}</h4>
                      <p className="bp-step-amount">{formatPeso(milestone.amount)}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GatewayBuildingProgressSection;
