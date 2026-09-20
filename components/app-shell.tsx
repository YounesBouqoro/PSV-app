"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, CalendarDays, House, LogOut, PlusCircle, UsersRound } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { useTeam } from "@/components/team-provider";

const nav = [
  { href: "/dashboard", label: "Übersicht", icon: House },
  { href: "/calendar", label: "Termine", icon: CalendarDays },
  { href: "/events/new", label: "Planen", icon: PlusCircle },
  { href: "/players", label: "Kader", icon: UsersRound },
  { href: "/stats", label: "Statistik", icon: BarChart3 },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, memberships, activeTeam, role, setActiveTeamId } = useTeam();
  const active = (href: string) => pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
  const roleLabel = role === "main_admin" ? "Main Admin" : role === "owner" ? "Owner" : role === "admin" ? "Admin" : role === "trainer" ? "Trainer" : role === "player" ? "Spieler" : "Viewer";
  async function logout() { const supabase = getSupabase(); if (supabase) await supabase.auth.signOut(); router.replace("/login"); }
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand-lockup"><span className="brand-mark">PSV</span><span className="brand-copy"><strong>Team Manager</strong><span>PSV Düsseldorf</span></span></div>
      <nav className="side-nav">{nav.map(({ href, label, icon: Icon }) => <Link className={active(href) ? "active" : ""} href={href} key={href}><Icon size={18}/>{label}</Link>)}</nav>
      <div className="side-bottom">
        <div className="team-picker"><label>Aktive Mannschaft</label><select value={activeTeam.id} onChange={(e) => setActiveTeamId(e.target.value)}>{memberships.map((membership) => membership.teams && <option value={membership.team_id} key={membership.id}>{membership.teams.name}</option>)}</select></div>
        <div className="user-box"><span className="user-copy"><strong>{user.user_metadata?.full_name || user.email || "Trainer"}</strong><span>{roleLabel} · {activeTeam.short_name}</span></span><button className="icon-button" onClick={logout} aria-label="Abmelden"><LogOut size={17}/></button></div>
      </div>
    </aside>
    <div className="main">
      <header className="mobile-top"><div className="brand-lockup"><span className="brand-mark">PSV</span><span className="brand-copy"><strong>{activeTeam.name}</strong><span>{activeTeam.season}</span></span></div><select className="select" value={activeTeam.id} onChange={(e) => setActiveTeamId(e.target.value)} aria-label="Mannschaft wechseln">{memberships.map((membership) => membership.teams && <option value={membership.team_id} key={membership.id}>{membership.teams.name}</option>)}</select></header>
      <main className="content">{children}</main>
      <nav className="bottom-nav">{nav.map(({ href, label, icon: Icon }) => <Link className={active(href) ? "active" : ""} href={href} key={href}><Icon size={19}/><span>{label}</span></Link>)}</nav>
    </div>
  </div>;
}
