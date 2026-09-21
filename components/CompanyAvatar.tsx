'use client';

import React, { useState } from 'react';

interface CompanyAvatarProps {
  ticker?: string;
  companyName: string;
  size?: number;
  is105?: boolean;
}

const TICKER_DOMAIN_MAP: Record<string, string> = {
  LII: 'lennox.com',
  CRWD: 'crowdstrike.com',
  KR: 'kroger.com',
  AAPL: 'apple.com',
  MSFT: 'microsoft.com',
  GOOGL: 'google.com',
  GOOG: 'google.com',
  AMZN: 'amazon.com',
  TSLA: 'tesla.com',
  NVDA: 'nvidia.com',
  META: 'meta.com',
  NFLX: 'netflix.com',
  S: 'sentinelone.com',
  PANW: 'paloaltonetworks.com',
  FTNT: 'fortinet.com',
  OKTA: 'okta.com',
  NET: 'cloudflare.com',
  SNOW: 'snowflake.com',
  DDOG: 'datadoghq.com',
  ZS: 'zscaler.com',
  UBER: 'uber.com',
  ABNB: 'airbnb.com',
  COIN: 'coinbase.com',
  PLTR: 'palantir.com',
  DIS: 'disney.com',
  WMT: 'walmart.com',
  TGT: 'target.com',
  COST: 'costco.com',
  HD: 'homedepot.com',
  LOW: 'lowes.com',
  ORCL: 'oracle.com',
  IBM: 'ibm.com',
  CSCO: 'cisco.com',
  CRM: 'salesforce.com',
  NOW: 'servicenow.com',
  ADBE: 'adobe.com',
  INTC: 'intel.com',
  AMD: 'amd.com',
  QCOM: 'qualcomm.com',
};

export function resolveCompanyDomain(ticker?: string, companyName?: string): string | null {
  if (ticker && TICKER_DOMAIN_MAP[ticker.toUpperCase()]) {
    return TICKER_DOMAIN_MAP[ticker.toUpperCase()];
  }

  if (companyName) {
    const cleanName = companyName
      .toLowerCase()
      .replace(/\b(inc|corp|corporation|ltd|co|llc|holdings|group|plc|class a|class b)\b/g, '')
      .replace(/[^a-z0-9]/g, '')
      .trim();

    if (cleanName.length > 2) {
      return `${cleanName}.com`;
    }
  }

  return null;
}

export const CompanyAvatar: React.FC<CompanyAvatarProps> = ({
  ticker,
  companyName,
  size = 38,
  is105 = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const domain = resolveCompanyDomain(ticker, companyName);
  const logoUrl = domain ? `https://logo.clearbit.com/${domain}` : null;

  const displayTicker = ticker ? ticker.toUpperCase() : '';
  const avatarInitial = (displayTicker || companyName || '?').charAt(0).toUpperCase();
  const avatarBg = is105 ? '#dc2626' : '#2563eb';

  if (logoUrl && !imageError) {
    return (
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          border: '1px solid rgba(0,0,0,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        }}
      >
        <img
          src={logoUrl}
          alt={`${companyName} logo`}
          onError={() => setImageError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: '2px',
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: avatarBg,
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '800',
        fontSize: `${Math.max(12, Math.round(size * 0.4))}px`,
        flexShrink: 0,
      }}
    >
      {avatarInitial}
    </div>
  );
};
