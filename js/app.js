/* ============================================================
   STEEL BALL RUN — EP2 COUNTDOWN ENGINE
   All timing is computed from the visitor's device clock.
   Target: 2026-09-25 17:00 JST (Netflix worldwide drop moment)
   ============================================================ */
"use strict";

const TARGET = Date.parse("2026-09-25T17:00:00+09:00"); // 08:00 UTC
const EP1    = Date.parse("2026-03-19T16:00:00+09:00"); // 1st STAGE drop
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

const $ = (s) => document.querySelector(s);

/* ---------------- hue engine (the color-changing bit) ---------------- */
const hue = {
  value: 38,          // desert gold to start
  mode: "auto",       // auto | locked
  locked: 38,
  speed: 2.2,         // degrees per second
};
function hueTick(dt, phase) {
  if (hue.mode === "auto" && !REDUCED) {
    const boost = phase === "live" ? 5 : phase === "imminent" ? 3.4 : phase === "final" ? 2.8 : 1;
    hue.value = (hue.value + hue.speed * boost * dt) % 360;
  } else {
    // ease toward the locked hue
    let d = ((hue.locked - hue.value + 540) % 360) - 180;
    hue.value = (hue.value + d * Math.min(1, dt * 4) + 360) % 360;
  }
  const r = document.documentElement.style;
  r.setProperty("--h", hue.value.toFixed(1));
  r.setProperty("--h2", ((hue.value + 42) % 360).toFixed(1));
  r.setProperty("--h3", ((hue.value + 178) % 360).toFixed(1));
}
document.querySelectorAll(".hue-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".hue-btn").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    const v = btn.dataset.hue;
    if (v === "auto") hue.mode = "auto";
    else { hue.mode = "locked"; hue.locked = parseFloat(v); }
  });
});

/* ---------------- menace ゴ field ---------------- */
(function menaces() {
  const field = $("#menaceField");
  const glyphs = ["ゴ", "ゴ", "ゴ", "ッ", "！"];
  for (let i = 0; i < 14; i++) {
    const s = document.createElement("span");
    s.textContent = glyphs[i % glyphs.length];
    s.style.left = Math.random() * 96 + "%";
    s.style.top = Math.random() * 96 + "%";
    s.style.fontSize = 26 + Math.random() * 84 + "px";
    s.style.setProperty("--rot", (Math.random() * 40 - 20).toFixed(1) + "deg");
    s.style.animationDelay = (-Math.random() * 16).toFixed(1) + "s";
    s.style.animationDuration = (12 + Math.random() * 10).toFixed(1) + "s";
    field.appendChild(s);
  }
})();

