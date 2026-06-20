import '@/styles/admin-dashboard.css';

export default function WomenNetwork() {
  return (
    <div className="admin-dashboard">
      <header className="admin-dash-page-header">
        <div className="admin-dash-header-meta">
          <p className="admin-dash-eyebrow" aria-hidden="true">Church Members</p>
          <h1 className="admin-dash-title">Women Network</h1>
          <p className="admin-dash-subtitle">Directory and management for the women&apos;s ministry network.</p>
        </div>
      </header>

      <section className="admin-dash-section" aria-label="Women Network content">
        <div className="admin-dash-coming-soon">
          <div className="admin-dash-coming-soon-icon-tile" aria-hidden="true">
            <i className="pi pi-heart" />
          </div>
          <h2 className="admin-dash-coming-soon-title">Coming Soon</h2>
          <p className="admin-dash-coming-soon-text">
            The Women Network directory is under development. This area will list all active members
            in the women&apos;s ministry and support group management.
          </p>
        </div>
      </section>
    </div>
  );
}
