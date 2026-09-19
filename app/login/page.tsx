"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login"|"signup">("login");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(null); setNotice(null);
    const supabase = getSupabase();
    if (!supabase) { setError("Supabase-Umgebung fehlt."); setBusy(false); return; }
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    if (mode === "login") {
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) setError(loginError.message); else router.replace("/dashboard");
    } else {
      const fullName = String(form.get("full_name") || "").trim();
      const { data, error: signupError } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
      if (signupError) setError(signupError.message);
      else if (data.session) router.replace("/dashboard");
      else setNotice("Konto erstellt. Bitte bestätige die E-Mail und melde dich anschließend an.");
    }
    setBusy(false);
  }

  return <main className="auth-page"><section className="auth-card">
    <div className="brand-lockup"><span className="brand-mark">PSV</span><span className="brand-copy"><strong>PSV Team Manager</strong><span>PSV Düsseldorf</span></span></div>
    <h1>{mode === "login" ? "Willkommen zurück." : "Trainerkonto anlegen."}</h1>
    <p>{mode === "login" ? "Melde dich an und verwalte Mannschaft, Training und Spieltage zentral." : "Der erste Benutzer wird automatisch als Owner der Startteams eingerichtet."}</p>
    <form className="stack" onSubmit={submit}>
      {mode === "signup" && <label className="field"><span>Name</span><input className="input" name="full_name" autoComplete="name" required /></label>}
      <label className="field"><span>E-Mail</span><input className="input" name="email" type="email" autoComplete="email" required /></label>
      <label className="field"><span>Passwort</span><input className="input" name="password" type="password" minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} required /></label>
      {error && <div className="notice notice-error">{error}</div>}{notice && <div className="notice">{notice}</div>}
      <button className="button button-primary button-wide" disabled={busy}>{busy ? "Bitte warten …" : mode === "login" ? "Anmelden" : "Konto erstellen"}</button>
      <button className="button button-ghost button-wide" type="button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); setNotice(null); }}>{mode === "login" ? "Noch kein Konto? Registrieren" : "Bereits registriert? Anmelden"}</button>
    </form>
  </section></main>;
}
