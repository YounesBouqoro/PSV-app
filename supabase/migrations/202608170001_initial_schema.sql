create extension if not exists pgcrypto;

create type public.team_role as enum ('owner', 'admin', 'trainer', 'player', 'viewer');
create type public.event_type as enum ('training', 'match', 'other');
create type public.event_status as enum ('draft', 'published', 'cancelled');
create type public.availability_status as enum ('pending', 'available', 'unavailable', 'injured', 'excused');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  short_name text not null,
  season text not null default '2026/27',
  age_group text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.team_memberships (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.team_role not null default 'viewer',
  created_at timestamptz not null default now(),
  unique (team_id, user_id)
);

create table public.players (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  first_name text not null,
  last_name text not null,
  shirt_number integer check (shirt_number between 1 and 99),
  primary_position text,
  secondary_position text,
  clothing_size text,
  date_of_birth date,
  active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  type public.event_type not null,
  status public.event_status not null default 'draft',
  title text not null,
  event_date date not null,
  meeting_time time,
  start_time time not null,
  end_time time,
  location text,
  opponent text,
  home_away text check (home_away is null or home_away in ('home', 'away')),
  competition text,
  notes text,
  recurrence_rule text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.event_squads (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  squad_status text not null default 'nominated' check (squad_status in ('nominated', 'starting', 'bench', 'cancelled')),
  position text,
  minutes_played integer check (minutes_played is null or minutes_played between 0 and 180),
  created_at timestamptz not null default now(),
  unique (event_id, player_id)
);

create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  status public.availability_status not null default 'pending',
  reason text,
  responded_at timestamptz,
  recorded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, player_id)
);

create index team_memberships_user_idx on public.team_memberships(user_id, team_id);
create index players_team_idx on public.players(team_id, active);
create index events_team_date_idx on public.events(team_id, event_date, start_time);
create index squads_event_idx on public.event_squads(event_id);
create index attendance_event_idx on public.attendance(event_id, status);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
create trigger teams_set_updated_at before update on public.teams for each row execute procedure public.set_updated_at();
create trigger players_set_updated_at before update on public.players for each row execute procedure public.set_updated_at();
create trigger events_set_updated_at before update on public.events for each row execute procedure public.set_updated_at();
create trigger attendance_set_updated_at before update on public.attendance for each row execute procedure public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_team_member(target_team_id uuid)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.team_memberships
    where team_id = target_team_id and user_id = auth.uid()
  );
$$;

create or replace function public.can_manage_team(target_team_id uuid)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.team_memberships
    where team_id = target_team_id
      and user_id = auth.uid()
      and role in ('owner', 'admin', 'trainer')
  );
$$;

create or replace function public.shares_team_with(target_user_id uuid)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1
    from public.team_memberships mine
    join public.team_memberships theirs on theirs.team_id = mine.team_id
    where mine.user_id = auth.uid() and theirs.user_id = target_user_id
  );
$$;

alter table public.profiles enable row level security;
alter table public.teams enable row level security;
alter table public.team_memberships enable row level security;
alter table public.players enable row level security;
alter table public.events enable row level security;
alter table public.event_squads enable row level security;
alter table public.attendance enable row level security;

create policy profiles_select on public.profiles for select to authenticated
using (id = auth.uid() or public.shares_team_with(id));
create policy profiles_update_self on public.profiles for update to authenticated
using (id = auth.uid()) with check (id = auth.uid());

create policy teams_select_members on public.teams for select to authenticated
using (public.is_team_member(id));
create policy teams_update_managers on public.teams for update to authenticated
using (public.can_manage_team(id)) with check (public.can_manage_team(id));

create policy memberships_select on public.team_memberships for select to authenticated
using (user_id = auth.uid() or public.can_manage_team(team_id));
create policy memberships_insert on public.team_memberships for insert to authenticated
with check (public.can_manage_team(team_id));
create policy memberships_update on public.team_memberships for update to authenticated
using (public.can_manage_team(team_id)) with check (public.can_manage_team(team_id));
create policy memberships_delete on public.team_memberships for delete to authenticated
using (public.can_manage_team(team_id));

create policy players_select on public.players for select to authenticated
using (public.is_team_member(team_id));
create policy players_insert on public.players for insert to authenticated
with check (public.can_manage_team(team_id));
create policy players_update on public.players for update to authenticated
using (public.can_manage_team(team_id)) with check (public.can_manage_team(team_id));
create policy players_delete on public.players for delete to authenticated
using (public.can_manage_team(team_id));

create policy events_select on public.events for select to authenticated
using (public.is_team_member(team_id) and (status = 'published' or public.can_manage_team(team_id)));
create policy events_insert on public.events for insert to authenticated
with check (public.can_manage_team(team_id));
create policy events_update on public.events for update to authenticated
using (public.can_manage_team(team_id)) with check (public.can_manage_team(team_id));
create policy events_delete on public.events for delete to authenticated
using (public.can_manage_team(team_id));

create policy squads_select on public.event_squads for select to authenticated
using (exists (select 1 from public.events e where e.id = event_id and public.is_team_member(e.team_id)));
create policy squads_insert on public.event_squads for insert to authenticated
with check (exists (select 1 from public.events e where e.id = event_id and public.can_manage_team(e.team_id)));
create policy squads_update on public.event_squads for update to authenticated
using (exists (select 1 from public.events e where e.id = event_id and public.can_manage_team(e.team_id)));
create policy squads_delete on public.event_squads for delete to authenticated
using (exists (select 1 from public.events e where e.id = event_id and public.can_manage_team(e.team_id)));

create policy attendance_select on public.attendance for select to authenticated
using (exists (
  select 1 from public.players p join public.events e on e.id = event_id and e.team_id = p.team_id
  where p.id = player_id and (p.user_id = auth.uid() or public.can_manage_team(p.team_id))
));
create policy attendance_insert on public.attendance for insert to authenticated
with check (exists (
  select 1 from public.players p join public.events e on e.id = event_id and e.team_id = p.team_id
  where p.id = player_id and (p.user_id = auth.uid() or public.can_manage_team(p.team_id))
));
create policy attendance_update on public.attendance for update to authenticated
using (exists (
  select 1 from public.players p join public.events e on e.id = event_id and e.team_id = p.team_id
  where p.id = player_id and (p.user_id = auth.uid() or public.can_manage_team(p.team_id))
)) with check (exists (
  select 1 from public.players p join public.events e on e.id = event_id and e.team_id = p.team_id
  where p.id = player_id and (p.user_id = auth.uid() or public.can_manage_team(p.team_id))
));
create policy attendance_delete on public.attendance for delete to authenticated
using (exists (
  select 1 from public.players p join public.events e on e.id = event_id and e.team_id = p.team_id
  where p.id = player_id and public.can_manage_team(p.team_id)
));

insert into public.teams (id, name, short_name, season, age_group)
values
  ('00000000-0000-0000-0000-000000000001', '2. Mannschaft', 'PSV Düsseldorf II', '2026/27', 'Herren'),
  ('00000000-0000-0000-0000-000000000002', 'C3', 'PSV Düsseldorf C3', '2026/27', 'C-Junioren')
on conflict (id) do nothing;
