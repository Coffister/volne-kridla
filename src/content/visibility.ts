import { site } from "@/content";

// Public visibility of Voľné krídla sections. Each flag drives both the
// section itself and its navbar entry, so a hidden section never leaves a
// dead link behind. The content (admin FAQ "tipy", target steps) stays in
// place either way.
export const visibility = {
  // toggled in the admin (Otázky → Tipy, triky a zaujímavosti), applied on publish
  showTipsAndTricks: site.sections.tipy,
  // removed at the client's request; flip back to true to republish
  showTargetTraining: false,
};
