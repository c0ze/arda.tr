# Cut the Codex sheet into frames: separate figure from background by flood fill from the border
# (so the white rim lines inside the silhouette stay part of the body), then align on a common baseline.
from PIL import Image, ImageDraw
import numpy as np
from collections import deque
im = Image.open("werewolf-sheet.png").convert("L")
a = np.array(im).astype(np.float32) / 255.0
H, W = a.shape
white = a > 0.72
# background = white pixels reachable from the image border
bg = np.zeros_like(white)
q = deque()
for x in range(W):
    for y in (0, H - 1):
        if white[y, x] and not bg[y, x]: bg[y, x] = True; q.append((y, x))
for y in range(H):
    for x in (0, W - 1):
        if white[y, x] and not bg[y, x]: bg[y, x] = True; q.append((y, x))
while q:
    y, x = q.popleft()
    for dy, dx in ((1,0),(-1,0),(0,1),(0,-1)):
        yy, xx = y + dy, x + dx
        if 0 <= yy < H and 0 <= xx < W and white[yy, xx] and not bg[yy, xx]:
            bg[yy, xx] = True; q.append((yy, xx))
body = ~bg
# find the 8 figures as connected components (8-connected); small bits (claw tips) join the nearest big one
lab = np.zeros(body.shape, np.int32); comps = []
ys_, xs_ = np.nonzero(body)
for y0, x0 in zip(ys_, xs_):
    if lab[y0, x0]: continue
    n = len(comps) + 1; lab[y0, x0] = n; q = deque([(y0, x0)]); pts = []
    while q:
        y, x = q.popleft(); pts.append((y, x))
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                yy, xx = y + dy, x + dx
                if 0 <= yy < H and 0 <= xx < W and body[yy, xx] and not lab[yy, xx]:
                    lab[yy, xx] = n; q.append((yy, xx))
    comps.append(np.array(pts))
sizes = [len(c) for c in comps]
big = sorted(range(len(comps)), key=lambda i: -sizes[i])[:8]
big = sorted(big, key=lambda i: comps[i][:, 1].mean())   # left to right
print("big comps", [sizes[i] for i in big])
owner = {}
cent = [comps[i][:, 1].mean() for i in big]
for i, c in enumerate(comps):
    if i in big: owner[i] = big.index(i)
    else: owner[i] = int(np.argmin([abs(c[:, 1].mean() - cx) for cx in cent]))
masks = [np.zeros(body.shape, bool) for _ in range(8)]
for i, c in enumerate(comps):
    masks[owner[i]][c[:, 0], c[:, 1]] = True
frames = []
for m in masks:
    ys, xs = np.nonzero(m); frames.append((xs.min(), xs.max() + 1, ys.min(), ys.max()))
base = max(f[3] for f in frames)           # common baseline: the lowest foot
top = min(f[2] for f in frames)
# horizontal anchor: centre of mass of the torso band (rows 35%..65% of each figure), so the body doesn't jitter
anchors = []
for (x0, x1, y0, y1) in frames:
    band = masks[len(anchors)][int(y0 + 0.35 * (y1 - y0)):int(y0 + 0.65 * (y1 - y0)), x0:x1]
    xs = np.nonzero(band)[1]
    anchors.append(x0 + xs.mean())
CW = int(max(max(ax - x0, x1 - ax) for (x0, x1, _, _), ax in zip(frames, anchors)) * 2 + 8)
CH = base - top + 6
print("cell", CW, CH)
for i, ((x0, x1, y0, y1), ax) in enumerate(zip(frames, anchors)):
    m = masks[i]
    rgba = np.zeros((CH, CW, 4), np.uint8)
    ox = int(round(CW / 2 - ax))
    for y in range(top, base + 1):
        for x in range(x0, x1):
            if m[y, x]:
                v = int(a[y, x] * 255)
                rgba[y - top + 2, x + ox] = (v, v, v, 255)
    Image.fromarray(rgba, "RGBA").save(f"frame{i+1:02d}.png")
