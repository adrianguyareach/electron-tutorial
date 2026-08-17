#!/usr/bin/env python3
"""Regenerate tray icons: python3 assets/generate-tray-icon.py"""
import os
from PIL import Image, ImageDraw

OUT = os.path.dirname(os.path.abspath(__file__))
SS = 16  # supersample

GREEN = (0x1E, 0xA9, 0x5C)


def bez(p0, p1, p2, p3, n=160):
    out = []
    for i in range(n + 1):
        t = i / n
        u = 1 - t
        a, b, c, d = u**3, 3 * u * u * t, 3 * u * t * t, t**3
        out.append((a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
                    a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]))
    return out


def leaf_alpha(px):
    """Alpha mask of the leaf at `px` logical pixels."""
    n = px * SS
    m = Image.new("L", (n, n), 0)
    d = ImageDraw.Draw(m)
    S = lambda p: (p[0] * n, p[1] * n)

    # Blade runs corner to corner so it fills the tiny canvas.
    tip, base = (0.87, 0.09), (0.13, 0.91)
    upper = bez(tip, (1.00, 0.40), (0.82, 0.74), base)
    lower = bez(base, (0.00, 0.60), (0.18, 0.00), tip)
    d.polygon([S(p) for p in upper] + [S(p) for p in lower], fill=255)

    # Midrib: thin, and stopping short of both ends so the blade stays
    # one connected shape instead of two slivers.
    d.line([S((0.26, 0.76)), S((0.74, 0.24))], fill=0, width=max(1, round(px * 0.055)) * SS)

    return m.resize((px, px), Image.LANCZOS)


def build(px, color):
    a = leaf_alpha(px)
    img = Image.new("RGBA", (px, px), color + (0,))
    img.putalpha(a)
    return img


os.makedirs(OUT, exist_ok=True)
# Colored set for Windows / Linux trays
for px, suffix in ((16, ""), (32, "@2x"), (48, "@3x")):
    build(px, GREEN).save(os.path.join(OUT, f"trayIcon{suffix}.png"))
# Template set for macOS (black + alpha; the OS recolors for light/dark menu bar)
for px, suffix in ((16, ""), (32, "@2x"), (48, "@3x")):
    build(px, (0, 0, 0)).save(os.path.join(OUT, f"trayIconTemplate{suffix}.png"))
print("wrote", OUT)
