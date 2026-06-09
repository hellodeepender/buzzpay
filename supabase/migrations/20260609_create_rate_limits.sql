create table if not exists public.rate_limits (
  "key" text primary key,
  count integer not null default 0,
  reset_at timestamptz not null default now()
);

alter table public.rate_limits enable row level security;

create or replace function public.check_rate_limit(
  p_key text,
  p_max integer,
  p_window_seconds integer
)
returns table(limited boolean, current_count integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := clock_timestamp();
begin
  insert into public.rate_limits ("key", count, reset_at)
  values (p_key, 1, v_now + make_interval(secs => p_window_seconds))
  on conflict ("key") do update
    set count = case
      when public.rate_limits.reset_at <= v_now then 1
      else public.rate_limits.count + 1
    end,
    reset_at = case
      when public.rate_limits.reset_at <= v_now then v_now + make_interval(secs => p_window_seconds)
      else public.rate_limits.reset_at
    end
  returning count into current_count;

  limited := current_count > p_max;
  return next;
end;
$$;

revoke all on function public.check_rate_limit(text, integer, integer) from public;
revoke all on function public.check_rate_limit(text, integer, integer) from anon;
revoke all on function public.check_rate_limit(text, integer, integer) from authenticated;
grant execute on function public.check_rate_limit(text, integer, integer) to service_role;

comment on table public.rate_limits is
  'Durable server-side rate limit counters for API routes.';

comment on function public.check_rate_limit(text, integer, integer) is
  'Server-side API use only. Do not expose to anon or authenticated clients.';
