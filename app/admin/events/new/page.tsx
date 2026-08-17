import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { EventForm } from "@/components/event-form";

export default function NewEventPage() {
  return <AppShell admin><Link className="back-link" href="/admin"><ArrowLeft size={17} /> Zurück zum Trainerbereich</Link><section className="form-heading"><p className="eyebrow">Trainerbereich</p><h1>Neues Event anlegen</h1><p>Termin veröffentlichen und bei Spielen direkt den Kader festlegen.</p></section><EventForm /></AppShell>;
}
