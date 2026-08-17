alter function private.set_updated_at() set search_path = pg_catalog;

create index if not exists attendance_recorded_by_idx
  on public.attendance(recorded_by)
  where recorded_by is not null;
