"use client";

import Link from "next/link";
import { CalendarDays, CheckCircle2, Clock3, MapPin, Shield, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTeam } from "@/components/team-provider";
import { getSupabase } from "@/lib/supabase";
import { formatDate, shortTime } from "@/lib/format";
import type { TeamEvent } from "@/lib/types";

type AttendanceSummary = { available: number; unavailable: number; pending: number };

export default function DashboardPage() {
  const { activeTeam } = useTeam();
  const [events, setEvents] = useState<TeamEvent[]>([]);
  const [playerCount, setPlayerCount] = useState(0);
  const [attendance, setAttendance] = useState<AttendanceSummary>({ available: 0, unavailable: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const supabase = getSupabase(); if (!supabase) return;
      const [eventResult, playersResult] = await Promise.all([
        supabase.from("events").select("*").eq("team_id", activeTeam.id).neq("status", "cancelled").gte("event_date", today).order("event_date").order("start_time").limit(6),
        supabase.from("players").select("id", { count: "exact", head: true }).eq("team_id", activeTeam.id).eq("active", true),
      ]);
      if (cancelled) return;
      const nextEvents = (eventResult.data ?? []) as TeamEvent[];
      setEvents(nextEvents); setPlayerCount(playersResult.count ?? 0);
      if (nextEvents[0]) {
        const { data } = await supabase.from("attendance").select("status").eq("event_id", nextEvents[0].id);
        if (!cancelled) {
          const rows = data ?? [];
          setAttendance({
            available: rows.filter((r) => r.status === "available").length,
            unavailable: rows.filter((r) => ["unavailable","excused","injured"].includes(r.status)).length,
            pending: Math.max((playersResult.count ?? 0) - rows.filter((r) => r.status !== "pending").length, 0),
          });
        }
      } else setAttendance({ available: 0, unavailable: 0, pending: playersResult.count ?? 0 });
      setLoading(false);
    }
    load(); return () => { cancelled = true; };
  }, [activeTeam.id, today]);

  const next = events[0];
  const trainingCount = events.filter((event) => event.type === "training").length;

  return <>
    <header className="page-head"><div><p className="eyebrow">{activeTeam.season}</p><h1>{activeTeam.name}</h1><p className="muted">Alles Wichtige für die nächste Einheit und den nächsten Spieltag.</p></div><Link className="button button-primary" href="/events/new">Termin planen</Link></header>
    <section className="grid-kpis">
      <article className="kpi"><span className="kpi-icon"><UsersRound size={20}/></span><div><strong>{playerCount}</strong><span>aktive Spieler</span></div></article>
      <article className="kpi"><span className="kpi-icon"><CalendarDays size={20}/></span><div><strong>{events.length}</strong><span>kommende Termine</span></div></article>
      <article className="kpi"><span className="kpi-icon"><CheckCircle2 size={20}/></span><div><strong>{attendance.available}</strong><span>Zusagen nächster Termin</span></div></article>
      <article className="kpi"><span className="kpi-icon"><Shield size={20}/></span><div><strong>{trainingCount}</strong><span>Trainings voraus</span></div></article>
    </section>
    <div className="dashboard-grid">
      <section className="card"><div className="card-head"><div><p className="eyebrow">Planung</p><h2>Nächste Termine</h2></div><Link href="/calendar">Kalender öffnen</Link></div>
        {loading ? <p className="muted">Termine werden geladen …</p> : events.length === 0 ? <div className="empty">Noch keine kommenden Termine angelegt.</div> : <div className="event-list">{events.slice(0,5).map((event) => <Link className="event-row" href={`/events/${event.id}`} key={event.id}><span className={`date-box ${event.type === "match" ? "match" : ""}`}><strong>{event.event_date.slice(8,10)}</strong><span>{formatDate(event.event_date).split(" ").slice(-1)[0].toUpperCase()}</span></span><span className="event-main"><strong>{event.title}</strong><p><span><Clock3 size={12}/> {shortTime(event.start_time)}</span>{event.location && <span><MapPin size={12}/> {event.location}</span>}</p></span><span className={`badge ${event.type === "match" ? "badge-red" : "badge-green"}`}>{event.type === "match" ? "Spiel" : "Training"}</span></Link>)}</div>}
      </section>
      <aside className="card next-match"><p className="eyebrow">Nächster Fokus</p><h2>{next?.title ?? "Noch kein Termin geplant"}</h2>{next && <div className="match-meta"><span><CalendarDays size={15}/> {formatDate(next.event_date)}</span><span><Clock3 size={15}/> {shortTime(next.meeting_time)} Treffpunkt · {shortTime(next.start_time)} Beginn</span>{next.location && <span><MapPin size={15}/> {next.location}</span>}</div>}<div className="availability-line"><div><strong>{attendance.available}</strong><span>ZUGESAGT</span></div><div><strong>{attendance.unavailable}</strong><span>ABGESAGT</span></div><div><strong>{attendance.pending}</strong><span>OFFEN</span></div></div></aside>
    </div>
  </>;
}
