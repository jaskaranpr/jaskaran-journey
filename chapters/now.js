// Now: a long wall of app screens and him in front of it. A band of light travels along the wall, and every screen
// it touches is wiped of its old, crowded layout and drawn again, clean: a greeting, one big number, a smooth line,
// two rows, one button. He walks in, stops, folds his arms and watches it go.
chapter('now', (() => {
  const {GY, ln, draw, wipe, box, circ, rng, keys, span, lerp, fit, stride, n1} = L;
  const S = 150, PW = 112, PH = 228, GAP = 150, PY = 432, N = 17, X0 = -330;   // phone size, spacing, top edge, count, first
  const STOP = 1.5, AT = 560;                                                    // when and where he stops
  const heX = t => keys(t, [[0, -90], [.12, -90], [STOP, AT]]);
  const passes = x => .7 + (x + 260) / 2460 * 2.8;                               // when the light reaches board x
  const phones = Array.from({length: N}, (_, i) => X0 + i * GAP);

  // the old screen: a row of little icons, an image banner, uneven rows, boxes, a crowded tab bar
  function old(x, r) {
    const w = PW - 24;
    let d = '';
    for (let k = 0; k < 5; k++) d += `M${x + 12 + k * 15} ${PY + 22}h8v8h-8Z`;
    d += `M${x + 12} ${PY + 40}h${w}v34h${-w}ZM${x + 12} ${PY + 40}l${w} 34M${x + 12 + w} ${PY + 40}l${-w} 34`;
    for (let k = 0; k < 7; k++) { const y = PY + 88 + k * 13; d += `M${x + 12} ${y}h6v6h-6ZM${x + 24} ${y + 3}h${n1(24 + r() * (w - 30))}`; }
    for (let k = 0; k < 3; k++) d += `M${x + 12 + k * 30} ${PY + 184}h24v10h-24Z`;
    d += `M${x + 6} ${PY + PH - 26}H${x + PW - 6}`;
    for (let k = 0; k < 5; k++) d += `M${x + 14 + k * 19} ${PY + PH - 18}h8v8h-8Z`;
    return d;
  }
  // the new one: a greeting, the balance as one bold stroke, a smooth line, two rows, one button
  function fresh(x, r) {
    const lift = 10 + r() * 16;
    const curve = `M${x + 14} ${PY + 128}C${x + 38} ${PY + 127} ${x + 50} ${n1(PY + 112 - lift * .3)} ${x + 64} ${n1(PY + 107 - lift * .5)}S${x + 88} ${n1(PY + 93 - lift)} ${x + PW - 14} ${n1(PY + 86 - lift)}`;
    const rows = [0, 1].map(k => { const y = PY + 154 + k * 26; return `${circ(x + 22, y, 6)}M${x + 34} ${y - 3}h${n1(34 + r() * 22)}M${x + 34} ${y + 4}h${n1(16 + r() * 12)}`; }).join('');
    return ln(`M${x + 16} ${PY + 30}h30`, 'thin nn') + ln(`M${x + 16} ${PY + 52}h${n1(44 + r() * 22)}`, 'bold nn') + ln(curve, 'nn') +
      ln(rows, 'thin nn') + ln(box(x + 14, PY + PH - 44, PW - 28, 24, 12), 'nn');
  }
  const phone = (x, i) => {
    const r = rng(40 + i);
    return `<g class="p${i}"><rect class="glow" x="${x - 8}" y="${PY - 8}" width="${PW + 16}" height="${PH + 16}" rx="24" fill="#fdfdfd" opacity="0" filter="url(#b8)"/>` +
      ln(box(x, PY, PW, PH, 18), 'nf') + ln(box(x + PW / 2 - 13, PY + 9, 26, 6, 3) + `M${x + PW / 2 - 16} ${PY + PH - 8}h32`, 'thin nf') +
      ln(old(x, r), 'hair no') + fresh(x, r) + '</g>';
  };

  return {
    backArt: () => `
      <defs><linearGradient id="nwBand" x1="0" x2="1"><stop offset="0" stop-color="#d6e9f6" stop-opacity="0"/><stop offset=".5" stop-color="#fdfdfd" stop-opacity=".42"/><stop offset="1" stop-color="#d6e9f6" stop-opacity="0"/></linearGradient>
        <linearGradient id="nwWash" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fdfdfd" stop-opacity="0"/><stop offset=".35" stop-color="#fdfdfd" stop-opacity=".06"/><stop offset=".8" stop-color="#fdfdfd" stop-opacity=".06"/><stop offset="1" stop-color="#fdfdfd" stop-opacity="0"/></linearGradient>
        <linearGradient id="nwFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
        <mask id="nwRefl" maskUnits="userSpaceOnUse" x="-800" y="${GY}" width="3400" height="300"><rect x="-800" y="${GY}" width="3400" height="210" fill="url(#nwFade)"/></mask></defs>
      <g class="band"><rect x="-2600" y="${PY - 110}" width="2600" height="${GY - PY + 150}" fill="url(#nwWash)"/>
        <rect x="-170" y="${PY - 90}" width="340" height="${GY - PY + 100}" fill="url(#nwBand)" filter="url(#b16)"/>
        <ellipse cx="0" cy="${GY + 4}" rx="200" ry="16" fill="url(#gPool)"/></g>
      ${ln(`M-600 ${GY}H2400`, 'floor')}${ln(`M-600 ${PY + PH + 16}H2400`, 'hair ledge')}
      ${phones.map(phone).join('')}
      <g mask="url(#nwRefl)" opacity=".16"><g transform="translate(0 ${2 * GY}) scale(1 -1)">${phones.map(x => ln(box(x, PY, PW, PH, 18), 'nf')).join('')}</g></g>`,
    build(tl, $) {
      draw(tl, $('.floor'), 0, .5);
      draw(tl, $('.ledge'), .1, .6);
      draw(tl, $('.nf'), .05, .55, .008);
      draw(tl, $('.no'), .2, .55, .008);
      tl.fromTo($('.band'), {x: -260}, {x: 2200, duration: 2.8}, .7);
      // the light reaches each screen: a flash, the old layout wiped away, the new one drawn in its place
      for (const [i, x] of phones.entries()) {
        const at = passes(x + PW / 2), g = $(`.p${i} .glow`);
        wipe(tl, $(`.p${i} .no`), at - .14, .22);
        draw(tl, $(`.p${i} .nn`), at + .02, .45, .05, 'power2.out');
        tl.fromTo(g, {opacity: 0}, {opacity: .2, duration: .1}, at - .06).to(g, {opacity: .07, duration: .45}, at + .05);
      }
    },
    // walks in along the wall, stops, turns to it and folds his arms
    alive: true,
    fig(t, life = 0) {
      if (t < STOP) { const x = heX(t); return {lib: 'a', clip: 'Walk_Formal_Loop', ct: stride(x + 90, S), x, y: GY, s: S, yaw: 90}; }
      return {lib: 'b', clip: 'Idle_FoldArms_Loop', ct: (t - STOP) * .6 + life * .35, x: AT, y: GY, s: S, yaw: lerp(90, 145, span(t, STOP, STOP + .35))};
    },
    view: (t, narrow) => ({x: fit(narrow, keys(t, [[0, 700], [4, 940]]), Math.max(heX(t), 120) + 30, 0, 2000), y: 450, zoom: keys(t, [[0, 1], [4, 1.05]])}),
  };
})());
