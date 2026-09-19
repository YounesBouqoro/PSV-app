"use client";

import Link from "next/link";
import { CalendarPlus, Clock3, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useTeam } from "@/components/team-provider";
import { getSupabase } from "@/lib/supabase";
import { formatDate, shortTime } from "@/lib/format";
import type { TeamEvent } from "@/lib/types";

export default function CalendarPage() {
  const { activeTeam } = useTeam();
  const [events,setEvents]=useState<TeamEvent[]>([]); const [filter,setFilter]=useState("all");
  useEffect(()=>{(async()=>{const supabase=getSupabase();if(!supabase)return;let q=supabase.from("events").select("*").eq("team_id",activeTeam.id).order("event_date",{ascending:true}).order("start_time",{ascending:true});if(filter!=="all")q=q.eq("type",filter);const {data}=await q;setEvents((data??[]) as TeamEvent[]);})();},[activeTeam.id,filter]);
  return <><header className="page-head"><div><p className="eyebrow">Teamkalender</p><h1>Termine</h1><p className="muted">Training, Spiele und Mannschaftstermine zentral planen.</p></div><Link className="button button-primary" href="/events/new"><CalendarPlus size={17}/> Neuer Termin</Link></header><div className="toolbar"><button className={`button ${filter==="all"?"button-secondary":"button-ghost"}`} onClick={()=>setFilter("all")}>Alle</button><button className={`button ${filter==="training"?"button-secondary":"button-ghost"}`} onClick={()=>setFilter("training")}>Training</button><button className={`button ${filter==="match"?"button-secondary":"button-ghost"}`} onClick={()=>setFilter("match")}>Spiele</button></div><section className="calendar-list section-gap">{events.length===0?<div className="empty">Noch keine Termine vorhanden.</div>:events.map(event=><Link className="calendar-item" href={`/events/${event.id}`} key={event.id}><span className={`date-box ${event.type==="match"?"match":""}`}><strong>{event.event_date.slice(8,10)}</strong><span>{formatDate(event.event_date).split(" ").slice(-1)[0].toUpperCase()}</span></span><span className="event-main"><strong>{event.title}</strong><p><span><Clock3 size={12}/> {shortTime(event.meeting_time)} Treff · {shortTime(event.start_time)} Beginn</span>{event.location&&<span><MapPin size={12}/> {event.location}</span>}</p></span><span className={`badge ${event.status==="cancelled"?"badge-gray":event.type==="match"?"badge-red":"badge-green"}`}>{event.status==="cancelled"?"Abgesagt":event.type==="match"?"Spiel":"Training"}</span></Link>)}</section></>;
}
