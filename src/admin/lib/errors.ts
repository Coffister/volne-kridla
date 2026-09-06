export function msg(e: unknown): string {
  if (e && typeof e === "object" && "message" in e) return String(e.message);
  return "Nastala chyba.";
}
