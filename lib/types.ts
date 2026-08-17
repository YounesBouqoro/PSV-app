export type EventType = "training" | "match" | "other";

export type TeamEvent = {
  id: string;
  teamId: string;
  type: EventType;
  title: string;
  weekday: string;
  day: string;
  date: string;
  meetingTime: string;
  startTime: string;
  endTime: string;
  location: string;
  opponent?: string;
  homeAway?: "home" | "away";
  note?: string;
  squad?: string[];
};

export type Player = {
  id: string;
  name: string;
  number: number;
  position: string;
  status: "available" | "injured" | "away";
};
