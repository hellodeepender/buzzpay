alter table public.report_requests
  add column if not exists consent_given boolean not null default false;

alter table public.report_requests
  add column if not exists consent_text text null;

alter table public.report_requests
  add column if not exists consented_at timestamp with time zone null;

comment on column public.report_requests.consent_given is
  'Whether the visitor explicitly agreed to receive the emailed report and occasional BuzzPay contractor finance emails.';

comment on column public.report_requests.consent_text is
  'Consent language shown at submission time.';

comment on column public.report_requests.consented_at is
  'Timestamp when consent was recorded on the server.';
