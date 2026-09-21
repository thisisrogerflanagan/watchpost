'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '../lib/useAuth';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signup' | 'login';
}

const PRESET_TICKERS = [
  { symbol: 'CRWD', name: 'CrowdStrike Holdings' },
  { symbol: 'PANW', name: 'Palo Alto Networks' },
  { symbol: 'OKTA', name: 'Okta, Inc.' },
  { symbol: 'ZS', name: 'Zscaler, Inc.' },
  { symbol: 'NET', name: 'Cloudflare, Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'LII', name: 'Lennox International' },
  { symbol: 'KR', name: 'Kroger Co.' },
];

export const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose, initialMode = 'signup' }) => {
  const router = useRouter();
  const { login } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [userRole, setUserRole] = useState<UserRole>('ir_partner');
  const [workspaceName, setWorkspaceName] = useState('');
  const [selectedTickers, setSelectedTickers] = useState<string[]>(['CRWD', 'PANW', 'OKTA', 'ZS', 'NET']);
  const [errorMessage, setErrorMessage] = useState('');

  const digitInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  if (!isOpen) return null;

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid work email address.');
      return;
    }
    setErrorMessage('');
    
    // Auto-generate default workspace name from domain
    const domain = email.split('@')[1] || '';
    const companyName = domain ? domain.split('.')[0] : 'My Workspace';
    const capitalized = companyName.charAt(0).toUpperCase() + companyName.slice(1);
    setWorkspaceName(`${capitalized} Breach Radar`);

    // Advance to Step 2 OTP
    setStep(2);
  };

  const handleOtpDigitChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const nextOtp = [...otpDigits];
    nextOtp[index] = val.slice(-1);
    setOtpDigits(nextOtp);
    setErrorMessage('');

    if (val && index < 5) {
      digitInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const digits = pasted.split('');
    const newOtp = ['', '', '', '', '', ''];
    digits.forEach((d, i) => {
      newOtp[i] = d;
    });
    setOtpDigits(newOtp);
    if (digits.length === 6) {
      setStep(3);
    }
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join('');
    if (code.length < 6) {
      setErrorMessage('Please enter the full 6-digit passcode (Try demo code: 123456)');
      return;
    }
    setErrorMessage('');
    setStep(3);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceName.trim()) {
      setErrorMessage('Please enter a workspace name.');
      return;
    }
    setErrorMessage('');
    setStep(4);
  };

  const toggleTicker = (symbol: string) => {
    if (selectedTickers.includes(symbol)) {
      if (selectedTickers.length === 1) return; // Keep at least one
      setSelectedTickers(selectedTickers.filter(t => t !== symbol));
    } else {
      setSelectedTickers([...selectedTickers, symbol]);
    }
  };

  const handleFinalComplete = () => {
    login({
      userEmail: email.trim(),
      workspaceName: workspaceName.trim(),
      userRole,
      watchlist: selectedTickers,
    });
    onClose();
    router.push('/feed');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.55)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '20px',
        padding: '36px',
        maxWidth: '480px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#64748b',
            fontSize: '20px',
            cursor: 'pointer',
            fontWeight: '700'
          }}
        >
          ✕
        </button>

        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                style={{
                  height: '6px',
                  width: '24px',
                  borderRadius: '3px',
                  backgroundColor: step >= s ? '#2563eb' : '#e2e8f0',
                  transition: 'background-color 0.2s'
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', letterSpacing: '0.05em' }}>
            STEP {step} OF 4
          </span>
        </div>

        {/* STEP 1: Email Entry */}
        {step === 1 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '900', letterSpacing: '0.05em' }}>
                SEC RADAR
              </span>
              <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', margin: 0, letterSpacing: '-0.03em' }}>
                {initialMode === 'login' ? 'Log in to Watchpost' : 'Get Started with Watchpost'}
              </h2>
            </div>
            <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 24px', lineHeight: '1.5' }}>
              Enter your work email for sub-second SEC EDGAR breach disclosures &amp; CISO leadership alerts.
            </p>

            <form onSubmit={handleStep1Submit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#475569', uppercase: true, letterSpacing: '0.05em', marginBottom: '8px' }}>
                  WORK EMAIL
                </label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#f8fafc',
                    color: '#0f172a',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {errorMessage && (
                <div style={{ fontSize: '13px', color: '#dc2626', marginBottom: '16px', fontWeight: '600' }}>
                  ⚠️ {errorMessage}
                </div>
              )}

              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  padding: '12px 0',
                  borderRadius: '8px',
                  fontWeight: '800',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  marginBottom: '16px'
                }}
              >
                Continue with email →
              </button>
            </form>

            <div style={{ textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
              By continuing, you agree to Watchpost HQ Terms of Service and Privacy Policy.
            </div>
          </div>
        )}

        {/* STEP 2: 6-Digit Passcode Verification */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', margin: '0 0 8px', letterSpacing: '-0.03em' }}>
              Check your inbox
            </h2>
            <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 20px', lineHeight: '1.5' }}>
              We sent a 6-digit passcode to <strong style={{ color: '#0f172a' }}>{email}</strong>.
            </p>

            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: '#166534', fontWeight: '700', marginBottom: '20px' }}>
              💡 Instant Demo Passcode: <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>123456</span>
            </div>

            <form onSubmit={handleStep2Submit}>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { digitInputRefs.current[idx] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onPaste={handleOtpPaste}
                    style={{
                      width: '48px',
                      height: '56px',
                      textAlign: 'center',
                      fontSize: '22px',
                      fontWeight: '800',
                      borderRadius: '8px',
                      border: '2px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      outline: 'none'
                    }}
                  />
                ))}
              </div>

              {errorMessage && (
                <div style={{ fontSize: '13px', color: '#dc2626', marginBottom: '16px', textAlign: 'center', fontWeight: '600' }}>
                  ⚠️ {errorMessage}
                </div>
              )}

              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  padding: '12px 0',
                  borderRadius: '8px',
                  fontWeight: '800',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  marginBottom: '12px'
                }}
              >
                Verify Code &amp; Continue →
              </button>
            </form>

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => setStep(1)}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
              >
                ← Change email address
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Persona Role & Workspace Setup */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', margin: '0 0 8px', letterSpacing: '-0.03em' }}>
              Customize Your Workspace
            </h2>
            <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 20px', lineHeight: '1.5' }}>
              Select your role to tailor SEC Item 1.05 and Item 5.02 intelligence feeds.
            </p>

            <form onSubmit={handleStep3Submit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#475569', letterSpacing: '0.05em', marginBottom: '6px' }}>
                  WORKSPACE NAME
                </label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="e.g. Mandiant Incident Response Radar"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#f8fafc',
                    color: '#0f172a',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#475569', letterSpacing: '0.05em', marginBottom: '10px' }}>
                  PRIMARY PROFESSIONAL ROLE
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    { id: 'ir_partner', label: '🛡️ IR Partner', desc: 'Breach response firm' },
                    { id: 'ciso_secops', label: '🔐 CISO / SecOps', desc: 'In-house defender' },
                    { id: 'sales_director', label: '📈 Security Sales', desc: 'B2B BD & deals' },
                    { id: 'equity_analyst', label: '🔍 Equity Analyst', desc: 'Market & risk research' },
                  ].map((roleItem) => {
                    const isSelected = userRole === roleItem.id;
                    return (
                      <div
                        key={roleItem.id}
                        onClick={() => setUserRole(roleItem.id as UserRole)}
                        style={{
                          padding: '12px',
                          borderRadius: '10px',
                          border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                          backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>{roleItem.label}</div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{roleItem.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {errorMessage && (
                <div style={{ fontSize: '13px', color: '#dc2626', marginBottom: '16px', fontWeight: '600' }}>
                  ⚠️ {errorMessage}
                </div>
              )}

              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  padding: '12px 0',
                  borderRadius: '8px',
                  fontWeight: '800',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Continue to Watchlist →
              </button>
            </form>
          </div>
        )}

        {/* STEP 4: Initial Watchlist Ticker Selection */}
        {step === 4 && (
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', margin: '0 0 8px', letterSpacing: '-0.03em' }}>
              Select Initial Watchlist Tickers
            </h2>
            <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 20px', lineHeight: '1.5' }}>
              Pick high-volatility public companies to monitor in real-time.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
              {PRESET_TICKERS.map((item) => {
                const isChecked = selectedTickers.includes(item.symbol);
                return (
                  <div
                    key={item.symbol}
                    onClick={() => toggleTicker(item.symbol)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: isChecked ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      backgroundColor: isChecked ? '#eff6ff' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div>
                      <span style={{ fontFamily: 'monospace', fontWeight: '800', fontSize: '13px', color: '#2563eb' }}>
                        ${item.symbol}
                      </span>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '1px' }}>{item.name}</div>
                    </div>
                    <span style={{ fontSize: '16px' }}>{isChecked ? '✅' : '⚪'}</span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleFinalComplete}
              style={{
                width: '100%',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: '14px 0',
                borderRadius: '8px',
                fontWeight: '900',
                fontSize: '15px',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '-0.02em'
              }}
            >
              Complete Setup &amp; Open Watchpost →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
