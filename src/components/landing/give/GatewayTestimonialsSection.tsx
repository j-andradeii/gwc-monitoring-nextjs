import React from 'react';
import { gatewayTestimonials } from '@/data/giveData';

export const GatewayTestimonialsSection: React.FC = () => {
  return (
    <section id="gateway-testimonials" className="landing-section gateway-testimonials-section">
      <div className="landing-container">
        <div className="section-header-center animate-on-scroll">
          <span className="section-label">Voices of Vision</span>
          <h2 className="gateway-testimonials-title">Words from Our Leaders</h2>
          <p className="gateway-testimonials-subtitle">
            Hear from the people who are leading this project forward
          </p>
        </div>

        <div className="gateway-testimonials-grid animate-on-scroll">
          {gatewayTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="gateway-testimonial-card">
              <div className="gateway-testimonial-quote-mark">
                <i className="pi pi-quote-right"></i>
              </div>
              <blockquote className="gateway-testimonial-text">
                {testimonial.quote}
              </blockquote>
              <div className="gateway-testimonial-attribution">
                <div className="gateway-testimonial-avatar">
                  <i className={testimonial.icon}></i>
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

export default GatewayTestimonialsSection;
