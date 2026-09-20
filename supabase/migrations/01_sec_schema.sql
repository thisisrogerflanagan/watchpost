-- Watchpost HQ Supabase PostgreSQL Idempotent DDL Schema
-- Safe to copy-paste and run in Supabase SQL Editor multiple times

-- 1. Enable Required PostgreSQL Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- 2. Create Custom ENUM Types safely
do $$ begin
    if not exists (select 1 from pg_type where typname = 'alert_channel') then
        create type alert_channel as enum ('email', 'slack', 'webhook');
    end if;
    if not exists (select 1 from pg_type where typname = 'alert_status') then
        create type alert_status as enum ('pending', 'delivered', 'failed');
    end if;
    if not exists (select 1 from pg_type where typname = 'user_tier') then
        create type user_tier as enum ('free', 'pro', 'enterprise');
    end if;
end $$;

-- 3. Companies Table
create table if not exists public.companies (
    cik varchar(10) primary key,
    ticker varchar(12) unique,
    company_name text not null,
    sic varchar(6),
    sic_description text,
    exchange varchar(20),
    is_active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 4. Filings Table (8-K Regulatory Signal Hub)
create table if not exists public.filings (
    id uuid primary key default gen_random_uuid(),
    accession_number varchar(25) unique not null,
    cik varchar(10) not null references public.companies(cik) on delete cascade,
    form_type varchar(10) not null default '8-K',
    filing_date timestamptz not null,
    acceptance_datetime timestamptz,
    item_105_flag boolean default false,
    item_502_flag boolean default false,
    items_detected text[] default '{}',
    title text not null,
    summary_text text,
    raw_html_url text not null,
    parsed_content jsonb default '{}'::jsonb,
    created_at timestamptz default now()
);

-- 5. Subscribers Table
create table if not exists public.subscribers (
    id uuid primary key default gen_random_uuid(),
    user_id uuid unique,
    email text unique not null,
    slack_webhook_url text,
    custom_webhook_url text,
    item_105_alerts boolean default true,
    item_502_alerts boolean default true,
    watchlist_tickers text[] default '{}',
    tier user_tier default 'free',
    is_active boolean default true,
    created_at timestamptz default now()
);

-- 6. Alerts Audit Log Table
create table if not exists public.alerts (
    id uuid primary key default gen_random_uuid(),
    filing_id uuid not null references public.filings(id) on delete cascade,
    subscriber_id uuid not null references public.subscribers(id) on delete cascade,
    channel alert_channel not null,
    status alert_status default 'pending',
    error_log text,
    sent_at timestamptz,
    created_at timestamptz default now()
);

-- 7. Performance & pSEO Indexes
create index if not exists idx_companies_ticker on public.companies(ticker);
create index if not exists idx_filings_cik on public.filings(cik);
create index if not exists idx_filings_date_105 on public.filings(filing_date desc, item_105_flag) where item_105_flag = true;
create index if not exists idx_filings_date_502 on public.filings(filing_date desc, item_502_flag) where item_502_flag = true;
create index if not exists idx_filings_accession on public.filings(accession_number);
create index if not exists idx_companies_trgm_name on public.companies using gin(company_name gin_trgm_ops);

-- 8. Table Permissions & Row Level Security Policies
grant all on public.companies to anon, authenticated, service_role;
grant all on public.filings to anon, authenticated, service_role;
grant all on public.subscribers to anon, authenticated, service_role;
grant all on public.alerts to anon, authenticated, service_role;

alter table public.companies enable row level security;
alter table public.filings enable row level security;

do $$ begin
    if not exists (select 1 from pg_policies where policyname = 'Allow public read access to companies') then
        create policy "Allow public read access to companies" on public.companies for select using (true);
    end if;
    if not exists (select 1 from pg_policies where policyname = 'Allow public read access to filings') then
        create policy "Allow public read access to filings" on public.filings for select using (true);
    end if;
    if not exists (select 1 from pg_policies where policyname = 'Allow public insert access to companies') then
        create policy "Allow public insert access to companies" on public.companies for insert with check (true);
    end if;
    if not exists (select 1 from pg_policies where policyname = 'Allow public insert access to filings') then
        create policy "Allow public insert access to filings" on public.filings for insert with check (true);
    end if;
end $$;
