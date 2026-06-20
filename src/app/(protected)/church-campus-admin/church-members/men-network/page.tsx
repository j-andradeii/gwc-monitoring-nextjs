import '@/styles/admin-dashboard.css';

export default function MenNetwork() {
  return (
    <div className="admin-dashboard">
      <header className="admin-dash-page-header">
        <div className="admin-dash-header-meta">
          <p className="admin-dash-eyebrow" aria-hidden="true">Church Members</p>
          <h1 className="admin-dash-title">Men Network</h1>
          <p className="admin-dash-subtitle">Directory and management for the men&apos;s ministry network.</p>
        </div>
      </header>

      <section className="admin-dash-section" aria-label="Men Network content">
        <div className="admin-dash-coming-soon">
          <div className="admin-dash-coming-soon-icon-tile" aria-hidden="true">
            <i className="pi pi-user" />
          </div>
          <h2 className="admin-dash-coming-soon-title">Coming Soon</h2>
          <p className="admin-dash-coming-soon-text">
            The Men Network directory is under development. This area will list all active members
            in the men&apos;s ministry and support group management.
          </p>
        </div>
      </section>
    </div>
  );
}
