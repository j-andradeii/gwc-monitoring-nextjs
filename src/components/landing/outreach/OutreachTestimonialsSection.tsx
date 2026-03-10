import React from 'react';
import Image from 'next/image';
import { outreachTestimonials } from '@/data/outreachData';

export const OutreachTestimonialsSection: React.FC = () => {
  return (
    <section id="outreach-testimonials" className="landing-section outreach-testimonials-section">
      <div className="landing-container">
        <div className="section-header-center animate-on-scroll">
          <span className="section-label">Stories of Hope</span>
          <h2 className="outreach-testimonials-title">Lives Changed by Outreach</h2>
          <p className="outreach-testimonials-subtitle">
            Hear from the communities we have served and the lives that have been transformed
          </p>
        </div>

        <div className="gateway-testimonials-grid animate-on-scroll">
          {outreachTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="gateway-testimonial-card">
              <div className="gateway-testimonial-quote-mark">
                <i className="pi pi-quote-right"></i>
              </div>
              <blockquote className="gateway-testimonial-text">
                {testimonial.quote}
              </blockquote>
              <div className="gateway-testimonial-attribution">
                <div
                  className="gateway-testimonial-avatar"
                  style={{
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    unoptimized
                  />
                </div>
                <div className="gateway-testimonial-info">
                  <span className="gateway-testimonial-name">{testimonial.name}</span>
                  <span className="gateway-testimonial-role">{testimonial.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OutreachTestimonialsSection;
