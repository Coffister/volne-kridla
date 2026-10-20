#!/usr/bin/env bash
# Render every clip (or the ones named) to exports/<clip>.mp4 — same settings for all.
set -euo pipefail
cd "$(dirname "$0")"
clips=("$@"); [ ${#clips[@]} -eq 0 ] && clips=(homepage services inquiry-form conditional-form submission-success admin-overview inquiry-status)
for c in "${clips[@]}"; do
  (cd "clips/$c" && npx hyperframes check . && npx hyperframes render . -o "../../exports/$c.mp4" --fps 30 --crf 20 --video-frame-format png --quiet)
done
python3 verify.py
