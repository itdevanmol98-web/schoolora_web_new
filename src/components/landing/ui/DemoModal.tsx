import React, { useState } from 'react';
import { Modal } from './Modal';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', school: '', role: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid #E2E8F0',
    fontSize: '14px',
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13.5px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '6px',
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { onClose(); setSubmitted(false); }} title="Book a Free Demo">
      {submitted ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
            <CheckCircle2 size={32} color="#10B981" />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Demo Requested!</h3>
          <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.6 }}>
            Thank you! Our team will contact you within 24 hours to schedule your personalised Axionexa ERP walkthrough.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle} htmlFor="demo-name">Full Name *</label>
            <input id="demo-name" name="name" required value={form.name} onChange={handleChange} placeholder="Your full name" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle} htmlFor="demo-email">Email Address *</label>
            <input id="demo-email" type="email" name="email" required value={form.email} onChange={handleChange} placeholder="school@example.com" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle} htmlFor="demo-phone">Phone Number *</label>
            <input id="demo-phone" type="tel" name="phone" required value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle} htmlFor="demo-school">School / Institution Name *</label>
            <input id="demo-school" name="school" required value={form.school} onChange={handleChange} placeholder="ABC Public School, Delhi" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle} htmlFor="demo-role">Your Role *</label>
            <select id="demo-role" name="role" required value={form.role} onChange={handleChange} style={inputStyle}>
              <option value="">Select your role</option>
              <option value="principal">Principal / Head of School</option>
              <option value="admin">Administrator</option>
              <option value="accountant">Accountant / Finance Head</option>
              <option value="trustee">School Trustee / Owner</option>
              <option value="it">IT Manager</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button
            type="submit"
            style={{
              padding: '13px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #FF6B00, #FF8533)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '15.5px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(255,107,0,0.35)',
              marginTop: '4px',
            }}
          >
            Book My Free Demo <ArrowRight size={17} />
          </button>
          <p style={{ textAlign: 'center', fontSize: '12.5px', color: '#94A3B8' }}>No credit card required. Get a guided walkthrough within 24 hours.</p>
        </form>
      )}
    </Modal>
  );
};
