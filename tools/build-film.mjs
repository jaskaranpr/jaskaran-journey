#!/usr/bin/env node
// Builds the film's sound from story.js: the narration (macOS `say`, or your own recordings),
// an original synthesized score that follows the scenes, and timeline.js with every scene and line time.
//
//   node tools/build-film.mjs            VOICE=Aman RATE=168 by default
//
// To use your own voice, drop recordings in narration/<sceneId>-<lineIndex>.(wav|m4a|mp3|aiff), e.g. narration/village-0.m4a.
// Needs ffmpeg on PATH. Writes timeline.js and audio/film.mp3.
import {execFileSync, spawnSync} from 'node:child_process';
import {readFileSync, writeFileSync, existsSync, mkdirSync, mkdtempSync, rmSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {tmpdir} from 'node:os';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SR = 44100, VOICE = process.env.VOICE || 'Aman', RATE = process.env.RATE || '168';
const TMP = mkdtempSync(join(tmpdir(), 'film-'));
const sh = (cmd, args) => execFileSync(cmd, args, {maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'pipe']});
const ffmpegLog = args => spawnSync('ffmpeg', ['-hide_banner', ...args], {encoding: 'utf8', maxBuffer: 1 << 26}).stderr;
const r2 = x => Math.round(x * 100) / 100;

const box = {window: {}};
vm.runInNewContext(readFileSync(join(ROOT, 'story.js'), 'utf8'), box);
const STORY = box.window.STORY;

// ---------- voice ----------

const seconds = file => +sh('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]);

// Aman sometimes drops the end of a line (good takes are identical, bad ones are random),
// so keep rendering until one length shows up twice.
function tts(text, file) {
  const takes = [];
  for (let n = 0; n < 8; n++) {
    const f = `${file}.${n}.aiff`;
    sh('say', ['-v', VOICE, '-r', RATE, '-o', f, text]);
    const d = seconds(f);
    if (takes.some(t => Math.abs(t.d - d) < .01)) return f;
    takes.push({d, f});
  }
  return takes.reduce((a, b) => b.d > a.d ? b : a).f; // no two agreed: keep the longest
}

// One narration line: trimmed, cleaned, mono 44.1 kHz samples.
function voiceLine(id, i, text) {
  const src = ['wav', 'm4a', 'mp3', 'aiff'].map(e => join(ROOT, 'narration', `${id}-${i}.${e}`)).find(existsSync) ||
    tts(text, join(TMP, `${id}-${i}`));
  const trim = 'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03';
  const chain = `${trim},areverse,${trim},areverse,highpass=f=70,equalizer=f=3000:t=q:w=1.2:g=2,` +
    'acompressor=threshold=-20dB:ratio=3:attack=5:release=90:makeup=2,aecho=0.9:0.9:23|41:0.06|0.035';
  const raw = sh('ffmpeg', ['-v', 'error', '-i', src, '-af', chain, '-ac', '1', '-ar', String(SR), '-f', 'f32le', 'pipe:1']);
  return new Float32Array(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.length));
}

// Lay the lines out: lead, lines with gaps, tail. Scenes are back to back.
const GAP = .55;
let clock = 0;
const film = STORY.map(s => {
  const [lead = 1, tail = 1.9] = s.hold || [], start = clock, lines = [];
  let c = start + lead;
  s.lines.forEach((l, i) => {
    const pcm = voiceLine(s.id, i, l.say || l.text), a = r2(c), b = r2(c + pcm.length / SR);
    lines.push({start: a, end: b, pcm});
    c = b + GAP;
  });
  const end = r2(Math.max(start + 5, (lines.at(-1)?.end ?? start + lead) + tail));
  clock = end;
  return {id: s.id, cut: s.cut, mood: s.mood, start, dur: r2(end - start), end, lines};
});
const DURATION = clock, N = Math.round(DURATION * SR);

const voice = new Float32Array(N);
for (const s of film) for (const l of s.lines) {
  const k0 = Math.round(l.start * SR);
  voice.set(l.pcm.subarray(0, N - k0), k0);
}

// ---------- score: D major / B minor, 92 BPM ----------

