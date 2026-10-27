// Shared pieces for drawing scenes. Every scene is painted on a 1600 x 900 board, back to front in layers.
// A scene file calls scene(id, {focus, layers, cam, frame}); see README.md for the details.
window.SCENES = {};
window.scene = (id, def) => { SCENES[id] = def; };

window.K = (() => {
  // the film's colours: one blue ramp and white, nothing else
  const C = {b0: '#021533', b1: '#072f68', b2: '#0d3673', b3: '#1d498b', b4: '#3569ad', b5: '#6f9fd3', b6: '#aed1ea', b7: '#d6e9f6', w: '#fdfdfd', ink: '#0b1d44'};
  const rng = (seed = 1) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => t * t * (3 - 2 * t);
  const n1 = v => Math.round(v * 10) / 10;
  // 0 before a, 1 after b, smooth in between
  const span = (p, a, b) => ease(clamp((p - a) / (b - a)));
  // piecewise curve through [p, value] keys, smoothed between keys
  const keys = (p, ks) => {
    if (p <= ks[0][0]) return ks[0][1];
    for (let i = 1; i < ks.length; i++) if (p <= ks[i][0]) return lerp(ks[i - 1][1], ks[i][1], ease((p - ks[i - 1][0]) / (ks[i][0] - ks[i - 1][0])));
    return ks[ks.length - 1][1];
  };

  // a soft cone of light from above; x is where it starts, spread is how wide it lands
  const beam = ({x, y = -60, top = 70, spread = 460, h = 1000, o = .55, tilt = 0}) => {
    const b = x + tilt;
    return `<g class="beam" opacity="${o}">` +
      `<path d="M${x - top / 2} ${y}L${x + top / 2} ${y}L${b + spread / 2} ${y + h}L${b - spread / 2} ${y + h}Z" fill="url(#gBeam)" filter="url(#b16)"/>` +
      `<path d="M${x - top / 5} ${y}L${x + top / 5} ${y}L${b + spread / 5} ${y + h}L${b - spread / 5} ${y + h}Z" fill="url(#gBeam)" opacity=".55" filter="url(#b8)"/></g>`;
  };
  // the bright oval a beam leaves on the floor
  const pool = (x, y, rx, ry, o = .5) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#gPool)" opacity="${o}"/>`;
  // a long band of mist
  const fog = (y, h, o = .25, col = C.b7, w = 1500, x = 800) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${h}" fill="${col}" opacity="${o}" filter="url(#b30)"/>`;
  // dust motes drifting inside a beam (an html layer, so they animate off the main thread).
  // poly is the beam outline in board units; motes only show inside it
  const dust = (poly, n = 40, seed = 3, big = .12) => {
    const r = rng(seed), xs = poly.map(p => p[0]), ys = poly.map(p => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const clip = poly.map(([x, y]) => `${n1((x - x0) / (x1 - x0) * 100)}% ${n1((y - y0) / (y1 - y0) * 100)}%`).join(',');
    let motes = '';
    for (let i = 0; i < n; i++) {
      const b = r() < big, s = b ? 4 + r() * 5 : .8 + r() * 2.2;
      motes += `<i class="${b ? 'bk' : ''}" style="left:${n1(r() * 100)}%;top:${n1(r() * 100)}%;--s:${n1(s)};--dx:${n1((r() - .5) * 70)}px;--dy:${n1(-20 - r() * 70)}px;` +
        `animation-duration:${n1(9 + r() * 12)}s,${n1(2.5 + r() * 4)}s;animation-delay:-${n1(r() * 20)}s,-${n1(r() * 6)}s"></i>`;
    }
    return `<div class="dust" style="left:${n1(x0 / 16)}%;top:${n1(y0 / 9)}%;width:${n1((x1 - x0) / 16)}%;height:${n1((y1 - y0) / 9)}%;clip-path:polygon(${clip})">${motes}</div>`;
  };
  // place a figure path: x, y are where his feet meet the floor, s is board units per centimetre
  const fig = (d, x, y, s, o = {}) => `<g transform="translate(${n1(x)} ${n1(y)}) scale(${o.flip ? -s : s} ${s})${o.rot ? ` rotate(${o.rot})` : ''}"${o.id ? ` id="${o.id}"` : ''}>` +
    `<path class="fig${o.cls ? ' ' + o.cls : ''}" d="${d}" filter="url(#${o.f || 'fuzz'})" fill="${o.fill || C.w}"/>${o.extra || ''}</g>`;
  // a mirror image on a glossy floor at y, fading away from the feet
  const refl = (markup, y, o = .22) => `<g opacity="${o}" filter="url(#b3)"><g transform="translate(0 ${2 * y}) scale(1 -1)" mask="url(#mRefl)">${markup}</g></g>`;
  // little birds: a pair of wings, flapping on a CSS loop
  const bird = (x, y, s = 1, d = 0) => `<g transform="translate(${n1(x)} ${n1(y)}) scale(${s})"><path class="flap" style="animation-delay:-${n1(d)}s" d="M-9 0Q-4.5 -5 0 0Q4.5 -5 9 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></g>`;

  return {C, rng, clamp, lerp, ease, span, keys, n1, beam, pool, fog, dust, fig, refl, bird};
})();
