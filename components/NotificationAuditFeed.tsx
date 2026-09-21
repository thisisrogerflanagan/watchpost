'use client';

import React from 'react';

interface NotificationAuditFeedProps {
  isDarkMode?: boolean;
}

export const NotificationAuditFeed: React.FC<NotificationAuditFeedProps> = ({ isDarkMode = false }) => {
  // Notion Design Tokens
  const bgCanvas = isDarkMode ? '#191919' : '#ffffff';
  const bgMuted = isDarkMode ? '#222222' : '#f7f6f3';
  const borderColor = isDarkMode ? '#2f2f2f' : '#e9e8e4';
  const textPrimary = isDarkMode ? '#d4d4d4' : '#37352f';
  const textMuted = isDarkMode ? '#9b9b9b' : '#787774';
  const textLink = isDarkMode ? '#529cca' : '#0b6e99';

  const mockAuditItems = [
    {
      id: '1',
      type: 'slack',
      title: 'Slack Block Kit Alert Delivered',
      detail: 'Block Kit Card dispatched to #sec-alerts ($CRWD Item 1.05)',
      time: '14m ago',
      channel: '#sec-alerts'
    },
    {
      id: '2',
      type: 'email',
      title: 'Resend HTML Email Delivered',
      detail: 'HTML Alert sent to alerts@watchposthq.com ($MSFT Item 5.02)',
      time: '42m ago',
      channel: 'alerts@watchposthq.com'
    },
    {
      id: '3',
      type: 'ingestion',
      title: 'SEC EDGAR Engine Scan Completed',
      detail: 'Scanned 100 recent filings. Extracted 22 regulatory signals.',
      time: '1h ago',
      channel: 'sec.gov/edgar'
    },
    {
      id: '4',
      type: 'slack',
      title: 'Slack Webhook Alert Delivered',
      detail: 'Block Kit Card dispatched to #sec-alerts ($OKTA Item 1.05)',
      time: '2h ago',
      channel: '#sec-alerts'
    }
  ];

  return (
    <div style={{
      backgroundColor: bgCanvas,
      border: `1px solid ${borderColor}`,
      borderRadius: '8px',
      padding: '20px 24px',
      fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, sans-serif'
    }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a', display: 'inline-block' }}></span>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: textPrimary, margin: 0 }}>
            📡 Real-Time Delivery Stream
          </h3>
        </div>
        <span style={{ fontSize: '11px', color: textMuted }}>
          SEC RSS 24/7 Active
        </span>
      </div>

      {/* Audit Log Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {mockAuditItems.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: bgMuted,
              border: `1px solid ${borderColor}`,
              borderRadius: '6px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}
          >
            <div style={{ fontSize: '14px', marginTop: '1px' }}>
              {item.type === 'slack' ? '💬' : item.type === 'email' ? '📧' : '⚡'}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontWeight: 600, fontSize: '12.5px', color: textPrimary }}>{item.title}</span>
                <span style={{ fontSize: '11px', color: textMuted }}>{item.time}</span>
              </div>
              <p style={{ margin: 0, fontSize: '11.5px', color: textMuted, lineHeight: '1.4' }}>
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