let seed = 92;
const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
const TAU = 2 * Math.PI, BEAT = 60 / 92, BAR = 4 * BEAT;
const hz = m => 440 * 2 ** ((m - 69) / 12);
const panGains = p => [Math.cos(p * Math.PI / 2), Math.sin(p * Math.PI / 2)];

// dry stereo + mono reverb send for the whole film
const G = {l: new Float32Array(N), r: new Float32Array(N), s: new Float32Array(N), n: N};

const CH = { // pad voicing, bass note, tones for plucks and arpeggios
  Bm: {bass: 35, pad: [54, 59, 62, 66], tones: [59, 62, 66, 71, 74, 78]},
  G: {bass: 31, pad: [55, 59, 62, 67], tones: [55, 59, 62, 67, 71, 74]},
  D: {bass: 38, pad: [54, 57, 62, 66], tones: [57, 62, 66, 69, 74, 78]},
  A: {bass: 33, pad: [52, 57, 61, 64], tones: [57, 61, 64, 69, 73, 76]},
};
const PROG = {night: ['Bm', 'G'], resolve: ['G', 'D', 'A', 'D']}, DEFAULT_PROG = ['Bm', 'G', 'D', 'A'];
const MOTIF = { // [beat, note, beats] over each chord
  Bm: [[0, 78, 1.5], [1.5, 76, .5], [2, 74, 2]],
  G: [[0, 74, 1.5], [1.5, 76, .5], [2, 71, 2]],
  D: [[0, 73, 1], [1, 74, 1], [2, 69, 2]],
  A: [[0, 69, 1.5], [1.5, 71, .5], [2, 73, 2]],
};
const PLUCK = [0, 2, 3, 2, 4, 2, 3, 1];
const MOOD = {
  intro: {bars: 2, pad: .5, cut: [600, 900], drone: .5, piano: 'sparse', att: 2.2},
  wonder: {bars: 2, pad: .45, cut: [900, 1300], drone: .3, piano: 'motif', bells: .5, att: 1.6},
  pulse: {bars: 1, pad: .35, cut: [1000, 1500], pluck: .5, bass: .22, piano: 'sparse', att: .8},
  lift: {bars: 1, pad: .55, cut: [1700, 2300], pluck: .5, bass: .26, piano: 'high', bells: .4, att: .7},
  build: {bars: 1, pad: .5, cut: [1300, 2400], pluck: .55, bass: .3, kick: .55, piano: 'sparse', att: .6, ramp: true},
  peak: {bars: 1, pad: .75, cut: [2200, 3000], pluck: .65, bass: .34, kick: .75, piano: 'high', bells: .5, att: .5},
  drop: {},
  bloom: {bars: 1, pad: .5, cut: [1800, 2400], pluck: .32, bass: .26, kick: .3, piano: 'arp', bells: .45, att: .9},
  night: {bars: 2, pad: .3, cut: [550, 800], drone: .35, piano: 'slow', att: 2},
  resolve: {bars: 2, pad: .45, cut: [1100, 1500], drone: .35, piano: 'motif', bells: .35, att: 1.8},
  end: {},
};

// band-limited saw wavetables for the string pad (fewer harmonics for high notes)
const TW = 4096;
function sawTable(h) {
  const t = new Float32Array(TW + 1);
  for (let k = 1; k <= h; k++) for (let i = 0; i <= TW; i++) t[i] += Math.sin(TAU * k * i / TW) / k;
  const peak = t.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
  return t.map(v => v / peak);
}
const SAW = sawTable(40), SAW_HI = sawTable(16);
const VIB = Float32Array.from({length: N + 4 * SR}, (_, k) => Math.sin(TAU * 5.1 * k / SR));

