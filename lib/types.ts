export type TeamRole = "main_admin" | "owner" | "admin" | "trainer" | "player" | "viewer";
export type EventType = "training" | "match" | "meeting";
export type AttendanceStatus = "pending" | "available" | "unavailable" | "excused" | "injured";

export type Team = {
  id: string;
  name: string;
  short_name: string;
  season: string;
  age_group: string | null;
};

export type Membership = {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamRole;
  teams: Team | null;
};

export type Player = {
  id: string;
  team_id: string;
  first_name: string;
  last_name: string;
  shirt_number: number | null;
  primary_position: string | null;
  secondary_position: string | null;
  status: "active" | "injured" | "away";
  date_of_birth: string | null;
  notes: string | null;
};

export type TeamEvent = {
  id: string;
  team_id: string;
  type: EventType;
  status: "draft" | "published" | "cancelled";
  title: string;
  event_date: string;
  meeting_time: string | null;
  start_time: string;
  end_time: string | null;
  location: string | null;
  opponent: string | null;
  home_away: "home" | "away" | null;
  competition: string | null;
  notes: string | null;
};
