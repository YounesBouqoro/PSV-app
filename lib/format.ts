export function formatDate(value: string) {
  return new Intl.DateTimeFormat("de-DE", { weekday: "short", day: "2-digit", month: "short" }).format(new Date(`${value}T12:00:00`));
}
export function formatLongDate(value: string) {
  return new Intl.DateTimeFormat("de-DE", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}
export function shortTime(value: string | null) { return value ? value.slice(0, 5) : "–"; }
export function initials(first: string, last: string) { return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase(); }