// felt piano: inharmonic partials with soft attack and per-partial decay
function piano(bus, t, m, vel, dur = 2, send = .3) {
  const f = hz(m), k0 = Math.round(t * SR), [pl, pr] = panGains(.5 + (m - 66) / 70), rel = Math.round(dur * SR);
  const len = Math.min(Math.round((dur + 3) * SR), bus.n - k0);
  for (let p = 1; p <= 8; p++) {
    const fp = f * p * Math.sqrt(1 + 4e-4 * p * p);
    if (fp > 8000) break;
    const w = TAU * fp / SR, c = 2 * Math.cos(w), decay = Math.exp(-(1 + .55 * p) * (f / 220) ** .4 / SR), damper = decay * Math.exp(-10 / SR);
    let y1 = -Math.sin(w), y2 = -Math.sin(2 * w), a = vel * p ** -1.8;
    for (let n = 0; n < len && a > 1e-5; n++) {
      const y = c * y1 - y2; y2 = y1; y1 = y;
      const v = y * a * (n < 260 ? n / 260 : 1), k = k0 + n;
      a *= n < rel ? decay : damper;
      if (k < 0) continue;
      bus.l[k] += v * pl; bus.r[k] += v * pr; bus.s[k] += v * send;
    }
  }
}

// Karplus-Strong pluck with a fractional delay so it stays in tune with the pad
function pluck(bus, t, m, vel, pan) {
  const f = hz(m), per = SR / f - .5, P = Math.floor(per), fr = per - P, M = P + 2, ring = new Float64Array(M);
  let lp = 0;
  for (let i = 0; i < M; i++) { lp += .4 * (rnd() * 2 - 1 - lp); ring[i] = lp; }
  const decay = .12 ** (1 / f), k0 = Math.round(t * SR), len = Math.min(Math.round(1.4 * SR), bus.n - k0), [a, b] = panGains(pan);
  let w = 0, prev = 0, out = 0;
  for (let n = 0; n < len; n++) {
    const x = (1 - fr) * ring[(w - P + M) % M] + fr * ring[(w - P - 1 + M) % M], y = decay * .5 * (x + prev);
    prev = x; ring[w] = y; w = (w + 1) % M;
    out += .45 * (y - out);
    const k = k0 + n;
    if (k < 0) continue;
    const v = out * vel;
    bus.l[k] += v * a; bus.r[k] += v * b; bus.s[k] += v * .25;
  }
}

function kick(bus, t, amp) {
  const k0 = Math.round(t * SR), len = Math.min(Math.round(.5 * SR), bus.n - k0);
  let ph = 0;
  for (let n = 0; n < len; n++) {
    const tt = n / SR;
    ph += TAU * (46 + 74 * Math.exp(-tt * 30)) / SR;
    const v = (Math.sin(ph) * Math.exp(-tt * 7) + (n < 130 ? (rnd() * 2 - 1) * .25 * (1 - n / 130) : 0)) * amp, k = k0 + n;
    if (k >= 0) { bus.l[k] += v; bus.r[k] += v; }
  }
}

function bassNote(bus, t0, t1, m, amp) {
  const f = hz(m), k0 = Math.round(t0 * SR), k1 = Math.round(t1 * SR), len = Math.min(k1 - k0 + Math.round(.4 * SR), bus.n - k0);
  let ph = 0;
  for (let n = 0; n < len; n++) {
    const k = k0 + n, env = Math.min(1, n / 900) * (k < k1 ? 1 : Math.exp(-(k - k1) / (.09 * SR)));
    ph += TAU * f / SR;
    const v = (Math.sin(ph) + .35 * Math.sin(2 * ph) + .12 * Math.sin(3 * ph)) * amp * env;
    bus.l[k] += v; bus.r[k] += v;
  }
}

// three detuned saws, slow attack, linear release; written to a pad bus that gets filtered later
function padNote(P, t0, t1, m, amp, att, rel = 1.6) {
  const k0 = Math.round(t0 * SR), k1 = Math.round(t1 * SR), A = att * SR, R = rel * SR, end = Math.min(k1 + R, P.n);
  [-7, 0, 7].forEach((cents, v) => {
    const f = hz(m) * 2 ** (cents / 1200), tab = f < 500 ? SAW : SAW_HI, inc = f / SR * TW, [a, b] = panGains([.15, .5, .85][v]);
    let ph = rnd() * TW;
    for (let k = Math.max(0, k0); k < end; k++) {
      const n = k - k0, env = (n < A ? Math.sin(n / A * Math.PI / 2) ** 2 : 1) * (k < k1 ? 1 : 1 - (k - k1) / R);
      ph += inc * (1 + .0011 * VIB[k]);
      if (ph >= TW) ph -= TW;
      const i = ph | 0, s = (tab[i] + (tab[i + 1] - tab[i]) * (ph - i)) * amp * env;
      P.l[k] += s * a; P.r[k] += s * b;
    }
  });
}

