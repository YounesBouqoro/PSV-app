"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setError("Supabase-Umgebung fehlt.");
      return;
    }

    supabase.auth.getSession().then(({ data }) => setReady(Boolean(data.session)));

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

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
    const password = String(form.get("password") || "");
    const confirm = String(form.get("confirm_password") || "");

    if (password.length < 8) {
      setError("Das neue Passwort muss mindestens 8 Zeichen lang sein.");
      setBusy(false);
      return;
    }

    if (password !== confirm) {
      setError("Die beiden Passwörter stimmen nicht überein.");
      setBusy(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError("Der Reset-Link ist ungültig oder abgelaufen. Bitte fordere einen neuen Link an.");
      setBusy(false);
      return;
    }

    setNotice("Passwort erfolgreich geändert. Du wirst zur App weitergeleitet.");
    setBusy(false);
    setTimeout(() => router.replace("/dashboard"), 700);
  }

  return <main className="auth-page"><section className="auth-card">
    <div className="brand-lockup"><span className="brand-mark">PSV</span><span className="brand-copy"><strong>PSV Team Manager</strong><span>PSV Düsseldorf</span></span></div>
    <h1>Neues Passwort festlegen.</h1>
    <p>Wähle ein neues Passwort für deinen Zugang.</p>

    {!ready && !error && <div className="notice">Reset-Link wird geprüft …</div>}

    <form className="stack" onSubmit={submit}>
      <label className="field">
        <span>Neues Passwort</span>
        <input className="input" name="password" type="password" minLength={8} autoComplete="new-password" required disabled={!ready} />
      </label>
      <label className="field">
        <span>Passwort wiederholen</span>
        <input className="input" name="confirm_password" type="password" minLength={8} autoComplete="new-password" required disabled={!ready} />
      </label>

      {error && <div className="notice notice-error">{error}</div>}
      {notice && <div className="notice">{notice}</div>}

      <button className="button button-primary button-wide" disabled={busy || !ready}>
        {busy ? "Wird gespeichert …" : "Neues Passwort speichern"}
      </button>

      <button className="button button-ghost button-wide" type="button" onClick={() => router.replace("/login")}>
        Zurück zur Anmeldung
      </button>
    </form>
  </section></main>;
}
