"use client";

import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import type { Membership, Team } from "@/lib/types";

type TeamContextValue = {
  user: User;
  memberships: Membership[];
  activeTeam: Team;
  role: string;
  setActiveTeamId: (id: string) => void;
  refreshMemberships: () => Promise<void>;
};

const TeamContext = createContext<TeamContextValue | null>(null);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [activeTeamId, setActiveTeamIdState] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadMemberships(currentUser: User) {
    const supabase = getSupabase();
    if (!supabase) return;
    let { data, error: membershipError } = await supabase
      .from("team_memberships")
      .select("id,team_id,user_id,role,teams(id,name,short_name,season,age_group)")
      .eq("user_id", currentUser.id)
      .order("created_at");

    if (membershipError) throw membershipError;
    const normalized = (data ?? []).map((row) => ({ ...row, teams: Array.isArray(row.teams) ? row.teams[0] : row.teams })) as unknown as Membership[];
    setMemberships(normalized);
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("psv-active-team") : null;
    const fallback = normalized[0]?.team_id ?? "";
    const validSaved = normalized.some((item) => item.team_id === saved) ? saved! : fallback;
    setActiveTeamIdState(validSaved);
  }

  async function refreshMemberships() { if (user) await loadMemberships(user); }

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) { setError("Supabase ist noch nicht konfiguriert."); setLoading(false); return; }
    let mounted = true;
    supabase.auth.getUser().then(async ({ data, error: authError }) => {
      if (!mounted) return;
      if (authError || !data.user) { router.replace("/login"); setLoading(false); return; }
      setUser(data.user);
      try { await loadMemberships(data.user); } catch (e) { setError(e instanceof Error ? e.message : "Teamdaten konnten nicht geladen werden."); }
      finally { if (mounted) setLoading(false); }
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") router.replace("/login");
    });
    return () => { mounted = false; subscription.subscription.unsubscribe(); };
  }, [router]);

  function setActiveTeamId(id: string) {
    setActiveTeamIdState(id);
    window.localStorage.setItem("psv-active-team", id);
  }

  const activeMembership = memberships.find((item) => item.team_id === activeTeamId) ?? memberships[0];
  const value = useMemo(() => activeMembership && user && activeMembership.teams ? ({
    user,
    memberships,
    activeTeam: activeMembership.teams,
    role: activeMembership.role,
    setActiveTeamId,
    refreshMemberships,
  }) : null, [activeMembership, memberships, user]);

  if (loading) return <main className="loading-screen"><div className="loading-card"><div className="brand-lockup"><span className="brand-mark">PSV</span><span className="brand-copy"><strong>PSV Team Manager</strong><span>Teamdaten werden geladen …</span></span></div></div></main>;
  if (error) return <main className="loading-screen"><div className="loading-card"><div className="brand-lockup"><span className="brand-mark">PSV</span><span className="brand-copy"><strong>Konfiguration erforderlich</strong><span>{error}</span></span></div></div></main>;
  if (!value) return <main className="loading-screen"><div className="loading-card"><p className="muted">Für dieses Konto ist noch keine Mannschaft freigeschaltet.</p></div></main>;
  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

export function useTeam() {
  const value = useContext(TeamContext);
  if (!value) throw new Error("useTeam must be used within TeamProvider");
  return value;
}