// Chamberlin state-variable lowpass; cutoff sweeps c0 → c1 over the first `span` samples
function lowpass(x, c0, c1, span, damp = 1.25) {
  let low = 0, band = 0;
  for (let i = 0; i < x.length; i++) {
    const fc = c0 + (c1 - c0) * Math.min(1, i / span), f = 2 * Math.sin(Math.PI * fc / SR);
    low += f * band;
    band += f * (x[i] - low - damp * band);
    x[i] = low;
  }
}

// D pedal with a slow sub swell
function drone(bus, t0, t1, amp) {
  const k0 = Math.round(t0 * SR), k1 = Math.min(Math.round(t1 * SR), bus.n), F = 2 * SR;
  for (let k = k0; k < k1; k++) {
    const t = k / SR, env = Math.min(1, (k - k0) / F, (k1 - k) / F) * (.6 + .4 * Math.sin(TAU * t / 9 - Math.PI / 2));
    const v = (Math.sin(TAU * 36.71 * t) * .55 + Math.sin(TAU * 73.42 * t) * .5 + Math.sin(TAU * 146.83 * t) * .1) * amp * env;
    bus.l[k] += v; bus.r[k] += v;
  }
}

const BELL = [[1, 1, 2.6], [2.76, .38, 1.3], [5.4, .16, .6], [8.93, .06, .3]]; // ratio, level, decay (s)
function bell(bus, t, m, amp, pan = .5, send = .75) {
  const f = hz(m), k0 = Math.round(t * SR), len = Math.min(5 * SR, bus.n - k0), [a, b] = panGains(pan);
  for (const [ratio, level, d] of BELL) {
    const fp = f * ratio;
    if (fp > 16000) continue;
    const w = TAU * fp / SR, c = 2 * Math.cos(w), g = Math.exp(-1 / (d * SR));
    let y1 = -Math.sin(w), y2 = -Math.sin(2 * w), e = amp * level;
    for (let n = 0; n < len; n++) {
      const y = c * y1 - y2; y2 = y1; y1 = y; e *= g;
      const k = k0 + n;
      if (k < 0) continue;
      const v = y * e * (n < 130 ? n / 130 : 1);
      bus.l[k] += v * a; bus.r[k] += v * b; bus.s[k] += v * send;
    }
  }
}

// band-passed noise rising f0 → f1, ending at tEnd (risers and whooshes)
function sweep(bus, tEnd, T, amp, f0, f1, curve = 2.2, send = .5) {
  const k0 = Math.round((tEnd - T) * SR), len = Math.round(T * SR), st = [[0, 0], [0, 0]];
  for (let n = 0; n < len; n++) {
    const k = k0 + n;
    if (k < 0 || k >= bus.n) continue;
    const x = n / len, f = 2 * Math.sin(Math.PI * Math.min(f0 * (f1 / f0) ** x, 7000) / SR), e = amp * x ** curve;
    for (let c = 0; c < 2; c++) {
      const s = st[c];
      s[0] += f * s[1];
      s[1] += f * (rnd() * 2 - 1 - s[0] - .7 * s[1]);
      const v = s[1] * e;
      (c ? bus.r : bus.l)[k] += v; bus.s[k] += v * send * .5;
    }
  }
}

// rising sines that vanish exactly on the cut
function shimmerRise(bus, tEnd, T, amp, notes) {
  const k0 = Math.round((tEnd - T) * SR), len = Math.round(T * SR);
  notes.forEach((m, j) => {
    const w = TAU * hz(m) / SR, [a, b] = panGains(.25 + .25 * j);
    for (let n = 0; n < len; n++) {
      const k = k0 + n;
      if (k < 0 || k >= bus.n) continue;
      const v = Math.sin(w * n) * amp * (n / len) ** 3;
      bus.l[k] += v * a; bus.r[k] += v * b; bus.s[k] += v * .9;
    }
  });
}

