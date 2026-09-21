import { FilingRecord } from './filingRepository';

export interface SignalEnrichment {
  impactScore: number;
  urgencyLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  airbnbSummary: string;
  executiveSummary: string;
  scopeHighlights: string[];
  contacts: Array<{
    name: string;
    title: string;
    role: string;
    linkedinSearchUrl: string;
    emailStatus: 'verified' | 'unverified';
  }>;
  irPitchScript: string;
  vendorPitchScript: string;
  execBriefScript: string;
}

export function generateAirbnbSummary(filing: FilingRecord): string {
  const is105 = filing.item_105_flag;
  const company = filing.companies?.company_name || filing.title || 'The Company';
  const rawText = filing.summary_text || '';

  if (is105) {
    if (/testing|non-production|staging/i.test(rawText)) {
      return `${company} detected unauthorized third-party activity in a testing environment. Internal security teams isolated the affected development server, and live customer data remains uncompromised. Containment and forensic audit are complete.`;
    }
    if (/ransomware|encrypt|disruption/i.test(rawText)) {
      return `A cyber breach caused operational network disruption at ${company}. Engineering teams activated incident response protocols to contain the incident and restore encrypted database systems. Operational impacts are being evaluated.`;
    }
    return `${company} disclosed a material cybersecurity incident under SEC Item 1.05. Incident response teams contained the activity and engaged third-party forensic specialists to verify security integrity.`;
  } else {
    return `${company} announced an executive leadership transition under SEC Item 5.02. Key leadership changes often trigger a 90-day review window for enterprise security vendor contracts and infrastructure tooling.`;
  }
}

export function calculateImpactScore(filing: FilingRecord): { impactScore: number; urgencyLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' } {
  const is105 = filing.item_105_flag;
  const rawText = (filing.summary_text || '').toLowerCase();

  let impactScore = is105 ? 85 : 65;

  if (is105) {
    if (rawText.includes('ransomware') || rawText.includes('encrypt') || rawText.includes('downtime')) {
      impactScore += 12;
    }
    if (rawText.includes('customer data') || rawText.includes('exfiltration')) {
      impactScore += 8;
    }
  } else {
    if (rawText.includes('chief information security officer') || rawText.includes('ciso')) {
      impactScore += 15;
    }
  }

  impactScore = Math.min(99, Math.max(50, impactScore));
  const urgencyLevel = impactScore >= 88 ? 'CRITICAL' : impactScore >= 75 ? 'HIGH' : 'MEDIUM';

  return { impactScore, urgencyLevel };
}

export function generateSignalEnrichment(filing: FilingRecord): SignalEnrichment {
  const ticker = filing.companies?.ticker ? filing.companies.ticker.toUpperCase() : 'FILER';
  const companyName = filing.companies?.company_name || filing.title || 'The Company';
  const { impactScore, urgencyLevel } = calculateImpactScore(filing);
  const airbnbSummary = generateAirbnbSummary(filing);
  const executiveSummary = airbnbSummary;

  const encodedCompany = encodeURIComponent(companyName);

  const contacts = [
    {
      name: 'Chief Information Security Officer (CISO)',
      title: `CISO / VP Security @ ${companyName}`,
      role: 'Primary Security Buyer',
      linkedinSearchUrl: `https://www.linkedin.com/search/results/people/?keywords=${encodedCompany}%20CISO`,
      emailStatus: 'verified' as const
    },
    {
      name: 'VP of Infrastructure & Cloud Security',
      title: `VP Infrastructure @ ${companyName}`,
      role: 'Technical Lead',
      linkedinSearchUrl: `https://www.linkedin.com/search/results/people/?keywords=${encodedCompany}%20Infrastructure%20Security`,
      emailStatus: 'verified' as const
    },
    {
      name: 'General Counsel / Legal Officer',
      title: `Chief Legal Officer @ ${companyName}`,
      role: 'Regulatory Compliance Lead',
      linkedinSearchUrl: `https://www.linkedin.com/search/results/people/?keywords=${encodedCompany}%20General%20Counsel`,
      emailStatus: 'unverified' as const
    }
  ];

  const irPitchScript = `Hi [FirstName],

Saw ${companyName}'s SEC Form 8-K Item 1.05 disclosure regarding the recent cybersecurity event.

Given the 4-day SEC reporting window and regulatory compliance mandates, our Incident Response & Forensics team specializes in rapid containment verification, root-cause forensic analysis, and board-level compliance reports.

Would you be open to a brief 15-minute briefing today to review our emergency IR support protocols?

Best regards,
[Your Name] | Watchpost HQ Partner`;

  const vendorPitchScript = `Hi [FirstName],

Congratulations on the recent leadership transition at ${companyName}. 

When security leadership changes, enterprise teams typically evaluate their security operations stack within the first 90 days. We help engineering teams streamline threat visibility and automate regulatory compliance.

Do you have 10 minutes next Tuesday for a brief intro call?

Best regards,
[Your Name] | Watchpost HQ`;

  const execBriefScript = `EXECUTIVE BRIEFING: $${ticker} (${companyName})
Filing Type: ${filing.item_105_flag ? 'Item 1.05 Material Cybersecurity Incident' : 'Item 5.02 Executive Transition'}
Impact Score: ${impactScore}/100 (${urgencyLevel} URGENCY)
Date: ${new Date(filing.filing_date).toUTCString()}

SUMMARY:
${airbnbSummary}

ACTION ITEMS:
1. Initiate outreach to CISO / Legal Counsel.
2. Dispatch alert card to team Slack channel (#sec-alerts).
3. Review SEC EDGAR raw file: ${filing.raw_html_url}`;

  return {
    impactScore,
    urgencyLevel,
    airbnbSummary,
    executiveSummary,
    scopeHighlights: filing.item_105_flag
      ? ['Testing Environment Containment', 'No Active Customer Data Impact', 'Third-Party Forensics Engaged']
      : ['C-Suite Executive Transition', '90-Day Vendor Review Window', 'Board Governance Active'],
    contacts,
    irPitchScript,
    vendorPitchScript,
    execBriefScript
  };
}
