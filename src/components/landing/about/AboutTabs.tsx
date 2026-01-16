'use client';

import React, { useState, useEffect, useRef } from 'react';

interface NavItem {
    id: string;
    label: string;
}

const navItems: NavItem[] = [
    { id: 'about-top', label: 'About' },
    { id: 'our-story', label: 'Our Story' },
    { id: 'vision-mission', label: 'Vision & Mission' },
    { id: 'our-values', label: 'Our Values' },
    { id: 'our-pastors', label: 'Our Pastors' },
    { id: 'contact', label: 'Contact' },
];

export const AboutTabs: React.FC = () => {
    const [activeSection, setActiveSection] = useState<string>('about-top');
    const [isSticky, setIsSticky] = useState(false);
    const isClickScrolling = useRef(false);
    const navRef = useRef<HTMLElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Handle scroll for sticky state and active section
    useEffect(() => {
        const handleScroll = () => {
            // Sticky check
            if (navRef.current) {
                const heroSection = document.getElementById('about-top');
                if (heroSection) {
                    // Make sticky when scrolling past hero content roughly
                    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
                    setIsSticky(window.scrollY > heroBottom - 100);
                }
            }

            if (isClickScrolling.current) return;

            const scrollTop = window.scrollY + 180; // Offset for header + tabs

            // Find the section whose top is closest to (but above) the scroll position
            let currentSection = navItems[0].id;

            for (const item of navItems) {
                const element = document.getElementById(item.id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const elementTop = rect.top + window.scrollY;

                    // Check if we're near the bottom of the page for the last item
                    const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;

                    if (isAtBottom) {
                        currentSection = navItems[navItems.length - 1].id;
                    } else if (elementTop <= scrollTop) {
                        currentSection = item.id;
                    }
                }
            }

            setActiveSection(currentSection);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial call

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Auto-scroll active tab into view
    useEffect(() => {
        if (scrollContainerRef.current) {
            const activeTab = document.getElementById(`tab-${activeSection}`);
            if (activeTab) {
                const container = scrollContainerRef.current;
                const scrollLeft =
                    activeTab.offsetLeft -
                    container.offsetWidth / 2 +
                    activeTab.offsetWidth / 2;

                container.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth',
                });
            }
        }
    }, [activeSection]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            // Prevent scroll handler from interfering during smooth scroll
            isClickScrolling.current = true;
            setActiveSection(id);

            const headerOffset = 140; // Approximate height of header + tab bar
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });

            // Re-enable detection after animation completes
            setTimeout(() => {
                isClickScrolling.current = false;
            }, 800);
        }
    };

    return (
        <nav
            ref={navRef}
            className={`about-tabs-nav ${isSticky ? 'sticky' : ''}`}
            style={{
                position: 'sticky',
                top: '70px', // Below the main header
                zIndex: 900,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                width: '100%',
            }}
        >
            <div
                ref={scrollContainerRef}
                className="landing-container"
                style={{
                    overflowX: 'auto',
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                    scrollBehavior: 'smooth'
                }}
            >
                <div
                    className="about-tabs-list"
                    style={{
                        display: 'flex',
                        gap: '8px',
                        padding: '16px 0',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            id={`tab-${item.id}`}
                            onClick={(e) => handleClick(e, item.id)}
                            className={`about-tab-btn ${activeSection === item.id ? 'active' : ''}`}
                            style={{
                                padding: '8px 20px',
                                borderRadius: '50px',
                                border: '1px solid',
                                borderColor: activeSection === item.id ? 'var(--primary-gold-accent)' : 'transparent',
                                backgroundColor: activeSection === item.id ? 'rgba(212, 168, 75, 0.1)' : 'transparent',
                                color: activeSection === item.id ? 'var(--primary-gold-accent)' : 'var(--text-secondary)',
                                fontWeight: 600,
                                fontSize: '14px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                outline: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default AboutTabs;
