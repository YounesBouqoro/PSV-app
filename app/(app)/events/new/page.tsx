"use client";

import { CalendarPlus, Check, Shield, UsersRound } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTeam } from "@/components/team-provider";
import { getSupabase } from "@/lib/supabase";
import type { EventType, Player } from "@/lib/types";

export default function NewEventPage() {
  const router = useRouter();
  const { activeTeam } = useTeam();
  const [type,setType]=useState<EventType>("training");
  const [players,setPlayers]=useState<Player[]>([]);
  const [selected,setSelected]=useState<string[]>([]);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState<string|null>(null);

  useEffect(()=>{(async()=>{const supabase=getSupabase();if(!supabase)return;const {data}=await supabase.from("players").select("*").eq("team_id",activeTeam.id).eq("active",true).order("last_name");setPlayers((data??[]) as Player[]);})();},[activeTeam.id]);

  function togglePlayer(id:string){setSelected(current=>current.includes(id)?current.filter(item=>item!==id):[...current,id]);}

  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault(); setBusy(true); setError(null); const supabase=getSupabase(); if(!supabase)return;
    const form=new FormData(event.currentTarget);
    const {data:created,error:createError}=await supabase.from("events").insert({
      team_id:activeTeam.id,type,status:"published",title:form.get("title"),event_date:form.get("event_date"),meeting_time:form.get("meeting_time")||null,start_time:form.get("start_time"),end_time:form.get("end_time")||null,location:form.get("location")||null,opponent:type==="match"?form.get("opponent")||null:null,home_away:type==="match"?form.get("home_away")||null:null,competition:type==="match"?form.get("competition")||null:null,notes:form.get("notes")||null,
    }).select("id").single();
    if(createError||!created){setError(createError?.message||"Termin konnte nicht angelegt werden.");setBusy(false);return;}
    if(type==="match"&&selected.length>0){const rows=selected.map(player_id=>({event_id:created.id,player_id,status:"selected"}));const {error:nominationError}=await supabase.from("nominations").insert(rows);if(nominationError)setError(nominationError.message);}
    if(players.length>0){ await supabase.from("attendance").insert(players.map(player=>({event_id:created.id,player_id:player.id,status:"pending"}))); }
    router.push(`/events/${created.id}`); router.refresh();
  }

  return <><header className="page-head"><div><p className="eyebrow">Planung</p><h1>Neuer Termin</h1><p className="muted">Training oder Spiel anlegen und bei Spielen direkt den Kader nominieren.</p></div></header>
    <form className="stack" onSubmit={submit}>
      <section className="card"><div className="card-head"><div><p className="eyebrow">1 · Typ</p><h2>Was planst du?</h2></div></div><div className="split"><button type="button" className={`button ${type==="training"?"button-secondary":"button-ghost"}`} onClick={()=>setType("training")}><CalendarPlus size={17}/> Training</button><button type="button" className={`button ${type==="match"?"button-secondary":"button-ghost"}`} onClick={()=>setType("match")}><Shield size={17}/> Spiel</button></div></section>
      <section className="card"><div className="card-head"><div><p className="eyebrow">2 · Eckdaten</p><h2>Termin & Ort</h2></div></div><div className="form-grid">
        <label className="field wide"><span>Titel</span><input className="input" name="title" required placeholder={type==="match"?`${activeTeam.short_name} – Gegner`:"Mannschaftstraining"}/></label>
        {type==="match"&&<><label className="field"><span>Gegner</span><input className="input" name="opponent" required/></label><label className="field"><span>Heim/Auswärts</span><select className="select" name="home_away" defaultValue="home"><option value="home">Heimspiel</option><option value="away">Auswärtsspiel</option></select></label><label className="field wide"><span>Wettbewerb</span><input className="input" name="competition" placeholder="z. B. Meisterschaft"/></label></>}
        <label className="field"><span>Datum</span><input className="input" type="date" name="event_date" required/></label><label className="field"><span>Treffpunkt</span><input className="input" type="time" name="meeting_time"/></label><label className="field"><span>{type==="match"?"Anstoß":"Beginn"}</span><input className="input" type="time" name="start_time" required/></label><label className="field"><span>Ende</span><input className="input" type="time" name="end_time"/></label><label className="field wide"><span>Ort</span><input className="input" name="location"/></label><label className="field wide"><span>Hinweis an die Mannschaft</span><textarea className="textarea" name="notes" placeholder="Ausrüstung, Trainingsschwerpunkt, Treffpunktdetails …"/></label>
      </div></section>
      {type==="match"&&<section className="card"><div className="card-head"><div><p className="eyebrow">3 · Kader</p><h2>{selected.length} Spieler nominiert</h2></div><UsersRound size={20}/></div><div className="nomination-list">{players.map(player=>{const active=selected.includes(player.id);return <button className="nomination-player" type="button" key={player.id} onClick={()=>togglePlayer(player.id)}><span><strong>{player.first_name} {player.last_name}</strong><span>{player.primary_position??"Ohne Position"}</span></span><span className={`badge ${active?"badge-green":"badge-gray"}`}>{active?<><Check size={12}/> Nominiert</>:"Auswählen"}</span></button>})}</div></section>}
      {error&&<div className="notice notice-error">{error}</div>}<button className="button button-primary" disabled={busy}>{busy?"Wird gespeichert …":"Termin veröffentlichen"}</button>
    </form>
  </>;
}
