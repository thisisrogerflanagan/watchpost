'use client';

import React, { useEffect } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { AuthProvider } from '../lib/useAuth';

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY || 'phc_sDJoKYKHzTktgNK2kjQnoVs2CqKVHLkEjd8aNamnXMom';
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

    if (typeof window !== 'undefined' && posthogKey) {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        person_profiles: 'identified_only',
        capture_pageview: true,
        capture_pageleave: true
      });
    }
  }, []);

  return (
    <PHProvider client={posthog}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </PHProvider>
  );
}

export { PostHogProvider } from 'posthog-js/react';
