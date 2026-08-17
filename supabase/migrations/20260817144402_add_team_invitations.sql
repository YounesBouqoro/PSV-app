create table if not exists private.team_invitations (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  email text not null,
  role public.team_role not null default 'viewer',
  invited_at timestamptz not null default now(),
  accepted_at timestamptz,
  unique (team_id, email),
  check (email = lower(email))
);

revoke all on table private.team_invitations from public, anon, authenticated;
grant all on table private.team_invitations to service_role;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), new.email)
  on conflict (id) do nothing;

  insert into public.team_memberships (team_id, user_id, role)
  select invitation.team_id, new.id, invitation.role
  from private.team_invitations as invitation
  where invitation.email = lower(new.email)
  on conflict (team_id, user_id)
  do update set role = excluded.role;

  update private.team_invitations
  set accepted_at = now()
  where email = lower(new.email);

  return new;
end;
$$;

revoke execute on function private.handle_new_user() from public, anon, authenticated;
grant execute on function private.handle_new_user() to service_role;

insert into private.team_invitations (team_id, email, role)
values (
  '00000000-0000-0000-0000-000000000001',
  'younesbouqoro@gmail.com',
  'owner'
)
on conflict (team_id, email)
do update set role = excluded.role;
