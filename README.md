# PSV Team Manager

Komplett neu aufgebaute Team-Management-App für den PSV Düsseldorf.

## Funktionen

- mehrere Mannschaften verwalten und wechseln
- Spieler und Kader pflegen
- Trainings und Spiele planen
- Zu-/Absagen und Anwesenheiten verwalten
- Spieltagskader nominieren
- WhatsApp-Spielinfo direkt aus einem Termin erzeugen
- Trainingsbeteiligung auswerten
- responsive Nutzung auf Smartphone und Desktop
- PWA-Grundlage für die Installation auf dem Homescreen

## Technik

- Next.js + TypeScript
- Supabase Auth + Postgres + Row Level Security
- GitHub als Codebasis
- vorbereitet für Vercel Deployment

## Lokaler Start

1. `.env.example` nach `.env.local` kopieren.
2. Supabase URL und Publishable Key eintragen.
3. `npm install`
4. `npm run dev`

Das verbundene Supabase-Projekt wurde für den Neustart vollständig neu strukturiert. Der erste bestehende Benutzer ist Owner der Startteams `C3` und `2. Mannschaft`.


## Vercel

Das Repository ist direkt für Vercel vorbereitet. Next.js wird automatisch erkannt; die öffentlichen Supabase-Clientvariablen liegen in `.env.production`. Ein Vercel-Import des GitHub-Repositories reicht daher für den ersten Produktiv-Deploy aus.
