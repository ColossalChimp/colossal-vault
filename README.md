# Colossal Vault

Design drafts for the **Collection** section inside Chimp.OS. The section is a video-store counter inside the desktop app: clamshells, aisle signs, a marquee, title cards, and match slips. The name is a placeholder for the Colossal Chimp Studios brand.

The working name lives in one line:

```js
// js/brand.js
window.PRODUCT_NAME = "Colossal Vault";
```

Change that string and every screen that uses `data-brand` picks it up.

## Look through them

```bash
python3 -m http.server 43123 --bind 0.0.0.0
```

Open [http://127.0.0.1:43123/](http://127.0.0.1:43123/).

The top bar switches **Classic** and **Chimp.OS**. The choice is stored as `vault-theme`. Add `?theme=classic` or `?theme=chimp` to force one.

| Screen | What it keeps from the first round |
| --- | --- |
| [Home](home.html) | Store lobby. Doors, marquee, new-release shelf, plus counts, value, queue, and the top mover. |
| [Wall](browse.html) | Shelf, spines, poster grid, and the aisle map, with sort and filters. |
| [Case](item.html) | Title card, open clamshell, match slip, and the correct-the-label dialog. |
| [Queue](queue.html) | Folder drop totals, the returns counter, and a lookup of titles already filed. |
| [Close](stats.html) | Membership card, aisle trophies, nightly receipt, stock, and movers. |

Counts and prices are placeholders (comics about 10,482, Magic about 19,847, other trading cards 2,150, Funko 1,306).

The first twelve layouts are in [archive/](archive/12-store-lobby.html), still on the Rewind styling they were reviewed in.

## Themes

Color, type, radius, and glow live in [`css/tokens.css`](css/tokens.css). Components use the Chimp.OS names `--bg`, `--panel`, `--line`, `--accent`, `--muted`, `--ink`, and `--soft`.

**Chimp.OS** (`data-theme="chimp"`) is sampled from the Files dashboard: slate `#2c333e`, charcoal panels, hot pink `#f830a0`, magenta, cyan `#10a8e8`, teal `#308898`, muted `#7a7f91`. Type is IBM Plex Mono. Radius is 6px. Aisle signs, cases, tickets, and the marquee stay, drawn in those colors.

**Video Store Classic** stays royal blue and ticket yellow, with the heavier display type.

`prefers-reduced-motion` still cuts the tracking-line animation.

## How this becomes the section

The Electron renderer should keep using these variable names so the app-wide theme switch recolors Collection. Classic can be one more Chimp.OS theme. Records and photos stay in the PHP backend. Phone photos are compared in [docs/phone-photos.md](docs/phone-photos.md): bulk folder import for the camera roll, and a QR code to a local HTTPS upload page for new snaps.
