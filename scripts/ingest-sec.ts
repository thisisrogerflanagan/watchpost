import { ingestLatestFilings, SECFeedIngestionEngine } from '../lib/secFeedIngestionEngine';

export { SECFeedIngestionEngine };

async function main() {
  console.log('[Watchpost HQ] Starting SEC EDGAR 8-K signal ingestion...');
  try {
    const result = await ingestLatestFilings();
    console.log(`[Watchpost HQ] Scanned SEC feed. Found ${result.signals.length} high-value signals (Item 1.05 / 5.02).`);
    console.log(`[Watchpost HQ] Saved ${result.savedCount} signals to Supabase database.`);
  } catch (err: any) {
    console.error('[Watchpost HQ Ingestion Error]:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
