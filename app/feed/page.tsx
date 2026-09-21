'use client';

import React, { useEffect, useState } from 'react';
import { getLatestFilings, FilingRecord } from '../../lib/filingRepository';
import { IvoryLayout } from '../../components/IvoryLayout';

export default function SignalFeedDashboard() {
  const [filings, setFilings] = useState<FilingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLiveFilings() {
      try {
        setLoading(true);
        const data = await getLatestFilings(50);
        setFilings(data);
      } catch (err) {
        console.error('Failed to fetch live filings from Supabase:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLiveFilings();
  }, []);

  return <IvoryLayout filings={filings} loading={loading} />;
}
