-- CyberSec-8K Supabase PostgreSQL DDL Migration
-- Enables extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- Enums
create type alert_channel as enum ('email', 'slack', 'webhook');
create type alert_status as enum ('pending', 'delivered', 'failed');
create type user_tier as enum ('free', 'pro', 'enterprise');

-- 1. Companies Table
create table public.companies (
    cik varchar(10) primary key, -- 10-digit padded CIK number
    ticker varchar(12) unique,
    company_name text not null,
    sic varchar(6),
    sic_description text,
    exchange varchar(20),
    is_active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 2. Filings Table (8-K Signal Hub)
create table public.filings (
    id uuid primary key default gen_random_uuid(),
    accession_number varchar(25) unique not null,
    cik varchar(10) not null references public.companies(cik) on delete cascade,
    form_type varchar(10) not null default '8-K',
    filing_date timestamptz not null,
    acceptance_datetime timestamptz,
    item_105_flag boolean default false, -- Material Cybersecurity Incident flag
    item_502_flag boolean default false, -- C-Suite Executive Transition flag
    items_detected text[] default '{}',
    title text not null,
    summary_text text,
    raw_html_url text not null,
    parsed_content jsonb default '{}'::jsonb,
    created_at timestamptz default now()
);

-- 3. Subscribers Table
create table public.subscribers (
    id uuid primary key default gen_random_uuid(),
    user_id uuid unique,
    email text unique not null,
    slack_webhook_url text,
    custom_webhook_url text,
    item_105_alerts boolean default true,
    item_502_alerts boolean default true,
    watchlist_tickers text[] default '{}', -- Empty array means ALL tickers
    tier user_tier default 'free',
    is_active boolean default true,
    created_at timestamptz default now()
);

-- 4. Alerts Log Table
create table public.alerts (
    id uuid primary key default gen_random_uuid(),
    filing_id uuid not null references public.filings(id) on delete cascade,
    subscriber_id uuid not null references public.subscribers(id) on delete cascade,
    channel alert_channel not null,
    status alert_status default 'pending',
    error_log text,
    sent_at timestamptz,
    created_at timestamptz default now()
);

-- Indexes for Millisecond Performance & pSEO
create index idx_companies_ticker on public.companies(ticker);
create index idx_filings_cik on public.filings(cik);
create index idx_filings_date_105 on public.filings(filing_date desc, item_105_flag) where item_105_flag = true;
create index idx_filings_date_502 on public.filings(filing_date desc, item_502_flag) where item_502_flag = true;
create index idx_filings_accession on public.filings(accession_number);
create index idx_companies_trgm_name on public.companies using gin(company_name gin_trgm_ops);

-- Row Level Security Policies
alter table public.companies enable row level security;
alter table public.filings enable row level security;

create policy "Allow public read access to companies" on public.companies for select using (true);
create policy "Allow public read access to filings" on public.filings for select using (true);
