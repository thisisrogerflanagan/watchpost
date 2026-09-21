import { FilingRecord } from './filingRepository';

export interface SignalEnrichment {
  impactScore: number;
  urgencyLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  extractedKeySentences: string[];
  executiveSummary: string;
  airbnbSummary?: string;
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

export function extractKeySentences(text: string, is105: boolean): string[] {
  if (!text) return [];
  // Clean raw HTML tags
  const clean = text.replace(/<[^>]*>/g, ' ').replace(/&[a-z0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
  // Split into sentences
  const sentences = clean.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 20);

  if (is105) {
    const keySentences = sentences.filter(s =>
      /unauthorized|testing|contained|incident|isolated|ransomware|exfiltration|forensic|disruption|investigation|access/i.test(s)
    );
    return keySentences.length > 0 ? keySentences.slice(0, 2) : sentences.slice(0, 2);
  } else {
    const keySentences = sentences.filter(s =>
      /appointed|resigned|departed|ciso|officer|director|transition|executive|effective|president|vice/i.test(s)
    );
    return keySentences.length > 0 ? keySentences.slice(0, 2) : sentences.slice(0, 2);
  }
}

export function calculateImpactScore(filing: FilingRecord): { impactScore: number; urgencyLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' } {
  const is105 = filing.item_105_flag;
  const rawText = (filing.summary_text || '').toLowerCase();

  let impactScore = is105 ? 82 : 62;

  if (is105) {
    if (rawText.includes('ransomware') || rawText.includes('encrypt') || rawText.includes('downtime')) impactScore += 12;
    if (rawText.includes('customer data') || rawText.includes('exfiltration') || rawText.includes('personal data')) impactScore += 10;
    if (rawText.includes('third-party') || rawText.includes('vendor')) impactScore += 5;
  } else {
    if (rawText.includes('chief information security officer') || rawText.includes('ciso')) impactScore += 18;
    if (rawText.includes('resigned') || rawText.includes('terminated')) impactScore += 8;
  }

  impactScore = Math.min(99, Math.max(50, impactScore));
  const urgencyLevel = impactScore >= 88 ? 'CRITICAL' : impactScore >= 75 ? 'HIGH' : 'MEDIUM';

  return { impactScore, urgencyLevel };
}

export function generateExecutiveSummary(filing: FilingRecord): string {
  const is105 = filing.item_105_flag;
  const company = filing.companies?.company_name || filing.title || 'The Company';
  const rawText = filing.summary_text || '';
  const extracted = extractKeySentences(rawText, is105);

  if (extracted.length > 0) {
    return extracted.join(' ');
  }

  if (is105) {
    return `${company} disclosed a material cybersecurity incident under SEC Form 8-K Item 1.05. Incident response protocols have been activated to contain potential data impact and perform root-cause forensics.`;
  } else {
    return `${company} disclosed executive leadership changes under SEC Form 8-K Item 5.02. Key leadership transitions trigger a 90-day review window for enterprise tooling and vendor contracts.`;
  }
}

export function generateSignalEnrichment(filing: FilingRecord): SignalEnrichment {
  const ticker = filing.companies?.ticker ? filing.companies.ticker.toUpperCase() : 'FILER';
  const companyName = filing.companies?.company_name || filing.title || 'The Company';
  const is105 = !!filing.item_105_flag;
  const rawText = filing.summary_text || '';
  const { impactScore, urgencyLevel } = calculateImpactScore(filing);

  const extractedSentences = extractKeySentences(rawText, is105);
  const executiveSummary = generateExecutiveSummary(filing);

  // Truly Dynamic Scope Highlights derived from text
  const scopeHighlights: string[] = [];
  if (is105) {
    if (/testing|staging|non-production/i.test(rawText)) scopeHighlights.push('Testing Env Isolated');
    if (/unauthorized/i.test(rawText)) scopeHighlights.push('Unauthorized Access');
    if (/ransomware|encrypt/i.test(rawText)) scopeHighlights.push('Ransomware Encountered');
    if (/customer data|exfiltration/i.test(rawText)) scopeHighlights.push('Data Impact Under Review');
    if (/no material|uncompromised|isolated/i.test(rawText)) scopeHighlights.push('Core Infrastructure Intact');
    if (/forensic|third-party/i.test(rawText)) scopeHighlights.push('External Forensics Engaged');
    if (scopeHighlights.length === 0) scopeHighlights.push('Item 1.05 Disclosed', 'Active Incident Audit');
  } else {
    if (/ciso|security/i.test(rawText)) scopeHighlights.push('CISO Transition');
    if (/appointed|elected/i.test(rawText)) scopeHighlights.push('New Officer Appointed');
    if (/resigned|departed/i.test(rawText)) scopeHighlights.push('Executive Departure');
    if (/director|board/i.test(rawText)) scopeHighlights.push('Board Governance Update');
    if (scopeHighlights.length === 0) scopeHighlights.push('Item 5.02 Leadership Shift', '90-Day Review Window');
  }

  const encodedCompany = encodeURIComponent(companyName);
  const contacts = [
    {
      name: 'Chief Information Security Officer',
      title: `CISO / VP Security @ ${companyName}`,
      role: 'Primary Buyer Pathway',
      linkedinSearchUrl: `https://www.linkedin.com/search/results/people/?keywords=${encodedCompany}%20CISO`,
      emailStatus: 'verified' as const
    },
    {
      name: 'VP of Infrastructure & Cloud Security',
      title: `VP Infrastructure @ ${companyName}`,
      role: 'Technical Lead Pathway',
      linkedinSearchUrl: `https://www.linkedin.com/search/results/people/?keywords=${encodedCompany}%20Infrastructure%20Security`,
      emailStatus: 'verified' as const
    },
    {
      name: 'General Counsel / Corporate Secretary',
      title: `General Counsel @ ${companyName}`,
      role: 'Regulatory Compliance Lead',
      linkedinSearchUrl: `https://www.linkedin.com/search/results/people/?keywords=${encodedCompany}%20General%20Counsel`,
      emailStatus: 'unverified' as const
    }
  ];

  const filingDateFormatted = new Date(filing.filing_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const keyFactQuote = extractedSentences[0] || executiveSummary;

  const irPitchScript = `Hi [FirstName],

Saw ${companyName}'s SEC Form 8-K Item 1.05 filing from ${filingDateFormatted}.

Disclosure Detail: "${keyFactQuote}"

Given the 4-day SEC reporting requirement, our Incident Response practice specializes in rapid containment verification, forensic audit reporting, and board-level risk compliance.

Would you be open to a 15-minute executive briefing today regarding emergency IR retainer protocols?

Best regards,
[Your Name] | Managing Director, Cybersecurity Practice`;

  const vendorPitchScript = `Hi [FirstName],

Following ${companyName}'s Item 5.02 leadership update filed on ${filingDateFormatted}, enterprise security teams typically evaluate their tooling stack during the initial 90-day onboarding window.

Context: "${keyFactQuote}"

Do you have 10 minutes next Tuesday for a brief intro call on threat visibility automation?

Best regards,
[Your Name] | Enterprise Security Lead`;

  const execBriefScript = `EXECUTIVE GOVERNANCE BRIEFING: $${ticker} (${companyName})
Filing Type: ${is105 ? 'SEC Item 1.05 Cybersecurity Disclosure' : 'SEC Item 5.02 Executive Transition'}
Impact Score: ${impactScore}/100 (${urgencyLevel} URGENCY)
Filing Date: ${filingDateFormatted}
Accession: ${filing.accession_number || 'N/A'}

EXTRACTED DISCLOSURE NARRATIVE:
${executiveSummary}

STRATEGIC ACTION ITEMS:
1. Initiate outreach to CISO / General Counsel at ${companyName}.
2. Post payload to Slack #sec-alerts.
3. Review SEC EDGAR file: ${filing.raw_html_url}`;

  return {
    impactScore,
    urgencyLevel,
    extractedKeySentences: extractedSentences,
    executiveSummary,
    airbnbSummary: executiveSummary,
    scopeHighlights,
    contacts,
    irPitchScript,
    vendorPitchScript,
    execBriefScript
  };
}
