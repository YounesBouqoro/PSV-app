import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { BrandLogo } from "@/components/brand-logo";

export default function LoginPage() {
  return <main className="login-page"><section className="login-brand-panel"><div className="brand brand--light"><span className="brand-mark"><BrandLogo /></span><span><strong>PSV</strong><small>TEAM-APP</small></span></div><div><p className="eyebrow">Eine Mannschaft. Eine Plattform.</p><h1>Alles für den Spieltag – und alles dazwischen.</h1><p>Termine, Kader und Mannschaftsorganisation zentral und sicher verwalten.</p></div><small>Polizei-Sport-Verein Düsseldorf 1926 e. V.</small></section><section className="login-card"><div><span className="login-shield"><BrandLogo /></span><p className="eyebrow">Geschützter Bereich</p><h2>Willkommen zurück</h2><p>Du erhältst einen sicheren Anmeldelink per E-Mail.</p></div><LoginForm /><div className="demo-entry"><span>Vorschau ohne Login</span><Link href="/">Demo öffnen <span aria-hidden="true">→</span></Link></div></section></main>;
}
