import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3, MapPin, MessageSquareText, Shield, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { activeTeam, demoEvents, demoPlayers } from "@/lib/demo-data";

export function generateStaticParams() {
  return demoEvents.map(({ id }) => ({ id }));
}

export default async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = demoEvents.find((item) => item.id === id) ?? demoEvents[0];
  const squad = demoPlayers.filter((player) => event.squad?.includes(player.id));

  return (
    <AppShell>
      <Link className="back-link" href="/"><ArrowLeft size={17} /> Zurück zur Übersicht</Link>
      <section className="detail-hero">
        <div>
          <span className={`pill pill--${event.type}`}>{event.type === "match" ? "Meisterschaftsspiel" : "Training"}</span>
          <p className="eyebrow">{event.weekday}, {event.day}. August 2026</p>
          <h1>{event.title}</h1>
          <p>{event.type === "match" ? `${activeTeam.shortName} · ${event.homeAway === "home" ? "Heimspiel" : "Auswärtsspiel"}` : activeTeam.name}</p>
        </div>
        <span className="detail-hero__icon">{event.type === "match" ? <Shield size={34} /> : <CalendarDays size={34} />}</span>
      </section>

      <section className="info-grid">
        <article><Clock3 size={20} /><span><small>Treffpunkt</small><strong>{event.meetingTime} Uhr</strong></span></article>
        <article><CalendarDays size={20} /><span><small>{event.type === "match" ? "Anstoß" : "Beginn"}</small><strong>{event.startTime} Uhr</strong></span></article>
        <article><MapPin size={20} /><span><small>Ort</small><strong>{event.location}</strong></span></article>
      </section>

      {event.note && <section className="note-card"><MessageSquareText size={21} /><div><h2>Anmerkung der Trainer</h2><p>{event.note}</p></div></section>}

      {event.type === "match" ? (
        <section className="section-block">
          <div className="section-heading">
            <div><p className="eyebrow">Aufgebot</p><h2>Kader für das Spiel</h2></div>
            <span className="count-badge"><Users size={16} /> {squad.length} Spieler</span>
          </div>
          <div className="squad-grid">
            {squad.map((player) => <article className="player-card" key={player.id}><span>{player.number}</span><div><strong>{player.name}</strong><small>{player.position}</small></div></article>)}
          </div>
        </section>
      ) : (
        <section className="response-card">
          <div><p className="eyebrow">Deine Rückmeldung</p><h2>Bist du beim Training dabei?</h2></div>
          <div className="response-actions"><button className="button button--success">Ich bin dabei</button><button className="button button--ghost">Absagen</button></div>
        </section>
      )}
    </AppShell>
  );
}
