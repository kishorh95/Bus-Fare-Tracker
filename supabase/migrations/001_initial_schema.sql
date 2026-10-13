-- BusFare Tracker MVP schema. Apply in Supabase SQL Editor.
-- All user-owned records are protected with row-level security.

create extension if not exists pgcrypto;

create table if not exists public.routes (
  id uuid primary key default gen_random_uuid(),
  origin text not null,
  destination text not null,
  origin_normalized text generated always as (lower(trim(origin))) stored,
  destination_normalized text generated always as (lower(trim(destination))) stored,
  created_at timestamptz not null default now(),
  constraint routes_distinct_cities check (lower(trim(origin)) <> lower(trim(destination))),
  constraint routes_unique_pair unique (origin_normalized, destination_normalized)
);

create table if not exists public.bus_services (
  id uuid primary key default gen_random_uuid(),
  route_id uuid not null references public.routes(id) on delete cascade,
  platform text not null,
  operator_name text not null,
  service_description text not null,
  bus_type text,
  external_service_id text,
  created_at timestamptz not null default now()
);
create index if not exists bus_services_route_idx on public.bus_services(route_id, platform);

create table if not exists public.fare_observations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  bus_service_id uuid references public.bus_services(id) on delete set null,
  origin text not null,
  destination text not null,
  platform text not null,
  operator_name text,
  service_description text not null,
  bus_type text,
  travel_date date not null,
  fare_amount numeric(10,2) not null check (fare_amount > 0),
  currency char(3) not null default 'INR' check (currency = 'INR'),
  observation_method text not null default 'manual' check (observation_method in ('manual', 'approved_api', 'approved_feed')),
  source_reference text,
  observed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists fare_observations_route_date_idx on public.fare_observations(lower(origin), lower(destination), travel_date, observed_at desc);
create index if not exists fare_observations_user_idx on public.fare_observations(user_id, observed_at desc);

create table if not exists public.watchlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  origin text not null,
  destination text not null,
  travel_date date not null,
  platform text not null default 'redBus',
  service_description text,
  target_fare numeric(10,2) check (target_fare is null or target_fare > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists watchlists_user_idx on public.watchlists(user_id, created_at desc);

create table if not exists public.price_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  watchlist_id uuid not null references public.watchlists(id) on delete cascade,
  target_fare numeric(10,2) not null check (target_fare > 0),
  enabled boolean not null default true,
  last_triggered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists price_alerts_user_enabled_idx on public.price_alerts(user_id, enabled);

alter table public.routes enable row level security;
alter table public.bus_services enable row level security;
alter table public.fare_observations enable row level security;
alter table public.watchlists enable row level security;
alter table public.price_alerts enable row level security;

-- Route/service catalog is initially private to authenticated users until a public catalog is intentionally designed.
create policy "authenticated users can read routes" on public.routes for select to authenticated using (true);
create policy "authenticated users can create routes" on public.routes for insert to authenticated with check (true);
create policy "authenticated users can read services" on public.bus_services for select to authenticated using (true);
create policy "authenticated users can create services" on public.bus_services for insert to authenticated with check (true);

create policy "users read own fare observations" on public.fare_observations for select to authenticated using (auth.uid() = user_id);
create policy "users create own fare observations" on public.fare_observations for insert to authenticated with check (auth.uid() = user_id);
create policy "users update own fare observations" on public.fare_observations for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users delete own fare observations" on public.fare_observations for delete to authenticated using (auth.uid() = user_id);

create policy "users read own watchlists" on public.watchlists for select to authenticated using (auth.uid() = user_id);
create policy "users create own watchlists" on public.watchlists for insert to authenticated with check (auth.uid() = user_id);
create policy "users update own watchlists" on public.watchlists for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users delete own watchlists" on public.watchlists for delete to authenticated using (auth.uid() = user_id);

create policy "users read own price alerts" on public.price_alerts for select to authenticated using (auth.uid() = user_id);
create policy "users create own price alerts" on public.price_alerts for insert to authenticated with check (auth.uid() = user_id);
create policy "users update own price alerts" on public.price_alerts for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users delete own price alerts" on public.price_alerts for delete to authenticated using (auth.uid() = user_id);

-- Seed the initial route. The generated normalized columns enforce case-insensitive uniqueness.
insert into public.routes (origin, destination)
values ('Bengaluru', 'Pune')
on conflict (origin_normalized, destination_normalized) do nothing;
