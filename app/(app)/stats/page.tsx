"use client";

import { BarChart3 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTeam } from "@/components/team-provider";
import { getSupabase } from "@/lib/supabase";
import type { Player } from "@/lib/types";

type Row={player_id:string;status:string};
export default function StatsPage(){
  const {activeTeam}=useTeam(); const [players,setPlayers]=useState<Player[]>([]); const [rows,setRows]=useState<Row[]>([]); const [trainingCount,setTrainingCount]=useState(0);
  useEffect(()=>{(async()=>{const supabase=getSupabase();if(!supabase)return;const [playerResult,eventResult]=await Promise.all([supabase.from("players").select("*").eq("team_id",activeTeam.id).eq("active",true).order("last_name"),supabase.from("events").select("id").eq("team_id",activeTeam.id).eq("type","training").neq("status","cancelled").lte("event_date",new Date().toISOString().slice(0,10))]);const eventIds=(eventResult.data??[]).map(e=>e.id);setPlayers((playerResult.data??[]) as Player[]);setTrainingCount(eventIds.length);if(eventIds.length){const {data}=await supabase.from("attendance").select("player_id,status").in("event_id",eventIds);setRows((data??[]) as Row[])}else setRows([])})();},[activeTeam.id]);
  const data=useMemo(()=>players.map(player=>{const mine=rows.filter(r=>r.player_id===player.id);const available=mine.filter(r=>r.status==="available").length;const rate=mine.length?Math.round(available/mine.length*100):0;return{player,available,total:mine.length,rate}}).sort((a,b)=>b.rate-a.rate),[players,rows]);
  const teamRate=useMemo(()=>{return rows.length?Math.round(rows.filter(r=>r.status==="available").length/rows.length*100):0},[rows]);
  return <><header className="page-head"><div><p className="eyebrow">Auswertung</p><h1>Trainingsbeteiligung</h1><p className="muted">Basis: {trainingCount} angelegte Trainingseinheiten.</p></div></header><section className="grid-kpis"><article className="kpi"><span className="kpi-icon"><BarChart3 size={20}/></span><div><strong>{teamRate}%</strong><span>Team-Anwesenheit</span></div></article><article className="kpi"><span className="kpi-icon"><BarChart3 size={20}/></span><div><strong>{trainingCount}</strong><span>Trainings gesamt</span></div></article><article className="kpi"><span className="kpi-icon"><BarChart3 size={20}/></span><div><strong>{players.length}</strong><span>aktive Spieler</span></div></article></section><section className="card"><div className="card-head"><div><p className="eyebrow">Spielerübersicht</p><h2>Anwesenheitsquote</h2></div></div>{data.length===0?<div className="empty">Noch keine Daten für eine Auswertung vorhanden.</div>:<div className="stack">{data.map(({player,available,total,rate})=><div key={player.id}><div style={{display:"flex",justifyContent:"space-between",gap:12,marginBottom:7,fontSize:12}}><strong>{player.first_name} {player.last_name}</strong><span>{available}/{total} · {rate}%</span></div><div className="progress"><span style={{width:`${rate}%`}}/></div></div>)}</div>}</section></>;
}
