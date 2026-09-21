'use client';

import React from 'react';

interface NotificationAuditFeedProps {
  isDarkMode?: boolean;
}

export const NotificationAuditFeed: React.FC<NotificationAuditFeedProps> = ({ isDarkMode = false }) => {
  const cardBg = isDarkMode ? '#18181b' : '#ffffff';
  const borderColor = isDarkMode ? '#27272a' : '#e2e8f0';
  const textColor = isDarkMode ? '#f4f4f5' : '#0f172a';
  const subtextColor = isDarkMode ? '#a1a1aa' : '#64748b';

  const mockAuditItems = [
    {
      id: '1',
      type: 'slack',
      title: 'Slack Webhook Alert Delivered',
      detail: 'Block Kit Card dispatched to #sec-alerts ($CRWD Item 1.05)',
      time: '14m ago',
      status: 'success',
      channel: '#sec-alerts'
    },
    {
      id: '2',
      type: 'email',
      title: 'Resend HTML Email Delivered',
      detail: 'HTML Alert sent to alerts@watchposthq.com ($MSFT Item 5.02)',
      time: '42m ago',
      status: 'success',
      channel: 'alerts@watchposthq.com'
    },
    {
      id: '3',
      type: 'ingestion',
      title: 'SEC EDGAR Engine Scan Completed',
      detail: 'Scanned 100 recent filings. Extracted 22 high-value regulatory signals.',
      time: '1h ago',
      status: 'active',
      channel: 'www.sec.gov'
    },
    {
      id: '4',
      type: 'slack',
      title: 'Slack Webhook Alert Delivered',
      detail: 'Block Kit Card dispatched to #sec-alerts ($OKTA Item 1.05)',
      time: '2h ago',
      status: 'success',
      channel: '#sec-alerts'
    },
    {
      id: '5',
      type: 'email',
      title: 'Resend HTML Email Delivered',
      detail: 'HTML Alert sent to alerts@watchposthq.com ($PANW Item 5.02)',
      time: '5h ago',
      status: 'success',
      channel: 'alerts@watchposthq.com'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Engine Status Card */}
      <div style={{
        backgroundColor: cardBg,
        border: `1px solid ${borderColor}`,
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: '#22c55e',
            display: 'inline-block',
            boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)'
          }}></span>
          <div>
            <div style={{ fontWeight: '700', fontSize: '13px', color: textColor }}>SEC Ingestion Radar Engine</div>
            <div style={{ fontSize: '11px', color: subtextColor }}>Polling SEC EDGAR RSS 24/7</div>
          </div>
        </div>
        <span style={{
          fontSize: '11px',
          fontWeight: '700',
          backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.15)' : '#dcfce7',
          color: '#16a34a',
          padding: '4px 8px',
          borderRadius: '6px'
        }}>
          ACTIVE
        </span>
      </div>

      {/* Notifications Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '700', color: textColor, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Real-Time Delivery Audit
        </h3>
        <span style={{ fontSize: '12px', color: subtextColor }}>Live Webhook Stream</span>
      </div>

      {/* Audit Log Feed Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {mockAuditItems.map((item) => (
          <div key={item.id} style={{
            backgroundColor: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: '10px',
            padding: '14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            {/* Icon Indicator */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: item.type === 'slack' ? '#4a154b' : item.type === 'email' ? '#2563eb' : '#059669',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              flexShrink: 0
            }}>
              {item.type === 'slack' ? '💬' : item.type === 'email' ? '📧' : '⚡'}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: '600', fontSize: '13px', color: textColor }}>{item.title}</span>
                <span style={{ fontSize: '11px', color: subtextColor }}>{item.time}</span>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: subtextColor, lineHeight: '1.4' }}>
                {item.detail}
              </p>
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: isDarkMode ? '#27272a' : '#f1f5f9',
                  color: subtextColor,
                  fontFamily: 'monospace'
                }}>
                  {item.channel}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