function impact(t, amp, low = 32, high = 90, decay = 1.6) {
  const k0 = Math.round(t * SR), len = Math.min(Math.round(2.6 * SR), N - k0);
  let ph = 0, lp = 0;
  for (let n = 0; n < len; n++) {
    const tt = n / SR;
    ph += TAU * (low + (high - low) * Math.exp(-tt * 3.2)) / SR;
    lp += .03 * (rnd() * 2 - 1 - lp);
    const v = (Math.sin(ph) * Math.exp(-tt * decay) + lp * 4 * Math.exp(-tt * 14)) * amp, k = k0 + n;
    G.l[k] += v; G.r[k] += v; G.s[k] += v * .3;
  }
}

function birds(t0, t1, amp, every = 1.6) {
  for (let t = t0 + .6 + rnd(); t < t1 - .6; t += every * (.5 + rnd() * 1.4)) {
    const [a, b] = panGains(.15 + rnd() * .7), count = 2 + (rnd() * 3 | 0), base = 2600 + rnd() * 1800;
    for (let c = 0; c < count; c++) {
      const k0 = Math.round((t + c * (.09 + rnd() * .07)) * SR), d = Math.round((.045 + rnd() * .06) * SR), up = rnd() > .5;
      let ph = 0;
      for (let n = 0; n < d; n++) {
        const x = n / d, f = base * (up ? .8 + .5 * x : 1.25 - .45 * x) + 260 * Math.sin(TAU * 38 * n / SR), k = k0 + n;
        ph += TAU * f / SR;
        if (k >= N) break;
        const v = Math.sin(ph) * Math.sin(Math.PI * x) ** 2 * amp;
        G.l[k] += v * a; G.r[k] += v * b; G.s[k] += v * .3;
      }
    }
  }
}

// soft wind: band-limited noise with a slow breath
function air(t0, t1, amp, rise = false) {
  const k0 = Math.round(t0 * SR), k1 = Math.min(Math.round(t1 * SR), N), F = 1.5 * SR;
  let l1 = 0, l2 = 0, r1 = 0, rr2 = 0;
  for (let k = k0; k < k1; k++) {
    l1 += .08 * (rnd() * 2 - 1 - l1); l2 += .004 * (l1 - l2);
    r1 += .08 * (rnd() * 2 - 1 - r1); rr2 += .004 * (r1 - rr2);
    const x = (k - k0) / (k1 - k0), env = Math.min(1, (k - k0) / F, (k1 - k) / F) * (.7 + .3 * Math.sin(TAU * k / SR / 7)) * amp * (rise ? .4 + x : 1);
    G.l[k] += (l1 - l2) * env; G.r[k] += (r1 - rr2) * env;
  }
}

// Consecutive scenes with the same mood play as one continuous section.
const sections = [];
for (const s of film) {
  const last = sections.at(-1);
  if (last && last.mood === s.mood) last.end = s.end;
  else sections.push({mood: s.mood, cut: s.cut, start: s.start, end: s.end});
}
sections.forEach((sec, i) => { sec.hardEnd = i < sections.length - 1 && sections[i + 1].cut !== 'fade'; });

