import Link from "next/link";
import { CalendarPlus, ChevronRight, Clock3, Database, MapPin, ShieldCheck, UsersRound } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { activeTeam, demoEvents, demoPlayers } from "@/lib/demo-data";

export default function AdminPage() {
  return (
    <AppShell admin>
      <section className="admin-heading">
        <div><p className="eyebrow">Trainerbereich</p><h1>Mannschaft verwalten</h1><p className="muted">Events, Kader und Berechtigungen für {activeTeam.name}.</p></div>
        <Link className="button button--primary" href="/admin/events/new"><CalendarPlus size={18} /> Neues Event</Link>
      </section>

      <section className="admin-kpis">
        <article><span><CalendarPlus size={20} /></span><div><strong>{demoEvents.length}</strong><small>Kommende Events</small></div></article>
        <article><span><UsersRound size={20} /></span><div><strong>{demoPlayers.length}</strong><small>Aktive Spieler</small></div></article>
        <article><span><ShieldCheck size={20} /></span><div><strong>3</strong><small>Trainerzugänge</small></div></article>
      </section>

      <div className="admin-grid">
        <section className="panel">
          <div className="panel-heading"><div><p className="eyebrow">Planung</p><h2>Nächste Termine</h2></div><Link href="/admin/events/new">Termin anlegen</Link></div>
          <div className="admin-event-list">
            {demoEvents.map((event) => (
              <Link href={`/events/${event.id}`} key={event.id}>
                <span className={`mini-date mini-date--${event.type}`}><strong>{event.day}</strong><small>AUG</small></span>
                <div><strong>{event.title}</strong><small><Clock3 size={13} /> {event.meetingTime} Uhr · <MapPin size={13} /> {event.location}</small></div>
                <ChevronRight size={18} />
              </Link>
            ))}
          </div>
        </section>

        <aside className="panel recurring-card">
          <span className="panel-icon"><CalendarPlus size={22} /></span>
          <p className="eyebrow">Serientermin</p>
          <h2>Regeltraining</h2>
          <p>Montag, Mittwoch und Freitag</p>
          <dl><div><dt>Treffpunkt</dt><dd>19:45</dd></div><div><dt>Training</dt><dd>20:00–21:30</dd></div></dl>
          <Link className="button button--dark" href="/admin/events/new?type=training">Serie bearbeiten</Link>
        </aside>
      </div>

      <section className="panel" id="squad">
        <div className="panel-heading"><div><p className="eyebrow">Kaderverwaltung</p><h2>Spielerstatus</h2></div><span className="count-badge">{demoPlayers.length} Spieler</span></div>
        <div className="player-table" role="table" aria-label="Spielerliste">
          <div className="player-table__head" role="row"><span>Spieler</span><span>Position</span><span>Status</span></div>
          {demoPlayers.slice(0, 8).map((player) => <div className="player-table__row" role="row" key={player.id}><span><b>{player.number}</b>{player.name}</span><span>{player.position}</span><span className={`status status--${player.status}`}>{player.status === "available" ? "Verfügbar" : player.status === "injured" ? "Verletzt" : "Abwesend"}</span></div>)}
        </div>
      </section>

      <section className="setup-banner" id="teams">
        <Database size={24} />
        <div><strong>Supabase vorbereitet</strong><p>Nach Hinterlegung der Projektvariablen werden Benutzer, Mannschaften und Events aus der Datenbank geladen.</p></div>
        <span>Schema bereit</span>
      </section>
    </AppShell>
  );
}
