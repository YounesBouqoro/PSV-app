"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, House, LogOut, Menu, Settings, Shield, Users } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Übersicht", icon: House },
  { href: "/admin", label: "Termine", icon: CalendarDays },
  { href: "/admin#squad", label: "Mannschaft", icon: Users },
];

export function AppShell({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="app-layout">
      <aside className={`sidebar ${open ? "sidebar--open" : ""}`}>
        <div className="brand">
          <span className="brand-mark"><Shield size={24} strokeWidth={2.4} /></span>
          <span><strong>PSV</strong><small>TEAM-APP</small></span>
        </div>
        <nav className="side-nav" aria-label="Hauptnavigation">
          <p>MANNSCHAFT</p>
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href.split("#")[0]);
            return <Link className={active ? "active" : ""} href={href} key={href} onClick={() => setOpen(false)}><Icon size={19} />{label}</Link>;
          })}
          <p>VERWALTUNG</p>
          <Link className={admin ? "active" : ""} href="/admin"><Settings size={19} />Trainerbereich</Link>
        </nav>
        <div className="sidebar-user">
          <span className="avatar">YB</span>
          <span><strong>Younes Bouqoro</strong><small>Trainer · PSV II</small></span>
          <Link href="/login" aria-label="Abmelden"><LogOut size={18} /></Link>
        </div>
      </aside>
      <div className="main-column">
        <header className="mobile-header">
          <div className="brand"><span className="brand-mark"><Shield size={21} /></span><strong>PSV TEAM-APP</strong></div>
          <button onClick={() => setOpen(!open)} aria-label="Menü öffnen"><Menu size={24} /></button>
        </header>
        <main className="content">{children}</main>
        <nav className="bottom-nav" aria-label="Mobile Navigation">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href.split("#")[0]);
            return <Link className={active ? "active" : ""} href={href} key={href}><Icon size={20} /><span>{label}</span></Link>;
          })}
        </nav>
      </div>
      {open && <button className="sidebar-backdrop" aria-label="Menü schließen" onClick={() => setOpen(false)} />}
    </div>
  );
}
