"use client";

import { ArrowRight, KeyRound, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [message, setMessage] = useState<string | null>(null);
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email") as string;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) { setMessage("Demo-Modus: Supabase-Zugangsdaten sind noch nicht verbunden."); return; }
    const appRoot = window.location.pathname.replace(/\/login\/?$/, "/");
    const emailRedirectTo = new URL(appRoot, window.location.origin).toString();
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo } });
    setMessage(error ? error.message : "Der Login-Link wurde per E-Mail verschickt.");
  }
  return <form className="login-form" onSubmit={login}><label className="field"><span>E-Mail-Adresse</span><div className="input-with-icon"><Mail size={17} /><input required name="email" type="email" placeholder="trainer@psv-duesseldorf.de" /></div></label><button className="button button--primary" type="submit"><KeyRound size={18} /> Login-Link anfordern <ArrowRight size={17} /></button>{message && <p className="login-message">{message}</p>}</form>;
}