function renderSection(sec) {
  const m = MOOD[sec.mood], len = sec.end - sec.start, base = Math.round(sec.start * SR);
  const n = Math.min(Math.round((len + 3) * SR), N - base);
  const B = {l: new Float32Array(n), r: new Float32Array(n), s: new Float32Array(n), n}, P = {l: new Float32Array(n), r: new Float32Array(n), n};
  let cut = m.cut || [1600, 1600];

  if (sec.mood === 'drop') {
    // the music stops; a faint high air, then a swell as the figure lands
    padNote(P, 0, len, 86, .004, 1.5, .5);
    padNote(P, 0, len, 93, .003, 1.5, .5);
    for (const note of [50, 54, 57, 64, 66]) padNote(P, len - 2.3, len, note, .028, 2.2, .3);
    shimmerRise(B, len, 2.2, .018, [86, 90, 93]);
    cut = [2600, 2600];
  } else if (sec.mood === 'end') {
    // one long D major chord to close
    for (const note of [50, 54, 57, 62, 66, 69]) padNote(P, 0, len, note, .016, 1.4, .1);
    [38, 45, 50, 54, 57, 62].forEach((note, i) => piano(B, .05 + i * .06, note, .13, len, .4));
    bell(B, .1, 86, .05, .35);
    bell(B, .9, 93, .035, .65);
    drone(B, 0, len + 1, .25);
    cut = [1700, 1700];
  } else {
    const prog = PROG[sec.mood] || DEFAULT_PROG, chordLen = m.bars * BAR, beats = m.bars * 4;
    const ramp = t => m.ramp ? .7 + .3 * t / len : 1;
    for (let c = 0; c * chordLen < len; c++) {
      const t0 = c * chordLen, t1 = Math.min(len, t0 + chordLen), name = prog[c % prog.length], ch = CH[name];
      for (const note of ch.pad) padNote(P, t0, t1, note, m.pad * .03, m.att);
      if (m.bass) bassNote(B, t0, t1, ch.bass, m.bass);
      if (m.pluck) for (let e = 0; e < beats * 2; e++) {
        const te = t0 + e * BEAT / 2;
        if (te < len) pluck(B, te, ch.tones[PLUCK[e % 8]], m.pluck * (e % 2 ? .6 : 1) * ramp(te), e % 2 ? .38 : .62);
      }
      if (m.kick) for (let b = 0; b < beats; b += 2) if (t0 + b * BEAT < len) kick(B, t0 + b * BEAT, m.kick * ramp(t0));
      if (m.bells) for (let b = 1; b < beats; b += 2) if (rnd() < .6 && t0 + b * BEAT < len) bell(B, t0 + b * BEAT, ch.tones[2 + (rnd() * 4 | 0)] + 12, .05 * m.bells, .2 + rnd() * .6);
      if (m.piano === 'sparse') for (let b = 0; b < beats; b += 4) {
        piano(B, t0 + b * BEAT, ch.tones[2 + (rnd() * 3 | 0)], .14, 1.6);
        if (t0 + (b + 2.5) * BEAT < len) piano(B, t0 + (b + 2.5) * BEAT, ch.tones[3 + (rnd() * 3 | 0)], .1, 1.2);
      }
      if (m.piano === 'motif' || m.piano === 'high') {
        const up = m.piano === 'high' ? 12 : 0;
        piano(B, t0, ch.bass + 24, .1, chordLen);
        for (const [b, note, d] of MOTIF[name]) if (t0 + b * m.bars * BEAT < len) piano(B, t0 + b * m.bars * BEAT, note + up, up ? .13 : .17, d * m.bars * BEAT);
      }
      if (m.piano === 'arp') for (let e = 0; e < beats * 2; e++) {
        const te = t0 + e * BEAT / 2, i = e % 12;
        if (te < len) piano(B, te, ch.tones[i < 6 ? i : 11 - i], .07, .4, .4);
      }
      if (m.piano === 'slow') piano(B, t0, ch.tones[1 + (rnd() * 2 | 0)] - 12, .12, 3);
    }
    if (m.drone) drone(B, 0, len, m.drone);
    if (sec.mood === 'peak') sweep(B, len, 3.6, .1, 200, 5000);
  }

  for (const x of [P.l, P.r]) lowpass(x, cut[0], cut[1], Math.round(len * SR));
  for (let k = 0; k < n; k++) { B.l[k] += P.l[k]; B.r[k] += P.r[k]; B.s[k] += (P.l[k] + P.r[k]) * .25; }
  if (sec.hardEnd) { // hard cut: stop the dry sound on the boundary (the reverb keeps ringing)
    const kb = Math.round(len * SR), fade = 600;
    for (const x of [B.l, B.r, B.s]) for (let k = Math.max(0, kb - fade); k < n; k++) x[k] *= k < kb ? (kb - k) / fade : 0;
  }
  for (let k = 0; k < n; k++) { G.l[base + k] += B.l[k]; G.r[base + k] += B.r[k]; G.s[base + k] += B.s[k]; }
}
sections.forEach(renderSection);

