"use client";

import { Plus, Search, UserRound } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useTeam } from "@/components/team-provider";
import { getSupabase } from "@/lib/supabase";
import type { Player } from "@/lib/types";

export default function PlayersPage() {
  const { activeTeam, role } = useTeam();
  const [players, setPlayers] = useState<Player[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const canManage = ["owner","admin","trainer"].includes(role);

  async function load() { const supabase = getSupabase(); if (!supabase) return; const { data } = await supabase.from("players").select("*").eq("team_id", activeTeam.id).order("last_name").order("first_name"); setPlayers((data ?? []) as Player[]); }
  useEffect(() => { load(); }, [activeTeam.id]);

  const filtered = useMemo(() => players.filter((p) => `${p.first_name} ${p.last_name} ${p.primary_position ?? ""}`.toLowerCase().includes(search.toLowerCase())), [players, search]);

  async function createPlayer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const supabase = getSupabase(); if (!supabase) return;
    const form = new FormData(event.currentTarget);
    const { error } = await supabase.from("players").insert({ team_id: activeTeam.id, first_name: form.get("first_name"), last_name: form.get("last_name"), shirt_number: form.get("shirt_number") ? Number(form.get("shirt_number")) : null, primary_position: form.get("primary_position") || null, status: "active", active: true });
    setNotice(error ? error.message : "Spieler wurde hinzugefügt."); if (!error) { event.currentTarget.reset(); setShowForm(false); await load(); }
  }

  async function setStatus(id: string, status: Player["status"]) { const supabase = getSupabase(); if (!supabase) return; await supabase.from("players").update({ status }).eq("id", id); setPlayers((current) => current.map((p) => p.id === id ? { ...p, status } : p)); }

  return <>
    <header className="page-head"><div><p className="eyebrow">Kaderverwaltung</p><h1>Spieler</h1><p className="muted">{players.length} Spieler in {activeTeam.name}.</p></div>{canManage && <button className="button button-primary" onClick={() => setShowForm(!showForm)}><Plus size={17}/> Spieler hinzufügen</button>}</header>
    {showForm && <section className="card"><div className="card-head"><div><p className="eyebrow">Neuer Spieler</p><h2>Kader ergänzen</h2></div></div><form className="form-grid" onSubmit={createPlayer}><label className="field"><span>Vorname</span><input className="input" name="first_name" required /></label><label className="field"><span>Nachname</span><input className="input" name="last_name" required /></label><label className="field"><span>Rückennummer</span><input className="input" name="shirt_number" type="number" min="1" max="99" /></label><label className="field"><span>Position</span><input className="input" name="primary_position" placeholder="z. B. Innenverteidiger" /></label><div className="wide toolbar"><button className="button button-primary">Speichern</button><button className="button button-ghost" type="button" onClick={() => setShowForm(false)}>Abbrechen</button></div></form>{notice && <div className="notice section-gap">{notice}</div>}</section>}
    <section className="card section-gap"><div className="card-head"><div><p className="eyebrow">Mannschaft</p><h2>Aktiver Kader</h2></div><div className="toolbar"><div style={{position:"relative"}}><Search size={16} style={{position:"absolute",left:12,top:15,color:"#6d766f"}}/><input className="input" style={{paddingLeft:36}} value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Spieler suchen"/></div></div></div>
      {filtered.length === 0 ? <div className="empty"><UserRound size={24}/><p>Keine Spieler gefunden.</p></div> : <div className="table-wrap"><table className="table"><thead><tr><th>Spieler</th><th>Position</th><th>Nr.</th><th>Status</th></tr></thead><tbody>{filtered.map((player)=><tr key={player.id}><td><span className="player-name"><span className="number">{player.shirt_number ?? "–"}</span>{player.first_name} {player.last_name}</span></td><td>{player.primary_position ?? "–"}</td><td>{player.shirt_number ?? "–"}</td><td>{canManage ? <select className="select" value={player.status} onChange={(e)=>setStatus(player.id,e.target.value as Player["status"])}><option value="active">Verfügbar</option><option value="injured">Verletzt</option><option value="away">Abwesend</option></select> : <span className={`badge ${player.status === "active" ? "badge-green" : player.status === "injured" ? "badge-red" : "badge-amber"}`}>{player.status}</span>}</td></tr>)}</tbody></table></div>}
    </section>
  </>;
}
