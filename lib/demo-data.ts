import type { Player, TeamEvent } from "./types";

export const activeTeam = { id: "psv-ii", name: "2. Mannschaft", shortName: "PSV Düsseldorf II" };

export const demoStats = { events: 14, attendance: 87, squad: 18 };

export const demoPlayers: Player[] = [
  { id: "p1", name: "Spieler 01", number: 2, position: "Außenverteidiger", status: "available" },
  { id: "p2", name: "Spieler 02", number: 3, position: "Außenverteidiger", status: "available" },
  { id: "p3", name: "Spieler 03", number: 6, position: "Defensives Mittelfeld", status: "available" },
  { id: "p4", name: "Spieler 04", number: 8, position: "Zentrales Mittelfeld", status: "available" },
  { id: "p5", name: "Spieler 05", number: 10, position: "Zentrales Mittelfeld", status: "available" },
  { id: "p6", name: "Spieler 06", number: 11, position: "Offensives Mittelfeld", status: "available" },
  { id: "p7", name: "Spieler 07", number: 17, position: "Flügel", status: "available" },
  { id: "p8", name: "Spieler 08", number: 19, position: "Offensives Mittelfeld", status: "available" },
  { id: "p9", name: "Spieler 09", number: 21, position: "Flügel", status: "available" },
  { id: "p10", name: "Spieler 10", number: 4, position: "Innenverteidiger", status: "available" },
  { id: "p11", name: "Spieler 11", number: 5, position: "Innenverteidiger", status: "available" },
  { id: "p12", name: "Spieler 12", number: 14, position: "Mittelfeld", status: "available" },
  { id: "p13", name: "Spieler 13", number: 1, position: "Torwart", status: "available" },
  { id: "p14", name: "Spieler 14", number: 7, position: "Außenverteidiger", status: "available" },
  { id: "p15", name: "Spieler 15", number: 16, position: "Mittelfeld", status: "away" },
  { id: "p16", name: "Spieler 16", number: 9, position: "Stürmer", status: "injured" },
];

export const demoEvents: TeamEvent[] = [
  { id: "ratingen-west", teamId: "psv-ii", type: "match", title: "PSV Düsseldorf II – Ratingen West II", weekday: "SO", day: "23", date: "2026-08-23", meetingTime: "13:45", startTime: "15:00", endTime: "17:00", location: "Sportplatz Ernst-Poensgen-Allee", opponent: "Ratingen West II", homeAway: "home", note: "Bitte spätestens 13:45 Uhr vollständig in der Kabine sein. Aufwärmshirt mitbringen.", squad: ["p13", "p1", "p2", "p10", "p11", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p12", "p14"] },
  { id: "training-19", teamId: "psv-ii", type: "training", title: "Mannschaftstraining", weekday: "MI", day: "19", date: "2026-08-19", meetingTime: "19:45", startTime: "20:00", endTime: "21:30", location: "Ernst-Poensgen-Allee · Platz 2", note: "Schwerpunkt: Spielaufbau und Gegenpressing." },
  { id: "training-21", teamId: "psv-ii", type: "training", title: "Abschlusstraining", weekday: "FR", day: "21", date: "2026-08-21", meetingTime: "19:45", startTime: "20:00", endTime: "21:30", location: "Ernst-Poensgen-Allee · Platz 2", note: "Leichte Einheit und Standards für Sonntag." },
  { id: "training-24", teamId: "psv-ii", type: "training", title: "Regeneration & Training", weekday: "MO", day: "24", date: "2026-08-24", meetingTime: "19:45", startTime: "20:00", endTime: "21:30", location: "Ernst-Poensgen-Allee · Platz 2" },
];