// dip the music into black cuts
for (const s of film.slice(1)) if (s.cut === 'black') {
  const kb = Math.round(s.start * SR);
  for (let k = kb - Math.round(.45 * SR); k < kb + Math.round(.5 * SR); k++) {
    const t = (k - kb) / SR, g = t < -.05 ? 1 - .9 * (t + .45) / .4 : t < 0 ? .1 : .1 + .9 * t / .5;
    G.l[k] *= g; G.r[k] *= g; G.s[k] *= g;
  }
}

// transition sounds and ambience
film.forEach((s, i) => {
  if (!i) return;
  if (s.cut === 'cut') impact(s.start, .55);
  if (s.cut === 'black') impact(s.start, .6, 28, 70, 1.1);
  if (s.cut === 'white') {
    sweep(G, s.start, 1.5, .09, 500, 8000, 2.4, .6);
    shimmerRise(G, s.start, 1.5, .012, [86, 90, 93]);
    bell(G, s.start, 86, .03, .4, .9);
    bell(G, s.start + .05, 93, .02, .6, .9);
  }
});
const scene = id => film.find(s => s.id === id);
for (const id of ['village', 'home']) { air(scene(id).start, scene(id).end, .12); birds(scene(id).start, scene(id).end, .012, id === 'home' ? 2.4 : 1.4); }
air(scene('leap').start, scene('leap').end, .22, true);

// Freeverb: 8 damped combs + 4 allpasses per channel, right channel spread by 23 samples
function freeverb(input, room = .86, damp = .32) {
  const fb = room * .28 + .7, d1 = damp * .4, d2 = 1 - d1, pre = Math.round(.025 * SR);
  return [0, 23].map(spread => {
    const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map(t => ({b: new Float32Array(t + spread), i: 0, z: 0}));
    const aps = [556, 441, 341, 225].map(t => ({b: new Float32Array(t + spread), i: 0}));
    const out = new Float32Array(input.length);
    for (let n = 0; n < input.length; n++) {
      const x = (n >= pre ? input[n - pre] : 0) * .015;
      let sum = 0;
      for (const c of combs) {
        const y = c.b[c.i];
        c.z = y * d2 + c.z * d1;
        c.b[c.i] = x + c.z * fb;
        if (++c.i === c.b.length) c.i = 0;
        sum += y;
      }
      for (const a of aps) {
        const y = a.b[a.i];
        a.b[a.i] = sum + y * .5;
        sum = y - sum;
        if (++a.i === a.b.length) a.i = 0;
      }
      out[n] = sum;
    }
    return out;
  });
}
const [wetL, wetR] = freeverb(G.s);

const rms = (a, from = 0, to = a.length) => { let s = 0; for (let k = from; k < to; k++) s += a[k] * a[k]; return Math.sqrt(s / Math.max(1, to - from)); };
const kWet = .6 * rms(G.l) / (rms(wetL) || 1);
const music = [new Float32Array(N), new Float32Array(N)];
const fadeK = Math.round(1.5 * SR);
let peak = 0;
for (let k = 0; k < N; k++) {
  const g = k > N - fadeK ? Math.cos((k - (N - fadeK)) / fadeK * Math.PI / 2) : 1;
  music[0][k] = (G.l[k] + wetL[k] * kWet) * g;
  music[1][k] = (G.r[k] + wetR[k] * kWet) * g;
  peak = Math.max(peak, Math.abs(music[0][k]), Math.abs(music[1][k]));
}
for (const ch of music) for (let k = 0; k < N; k++) ch[k] = Math.tanh(ch[k] * 1.15 / peak) / Math.tanh(1.15);

