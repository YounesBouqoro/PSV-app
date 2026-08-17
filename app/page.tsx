import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Clock3,
  MapPin,
  ShieldCheck,
  Shirt,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { BrandLogo } from "@/components/brand-logo";
import { demoEvents, demoStats, activeTeam } from "@/lib/demo-data";

export default function Home() {
  const nextMatch = demoEvents.find((event) => event.type === "match");
  const upcoming = demoEvents.slice(1, 4);

  return (
    <AppShell>
      <section className="welcome-row">
        <div>
          <p className="eyebrow">Montag, 17. August</p>
          <h1>Hallo Younes.</h1>
          <p className="muted">Alles Wichtige für {activeTeam.shortName} auf einen Blick.</p>
        </div>
        <Link className="team-switch" href="/admin#teams" aria-label="Mannschaft wechseln">
          <span className="team-badge">II</span>
          <span>
            <small>Aktives Team</small>
            <strong>{activeTeam.name}</strong>
          </span>
          <ChevronRight size={18} />
        </Link>
      </section>

      {nextMatch && (
        <section className="match-hero" aria-labelledby="next-match-title">
          <div className="match-hero__glow" />
          <div className="match-label">
            <span>Nächstes Spiel</span>
            <span className="pill pill--light">Kreisliga A</span>
          </div>
          <div className="match-body">
            <div className="club-lockup">
              <span className="club-crest club-crest--psv"><BrandLogo /></span>
              <span>{activeTeam.shortName}</span>
            </div>
            <div className="match-center">
              <span className="match-date">SO · 23. AUG</span>
              <h2 id="next-match-title">15:00</h2>
              <span className="match-venue">Heimspiel</span>
            </div>
            <div className="club-lockup club-lockup--away">
              <span className="club-crest club-crest--away">RW</span>
              <span>Ratingen West II</span>
            </div>
          </div>
          <div className="match-footer">
            <span><Clock3 size={16} /> Treffpunkt {nextMatch.meetingTime} Uhr</span>
            <span><MapPin size={16} /> {nextMatch.location}</span>
            <Link href={`/events/${nextMatch.id}`}>Spielinfo <ArrowRight size={16} /></Link>
          </div>
        </section>
      )}

      <section className="stats-grid" aria-label="Saisonübersicht">
        <article className="stat-card">
          <span className="stat-icon stat-icon--blue"><CalendarDays size={20} /></span>
          <div><strong>{demoStats.events}</strong><span>Termine im August</span></div>
        </article>
        <article className="stat-card">
          <span className="stat-icon stat-icon--green"><ShieldCheck size={20} /></span>
          <div><strong>{demoStats.attendance}%</strong><span>Trainingsquote</span></div>
        </article>
        <article className="stat-card">
          <span className="stat-icon stat-icon--red"><Shirt size={20} /></span>
          <div><strong>{demoStats.squad}</strong><span>Spieler im Kader</span></div>
        </article>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Teamkalender</p>
            <h2>Kommende Termine</h2>
          </div>
          <Link href="/admin">Alle anzeigen</Link>
        </div>
        <div className="event-list">
          {upcoming.map((event) => (
            <Link className="event-row" href={`/events/${event.id}`} key={event.id}>
              <div className={`date-tile date-tile--${event.type}`}>
                <small>{event.weekday}</small>
                <strong>{event.day}</strong>
                <span>AUG</span>
              </div>
              <div className="event-copy">
                <div className="event-title-line">
                  <h3>{event.title}</h3>
                  <span className={`pill pill--${event.type}`}>{event.type === "match" ? "Spiel" : "Training"}</span>
                </div>
                <p><Clock3 size={15} /> {event.meetingTime} Treffpunkt · {event.startTime}–{event.endTime} Uhr</p>
                <p><MapPin size={15} /> {event.location}</p>
              </div>
              <ChevronRight className="event-arrow" size={20} />
            </Link>
          ))}
        </div>
      </section>

      <section className="action-banner">
        <div className="action-banner__icon"><Users size={24} /></div>
        <div>
          <p className="eyebrow">Für Trainer</p>
          <h2>Kader, Termine und Anwesenheiten zentral steuern.</h2>
        </div>
        <Link className="button button--primary" href="/admin">Trainerbereich öffnen</Link>
      </section>
    </AppShell>
  );
}
