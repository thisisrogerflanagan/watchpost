import React from 'react';
import { Metadata } from 'next';
import { AppProviders } from './providers';

export const metadata: Metadata = {
  title: 'Watchpost HQ — Real-Time SEC 8-K Regulatory & Breach Intelligence',
  description: 'Watchpost HQ monitors SEC EDGAR filings 24/7 for Item 1.05 Material Cybersecurity Incidents and Item 5.02 C-Suite Transitions, delivering instant Slack and Email alerts.',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#ffffff', color: '#0f172a' }}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
