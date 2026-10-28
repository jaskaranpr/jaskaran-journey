// Shared pieces for the chapters. Every drawing is a stroke with pathLength 1, so a timeline can draw it on by
// moving its dash: 1.1 is hidden, 0 is drawn, -1.1 is wiped away from its start. Board is 1600 x 900.
window.CHAPTERS = {};
window.chapter = (id, def) => { window.CHAPTERS[id] = def; };
// the film's eye: a brow over the outer corner and a big ink almond with the white ball low against the lower lid.
// c is the almond's centre, sc its scale (the almond is 10 units wide), look slides the ball along it
window.FIG = (() => {
  const P = (x, y) => ({x, y}), ALMOND = 'M-5 .4C-3.6 -3.2 1.6 -4.4 5 -.4Q.6 2.6 -5 .4Z';
  let eyes = 0;
  const eye = (c, sc = 1, look = 1, tilt = -24) => `<g class="eye" transform="translate(${c.x.toFixed(1)} ${c.y.toFixed(1)}) rotate(${tilt}) scale(${sc})">` +
    `<clipPath id="eyeclip${++eyes}"><path d="${ALMOND}"/></clipPath>` +
    `<path class="brow" d="M-5.9 -3.9Q-3.1 -7.4 1.3 -5.7" fill="none" stroke="#0b1d44" stroke-width="1.35" stroke-linecap="round"/>` +
    `<g class="lid"><path d="${ALMOND}" fill="#0b1d44"/><circle clip-path="url(#eyeclip${eyes})" cx="${(1.1 * look).toFixed(2)}" cy="1" r="2.3" fill="#fdfdfd"/>` +
    `<path d="M5 -.4Q.6 2.6 -5 .4" fill="none" stroke="#aed1ea" stroke-width=".22"/></g></g>`;
  return {P, eye};
})();

window.L = (() => {
  // the film's colours: one blue ramp and white, nothing else
  const C = {b0: '#021533', b1: '#072f68', b2: '#0d3673', b3: '#1d498b', b4: '#3569ad', b5: '#6f9fd3', b6: '#aed1ea', b7: '#d6e9f6', w: '#fdfdfd', ink: '#0b1d44'};
  const rng = (seed = 1) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => t * t * (3 - 2 * t);
  const n1 = v => Math.round(v * 10) / 10;
  const span = (p, a, b) => ease(clamp((p - a) / (b - a)));          // 0 before a, 1 after b, smooth between
  const keys = (p, ks) => {                                            // a smooth curve through [p, value] keys
    if (p <= ks[0][0]) return ks[0][1];
    for (let i = 1; i < ks.length; i++) if (p <= ks[i][0]) return lerp(ks[i - 1][1], ks[i][1], ease((p - ks[i - 1][0]) / (ks[i][0] - ks[i - 1][0])));
    return ks[ks.length - 1][1];
  };
  const GY = 700;                                                       // the line everyone stands on
  const ln = (d, cls = '', attrs = '') => `<path class="ln ${cls}" pathLength="1" d="${d}" ${attrs}/>`;
  // (autoRound off: GSAP rounds pixel values by default, which would snap a 0..1 dash to whole numbers)
  const draw = (tl, els, at, dur = .6, stagger = 0, ez = 'power1.inOut') => els.length && tl.fromTo(els, {strokeDashoffset: 1.1}, {strokeDashoffset: 0, duration: dur, stagger, ease: ez, autoRound: false}, at);
  const wipe = (tl, els, at, dur = .4, stagger = 0) => els.length && tl.fromTo(els, {strokeDashoffset: 0}, {strokeDashoffset: -1.1, duration: dur, stagger, ease: 'power1.in', immediateRender: false, autoRound: false}, at);
  const show = (tl, els, at, dur = .4, to = 1) => els.length && tl.fromTo(els, {opacity: 0}, {opacity: to, duration: dur}, at);
  const pts = a => 'M' + a.map(p => `${n1(p[0])} ${n1(p[1])}`).join('L');
  // walking: the clip time that keeps a planted foot still while he moves dx board units (s units per metre)
  const stride = (dx, s, kid) => dx / (s * (kid ? .74 : 1) * 1.05);
  // a layer at depth d (0 far, 1 with him) slides this much when the camera is at x: use it to pin far figures
  const par = (x, d, camX) => x + (camX - 800) * (1 - d);
  // phones and other tall screens: keep the subject in frame instead of the middle of the board
  const fit = (narrow, x, subject, lo = 0, hi = 1600) => narrow ? clamp(subject, lo, hi) : x;
  // a little city of strokes: rounded box, circle, arc
  const box = (x, y, w, h, r = 6) => `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`;
  // a leafy tree: a scalloped canopy with a few clumps drawn inside it, on a forked trunk. returns [outline, detail]
  const tree = (x, base, w, h, seed = 1) => {
    const r = rng(seed), cy = base - h * .66, rx = w / 2, ry = h * .34, n = 13;
    const at = k => { const a = k / n * Math.PI * 2, f = 1 + (r() - .5) * .16; return [x + Math.cos(a) * rx * f, cy + Math.sin(a) * ry * f * (Math.sin(a) > 0 ? .62 : 1)]; };
    const p = Array.from({length: n}, (_, k) => at(k));
    let d = `M${n1(p[0][0])} ${n1(p[0][1])}`;
    for (let k = 1; k <= n; k++) { const a = p[k - 1], b = p[k % n], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, ox = (mx - x) * .22, oy = (my - cy) * .3;
      d += `Q${n1(mx + ox)} ${n1(my + oy)} ${n1(b[0])} ${n1(b[1])}`; }
    let inner = '';
    for (let k = 0; k < 5; k++) { const ix = x + (r() - .5) * rx * 1.1, iy = cy + (r() - .3) * ry * .9, s = 14 + r() * 16; inner += `M${n1(ix - s)} ${n1(iy)}q${n1(s * .5)} ${n1(-s * .7)} ${n1(s)} 0q${n1(s * .5)} ${n1(-s * .5)} ${n1(s)} 0`; }
    const ty = cy + ry * .5;
    const trunk = `M${x - 6} ${base}C${x - 4} ${n1(base - h * .2)} ${x - 8} ${n1(ty + 20)} ${x - 22} ${n1(ty)}M${x + 6} ${base}C${x + 4} ${n1(base - h * .22)} ${x + 10} ${n1(ty + 16)} ${x + 26} ${n1(ty - 4)}M${x} ${n1(ty + 30)}V${n1(ty - 6)}`;
    return [d + trunk, inner];
  };
  const circ = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
  return {C, GY, n1, rng, clamp, lerp, ease, span, keys, ln, draw, wipe, show, pts, stride, par, fit, box, circ, tree};
})();
