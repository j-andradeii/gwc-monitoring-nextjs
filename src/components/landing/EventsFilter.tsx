'use client';

import React, { useState } from 'react';

interface EventsFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categoryOptions: string[];
  totalCount: number;
  filteredCount: number;
}

/**
 * EventsFilter Component
 *
 * Reusable filter component for events with search and category filters.
 * Currently not in use but available for future implementation.
 */
export const EventsFilter: React.FC<EventsFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categoryOptions,
  totalCount,
  filteredCount,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <section
      style={{
        padding: '40px 0',
        background: 'linear-gradient(180deg, #fefcf3 0%, #fdf6e3 100%)',
        borderBottom: '1px solid rgba(240, 180, 41, 0.15)',
        position: 'sticky',
        top: '64px',
        zIndex: 100,
      }}
    >
      <div className="landing-container">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1', minWidth: '250px', maxWidth: '400px' }}>
            <i
              className="pi pi-search"
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)',
                fontSize: '14px',
              }}
            />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 46px',
                border: '2px solid var(--border-color)',
                borderRadius: '12px',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                backgroundColor: '#ffffff',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary-gold-accent)';
                e.target.style.boxShadow = '0 0 0 4px var(--gold-shadow-hover)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.boxShadow = 'none';
              }}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  padding: '4px',
                }}
              >
                <i className="pi pi-times" />
              </button>
            )}
          </div>

          {/* Desktop Filters */}
          <div className="desktop-filters" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categoryOptions.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                style={{
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: '2px solid',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor:
                    selectedCategory === category ? 'var(--primary-gold-accent)' : 'transparent',
                  borderColor:
                    selectedCategory === category
                      ? 'var(--primary-gold-accent)'
                      : 'var(--border-color)',
                  color: selectedCategory === category ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Mobile Filter Dropdown */}
          <div className="mobile-filters" style={{ position: 'relative', display: 'none' }}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 20px',
                border: '2px solid var(--border-color)',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-primary)',
              }}
            >
              <i className="pi pi-filter" />
              {selectedCategory}
              <i className={`pi pi-chevron-${isFilterOpen ? 'up' : 'down'}`} />
            </button>
            {isFilterOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                  overflow: 'hidden',
                  minWidth: '200px',
                  zIndex: 10,
                }}
              >
                {categoryOptions.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      onCategoryChange(category);
                      setIsFilterOpen(false);
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '14px 20px',
                      border: 'none',
                      backgroundColor:
                        selectedCategory === category ? 'var(--primary-gold-accent)' : 'transparent',
                      color: selectedCategory === category ? '#ffffff' : 'var(--text-primary)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div style={{ marginTop: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          {filteredCount === totalCount
            ? `Showing all ${totalCount} upcoming events`
            : `Found ${filteredCount} event${filteredCount !== 1 ? 's' : ''}`}
        </div>
      </div>
    </section>
  );
};

export default EventsFilter;