/* ---------------- dust canvas ---------------- */
(function dust() {
  if (REDUCED) return;
  const cv = $("#dust"), ctx = cv.getContext("2d");
  let W, H, parts;
  const resize = () => {
    W = cv.width = innerWidth * devicePixelRatio;
    H = cv.height = innerHeight * devicePixelRatio;
    parts = Array.from({ length: Math.min(90, innerWidth / 14) }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: (Math.random() * 1.8 + .5) * devicePixelRatio,
      vx: (Math.random() * -.5 - .12) * devicePixelRatio,
      vy: (Math.random() * -.32 - .05) * devicePixelRatio,
      o: Math.random() * .5 + .15,
    }));
  };
  resize();
  addEventListener("resize", resize);
  (function draw() {
    ctx.clearRect(0, 0, W, H);
    const h = hue.value;
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < -5) p.x = W + 5; if (p.y < -5) p.y = H + 5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 7);
      ctx.fillStyle = `hsla(${(h + p.o * 90) % 360},85%,65%,${p.o * .5})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  })();
})();

/* ---------------- digit renderer ---------------- */
function renderDigits(el, value, pad) {
  const str = String(value).padStart(pad, "0");
  if (el.childElementCount !== str.length) {
    el.innerHTML = "";
    for (const ch of str) {
      const d = document.createElement("span");
      d.className = "digit"; d.textContent = ch;
      el.appendChild(d);
    }
    return;
  }
  [...el.children].forEach((d, i) => {
    if (d.textContent !== str[i]) {
      d.textContent = str[i];
      if (!REDUCED) {
        d.classList.remove("tick");
        void d.offsetWidth;
        d.classList.add("tick");
      }
    }
  });
}

/* ---------------- timezone helpers ---------------- */
const ZONES = [
  { city: "YOUR AREA", tz: Intl.DateTimeFormat().resolvedOptions().timeZone, you: true },
  { city: "TOKYO", tz: "Asia/Tokyo" },
  { city: "LOS ANGELES", tz: "America/Los_Angeles" },
  { city: "NEW YORK", tz: "America/New_York" },
  { city: "LONDON", tz: "Europe/London" },
  { city: "PARIS", tz: "Europe/Paris" },
  { city: "SYDNEY", tz: "Australia/Sydney" },
];
const fmtIn = (tz, opts) => new Intl.DateTimeFormat("en-US", { timeZone: tz, ...opts });
function fmtClock(tz, withSec = true) {
  const opts = { hour: "2-digit", minute: "2-digit", hour12: false };
  if (withSec) opts.second = "2-digit";
  return fmtIn(tz, opts).format(new Date());
}
function tzOffsetLabel(tz) {
  const dtf = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "longOffset" });
  const part = dtf.formatToParts(new Date()).find((p) => p.type === "timeZoneName");
  return part ? part.value.replace("GMT", "UTC") : "";
}
function tzAbbr(tz) {
  const part = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "short" })
    .formatToParts(new Date()).find((p) => p.type === "timeZoneName");
  return part ? part.value : "";
}

/* ---------------- build zone cards ---------------- */
(function buildZones() {
  const grid = $("#zoneGrid");
  for (const z of ZONES) {
    const card = document.createElement("div");
    card.className = "zone-card" + (z.you ? " is-you" : "");
    card.innerHTML =
      `<span class="zone-city">${z.city}${z.you ? '<i class="you-tag">YOU</i>' : ""}</span>` +
      `<span class="zone-drop" data-drop="${z.tz}">—</span>` +
      `<span class="zone-day" data-day="${z.tz}">—</span>` +
      `<span class="zone-now" data-now="${z.tz}">--:--:--</span>`;
    grid.appendChild(card);
  }
})();
function refreshZones() {
  document.querySelectorAll("[data-drop]").forEach((el) => {
    const tz = el.dataset.drop;
    el.textContent = fmtIn(tz, { hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(TARGET));
  });
  document.querySelectorAll("[data-day]").forEach((el) => {
    const tz = el.dataset.day;
    el.textContent = fmtIn(tz, { weekday: "long", month: "short", day: "numeric" }).format(new Date(TARGET)).toUpperCase() + " · " + tzOffsetLabel(tz);
  });
}
function refreshZoneClocks() {
  document.querySelectorAll("[data-now]").forEach((el) => { el.textContent = fmtClock(el.dataset.now) + " local"; });
}

/* ---------------- local (visitor) info + geolocation ---------------- */
const myTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
(function localCard() {
  const when = fmtIn(myTz, { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(TARGET));
  $("#localWhen").textContent = when;
  $("#localTz").textContent = `${myTz} · ${tzOffsetLabel(myTz)} · ${tzAbbr(myTz)} — computed from your device clock`;
  $("#tzPill").textContent = `${tzAbbr(myTz)} ${fmtClock(myTz, false)}`;
  // geo enrichment (best effort, silent fallback)
  const ctl = new AbortController();
  const to = setTimeout(() => ctl.abort(), 6000);
  fetch("https://ipapi.co/json/", { signal: ctl.signal })
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((g) => {
      clearTimeout(to);
      if (!g || g.error) throw 0;
      $("#localFlag").textContent = flagEmoji(g.country_code);
      $("#localPlace").textContent = `${g.city || g.region || "Your area"}, ${g.country_name || ""} — EP2 lands at`;
    })
    .catch(() => {
      clearTimeout(to);
      const city = (myTz.split("/").pop() || "Your area").replace(/_/g, " ");
      $("#localPlace").textContent = `${city} (from device timezone) — EP2 lands at`;
    });
  function flagEmoji(cc) {
    if (!cc || cc.length !== 2) return "🌐";
    return String.fromCodePoint(...[...cc.toUpperCase()].map((c) => 127397 + c.charCodeAt(0)));
  }
})();

/* ---------------- countdown core ---------------- */
const els = {
  d: $("#u-days"), h: $("#u-hours"), m: $("#u-mins"), s: $("#u-secs"),
  msFill: $("#msFill"), msNum: $("#msNum"),
  progFill: $("#progFill"), progPct: $("#progressPct"),
  label: $("#cdLabelEn"), labelJp: $("#cdLabelJp"), live: $("#liveBadge"), now: $("#localNow"), tzPill: $("#tzPill"),
};
let lastSec = -1, lastPhase = "";

function phaseFor(msLeft) {
  if (msLeft <= 0) return "live";
  if (msLeft < 3600e3) return "imminent";
  if (msLeft < 86400e3) return "final";
  if (msLeft < 7 * 86400e3) return "close";
  return "calm";
}

function updateCountdown(nowMs) {
  let diff = TARGET - nowMs;
  const live = diff <= 0;
  if (live) diff = -diff;

  const secs = Math.floor(diff / 1000);
  const d = Math.floor(secs / 86400);
  const h = Math.floor(secs / 3600) % 24;
  const m = Math.floor(secs / 60) % 60;
  const s = secs % 60;

  if (secs !== lastSec) {
    lastSec = secs;
    renderDigits(els.d, d, d > 99 ? 3 : 2);
    renderDigits(els.h, h, 2);
    renderDigits(els.m, m, 2);
    renderDigits(els.s, s, 2);
    refreshZoneClocks();
    els.now.textContent = fmtClock(myTz);
    els.tzPill.textContent = `${tzAbbr(myTz)} ${fmtClock(myTz, false)}`;
    document.title = live
      ? `🏇 NOW STREAMING — SBR EP2 (2nd STAGE)`
      : `${d}d ${h}h ${m}m ${s}s — SBR EP2 COUNTDOWN`;
  }

  // millisecond sweep + spinning ball
  const ms = diff % 1000;
  els.msFill.style.width = (ms / 10).toFixed(1) + "%";
  els.msNum.textContent = "." + String(ms).padStart(3, "0");
  document.querySelector(".ms-ball").style.transform = `rotate(${(ms * 0.36).toFixed(0)}deg)`;

  // phase
  const phase = phaseFor(TARGET - nowMs);
  if (phase !== lastPhase) {
    lastPhase = phase;
    document.body.dataset.phase = phase;
    if (phase === "live") {
      els.live.hidden = false;
      els.label.textContent = "SINCE THE 2nd STAGE BEGAN — RIDE!";
      els.labelJp.textContent = "配信中！走り出せ！";
    } else {
      els.label.textContent = "UNTIL EPISODE 2 DROPS IN YOUR TIMEZONE";
      els.labelJp.textContent = "配信開始まで";
    }
  }

  // progress 1st STAGE -> 2nd STAGE
  const total = TARGET - EP1;
  const done = Math.min(1, Math.max(0, (nowMs - EP1) / total));
  els.progFill.style.width = (done * 100).toFixed(3) + "%";
  els.progPct.textContent = (done * 100).toFixed(2) + "%";
}

/* ---------------- main loop ---------------- */
let prev = performance.now();
function loop(t) {
  const dt = Math.min(.1, (t - prev) / 1000);
  prev = t;
  updateCountdown(Date.now());
  hueTick(dt, document.body.dataset.phase);
  requestAnimationFrame(loop);
}
refreshZones();
updateCountdown(Date.now());
requestAnimationFrame(loop);
setInterval(refreshZones, 60e3); // DST safety

/* ---------------- trailer modal ---------------- */
const dlg = $("#player"), frame = $("#playerFrame");
document.querySelectorAll(".trailer-card").forEach((card) => {
  card.addEventListener("click", () => {
    const id = card.dataset.yt;
    frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0"
      title="Steel Ball Run trailer" allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
      allowfullscreen></iframe>`;
    dlg.showModal();
  });
});
function closePlayer() { dlg.close(); }
$("#playerClose").addEventListener("click", closePlayer);
dlg.addEventListener("close", () => { frame.innerHTML = ""; });
dlg.addEventListener("click", (e) => { if (e.target === dlg) closePlayer(); });

/* ---------------- add to calendar (.ics) ---------------- */
$("#icsBtn").addEventListener("click", () => {
  const stamp = (ms) => new Date(ms).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//SBRCOUNTDOWN//EP2//EN", "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:sbr-ep2-" + TARGET + "@sbrcountdown",
    "DTSTAMP:" + stamp(Date.now()),
    "DTSTART:" + stamp(TARGET),
    "DTEND:" + stamp(TARGET + 30 * 60e3),
    "SUMMARY:STEEL BALL RUN EP2 — 2nd STAGE drops on Netflix",
    "DESCRIPTION:The Sheriff's Request to Mountain Tim. 2nd & 3rd STAGE begins\\, weekly Fridays. Nyo-ho-ho!",
    "LOCATION:Netflix (worldwide)",
    "BEGIN:VALARM", "TRIGGER:-PT60M", "ACTION:DISPLAY", "DESCRIPTION:SBR EP2 in one hour!", "END:VALARM",
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  a.download = "sbr-episode-2-countdown.ics";
  a.click();
  URL.revokeObjectURL(a.href);
});
