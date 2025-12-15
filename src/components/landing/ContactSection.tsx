'use client';

import React, { useState } from 'react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="contact-section animate-on-scroll">
      <div className="contact-bg-pattern"></div>
      <div className="landing-container">
        <div className="contact-card">
          <div className="contact-card-inner">
            {/* Left - Info */}
            <div className="contact-info-panel">
              <span className="contact-eyebrow">Get in Touch</span>
              <h2>Let&apos;s Start a Conversation</h2>
              <p>We&apos;re here to help and answer any questions you might have.</p>

              <div className="contact-details">
                <a href="mailto:hello@gatewaychurch.ph" className="contact-detail-item">
                  <i className="pi pi-envelope"></i>
                  <span>hello@gatewaychurch.ph</span>
                </a>
                <a href="tel:+639171234567" className="contact-detail-item">
                  <i className="pi pi-phone"></i>
                  <span>+63 917 123 4567</span>
                </a>
                <div className="contact-detail-item">
                  <i className="pi pi-map-marker"></i>
                  <span>Lex Hotel, Ortigas Center</span>
                </div>
              </div>

              <div className="contact-social-row">
                <a href="#" aria-label="Facebook"><i className="pi pi-facebook"></i></a>
                <a href="#" aria-label="Instagram"><i className="pi pi-instagram"></i></a>
                <a href="#" aria-label="YouTube"><i className="pi pi-youtube"></i></a>
              </div>
            </div>

            {/* Right - Form */}
            <div className="contact-form-panel">
              {submitted ? (
                <div className="contact-success-state">
                  <div className="success-checkmark">
                    <i className="pi pi-check"></i>
                  </div>
                  <h3>Message Sent!</h3>
                  <p>We&apos;ll get back to you soon.</p>
                  <button onClick={() => setSubmitted(false)} className="success-reset">
                    Send another <i className="pi pi-arrow-right"></i>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form-minimal">
                  <div className="input-group">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder=" "
                    />
                    <label>Name</label>
                  </div>

                  <div className="input-group">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder=" "
                    />
                    <label>Email</label>
                  </div>

                  <div className="input-group">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={3}
                      placeholder=" "
                    ></textarea>
                    <label>Message</label>
                  </div>

                  <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <i className="pi pi-spin pi-spinner"></i>
                    ) : (
                      <>
                        Send Message
                        <i className="pi pi-send"></i>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
