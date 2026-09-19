import { AppShell } from "@/components/app-shell";
import { TeamProvider } from "@/components/team-provider";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <TeamProvider><AppShell>{children}</AppShell></TeamProvider>;
}
