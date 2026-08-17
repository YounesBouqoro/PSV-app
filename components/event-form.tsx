"use client";

import { useSearchParams } from "next/navigation";
import { CalendarPlus, Check, Clock3, MapPin, Users } from "lucide-react";
import { FormEvent, useState } from "react";
import { demoPlayers } from "@/lib/demo-data";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function EventForm() {
  const searchParams = useSearchParams();
  const [type, setType] = useState(searchParams.get("type") === "training" ? "training" : "match");
  const [selected, setSelected] = useState<string[]>(demoPlayers.filter((p) => p.status === "available").slice(0, 14).map((p) => p.id));
  const [notice, setNotice] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setNotice("Demo gespeichert. Nach der Supabase-Verknüpfung wird der Termin direkt veröffentlicht.");
      return;
    }
    const { error } = await supabase.from("events").insert({
      team_id: form.get("team_id"), type, title: form.get("title"), event_date: form.get("date"),
      meeting_time: form.get("meeting_time"), start_time: form.get("start_time"), end_time: form.get("end_time"),
      location: form.get("location"), opponent: form.get("opponent") || null, notes: form.get("notes") || null, status: "published",
    });
    setNotice(error ? `Speichern nicht möglich: ${error.message}` : "Termin wurde veröffentlicht.");
  }

  return (
    <form className="event-form" onSubmit={submit}>
      <input type="hidden" name="team_id" value="00000000-0000-0000-0000-000000000001" />
      <section className="form-section">
        <div className="form-section__title"><span>1</span><div><h2>Eventtyp</h2><p>Was soll für die Mannschaft geplant werden?</p></div></div>
        <div className="type-picker">
          <button className={type === "match" ? "active" : ""} type="button" onClick={() => setType("match")}><CalendarPlus size={22} /><span><strong>Spiel</strong><small>Mit Gegner und Kader</small></span></button>
          <button className={type === "training" ? "active" : ""} type="button" onClick={() => setType("training")}><Clock3 size={22} /><span><strong>Training</strong><small>Einzel- oder Serientermin</small></span></button>
        </div>
      </section>
      <section className="form-section">
        <div className="form-section__title"><span>2</span><div><h2>Termin und Ort</h2><p>Die wichtigsten Eckdaten des Events.</p></div></div>
        <div className="form-grid">
          <label className="field field--wide"><span>Titel</span><input required name="title" defaultValue={type === "match" ? "PSV Düsseldorf II – " : "Mannschaftstraining"} /></label>
          {type === "match" && <label className="field"><span>Gegner</span><input name="opponent" placeholder="z. B. Ratingen West II" /></label>}
          <label className="field"><span>Datum</span><input required name="date" type="date" defaultValue="2026-08-23" /></label>
          <label className="field"><span>Treffpunkt</span><input required name="meeting_time" type="time" defaultValue={type === "training" ? "19:45" : "13:45"} /></label>
          <label className="field"><span>{type === "match" ? "Anstoß" : "Beginn"}</span><input required name="start_time" type="time" defaultValue={type === "training" ? "20:00" : "15:00"} /></label>
          <label className="field"><span>Ende</span><input required name="end_time" type="time" defaultValue={type === "training" ? "21:30" : "17:00"} /></label>
          <label className="field field--wide"><span><MapPin size={15} /> Ort</span><input required name="location" defaultValue="Ernst-Poensgen-Allee · Platz 2" /></label>
          <label className="field field--wide"><span>Anmerkungen</span><textarea name="notes" rows={4} placeholder="Infos zu Treffpunkt, Ausrüstung oder Trainingsschwerpunkt …" /></label>
        </div>
      </section>
      {type === "match" && <section className="form-section">
        <div className="form-section__title"><span>3</span><div><h2>Kader auswählen</h2><p>{selected.length} Spieler sind aktuell nominiert.</p></div></div>
        <div className="select-squad">
          {demoPlayers.map((player) => {
            const active = selected.includes(player.id);
            return <button className={active ? "active" : ""} type="button" key={player.id} onClick={() => setSelected(active ? selected.filter((id) => id !== player.id) : [...selected, player.id])}><span className="select-number">{player.number}</span><span><strong>{player.name}</strong><small>{player.position}</small></span><span className="select-check">{active && <Check size={15} />}</span></button>;
          })}
        </div>
      </section>}
      {notice && <p className="form-notice"><Check size={18} /> {notice}</p>}
      <div className="form-actions"><button className="button button--ghost" type="button">Als Entwurf speichern</button><button className="button button--primary" type="submit"><Users size={18} /> Event veröffentlichen</button></div>
    </form>
  );
}
