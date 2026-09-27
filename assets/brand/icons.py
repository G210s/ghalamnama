# Language-neutral keyboard icon concepts for Ghalamnama, drawn as 256x256 SVG.
# Each concept has a detailed form (48px and up) and a simplified form for toolbar sizes (16-32px).
LIME, INK, PAPER = "#c9ed95", "#101312", "#f8f4ec"


def keys(x0, y0, cols, rows, w, h, gx, gy, fill, skip=()):
    out = []
    for r in range(rows):
        for c in range(cols):
            if (r, c) in skip:
                continue
            out.append(f'<rect x="{x0 + c*(w+gx):.1f}" y="{y0 + r*(h+gy):.1f}" width="{w}" height="{h}" rx="{min(w, h)*0.22:.1f}" fill="{fill}"/>')
    return "".join(out)


def globe(cx, cy, r, stroke, width):
    """The universal 'switch keyboard language' globe."""
    lat = r * 0.5
    half = (r*r - lat*lat) ** 0.5
    return (f'<g fill="none" stroke="{stroke}" stroke-width="{width}" stroke-linecap="round">'
            f'<circle cx="{cx}" cy="{cy}" r="{r}"/>'
            f'<ellipse cx="{cx}" cy="{cy}" rx="{r*0.42:.1f}" ry="{r}"/>'
            f'<line x1="{cx-r}" y1="{cy}" x2="{cx+r}" y2="{cy}"/>'
            f'<line x1="{cx-half:.1f}" y1="{cy-lat:.1f}" x2="{cx+half:.1f}" y2="{cy-lat:.1f}"/>'
            f'<line x1="{cx-half:.1f}" y1="{cy+lat:.1f}" x2="{cx+half:.1f}" y2="{cy+lat:.1f}"/></g>')


def text(x, y, size, fill, char, family="system-ui", weight=800):
    return f'<text x="{x}" y="{y}" font-family="{family}" font-weight="{weight}" font-size="{size}" fill="{fill}" text-anchor="middle">{char}</text>'


def tile(body):
    return f'<rect x="8" y="8" width="240" height="240" rx="53" fill="{LIME}"/>{body}'


BOARD = f'<rect x="22" y="58" width="212" height="146" rx="22" fill="{INK}"/>'
SMALL_BOARD = f'<rect x="16" y="52" width="224" height="160" rx="28" fill="{INK}"/>'

CONCEPTS = {
    # A keyboard whose featured key is the globe language key.
    "globe-key": (
        tile(BOARD
             + keys(36, 72, 6, 3, 24, 24, 7.2, 7, LIME, skip={(0, 2), (0, 3), (1, 2), (1, 3)})
             + f'<rect x="98" y="72" width="55" height="55" rx="10" fill="{PAPER}"/>'
             + globe(125.5, 99.5, 19, INK, 4.5)
             + f'<rect x="74" y="165" width="108" height="24" rx="5" fill="{LIME}"/>'),
        tile(SMALL_BOARD
             + keys(34, 70, 2, 2, 44, 44, 12, 12, LIME)
             + f'<rect x="146" y="70" width="76" height="100" rx="14" fill="{PAPER}"/>'
             + globe(184, 120, 26, INK, 9)
             + f'<rect x="34" y="182" width="188" height="14" rx="5" fill="{LIME}"/>')),
    # Keys labelled in several scripts: the product is many languages, not one.
    "multi-script": (
        tile(BOARD
             + keys(36, 72, 6, 3, 24, 24, 7.2, 7, LIME, skip={(0, 1), (0, 2), (0, 3), (0, 4)})
             + "".join(f'<rect x="{67.2 + i*31.2:.1f}" y="66" width="28" height="34" rx="6" fill="{PAPER}"/>' + text(81.2 + i*31.2, 92, 24, INK, ch, f)
                       for i, (ch, f) in enumerate([("ق", "Nahar"), ("א", "system-ui"), ("Я", "system-ui"), ("Ω", "system-ui")]))
             + f'<rect x="74" y="165" width="108" height="24" rx="5" fill="{LIME}"/>'),
        tile(SMALL_BOARD
             + keys(34, 70, 3, 2, 52, 44, 16, 12, LIME, skip={(0, 1)})
             + f'<rect x="102" y="62" width="52" height="60" rx="10" fill="{PAPER}"/>'
             + text(128, 108, 44, INK, "Ω")
             + f'<rect x="34" y="182" width="188" height="14" rx="5" fill="{LIME}"/>')),
    # Stacked keycaps, like layouts swapping over each other; the front one is the globe key.
    "layered-keycaps": (
        tile(f'<rect x="92" y="34" width="124" height="124" rx="26" fill="#6d7a6a"/>'
             f'<rect x="66" y="62" width="124" height="124" rx="26" fill="#3a423c"/>'
             f'<rect x="40" y="90" width="132" height="132" rx="28" fill="{INK}"/>'
             f'<rect x="50" y="96" width="112" height="106" rx="20" fill="#2b312d"/>'
             + globe(106, 149, 32, LIME, 7)),
        tile(f'<rect x="100" y="28" width="128" height="128" rx="28" fill="#5a6558"/>'
             f'<rect x="28" y="84" width="148" height="148" rx="32" fill="{INK}"/>'
             + globe(102, 158, 42, LIME, 13))),
    # A plain keyboard silhouette with a globe badge on the corner.
    "keyboard-badge": (
        tile(f'<rect x="22" y="94" width="176" height="124" rx="20" fill="{INK}"/>'
             + keys(35, 107, 5, 3, 24, 22, 6.5, 7, LIME)
             + f'<rect x="60" y="194" width="100" height="12" rx="4" fill="{LIME}"/>'
             + f'<circle cx="182" cy="82" r="50" fill="{PAPER}" stroke="{LIME}" stroke-width="10"/>'
             + globe(182, 82, 32, INK, 7)),
        tile(f'<rect x="16" y="100" width="184" height="132" rx="26" fill="{INK}"/>'
             + keys(36, 122, 3, 2, 40, 30, 14, 14, LIME)
             + f'<circle cx="180" cy="80" r="62" fill="{PAPER}" stroke="{LIME}" stroke-width="12"/>'
             + globe(180, 80, 38, INK, 12))),
}


def svg(name, small=False):
    body = CONCEPTS[name][1 if small else 0]
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">{body}</svg>'
