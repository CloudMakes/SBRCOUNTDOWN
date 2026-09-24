# SBRCOUNTDOWN 🏇

A **super-sleek, color-shifting fan countdown** to
**STEEL BALL RUN: JoJo's Bizarre Adventure — Episode 2** (the opening of the 2nd & 3rd STAGE),
streaming worldwide on **Netflix, Friday September 25 2026, 17:00 JST (08:00 UTC)** —
and every Friday weekly after that.

Open `index.html` (or serve the folder) and the page does the rest: **it reads your device's
clock and timezone**, translates the drop moment into *your* local time, and counts down to
the millisecond while the whole page cycles through hues like a Stand ability.

> Nyo-ho-ho! Guided by the Steel Ball's spin, destiny begins to run.
> 鉄球の回転、運命が走りだす。

---

## ✨ Features

- **Millisecond-precise countdown** to `2026-09-25T17:00:00+09:00`, computed 100% client-side
  from the visitor's device clock — days / hours / minutes / seconds tiles with flip-in digit
  animation, plus a sweeping millisecond bar and a spinning Steel Ball.
- **"In your area" panel** — the exact drop moment rendered in *your* timezone (weekday, date,
  time, UTC offset, abbreviation), enriched with best-effort geolocation (city + flag, silent
  fallback to the device timezone). No server, no tracking beyond that optional lookup.
- **World race clocks** — live ticking clocks for Your area / Tokyo / Los Angeles / New York /
  London / Paris / Sydney, each showing what time the episode lands there.
- **Color-changing everything** — a hue engine drifts the entire palette (background halftone,
  speed lines, title shadows, tiles, buttons, menace ゴ glyphs, dust particles) through the
  spectrum; lock it to **GOLD / PALM / STEEL / PINK** from the top bar, or leave it on AUTO.
  The drift speeds up as the drop approaches.
- **Phase-aware drama** — the page mood shifts: calm → close → final hour → *imminent*
  (tiles shake) → **LIVE** (after the drop the countdown flips to elapsed time and a
  "NOW STREAMING" badge takes over).
- **All official trailers & PVs in one place** — 8 videos (2nd STAGE official trailers EN,
  JP 2nd Trailer, 2nd STAGE teaser PV, Netflix trailer, 1st STAGE digest, 1st Trailer,
  AnimeJapan teaser, announcement trailer) played in-page through a lightweight
  YouTube facade modal (thumbnails only load on scroll, players only on click).
- **Episode 2 dossier** — title (EN/JP), official 2nd STAGE synopsis, manga arc chips,
  production crew and the new 2nd STAGE cast.
- **Add to calendar** — generates an `.ics` file client-side with a 1-hour-before alarm.
- **JoJo print styling** — Anton + Dela Gothic One (subsetted JP) + Space Grotesk +
  JetBrains Mono, hard offset shadows, halftone dots, floating ゴ menace, rotating steel balls.
- Respects `prefers-reduced-motion`, keyboard-focusable controls, `<noscript>` fallback with
  the hard facts, fully responsive down to small phones.

## 🚀 Run it

It's a static site — no build step, no dependencies:

```bash
# either open index.html directly, or serve it:
python3 -m http.server 8000
# → http://localhost:8000
```

## 🗂 Layout

```
index.html          page structure, trailer cards, dossier
css/style.css       hue-driven design system + animations
js/app.js           countdown engine, hue engine, clocks, geo, ICS, modal
assets/fonts/       self-hosted SIL-OFL fonts (subsetted JP display face)
```

## 📚 Drop-moment sources

- Official schedule via the JoJo portal / Warner Bros. Japan: 2nd & 3rd STAGE (11 episodes)
  weekly on Fridays from **2026-09-25**, Netflix worldwide exclusive.
- Episode 2 = *"The Sheriff's Request to Mountain Tim"* (マウンテン・ティムへの依頼),
  overall JoJo episode #192 — JoJo Wiki.
- Trailer IDs verified against the official Warner Bros. Japan Anime / Netflix YouTube channels.

## ⚖️ Credits & license

Fan project, not affiliated with Lucky Land Communications, Shueisha, Warner Bros. Japan,
david production or Netflix. All trailers remain © their owners (embedded via YouTube).
Fonts: **Dela Gothic One**, **Anton**, **Space Grotesk**, **JetBrains Mono** — SIL Open Font
License (see `assets/fonts/LICENSES.txt`). Code here is MIT.
