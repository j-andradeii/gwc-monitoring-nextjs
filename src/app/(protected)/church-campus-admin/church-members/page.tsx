import '@/styles/admin-dashboard.css';

export default function ChurchMembers() {
  return (
    <div className="admin-dashboard">
      <header className="admin-dash-page-header">
        <div className="admin-dash-header-meta">
          <p className="admin-dash-eyebrow" aria-hidden="true">Church Campus</p>
          <h1 className="admin-dash-title">Church Members</h1>
          <p className="admin-dash-subtitle">Browse and manage your congregation roster.</p>
        </div>
      </header>

      <section className="admin-dash-section" aria-label="Church members content">
        <div className="admin-dash-coming-soon">
          <div className="admin-dash-coming-soon-icon-tile" aria-hidden="true">
            <i className="pi pi-users" />
          </div>
          <h2 className="admin-dash-coming-soon-title">Coming Soon</h2>
          <p className="admin-dash-coming-soon-text">
            The members directory is being prepared. Use&nbsp;
            <strong>Add Member</strong> from the dashboard to register new members in the meantime.
          </p>
        </div>
      </section>
    </div>
  );
}
