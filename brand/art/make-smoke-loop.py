"""Turns a generated film of the plume into the seamless loop the site plays.

The source (output/smoke/plume-smoke-2.mp4 in the workspace: MiniMax Hailuo
2.3, image-to-video from brand/art/plume.webp on black) starts on the still
engraving and ends somewhere else, so it cannot simply repeat. The loop plays
it forward and then backward, and eases to a standstill at both turning
points, so each cycle comes to rest on the original engraving and nothing
ever jumps or cross-fades.

Usage:
  python3 make-smoke-loop.py <source.mp4> <workdir> <out-basename>
Writes <out-basename>.webm and <out-basename>.mp4. Needs ffmpeg and ImageMagick.
"""
import math
import subprocess
import sys
from pathlib import Path

WIDTH, HEIGHT = 560, 858  # the plume's 1280:1960 proportion
# The film comes back near-white with a faint colour cast: make it grey, then
# the brand's bone (#E8E0CE), so its lines are the still engraving's colour.
BONE = "format=gray,format=gbrp,colorchannelmixer=rr=0.910:gg=0.878:bb=0.808"
FPS = 24
EASE_IN = 2.0  # seconds to reach full speed from the still engraving
EASE_OUT = 1.0  # seconds to come to rest at the far end


def run(*args):
    subprocess.run(args, check=True)


def positions(count):
    """Source position (fractional frame index) for every frame of the forward pass."""
    ramp_in, ramp_out = EASE_IN * FPS, EASE_OUT * FPS
    last = count - 1
    # A ramp of r output frames covers r/2 source frames.
    total = round(last + ramp_in / 2 + ramp_out / 2)
    out, pos = [], 0.0
    for i in range(total + 1):
        out.append(min(pos, last))
        if i < ramp_in:
            speed = (i + 0.5) / ramp_in
        elif i > total - ramp_out:
            speed = max((total - i - 0.5) / ramp_out, 0.0)
        else:
            speed = 1.0
        pos += speed
    out[-1] = last
    return out


def main():
    source, work, out = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3]
    src, fwd = work / "src", work / "fwd"
    for d in (src, fwd):
        d.mkdir(parents=True, exist_ok=True)
    run("ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(source),
        "-vf", f"scale={WIDTH}:{HEIGHT}:flags=lanczos,{BONE}", str(src / "%04d.png"))
    count = len(list(src.glob("*.png")))

    for i, pos in enumerate(positions(count)):
        lo = math.floor(pos)
        frac = pos - lo
        a = src / f"{lo + 1:04d}.png"
        target = fwd / f"{i:04d}.png"
        if frac < 0.02 or lo + 1 >= count:
            run("cp", str(a), str(target))
        else:
            b = src / f"{lo + 2:04d}.png"
            run("magick", str(a), str(b), "-define", f"compose:args={frac * 100:.1f}",
                "-compose", "blend", "-composite", str(target))

    # Forward, then the same frames backward.
    graph = "[0:v]split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[out]"
    common = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-framerate", str(FPS),
              "-i", str(fwd / "%04d.png"), "-filter_complex", graph, "-map", "[out]", "-an",
              "-pix_fmt", "yuv420p"]
    run(*common, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "45", "-row-mt", "1", f"{out}.webm")
    run(*common, "-c:v", "libx264", "-preset", "slow", "-crf", "29", "-movflags", "+faststart", f"{out}.mp4")


if __name__ == "__main__":
    main()
