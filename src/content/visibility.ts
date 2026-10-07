// Public visibility of Voľné krídla sections. Each flag drives both the
// section itself and its navbar entry, so a hidden section never leaves a
// dead link behind. The content (admin FAQ "tipy", target steps) stays in
// place — flip a flag back to true to republish.
export const visibility = {
  showTipsAndTricks: false,
  showTargetTraining: false,
};