// levels: speech at about -20 dBFS RMS, music bed 6 dB under it (ducked a further ~8 dB while the voice speaks)
let vs = 0, vn = 0;
for (const s of film) for (const l of s.lines) { const a = Math.round(l.start * SR), b = Math.round(l.end * SR); vs += rms(voice, a, b) ** 2 * (b - a); vn += b - a; }
const vGain = .1 / Math.sqrt(vs / vn), mGain = .05 / ((rms(music[0]) + rms(music[1])) / 2);
for (let k = 0; k < N; k++) { voice[k] *= vGain; music[0][k] *= mGain; music[1][k] *= mGain; }

// ---------- mix ----------

function writeWav(file, l, r) {
  const data = new Float32Array(l.length * 2);
  for (let k = 0; k < l.length; k++) { data[2 * k] = l[k]; data[2 * k + 1] = r[k]; }
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.byteLength, 4); h.write('WAVEfmt ', 8);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(3, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(SR, 24);
  h.writeUInt32LE(SR * 8, 28); h.writeUInt16LE(8, 32); h.writeUInt16LE(32, 34); h.write('data', 36); h.writeUInt32LE(data.byteLength, 40);
  writeFileSync(file, Buffer.concat([h, Buffer.from(data.buffer)]));
}
// Duck the music under the voice (about -8 dB while speaking, 20 ms attack, 350 ms release) and mix here:
// ffmpeg's sidechaincompress + amix ends a random fraction of a second early, which would break the scroll sync.
const up = Math.exp(-1 / (.02 * SR)), down = Math.exp(-1 / (.35 * SR)), mix = [new Float32Array(N), new Float32Array(N)];
let env = 0;
for (let k = 0; k < N; k++) {
  const x = Math.abs(voice[k]), c = x > env ? up : down;
  env = c * env + (1 - c) * x;
  const g = 1 - .6 * Math.min(1, env / .03);
  mix[0][k] = music[0][k] * g + voice[k];
  mix[1][k] = music[1][k] * g + voice[k];
}
const mixWav = join(TMP, 'mix.wav');
writeWav(mixWav, mix[0], mix[1]);

// loudness: measure, then a linear gain and a peak limiter, so quiet moments stay quiet
const stats = JSON.parse(ffmpegLog(['-i', mixWav, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=20:print_format=json', '-f', 'null', '-']).match(/\{[\s\S]*\}/)[0]);
const gainDb = -16 - +stats.input_i;
mkdirSync(join(ROOT, 'audio'), {recursive: true});
sh('ffmpeg', ['-v', 'error', '-y', '-i', mixWav, '-af', `volume=${gainDb.toFixed(2)}dB,alimiter=limit=0.78:attack=3:release=80:level=0`,
  '-ar', String(SR), '-c:a', 'libmp3lame', '-b:a', '160k', join(ROOT, 'audio', 'film.mp3')]);

// ---------- timeline ----------

const out = {duration: r2(DURATION), scenes: film.map(s => ({id: s.id, start: r2(s.start), dur: s.dur, lines: s.lines.map(l => ({start: l.start, end: l.end}))}))};
writeFileSync(join(ROOT, 'timeline.js'), `// Generated by tools/build-film.mjs from story.js. Run it again after editing the script.\nwindow.FILM = ${JSON.stringify(out)};\n`);
if (!process.env.KEEP) rmSync(TMP, {recursive: true, force: true});
else console.log(`kept ${TMP}`);

console.log(`voice ${VOICE} @ ${RATE}, ${out.duration}s, gain ${gainDb.toFixed(1)} dB`);
for (const s of out.scenes) console.log(`${s.id.padEnd(8)} ${s.start.toFixed(2).padStart(7)} +${s.dur.toFixed(2)}  ${s.lines.map(l => `${l.start}-${l.end}`).join('  ')}`);

// the page maps audio time to scroll, so the mp3 must be exactly as long as the timeline
const [, hh, mm, ss] = ffmpegLog(['-i', join(ROOT, 'audio', 'film.mp3'), '-f', 'null', '-']).match(/time=(\d+):(\d+):([\d.]+)(?![\s\S]*time=)/);
const got = hh * 3600 + mm * 60 + +ss;
if (Math.abs(got - DURATION) > .05) { console.error(`film.mp3 is ${got}s but the timeline is ${DURATION}s`); process.exit(1); }
