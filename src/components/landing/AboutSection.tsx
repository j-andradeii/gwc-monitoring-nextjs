'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="about-us-section animate-on-scroll">
      <div className="landing-container">
        <h2>About Our Church</h2>
        <div className="about-content-wrapper">
          <div className="about-text">
            <h3>Loving God, Loving People</h3>
            <p>
              Gateway Church is a vibrant, multicultural community dedicated to sharing the
              love of Christ and serving our city. We believe in creating a space where people
              can encounter God, grow in their faith, and find a supportive family.
            </p>
            <p>
              Our mission is to lead people into a growing relationship with Jesus Christ by
              creating environments where people are encouraged and equipped to pursue intimacy
              with God, community with insiders, and influence with outsiders.
            </p>
            <Link href="#" className="landing-btn landing-btn-outline">
              Learn More About Us
            </Link>
          </div>
          <div className="about-image">
            <Image
              src="https://placehold.co/600x400/E8E8E8/232323?text=Our+Community"
              alt="About Gateway Church"
              width={600}
              height={400}
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
