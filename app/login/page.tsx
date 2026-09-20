"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

type Mode = "login" | "signup" | "forgot";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);

    const supabase = getSupabase();
    if (!supabase) {
      setError("Supabase-Umgebung fehlt.");
      setBusy(false);
      return;
    }

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();

    if (mode === "forgot") {
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (resetError) setError(resetError.message);
      else setNotice("Reset-Link versendet. Prüfe jetzt dein E-Mail-Postfach.");
      setBusy(false);
      return;
    }

    const password = String(form.get("password") || "");

    if (mode === "login") {
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) setError("E-Mail oder Passwort ist nicht korrekt.");
      else router.replace("/dashboard");
    } else {
      const fullName = String(form.get("full_name") || "").trim();
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });

      if (signupError) setError(signupError.message);
      else if (data.session) router.replace("/dashboard");
      else setNotice("Konto erstellt. Bitte bestätige die E-Mail und melde dich anschließend an.");
    }

    setBusy(false);
  }

  const title =
    mode === "login" ? "Willkommen zurück." :
    mode === "signup" ? "Trainerkonto anlegen." :
    "Passwort zurücksetzen.";

  const intro =
    mode === "login"
      ? "Melde dich an und verwalte Mannschaft, Training und Spieltage zentral."
      : mode === "signup"
        ? "Lege dein Konto für den PSV Team Manager an."
        : "Gib deine E-Mail-Adresse ein. Du erhältst einen Link, mit dem du ein neues Passwort festlegen kannst.";

  return <main className="auth-page"><section className="auth-card">
    <div className="brand-lockup"><span className="brand-mark">PSV</span><span className="brand-copy"><strong>PSV Team Manager</strong><span>PSV Düsseldorf</span></span></div>
    <h1>{title}</h1>
    <p>{intro}</p>

    <form className="stack" onSubmit={submit}>
      {mode === "signup" && <label className="field"><span>Name</span><input className="input" name="full_name" autoComplete="name" required /></label>}

      <label className="field">
        <span>E-Mail</span>
        <input className="input" name="email" type="email" autoComplete="email" required />
      </label>

      {mode !== "forgot" && <label className="field">
        <span>Passwort</span>
        <input className="input" name="password" type="password" minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} required />
      </label>}

      {mode === "login" && <button className="button button-ghost button-wide" type="button" onClick={() => { setMode("forgot"); setError(null); setNotice(null); }}>
        Passwort vergessen?
      </button>}

      {error && <div className="notice notice-error">{error}</div>}
      {notice && <div className="notice">{notice}</div>}

      <button className="button button-primary button-wide" disabled={busy}>
        {busy ? "Bitte warten …" : mode === "login" ? "Anmelden" : mode === "signup" ? "Konto erstellen" : "Reset-Link senden"}
      </button>

      {mode === "login" ? (
        <button className="button button-ghost button-wide" type="button" onClick={() => { setMode("signup"); setError(null); setNotice(null); }}>
          Noch kein Konto? Registrieren
        </button>
      ) : (
        <button className="button button-ghost button-wide" type="button" onClick={() => { setMode("login"); setError(null); setNotice(null); }}>
          Zurück zur Anmeldung
        </button>
      )}
    </form>
  </section></main>;
}
