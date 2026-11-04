# Chimp.OS Collection — design drafts

Desktop layout drafts for a **Collection** section inside Chimp.OS, the Electron app with a PHP backend. The section is an original 1990s video-store homage called **Rewind** (the tape room). It does not use the Blockbuster name or logo.

These pages are static HTML. They are the designs to react to before anyone builds the section into Electron. The standalone phone app was not continued, and no collection backend was started.

## Look through them

From this folder:

```bash
python3 -m http.server 43123 --bind 0.0.0.0
```

Open [http://127.0.0.1:43123/](http://127.0.0.1:43123/). The index links all twelve drafts.

Every screen has a **Classic / Cyberpunk** switch in the top bar. The choice is stored in `localStorage` under `rewind-theme` and follows you from draft to draft. Add `?theme=classic` or `?theme=cyber` to force one.

| Draft | Screen | Idea |
| --- | --- | --- |
| 01 Shelf wall | Browser | Face-out clamshells, aisle filters, sort |
| 02 Spine wall | Browser | Dense spines for a huge Magic aisle |
| 03 Marquee grid | Browser | Poster wall and ticket-stub filters |
| 04 Store map | Browser | Floor plan, then the bay you picked |
| 05 Rental case | Detail | Open clamshell, match slip, edit dialog |
| 06 Sleeve & ticket | Detail | Torn title card beside the photo |
| 07 Returns counter | Queue | One photo on the glass, confirm or correct |
| 08 Bulk drop | Import | A folder of photos, file the confident rows |
| 09 Membership | Stats | Member card and trophy case |
| 10 Nightly close | Stats | Register receipt and aisle stock |
| 11 Lookup terminal | Browser | Search and sort the whole vault |
| 12 Store lobby | Home | Marquee, aisle doors, new releases |

Phone photos into the desktop app are compared in [docs/phone-photos.md](docs/phone-photos.md).

## Themes

All color, type, radius, shadow, and glow live in [`css/tokens.css`](css/tokens.css). Components only use variables.

Chimp.OS `styles.css` already defines:

- `--bg`
- `--panel`
- `--line`
- `--accent`
- `--muted`
- `--ink`
- `--soft`

Dialogs there are `background: var(--bg); color: var(--ink); border: 1px solid var(--line); border-radius: 12px`. `--radius` is `12px`. The correct-the-label panel on the rental case uses the `.dialog` class with that contract.

Two full themes set those names, plus extras (`--neon`, `--gold`, `--paper`, category colors, glows):

1. **Video Store Classic** — royal blue and ticket yellow. Default.
2. **Chimp.OS Cyberpunk** — near-black, neon purple, neon green, spotlight gold. The hex values are placeholders sampled from the Chimp.OS brand art. Replace the `[data-theme="cyber"]` block when the real `styles.css` values are in hand.

`prefers-reduced-motion` cuts the tracking-line animation and the short hover transitions.

## How this becomes the real section

- The Electron renderer for Collection should keep using these variable names so a Chimp.OS theme switch recolors the section without a second palette.
- Prefer the app-wide theme switcher as the source of truth. The Classic / Cyberpunk control in these drafts shows both looks; in the app it can be that same switcher, with Video Store Classic as one more Chimp.OS theme.
- Records, photos, and price-guide checks belong in the existing PHP backend. These drafts do not include an API. Magic match slips are drawn as if a Scryfall lookup had already returned set, collector number, finish, and price.
- The returns counter is the one-photo review screen. The bulk drop is the folder import. [docs/phone-photos.md](docs/phone-photos.md) is the capture side of that queue.

Screenshots of every draft, in both themes, at 1440×900 are saved with the design review.
