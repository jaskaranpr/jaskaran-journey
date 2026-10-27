// Now: a long dark wall of app screens, like the film's wall of months, and him standing small in front of it,
// looking up. A band of light travels along the wall and every screen it touches turns over, from the old,
// crowded look to a clean new one, and the room gets brighter as it goes.
(() => {
  const {C, rng, keys, span, n1, clamp} = K;
  const COLS = 17, ROWS = 3, FX = 360, FY = 712, FS = 1.32;
  const sweep = p => keys(p, [[0, -.12], [.1, -.1], [.9, 1.16], [1, 1.2]]);    // where the light is along the wall, 0..1

  // an old screen: dim, crowded, nothing lines up
  const old = r => {
    let o = '';
    for (let y = 6; y < 92; y += 3.5 + r() * 4) { const x = 6 + r() * 14, w = 20 + r() * 64;
      o += `<i style="left:${n1(x)}%;top:${n1(y)}%;width:${n1(Math.min(w, 92 - x))}%;height:${n1(1.2 + r() * 2.2)}%;opacity:${n1(.35 + r() * .5)}"></i>`; }
    for (let k = 0; k < 4; k++) o += `<i style="left:${n1(8 + r() * 60)}%;top:${n1(10 + r() * 70)}%;width:${n1(10 + r() * 16)}%;height:${n1(5 + r() * 6)}%;opacity:.5"></i>`;
    return o;
  };
  // a new screen: white, one big number, a smooth line, two rows, one button
  const fresh = r => {
    let d = 'M0 30';
    for (let i = 1; i <= 8; i++) d += `L${i * 12.5} ${n1(30 - i * 2 - Math.sin(i * 1.3 + r() * 2) * 6 - r() * 4)}`;
    return `<b class="nt"></b><b class="nn" style="width:${n1(36 + r() * 24)}%"></b>` +
      `<svg viewBox="0 0 100 40" preserveAspectRatio="none"><path d="${d}L100 40L0 40Z" fill="${C.b7}"/><path d="${d}" fill="none" stroke="${C.b4}" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>` +
      `<b class="nr"><u></u></b><b class="nr"><u></u></b><b class="nb"></b>`;
  };

  let cards = [], light;
  scene('now', {
    bg: C.b0,
    focus: p => 420 + span(p, .2, .9) * 460,
    css: `.s-now .nroom{position:absolute;inset:0;perspective:calc(1500px*var(--S));perspective-origin:24% 48%}
      .s-now .nwall{position:absolute;left:28%;top:28%;width:calc(1520px*var(--S));height:calc(390px*var(--S));transform-origin:0 50%;
        transform:rotateY(30deg);background:linear-gradient(${C.b1},#06265a);box-shadow:0 0 0 calc(14px*var(--S)) ${C.b1};transform-style:preserve-3d;display:grid;grid-template-columns:repeat(${COLS},1fr);grid-template-rows:repeat(${ROWS},1fr);gap:calc(16px*var(--S));padding:calc(16px*var(--S))}
      .s-now .nc{position:relative;transform-style:preserve-3d}
      .s-now .nc>div{position:absolute;inset:0;border-radius:calc(9px*var(--S));overflow:hidden;backface-visibility:hidden;-webkit-backface-visibility:hidden}
      .s-now .no{background:${C.b1};box-shadow:inset 0 0 0 1px ${C.b2}}
      .s-now .no i{position:absolute;background:${C.b3};border-radius:1px}
      .s-now .nw{background:${C.w};transform:rotateY(180deg);padding:9% 9%;display:flex;flex-direction:column;gap:5%;
        box-shadow:0 0 calc(26px*var(--S)) rgba(214,233,246,.35)}
      .s-now .nw b{display:block;border-radius:99px;background:${C.b7}}
      .s-now .nw .nt{height:3%;width:40%}
      .s-now .nw .nn{height:7%;background:${C.ink};border-radius:calc(3px*var(--S))}
      .s-now .nw svg{width:100%;height:26%;display:block}
      .s-now .nw .nr{height:9%;width:100%;background:none;display:flex;align-items:center;gap:8%;border-bottom:1px solid ${C.b7};border-radius:0}
      .s-now .nw .nr u{display:block;width:16%;aspect-ratio:1;border-radius:50%;background:${C.b6}}
      .s-now .nw .nb{margin-top:auto;height:8%;background:${C.ink}}
      .s-now .nsweep{position:absolute;top:-12%;bottom:-12%;width:22%;left:-10%;translate:-50% 0;pointer-events:none;
        background:radial-gradient(50% 50% at 50% 50%,rgba(253,253,253,.55),rgba(214,233,246,.18) 55%,rgba(214,233,246,0));transform:translateZ(1px)}
      @media (prefers-reduced-motion:reduce){.s-now .nc{transition:none}}`,
    layers() {
      const r = rng(5);
      let cards = '';
      for (let row = 0; row < ROWS; row++) for (let c = 0; c < COLS; c++)
        cards += `<div class="nc" style="--u:${n1(((c + .5) / COLS + row * .012) * 1000) / 1000}"><div class="no">${old(r)}</div><div class="nw">${fresh(r)}</div></div>`;
      // the hall: dark ceiling and walls, lamps in a row overhead
      const hall = `<linearGradient id="nHall" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="900"><stop offset="0" stop-color="${C.b0}"/><stop offset=".55" stop-color="#041d45"/><stop offset="1" stop-color="${C.b0}"/></linearGradient>
        <rect x="-600" y="-400" width="2900" height="1700" fill="url(#nHall)"/>
        ${[520, 760, 980, 1180, 1360].map((x, i) => `<ellipse cx="${x}" cy="${140 + i * 14}" rx="${30 - i * 4}" ry="${5 - i * .6}" fill="${C.b6}" opacity=".6"/>`).join('')}`;
      const beams = [520, 760, 980, 1180].map((x, i) => K.beam({x, y: 140 + i * 14, top: 40, spread: 300 - i * 50, h: 520 - i * 40, o: .2, tilt: -30})).join('');
      // the floor: polished, so the wall and he both show in it
      const floor = `<path d="M-600 676L2300 656L2300 1300L-600 1300Z" fill="#031a40"/>
        <path d="M460 690L1500 640L1900 760L60 860Z" fill="${C.b2}" opacity=".35" filter="url(#b16)"/>
        <ellipse id="nfloor" cx="950" cy="710" rx="640" ry="60" fill="${C.b6}" opacity="0" filter="url(#b30)"/>
        ${Array.from({length: 7}, (_, i) => `<path d="M-600 ${662 + i * i * 6}H2300" stroke="${C.b0}" stroke-width="1.2" opacity=".5"/>`).join('')}`;
      const me = `<g id="nme"><path class="fig" id="nfig" filter="url(#fuzz)" fill="${C.w}"/></g>`;
      const pillar = `<rect x="-120" y="-200" width="190" height="1400" fill="${C.b0}"/><rect x="1660" y="-200" width="200" height="1400" fill="${C.b0}"/>`;

      return [
        {z: .3, svg: hall},
        {z: .55, html: `<div class="nroom"><div class="nwall" style="--s:-.1">${cards}<div class="nsweep"></div></div></div>`},
        {z: .55, svg: beams},
        {z: .8, svg: floor},
        {z: 1, svg: `<g transform="translate(${FX} ${FY}) scale(${FS})">${K.refl('<use href="#nme"/>', 0, .22)}${me}</g>`},
        {z: 1, html: K.dust([[500, 150], [540, 150], [700, 640], [380, 660]], 26, 8)},
        {z: 1.4, cls: 'blur12', svg: pillar},
      ];
    },
    cam: p => ({x: keys(p, [[0, 0], [1, 70]]), zoom: keys(p, [[0, 1.02], [.5, 1.05], [1, 1.08]]), ox: 640, oy: 560}),
    init(st) {
      cards = [...st.querySelectorAll('.nc')].map(el => ({el, u: parseFloat(el.style.getPropertyValue('--u')), e: 0}));
      light = st.querySelector('.nsweep');
    },
    frame(p, st) {
      // turn over only the cards the light is passing; the rest are already done or still waiting
      const s = sweep(p);
      for (const c of cards) {
        const f = clamp((s - c.u) / .07), e = f * f * (3 - 2 * f);
        if (Math.abs(e - c.e) > .002) { c.e = e; c.el.style.transform = `rotateY(${(-180 * e).toFixed(1)}deg)`; }
      }
      if (light) light.style.left = (s * 100).toFixed(2) + '%';
      // he lifts his head to follow the light up the wall
      const up = span(p, .08, .55);
      const pose = FIG.side({lean: -1, neck: -4 - up * 8, head: -6 - up * 20, legs: [{thigh: 4, knee: 3}, {thigh: -4, knee: 2}],
        arms: [{upper: -3, elbow: 9}, {upper: 6, elbow: 13}]});
      st.querySelector('#nfig')?.setAttribute('d', pose.d);
      st.querySelector('#nfloor')?.setAttribute('opacity', (span(p, .1, .95) * .35).toFixed(3));
    },
  });
})();
