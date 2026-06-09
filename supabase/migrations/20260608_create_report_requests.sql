create extension if not exists pgcrypto;

create table if not exists public.report_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  first_name text null,
  calculator_slug text null,
  calculator_name text null,
  page_path text null,
  result_snapshot jsonb null,
  source text not null default 'buzzpay',
  created_at timestamp with time zone not null default now()
);

create index if not exists report_requests_email_idx
  on public.report_requests (email);

create index if not exists report_requests_created_at_idx
  on public.report_requests (created_at desc);

alter table public.report_requests enable row level security;

alter table public.report_requests
  add column if not exists email_sent_at timestamp with time zone null;

alter table public.report_requests
  add column if not exists email_delivery_status text null;

alter table public.report_requests
  add column if not exists email_error text null;

alter table public.report_requests
  add column if not exists resend_email_id text null;

comment on table public.report_requests is
  'Calculator report requests. Server-side service-role writes only until explicit policies are added.';
