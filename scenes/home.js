// Home: an afternoon on a hilltop outside Chakar, seen from the side, low in the grass. He's lying on the crest with
// one knee up and a wheat stalk in his mouth; white butterflies, a kite over the village, and down on the plain its
// fields, poplars, water tower and gurdwara. As the scene ends the camera tilts up past the tree into the sky,
// and the sun takes over.
(() => {
  const {C, rng, keys, span, n1, bird} = K;
  const FX = 720, FS = 1.95, HZ = 650;                       // where he lies, his scale, the far horizon
  const hill = x => 612 + (x < FX ? .00012 : .0003) * (x - FX) ** 2 + Math.sin(x / 130) * 3 + Math.sin(x / 47 + 2) * 1.5;
  const FY = hill(FX);
  const rd = Math.round;

  // a fountain of grass: thin strokes from one patch of ground, arching out, lighter where the sun catches them.
  // shift moves the whole fountain darker (-) or lighter (+) along the palette
  const PAL = [C.b2, C.b3, C.b4, C.b5, C.b6, C.w];
  function fountain(r, out, x, y, s, light, n = 9 + Math.floor(r() * 9), shift = 0) {
    const lean = (r() - .45) * .5;
    for (let b = 0; b < n; b++) {
      const f = b / (n - 1) - .5, a = lean + f * (1 + r() * .5) + (r() - .5) * .2;
      const h = (22 + r() * 40) * s * (1 - Math.abs(f) * .6), tx = Math.sin(a) * h, ty = -Math.cos(a) * h * .9;
      const c = 2 + shift + (r() < .55 ? 1 : 0) + (r() < light ? 1 : 0) + (r() < light * .25 ? 1 : 0) - (r() < .2 ? 1 : 0);
      out[Math.min(5, Math.max(0, c))] += `M${rd(x + f * 10 * s)} ${rd(y)}q${rd(tx * .15)} ${rd(ty * .65)} ${rd(tx)} ${rd(ty)}`;
    }
  }
  // one swaying svg of grass, one path per colour
  const sway = (cols, w, k, r) => `<svg class="hg" viewBox="0 0 1600 900" overflow="visible" style="--d:${n1(5 + r() * 3)}s;--dl:-${n1(r() * 5)}s;--k:${k}">` +
    cols.map((d, c) => d && `<path d="${d}" stroke="${PAL[c]}" stroke-width="${w}" stroke-linecap="round" fill="none"${c === 5 ? ' opacity=".8"' : ''}/>`).join('') + '</svg>';
  const daisy = (x, y, h, s, lean) => `<path d="M${n1(x)} ${n1(y)}q${n1(lean * .4)} ${n1(-h * .6)} ${n1(lean)} ${n1(-h)}" stroke="${C.b2}" stroke-width="${n1(1.2 * s)}" fill="none"/>` +
    `<circle cx="${n1(x + lean)}" cy="${n1(y - h)}" r="${n1(3.4 * s)}" fill="${C.w}"/><circle cx="${n1(x + lean)}" cy="${n1(y - h)}" r="${n1(1.3 * s)}" fill="${C.b6}"/>`;

  // a butterfly: two wings that flap on their own, moved each frame
  const fly = i => `<g id="hb${i}"><g class="hw" style="animation-duration:${(.15 + i % 3 * .03).toFixed(2)}s;animation-delay:-${(i * .07).toFixed(2)}s">` +
    `<path d="M0 0C-6 -10 -15 -8 -12 -1C-15 4 -8 9 0 2Z" fill="${C.w}"/><path d="M0 0C6 -10 15 -8 12 -1C15 4 8 9 0 2Z" fill="${C.w}"/></g>` +
    `<path d="M0 -4V5" stroke="${C.b7}" stroke-width="1.3" stroke-linecap="round"/></g>`;
  const FLY = [[560, 520, 1.2, 0], [1010, 470, 1, 1.7], [1180, 590, 1.3, 3.1], [430, 580, 1, 4.4], [1320, 520, .9, 2.2], [300, 470, .8, 5.6], [880, 545, 1.1, .9]];

  // him: on his back on the crest, one arm thrown back over his head, one knee up, chewing a stalk of wheat
  const ME = FIG.side({y: -11, lean: -90, neck: -90, head: -94, legs: [{to: FIG.P(46, -8.6)}, {thigh: 88, knee: 3}],
    arms: [{upper: -84, elbow: 4}, {upper: 86, elbow: 2}]});
  const MOUTH = FIG.add(ME.joints.skull, FIG.rot(FIG.P(10, 8), -94));
  const stalk = (() => {
    let ear = '';
    for (let i = 0; i < 6; i++) ear += `<ellipse cx="${n1(i * 1.3)}" cy="${i % 2 ? .7 : -.7}" rx="1.1" ry=".55"/><path d="M${n1(i * 1.3 + .6)} ${i % 2 ? .9 : -.9}l3.4 ${i % 2 ? 1.4 : -1.4}" stroke="${C.w}" stroke-width=".2"/>`;
    return `<g transform="translate(${n1(MOUTH.x)} ${n1(MOUTH.y)})"><g class="hstalk"><path d="M0 0Q4 -16 14 -28" stroke="${C.w}" stroke-width=".9" fill="none" stroke-linecap="round"/>` +
      `<g transform="translate(14 -28) rotate(-50)" fill="${C.w}">${ear}</g></g></g>`;
  })();

  scene('home', {
    bg: C.b4,
    focus: FX - 10,                                   // his middle, so phones keep head and feet
    css: `.hg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;transform-origin:50% 72%;
        animation:hsway var(--d) ease-in-out var(--dl) infinite alternate}
      @keyframes hsway{from{transform:skewX(calc(var(--k)*-1.3deg))}to{transform:skewX(calc(var(--k)*2deg))}}
      .s-home .hw{transform-box:fill-box;transform-origin:50% 50%;animation:hflap .2s ease-in-out infinite alternate}
      @keyframes hflap{to{transform:scaleX(.18)}}
      .s-home .hstalk{transform-box:fill-box;transform-origin:0 100%;animation:hchew 2.6s ease-in-out infinite alternate}
      @keyframes hchew{from{transform:rotate(-4deg)}to{transform:rotate(5deg)}}
      .s-home .hdrift{position:absolute;inset:0;width:100%;height:100%;animation:drift 70s linear infinite alternate}
      .s-home .hkite{position:absolute;inset:0;width:100%;height:100%;overflow:visible;transform-origin:88.75% 72.2%;animation:hkite 7s ease-in-out infinite alternate}
      @keyframes hkite{from{transform:rotate(-1.2deg)}to{transform:rotate(1.4deg)}}
      .s-home .hbloom{position:absolute;inset:-25%;background:radial-gradient(closest-side,#fdfdfd,rgba(253,253,253,.9) 50%,rgba(214,233,246,0));opacity:0}
      @media (prefers-reduced-motion:reduce){.hg,.s-home .hw,.s-home .hdrift,.s-home .hstalk,.s-home .hkite{animation:none}}`,
    layers() {
      const r = rng(77);
      // the sky: deep enough over the hill for white words to read and for him to stand out, paler at the horizon,
      // and pale again high up where the sun waits
      const sky = `<linearGradient id="hSky" gradientUnits="userSpaceOnUse" x1="0" y1="-1700" x2="0" y2="${HZ}">
          <stop offset="0" stop-color="${C.b6}"/><stop offset=".34" stop-color="${C.b6}"/><stop offset=".6" stop-color="${C.b5}"/>
          <stop offset=".77" stop-color="${C.b4}"/><stop offset=".9" stop-color="${C.b4}"/><stop offset="1" stop-color="${C.b5}"/></linearGradient>
        <rect x="-700" y="-2000" width="3000" height="${HZ + 2300}" fill="url(#hSky)"/>
        <circle cx="1170" cy="-960" r="580" fill="url(#gGlow)" opacity=".9"/>
        <circle cx="1170" cy="-960" r="54" fill="${C.w}" filter="url(#b1)"/>
        <ellipse cx="1300" cy="80" rx="700" ry="240" fill="${C.b5}" opacity=".35" filter="url(#b30)"/>`;
      let clouds = '';
      for (const [cx, cy, sc, o] of [[300, -1320, 1.5, .75], [1460, -1280, 1.2, .65], [560, -980, 1.1, .8], [1540, -760, 1.3, .7], [160, -620, 1.2, .7],
        [900, -520, 1, .6], [1300, -360, .8, .55], [520, -260, .8, .5], [1420, 430, .7, .35], [180, 470, .6, .3]]) {
        let puff = '', core = '';
        for (let i = 0; i < 12; i++) {
          const x = cx + (i - 5.5) * 26 * sc + (r() - .5) * 16, y = cy - Math.sin(i / 11 * Math.PI) * 36 * sc + r() * 12, rr = (22 + r() * 22) * sc;
          puff += `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(rr)}" fill="${C.w}"/>`;
          if (i % 2) core += `<circle cx="${n1(x)}" cy="${n1(y + 4)}" r="${n1(rr * .7)}" fill="${C.w}"/>`;
        }
        clouds += `<g opacity="${o}"><g filter="url(#b16)">${puff}</g><g filter="url(#b8)" opacity=".75">${core}</g>` +
          `<ellipse cx="${cx}" cy="${n1(cy + 20 * sc)}" rx="${n1(170 * sc)}" ry="${n1(14 * sc)}" fill="${C.w}" filter="url(#b8)"/></g>`;
      }
      const birds = Array.from({length: 7}, (_, i) => bird(n1(980 + i * 22 + r() * 30), n1(-1110 + Math.abs(i - 3) * 9 + r() * 10), .75 + r() * .3, r())).join('') +
        Array.from({length: 5}, (_, i) => bird(n1(420 + i * 28 + r() * 20), n1(-760 + r() * 30), .6, r())).join('') +
        Array.from({length: 4}, (_, i) => bird(n1(300 + i * 18 + r() * 12), n1(330 + r() * 16), .45, r())).join('');

      // a kite over the village, tugging on its long string
      let tail = '';
      for (let i = 1; i <= 6; i++) tail += `<path transform="translate(${n1(1178 - i * 5 + Math.sin(i) * 6)} ${n1(262 + i * 15)}) rotate(${i * 20})" d="M-3 -2L3 2M-3 2L3 -2" stroke="${C.w}" stroke-width="1.2"/>`;
      const kite = `<svg class="hkite" viewBox="0 0 1600 900"><path d="M1180 258Q1250 520 1420 650" stroke="${C.b7}" stroke-width=".8" fill="none" opacity=".7"/>
        <path d="M1180 258Q1176 280 1172 300Q1168 330 1160 352" stroke="${C.w}" stroke-width=".8" fill="none" opacity=".8"/>${tail}
        <path d="M1180 222L1198 246L1180 262L1162 246Z" fill="${C.w}"/><path d="M1180 222V262M1162 246H1198" stroke="${C.b6}" stroke-width=".8"/></svg>`;

      // the plain below: fields in strips that thin toward the horizon, lines of trees, Chakar itself on the right
      let far = `<linearGradient id="hPlain" gradientUnits="userSpaceOnUse" x1="0" y1="${HZ}" x2="0" y2="${HZ + 260}"><stop offset="0" stop-color="${C.b6}"/><stop offset=".3" stop-color="${C.b5}"/><stop offset="1" stop-color="${C.b4}"/></linearGradient>
        <rect x="-700" y="${HZ}" width="3000" height="700" fill="url(#hPlain)"/>`;
      for (let k = 0, y = HZ + 2; k < 14; k++) {
        const h = 2 + k * 2.4;
        for (let x = -600; x < 2300;) {
          const w = (90 + r() * 260) * (1 + k * .2), col = [C.b4, C.b5, C.b6, C.b7][Math.floor(r() * 4)];
          far += `<path d="M${n1(x)} ${n1(y)}h${n1(w)}l${n1(h * 1.6)} ${n1(h)}h${n1(-w - h * 1.6)}Z" fill="${col}" opacity="${n1(.18 + r() * .25)}"/>`;
          if (r() < .3) for (let t = x; t < x + w; t += 4 + r() * 5 * (1 + k * .3))      // a hedge of trees along the field edge
            far += `<ellipse cx="${n1(t)}" cy="${n1(y - 1)}" rx="${n1((3 + r() * 3) * (1 + k * .25))}" ry="${n1((2 + r() * 2) * (1 + k * .25))}" fill="${C.b4}" opacity=".55"/>`;
          x += w;
        }
        y += h;
      }
      for (let x = -600; x < 2300; x += 10 + r() * 30) far += `<ellipse cx="${n1(x)}" cy="${n1(HZ - r() * 4)}" rx="${n1(10 + r() * 26)}" ry="${n1(5 + r() * 9)}" fill="${C.b5}" opacity="${n1(.35 + r() * .3)}"/>`;
      // the village: flat roofs, the gurdwara's dome and flag, the water tower, and rows of poplars around it all
      for (let i = 0; i < 26; i++) { const x = 1190 + r() * 260, w = 8 + r() * 14, h = 5 + r() * 8;
        far += `<rect x="${n1(x)}" y="${n1(HZ + 2 - h)}" width="${n1(w)}" height="${n1(h)}" fill="${[C.b4, C.b5][i % 2]}" opacity=".9"/>`; }
      far += `<g fill="${C.b4}"><rect x="1352" y="${HZ - 14}" width="22" height="16"/><path d="M1354 ${HZ - 14}Q1363 ${HZ - 31} 1372 ${HZ - 14}Z"/><path d="M1363 ${HZ - 31}v-5" stroke="${C.b4}" stroke-width="1.2"/>
        <path d="M1392 ${HZ}V${HZ - 46}" stroke="${C.b4}" stroke-width="1.2"/><path d="M1392 ${HZ - 46}l12 3.5l-12 3.5Z"/></g>`;
      for (let i = 0; i < 24; i++) { const x = 1080 + i * 17 + r() * 6, h = 40 + r() * 22;
        if (x > 1180 && x < 1300) continue;
        far += `<ellipse cx="${n1(x)}" cy="${n1(HZ - h * .5 + 2)}" rx="${n1(h * .07)}" ry="${n1(h * .5)}" fill="${C.b4}" opacity=".8"/>`; }
      far += `<g fill="${C.b4}" transform="translate(1240 ${HZ})"><path d="M-9 0L-6 -44M9 0L6 -44M-9 0L6 -30M9 0L-6 -30" stroke="${C.b4}" stroke-width="1.6" fill="none"/>
        <rect x="-15" y="-62" width="30" height="20" rx="4"/><path d="M-15 -60Q0 -70 15 -60Z"/></g>` + K.fog(HZ + 4, 22, .55, C.b7, 1900, 800);

      // the hill: dark under the crest and darker toward us, a lit rim where the sun catches the top
      let crest = `M-700 ${n1(hill(-700))}`;
      for (let x = -650; x <= 2300; x += 25) crest += `L${x} ${n1(hill(x))}`;
      const ground = `<linearGradient id="hGround" gradientUnits="userSpaceOnUse" x1="0" y1="600" x2="0" y2="1000">
          <stop offset="0" stop-color="${C.b3}"/><stop offset=".35" stop-color="${C.b2}"/><stop offset="1" stop-color="${C.b1}"/></linearGradient>
        <path d="${crest}L2300 1500L-700 1500Z" fill="url(#hGround)"/>
        <path d="${crest}" stroke="${C.b5}" stroke-width="5" fill="none" opacity=".5" filter="url(#b3)"/>
        ${[[260, 760, 300, 60], [1180, 800, 340, 70], [700, 880, 380, 60]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${C.b4}" opacity=".22" filter="url(#b30)"/>`).join('')}
        <ellipse cx="${FX + 10}" cy="${n1(FY + 6)}" rx="240" ry="10" fill="${C.b1}" opacity=".5" filter="url(#b8)"/>`;

      // grass: a dense fringe all along the crest, dark against the sky, and clumps down the face of the hill
      const back = PAL.map(() => ''), face = PAL.map(() => ''), front = PAL.map(() => '');
      for (let x = 60; x < 1700; x += 4 + r() * 7) fountain(r, back, x, hill(x) + 7, .45 + r() * .4, .25, 5 + Math.floor(r() * 3), -2);
      for (let i = 0; i < 34; i++) {
        const cx = -100 + r() * 1800, cy = hill(cx) + 50 + Math.pow(r(), .7) * 330, s = .5 + (cy - 600) / 360;
        for (let j = 0, n = 2 + Math.floor(r() * 4); j < n; j++) fountain(r, face, cx + (r() - .5) * 80 * s, cy + (r() - .5) * 12 * s, s * (.6 + r() * .4), .25, 6 + Math.floor(r() * 5), -2);
      }
      for (let x = FX - 236; x < FX + 206; x += 9 + r() * 12) fountain(r, front, x, hill(x) + 10, .38 + r() * .2, .4, 5, -1);
      let flowers = '';
      for (const [x, h, lean] of [[FX - 262, 24, -4], [FX - 252, 30, 3], [FX + 226, 34, 5], [FX + 244, 22, -3], [FX + 420, 26, 4], [FX - 420, 22, 2]])
        flowers += daisy(x, hill(x) + 6, h, 1, lean);
      for (let i = 0; i < 40; i++) {                   // small white flowers dotted down the slope
        const x = -100 + r() * 1800, y = hill(x) + 30 + r() * 320, k = .5 + (y - 600) / 300;
        flowers += `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(1.6 * k)}" fill="${C.w}" opacity=".8"/>`;
      }

      const body = K.fig(ME.d, FX, FY, FS, {extra: stalk, rot: 2});

      // the tree on the left: an out-of-focus trunk, and a canopy of leaves the camera finds when it looks up
      let canopy = '';
      for (let i = 0; i < 46; i++) {
        const t = r(), cx = -300 + Math.pow(t, .7) * 1000 + (r() - .5) * 120, cy = -1250 + r() * 560 + t * 180, edge = t > .7 || r() < .25;
        for (let j = 0; j < 9 + Math.floor(r() * 8); j++) {
          const a = r() * 360, d = r() * 46, x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d * .7, sc = .8 + r() * 1.1;
          const col = edge ? [C.b2, C.b3, C.b4][Math.floor(r() * 3)] : [C.b1, C.b2, C.b2, C.b3][Math.floor(r() * 4)];
          canopy += `<path transform="translate(${n1(x)} ${n1(y)}) rotate(${n1(a + (r() - .5) * 60)}) scale(${n1(sc)})" d="M0 0C6 -7 18 -9 30 0C18 9 6 7 0 0Z" fill="${col}"/>`;
        }
      }
      for (const [x, y0, len] of [[520, -780, 320], [610, -720, 420], [200, -660, 250]]) {     // vines hanging down
        canopy += `<path d="M${x} ${y0}q10 ${len / 2} -6 ${len}" stroke="${C.b3}" stroke-width="1.6" fill="none"/>`;
        for (let y = y0 + 26; y < y0 + len; y += 30 + r() * 16) { const sd = r() < .5 ? 1 : -1;
          canopy += `<path transform="translate(${x + sd * 2} ${n1(y)}) rotate(${sd * 40 + 90}) scale(.45)" d="M0 0C6 -7 18 -9 30 0C18 9 6 7 0 0Z" fill="${C.b3}"/>`; }
      }
      const trunk = `<path d="M-500 1300L-500 -1300C-260 -1200 -110 -1000 -20 -760C40 -620 60 -300 100 0C130 300 120 800 160 1300Z" fill="${C.b1}"/>
        <path d="M-20 -760C80 -900 200 -980 360 -1020" stroke="${C.b1}" stroke-width="42" fill="none" stroke-linecap="round"/>`;

      // right against the lens: tall grass at the bottom corners, out of focus
      const near = PAL.map(() => '');
      for (let i = 0; i < 18; i++) fountain(r, near, i % 2 ? -120 + r() * 420 : 1240 + r() * 520, 960, 3.4 + r() * 2, .2, 8, -1);
      const fg = near.map((d, c) => d && `<path d="${d}" stroke="${PAL[c]}" stroke-width="7" stroke-linecap="round" fill="none"/>`).join('');

      return [
        {z: .95, svg: sky},
        {z: .96, html: `<svg class="hdrift" viewBox="0 0 1600 900" overflow="visible">${clouds}</svg>`},
        {z: .96, html: kite},
        {z: .96, svg: `<g style="color:${C.b3}">${birds}</g>`},
        {z: .98, svg: far},
        {z: 1, svg: ground + flowers},
        {z: 1, html: sway(back, 1.4, .5, r) + sway(face, 2, .8, r)},
        {z: 1, svg: body + `<g id="hflies">${FLY.map((_, i) => fly(i)).join('')}</g>`},
        {z: 1, html: sway(front, 1.5, .6, r)},
        {z: 1.12, cls: 'blur2', svg: canopy},
        {z: 1.15, cls: 'blur12', svg: trunk},
        {z: 1.3, cls: 'blur12', svg: fg},
        {z: 0, html: '<div class="hbloom"></div>'},
      ];
    },
    // ease in on him, then tilt up past the tree into the sky
    // (phones in portrait pull back so all of him fits across the screen)
    cam: p => ({zoom: (innerWidth < innerHeight ? .8 : 1) * keys(p, [[0, 1.04], [.45, 1.14], [.62, 1.05], [1, 1]]), ox: FX, oy: FY - 40, y: keys(p, [[0, 0], [.48, 0], [.98, -1160]])}),
    frame(p, st) {
      const up = span(p, .45, 1);
      FLY.forEach(([x, y, s, ph], i) => {
        const el = st.querySelector('#hb' + i);
        if (!el) return;
        const t = p * 9 + ph;
        el.setAttribute('transform', `translate(${n1(x + Math.sin(t * 1.3) * 70 + p * 140)} ${n1(y + Math.cos(t * 1.9) * 26 - up * (420 + i * 70))}) rotate(${n1(Math.sin(t * 2.2) * 18)}) scale(${s})`);
      });
      const bloom = st.querySelector('.hbloom');
      if (bloom) bloom.style.opacity = (span(p, .82, 1) * .92).toFixed(3);
    },
  });
})();
