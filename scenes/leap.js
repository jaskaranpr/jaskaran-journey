// The leap. A white card with a single line and a tiny figure at the end of a ledge. He steps off, the white opens
// like an eye, and he's falling backwards through a bright sky: clouds rushing up past him,
// bubbles drifting, light from above. He drops into a bank of cloud and everything goes white.
(() => {
  const {C, rng, keys, span, clamp, n1, beam, dust, fig} = K;
  const FALL = 2400;                                   // how far the camera drops while he falls (board units at z = 1)
  const LX = 800, LY = 668;                            // where the ledge ends on the white card

  // a cumulus: puffs heaped highest in the middle, each lit from above (the fill is a top-to-bottom gradient per puff),
  // drawn back to front so every lower puff shows its bright top against the shade under the one behind it
  const cloud = (x, y, s, r) => {
    const w = 260 * s, puffs = [];
    for (let i = 0, n = 9 + Math.floor(r() * 6); i < n; i++) {
      const t = r(), h = Math.sin(t * Math.PI), rr = (24 + h * 36 + r() * 16) * s;
      puffs.push([x + (t - .5) * w, y + 4 * s - rr - h * (8 + r() * 34) * s, rr]);
    }
    puffs.sort((a, b) => a[1] - b[1]);
    const x0 = Math.min(...puffs.map(([cx, , rr]) => cx - rr * .6)), x1 = Math.max(...puffs.map(([cx, , rr]) => cx + rr * .6));
    return `<g fill="url(#lpPuff)">${puffs.map(([cx, cy, rr]) => `<circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(rr)}"/>`).join('')}` +
      `<rect x="${n1(x0)}" y="${n1(y - 22 * s)}" width="${n1(x1 - x0)}" height="${n1(26 * s)}" rx="${n1(13 * s)}" fill="${C.b6}" opacity=".5"/></g>`;
  };
  const bubble = (x, y, rr, k) => `<g class="lp-bob" style="animation-delay:-${n1(k * 1.7)}s"><circle cx="${x}" cy="${y}" r="${rr}" fill="url(#lpBub)" stroke="${C.w}" stroke-width="1.2" stroke-opacity=".55"/>` +
    `<circle cx="${x}" cy="${y}" r="${n1(rr * .82)}" fill="none" stroke="${C.b6}" stroke-width="1" opacity=".5"/>` +
    `<path d="M${n1(x - rr * .62)} ${n1(y - rr * .2)}A${n1(rr * .68)} ${n1(rr * .68)} 0 0 1 ${n1(x - rr * .1)} ${n1(y - rr * .66)}" fill="none" stroke="${C.w}" stroke-width="${n1(rr * .12)}" stroke-linecap="round" opacity=".85"/>` +
    `<circle cx="${n1(x + rr * .42)}" cy="${n1(y + rr * .42)}" r="${n1(rr * .07)}" fill="${C.w}" opacity=".8"/></g>`;

  // falling backwards: head low, arms thrown up, knees bent
  const pose = t => ({x: 0, y: 0, lean: -118 + Math.sin(t * 9) * 4, neck: -128, head: -140,
    legs: [{thigh: 148 + Math.sin(t * 7) * 6, knee: 42}, {thigh: 122 - Math.sin(t * 6) * 5, knee: 64}],
    arms: [{upper: -150 + Math.sin(t * 8) * 8, elbow: 26}, {upper: 165 - Math.sin(t * 7) * 7, elbow: -24}]});

  let els = {};
  scene('leap', {
    bg: C.w,
    css: `.lp-bob{animation:lpBob 6s ease-in-out infinite alternate}@keyframes lpBob{to{transform:translate(8px,-14px)}}`,
    layers() {
      const r = rng(5);
      const sky = `<linearGradient id="lpSky" gradientUnits="userSpaceOnUse" x1="0" y1="-200" x2="0" y2="1000">
          <stop offset="0" stop-color="${C.b7}"/><stop offset=".22" stop-color="${C.b6}"/><stop offset=".55" stop-color="${C.b5}"/><stop offset="1" stop-color="${C.b4}"/></linearGradient>
        <radialGradient id="lpBub" cx=".5" cy=".5" r=".5"><stop offset=".55" stop-color="${C.w}" stop-opacity="0"/><stop offset=".86" stop-color="${C.b7}" stop-opacity=".22"/><stop offset="1" stop-color="${C.w}" stop-opacity=".6"/></radialGradient>
        <linearGradient id="lpPuff" x1="0" y1="0" x2="0" y2="1"><stop offset=".1" stop-color="${C.w}"/><stop offset=".55" stop-color="${C.w}"/><stop offset="1" stop-color="${C.b6}"/></linearGradient>
        <rect x="-600" y="-600" width="2800" height="2200" fill="url(#lpSky)"/>
        <ellipse cx="800" cy="-140" rx="700" ry="300" fill="${C.w}" opacity=".7" filter="url(#b30)"/>`;
      const light = beam({x: 640, y: -200, top: 120, spread: 520, h: 1300, o: .34, tilt: -80}) + beam({x: 980, y: -200, top: 90, spread: 420, h: 1300, o: .26, tilt: 90}) +
        beam({x: 360, y: -200, top: 60, spread: 300, h: 1200, o: .16, tilt: -160});
      let far = '';
      for (let i = 0; i < 14; i++) far += cloud(-200 + r() * 2000, 200 + i * 110 + r() * 60, .4 + r() * .4, r);
      let bubs = '';
      for (let i = 0; i < 18; i++) {
        const x = n1(80 + r() * 1440), y = n1(260 + i * 140 + r() * 90);
        if (Math.abs(x - 800) > 150 || r() < .3) bubs += bubble(x, y, n1(10 + r() * 22), i);
      }
      let near = '';
      for (let i = 0; i < 9; i++) near += cloud(r() < .5 ? -120 + r() * 520 : 1180 + r() * 520, 900 + i * 320 + r() * 120, 1.5 + r() * 1.1, r);
      // the bank of cloud he falls into at the end
      let bank = '';
      for (let i = 0; i < 9; i++) bank += cloud(-200 + i * 260, 3800 + (i % 2) * 70, 2.6, r);
      bank += `<rect x="-600" y="3770" width="2800" height="1400" fill="${C.b7}"/>`;
      const me = `<g id="lpMe"><path id="lpBody" class="fig" filter="url(#fuzz)" fill="${C.w}"/></g>`;
      // the card: a line of ledge, a small figure in ink standing at its end
      const kid = FIG.side({lean: 3, neck: 4, head: 2, legs: [{thigh: 2, knee: 2}, {thigh: -3, knee: 2}], arms: [{upper: -4, elbow: 8}, {upper: 5, elbow: 10}]});
      const card = `<filter id="lpInk" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="b"/><feComponentTransfer in="b" result="m"><feFuncA type="linear" slope="16" intercept="-7.4"/></feComponentTransfer>
          <feTurbulence type="fractalNoise" baseFrequency=".6" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="m" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G" result="d"/>
          <feFlood flood-color="${C.ink}"/><feComposite operator="in" in2="d"/></filter>
        <mask id="lpIris"><rect x="-600" y="-600" width="2800" height="2200" fill="#fff"/><circle id="lpHole" cx="800" cy="540" r="0" fill="url(#lpHoleG)"/></mask>
        <radialGradient id="lpHoleG"><stop offset=".8" stop-color="#000"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
        <rect x="-600" y="-600" width="2800" height="2200" fill="${C.w}" mask="url(#lpIris)"/>
        <g id="lpCard"><path d="M${LX - 420} ${LY}H${LX}" stroke="${C.ink}" stroke-width="2" stroke-linecap="round"/>
          <path d="M${LX - 420} ${LY + 1}L${LX - 6} ${LY + 1}L${LX - 26} ${LY + 22}L${LX - 70} ${LY + 30}L${LX - 140} ${LY + 18}Z" fill="${C.ink}" opacity=".06"/>
          <g id="lpKid">${fig(kid.d, 0, 0, .34, {fill: C.ink, f: 'lpInk'})}</g></g>`;
      return [
        {z: .02, svg: sky},
        {z: .05, svg: light},
        {z: .05, html: dust([[300, -100], [1300, -100], [1500, 900], [100, 900]], 50, 23, .2)},
        {z: .22, cls: 'blur2', svg: `<g opacity=".8">${far}</g>`},
        {z: .6, svg: bubs},
        {z: 0, svg: me},
        {z: 1.35, cls: 'blur6', svg: `<g opacity=".92">${near}</g>${bank}`},
        {z: 0, svg: card},
        {z: 0, svg: `<rect id="lpBloom" x="-600" y="-600" width="2800" height="2200" fill="${C.w}" opacity="0"/>`},
      ];
    },
    init(st) { for (const id of ['lpMe', 'lpBody', 'lpHole', 'lpKid', 'lpCard', 'lpBloom']) els[id] = st.querySelector('#' + id); },
    cam: p => ({y: keys(p, [[.3, 0], [.97, FALL]]), zoom: keys(p, [[.26, 1.14], [.46, 1], [1, 1.05]]), oy: 470}),
    frame(p) {
      if (!els.lpMe) return;
      // on the card: he leans over the edge and drops out of sight
      const tip = span(p, .14, .22), drop = span(p, .2, .29);
      els.lpKid.setAttribute('transform', `translate(${LX - 8 + drop * 30} ${LY + drop * drop * 260}) rotate(${n1(tip * 28 + drop * 70)})`);
      els.lpKid.style.opacity = 1 - span(p, .25, .29);
      els.lpCard.style.opacity = 1 - span(p, .27, .33);
      // the white opens
      els.lpHole.setAttribute('r', n1(keys(p, [[.27, 0], [.43, 1250]])));
      // the fall
      const t = p * 3.4;
      els.lpBody.setAttribute('d', FIG.side(pose(t), 'adult', 11).d);
      const x = 800 + Math.sin(t * 1.3) * 26, y = 420 + Math.sin(t * 2.1) * 12 + span(p, .88, 1) * 120;
      els.lpMe.setAttribute('transform', `translate(${n1(x)} ${n1(y)}) rotate(${n1(keys(p, [[.28, -24], [1, 30]]) + Math.sin(t * 1.7) * 4)}) scale(1.28)`);
      els.lpBloom.setAttribute('opacity', n1(span(p, .9, .99) * 100) / 100);
    },
  });
})();
