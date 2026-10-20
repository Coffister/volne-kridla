#!/usr/bin/env python3
"""Pre-delivery check of every export: length 6–8 s and equal to the
composition's data-duration, 1920×1080 H.264, no audio stream, decodable to
the last frame, and a loop seam (last vs first frame) without a visible jump.

    python3 video/verify.py
"""
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).parent
CLIPS = ["homepage", "services", "inquiry-form", "conditional-form",
         "submission-success", "admin-overview", "inquiry-status"]
SEAM_MAX = 3.0  # mean abs luma difference /255 between last and first frame


def probe(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-count_frames", "-show_entries",
                          "format=duration,size:stream=codec_type,codec_name,width,height,r_frame_rate,nb_read_frames",
                          "-of", "json", str(path)], capture_output=True, text=True, check=True)
    return json.loads(out.stdout)


def gray_frame(path, args):
    raw = subprocess.run(["ffmpeg", "-v", "error", *args, "-i", str(path), "-frames:v", "1",
                          "-vf", "scale=480:270,format=gray", "-f", "rawvideo", "-"],
                         capture_output=True, check=True).stdout
    return raw


def main():
    failed = False
    for clip in CLIPS:
        mp4 = ROOT / "exports" / f"{clip}.mp4"
        html = (ROOT / "clips" / clip / "index.html").read_text()
        authored = float(re.search(r'id="root"[^>]*data-duration="([\d.]+)"', html).group(1))
        info = probe(mp4)
        v = [s for s in info["streams"] if s["codec_type"] == "video"][0]
        audio = [s for s in info["streams"] if s["codec_type"] == "audio"]
        dur = float(info["format"]["duration"])
        frames = int(v["nb_read_frames"])
        fps = eval(v["r_frame_rate"])
        a, b = gray_frame(mp4, []), gray_frame(mp4, ["-sseof", "-0.04"])
        seam = sum(abs(x - y) for x, y in zip(a, b)) / len(a)
        problems = []
        if not 6 <= dur <= 8:
            problems.append(f"length {dur}s outside 6–8 s")
        if abs(dur - authored) > 0.001 or frames != round(authored * fps):
            problems.append(f"export {dur}s/{frames}f ≠ timeline {authored}s")
        if (v["width"], v["height"], v["codec_name"]) != (1920, 1080, "h264"):
            problems.append(f"{v['codec_name']} {v['width']}x{v['height']}")
        if audio:
            problems.append("has an audio stream")
        if seam > SEAM_MAX:
            problems.append(f"loop seam {seam:.2f}")
        size = int(info["format"]["size"]) / 1e6
        status = "OK " if not problems else "FAIL"
        failed |= bool(problems)
        print(f"{status} {clip:20} {dur:.3f}s {frames}f {v['width']}x{v['height']} "
              f"{size:.2f} MB seam {seam:.2f}  {'; '.join(problems)}")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
