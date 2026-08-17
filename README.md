# PSV Team-App

Web-App für Termine, Kader, Anwesenheiten und rollenbasierte Mannschaftsverwaltung beim PSV Düsseldorf.

## Aktueller MVP

- responsive Spieleransicht mit kommenden Trainings und Spielen
- Spielansicht mit Treffpunkt, Anstoß, Ort, Trainerhinweisen und Kader
- Trainerbereich mit Terminübersicht, Spielerstatus und Teamkontext
- Formular für Spiele und Trainings inklusive Kaderauswahl
- wiederkehrender Trainingsplan für Montag, Mittwoch und Freitag
- Supabase Magic-Link-Login
- Datenmodell für mehrere Mannschaften und Rollen pro Team
- Row-Level-Security für Trainer-, Spieler- und Betrachterrechte
- Demo-Modus ohne Datenbankverbindung

## Lokaler Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

In `.env.local` eintragen:

```env
NEXT_PUBLIC_SUPABASE_URL=https://DEIN-PROJEKT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_DEIN-KEY
```

## Supabase einrichten

1. Die Datei `supabase/migrations/202608170001_initial_schema.sql` im Supabase SQL Editor ausführen.
2. In Supabase Authentication einen ersten Trainer-Benutzer anlegen oder per Magic Link registrieren.
3. Den Benutzer einmalig als Besitzer der 2. Mannschaft zuordnen:

```sql
insert into public.team_memberships (team_id, user_id, role)
select
  '00000000-0000-0000-0000-000000000001',
  id,
  'owner'::public.team_role
from auth.users
where email = 'DEINE-TRAINER-EMAIL';
```

Die Migration legt bereits die Mannschaften `2. Mannschaft` und `C3` an. Weitere Benutzer erhalten ihre Rechte ausschließlich über `team_memberships`.

## Datenschutz

Die Excel-Bestandsliste wird nicht in das öffentliche Repository übernommen. Personenbezogene Daten werden erst nach aktivierter Supabase-Anmeldung und über einen kontrollierten Import eingespielt.
