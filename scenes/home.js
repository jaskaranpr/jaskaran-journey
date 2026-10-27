// Home: an afternoon lying on a grassy slope, seen from above like the end of the Fold film. White butterflies,
// a tree leaning in from the left, the poplars and water tower of Chakar far off. As the scene ends the camera
// tilts up past the tree into the sky, and the sun takes over.
(() => {
  const {C, rng, keys, span, n1, bird} = K;
  const FX = 800, FY = 560, FS = 1.86;                      // where he lies and his scale
  const ridge = x => -40 + 250 * Math.pow(Math.max(0, x + 600) / 2700, 1.8) + Math.sin(x / 170) * 9 + Math.sin(x / 61 + 1) * 4;   // the crest, higher on the left
  const rd = Math.round;

  // a fountain of grass: thin strokes from one patch of ground, arching out, lighter where the sun catches them
  const PAL = [C.b2, C.b3, C.b4, C.b5, C.b6, C.w];
  function fountain(r, out, x, y, s, light, n = 9 + Math.floor(r() * 9)) {
    const lean = (r() - .45) * .5;
    for (let b = 0; b < n; b++) {
      const f = b / (n - 1) - .5, a = lean + f * (1 + r() * .5) + (r() - .5) * .2;
      const h = (22 + r() * 40) * s * (1 - Math.abs(f) * .6), tx = Math.sin(a) * h, ty = -Math.cos(a) * h * .9;
      const c = 2 + (r() < .55 ? 1 : 0) + (r() < light ? 1 : 0) + (r() < light * .25 ? 1 : 0) - (r() < .2 ? 1 : 0);
      out[Math.min(5, Math.max(0, c))] += `M${rd(x + f * 10 * s)} ${rd(y)}q${rd(tx * .15)} ${rd(ty * .65)} ${rd(tx)} ${rd(ty)}`;
    }
  }
  // grass in strips by depth; each strip is one small svg that sways on the compositor, one path per colour
  const STRIPS = [[-60, 200, 1], [200, 420, 1.4], [420, 640, 1.9], [640, 860, 2.4], [860, 1240, 3]];
  function slope(r, front) {
    const strips = STRIPS.map(() => PAL.map(() => ''));
    for (let i = 0; i < (front ? 260 : 1500); i++) {
      const x = -560 + r() * 2720, top = ridge(x), t = r(), y = top + 14 + t * (1240 - top);
      const d = Math.hypot((x - FX) / 420, (y - FY - 20) / 120);
      const k = STRIPS.findIndex(([, b]) => y < b), s = .55 + 1.25 * Math.max(0, (y + 60) / 1300);
      if (front) { if (d > .78 && d < 1.12 && y > FY) fountain(r, strips[Math.max(0, k)], x, y, s * .7, .4, 7); continue; }   // blades over his edge
      if (d < 1.1 && r() > (d - .55) * 1.6) continue;                                   // he's lying here, the grass is pressed
      fountain(r, strips[Math.max(0, k)], x, y, s, .32 + (x > 900 ? .12 : 0));
    }
    // along the crest the grass stands up against the sky, a dense row of spikes
    if (!front) for (let x = -560; x < 2160; x += 7 + r() * 9) fountain(r, strips[0], x, ridge(x) + 10, .7 + r() * .5, .15, 5);
    return strips.map((cols, k) => `<svg class="hg" viewBox="0 0 1600 900" overflow="visible" style="--d:${n1(5 + r() * 3)}s;--dl:-${n1(r() * 5)}s;--k:${n1(.3 + k * .25)};--oy:${n1(STRIPS[k][1] / 9)}%">` +
      cols.map((d, c) => d && `<path d="${d}" stroke="${PAL[c]}" stroke-width="${n1(STRIPS[k][2] * (c > 3 ? .8 : 1))}" stroke-linecap="round" fill="none"${c === 5 ? ' opacity=".8"' : ''}/>`).join('') + '</svg>').join('');
  }
  // a whorl of pointed leaves, like the tree in the film
  const whorl = (r, x, y, s, col) => {
    let o = '';
    const n = 5 + Math.floor(r() * 3), a0 = r() * 360;
    for (let i = 0; i < n; i++) o += `<path transform="translate(${n1(x)} ${n1(y)}) rotate(${n1(a0 + i * 360 / n + (r() - .5) * 20)}) scale(${n1(s * (.8 + r() * .4))})" d="M0 0C6 -6 18 -8 30 0C18 8 6 6 0 0Z"/>`;
    return `<g fill="${col}">${o}</g>`;
  };
  // a butterfly: two wings that flap on their own, moved each frame
  const fly = i => `<g id="hb${i}"><g class="hw" style="animation-duration:${(.15 + i % 3 * .03).toFixed(2)}s;animation-delay:-${(i * .07).toFixed(2)}s">` +
    `<path d="M0 0C-6 -10 -15 -8 -12 -1C-15 4 -8 9 0 2Z" fill="${C.w}"/><path d="M0 0C6 -10 15 -8 12 -1C15 4 8 9 0 2Z" fill="${C.w}"/></g>` +
    `<path d="M0 -4V5" stroke="${C.b7}" stroke-width="1.3" stroke-linecap="round"/></g>`;
  const FLY = [[560, 430, 1.5, 0], [1010, 400, 1.2, 1.7], [1180, 560, 1.6, 3.1], [430, 640, 1.2, 4.4], [1320, 420, 1.1, 2.2], [300, 380, 1, 5.6], [880, 700, 1.4, .9]];

  scene('home', {
    bg: C.b3,
    focus: FX + 38,                                   // his middle, so phones keep head and feet
    css: `.hg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;transform-origin:50% var(--oy);
        animation:hsway var(--d) ease-in-out var(--dl) infinite alternate}
      @keyframes hsway{from{transform:skewX(calc(var(--k)*-1.3deg))}to{transform:skewX(calc(var(--k)*2deg))}}
      .s-home .hw{transform-box:fill-box;transform-origin:50% 50%;animation:hflap .2s ease-in-out infinite alternate}
      @keyframes hflap{to{transform:scaleX(.18)}}
      .s-home .hdrift{position:absolute;inset:0;width:100%;height:100%;animation:drift 70s linear infinite alternate}
      .s-home .hbloom{position:absolute;inset:-25%;background:radial-gradient(closest-side,#fdfdfd,rgba(253,253,253,.9) 50%,rgba(214,233,246,0));opacity:0}
      @media (prefers-reduced-motion:reduce){.hg,.s-home .hw,.s-home .hdrift{animation:none}}`,
    layers() {
      const r = rng(77);
      // the sky: deep enough near the top for white words to read, pale at the horizon; the sun waits up high
      const sky = `<linearGradient id="hSky" gradientUnits="userSpaceOnUse" x1="0" y1="-1700" x2="0" y2="0">
          <stop offset="0" stop-color="${C.b4}"/><stop offset=".45" stop-color="${C.b5}"/><stop offset=".85" stop-color="${C.b6}"/><stop offset="1" stop-color="${C.b7}"/></linearGradient>
        <rect x="-700" y="-2000" width="3000" height="2400" fill="url(#hSky)"/>
        <circle cx="1170" cy="-960" r="580" fill="url(#gGlow)" opacity=".9"/>
        <circle cx="1170" cy="-960" r="54" fill="${C.w}" filter="url(#b1)"/>`;
      let clouds = '';
      for (const [cx, cy, sc, o] of [[300, -1320, 1.5, .75], [1460, -1280, 1.2, .65], [560, -980, 1.1, .8], [1540, -760, 1.3, .7], [160, -620, 1.2, .7], [900, -520, 1, .6], [1300, -360, .8, .55], [520, -260, .8, .5]]) {
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
        Array.from({length: 5}, (_, i) => bird(n1(420 + i * 28 + r() * 20), n1(-760 + r() * 30), .6, r())).join('');

      // far off beyond the slope: the plain with Chakar's poplars and water tower in the haze
      const HZ = -110;
      let far = `<linearGradient id="hPlain" gradientUnits="userSpaceOnUse" x1="0" y1="${HZ}" x2="0" y2="${HZ + 260}"><stop offset="0" stop-color="${C.b6}"/><stop offset=".5" stop-color="${C.b5}"/><stop offset="1" stop-color="${C.b4}"/></linearGradient>
        <rect x="-700" y="${HZ}" width="3000" height="420" fill="url(#hPlain)"/>`;
      for (let i = 0; i < 70; i++) { const y = HZ + 8 + Math.pow(r(), 1.6) * 220, k = .4 + (y - HZ) / 140;     // copses scattered over the plain
        far += `<ellipse cx="${n1(-600 + r() * 2900)}" cy="${n1(y)}" rx="${n1((10 + r() * 22) * k)}" ry="${n1((3 + r() * 4) * k)}" fill="${C.b4}" opacity="${n1(.25 + r() * .25)}"/>`; }
      for (let x = -600; x < 2300; x += 10 + r() * 30) far += `<ellipse cx="${n1(x)}" cy="${n1(HZ - r() * 5)}" rx="${n1(10 + r() * 26)}" ry="${n1(6 + r() * 12)}" fill="${C.b5}" opacity="${n1(.4 + r() * .35)}"/>`;
      for (let i = 0; i < 24; i++) { const x = 1080 + i * 17 + r() * 6, h = 46 + r() * 24;
        far += `<ellipse cx="${n1(x)}" cy="${n1(HZ - h * .5)}" rx="${n1(h * .07)}" ry="${n1(h * .5)}" fill="${C.b5}" opacity=".85"/>`; }
      far += `<g fill="${C.b5}" opacity=".85" transform="translate(40 ${HZ - 540})"><path d="M300 540L307 470M334 540L327 470M300 540L334 486M334 540L300 486" stroke="${C.b5}" stroke-width="2" fill="none"/>
        <rect x="294" y="444" width="46" height="28" rx="5"/><path d="M294 446Q317 432 340 446Z"/></g>` + K.fog(HZ + 6, 30, .6, C.b7, 1900, 800);

      // the slope: deep blue, lighter toward the crest where the sky reflects, soft patches of sun
      let crest = `M-700 ${n1(ridge(-700))}`;
      for (let x = -650; x <= 2300; x += 50) crest += `L${x} ${n1(ridge(x))}`;
      const ground = `<linearGradient id="hGround" gradientUnits="userSpaceOnUse" x1="0" y1="-40" x2="0" y2="1200">
          <stop offset="0" stop-color="${C.b4}"/><stop offset=".3" stop-color="${C.b3}"/><stop offset="1" stop-color="${C.b2}"/></linearGradient>
        <path d="${crest}L2300 1500L-700 1500Z" fill="url(#hGround)"/>
        ${[[300, 300, 300, 70], [1300, 320, 320, 70], [700, 860, 420, 100], [1450, 760, 280, 90], [100, 700, 240, 80]].map(([x, y, rx, ry]) =>
          `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${C.b5}" opacity=".18" filter="url(#b30)"/>`).join('')}
        <ellipse cx="${FX}" cy="${FY + 6}" rx="420" ry="118" fill="${C.b4}" opacity=".45" filter="url(#b16)"/>
        <ellipse cx="${FX + 20}" cy="${FY + 18}" rx="300" ry="34" fill="${C.b1}" opacity=".45" filter="url(#b8)"/>`;
      // the grass he's lying on, pressed flat: short strokes all leaning one way
      let flat = '';
      for (let i = 0; i < 300; i++) {
        const a = r() * 6.283, d = Math.sqrt(r()), x = FX + Math.cos(a) * d * 410, y = FY + 16 + Math.sin(a) * d * 118, l = 14 + r() * 26;
        flat += `M${rd(x)} ${rd(y)}l${rd(l)} ${rd(-l * .2)}`;
      }
      const flats = `<path d="${flat}" stroke="${C.b5}" stroke-width="1.6" stroke-linecap="round" opacity=".4" fill="none"/>`;
      const fl = (() => {   // small white flowers dotted through the grass
        let d = '';
        for (let i = 0; i < 120; i++) {
          const x = -400 + r() * 2400, top = ridge(x), y = top + 30 + r() * (1150 - top), k = .5 + (y + 60) / 1300 * 1.1;
          if (Math.hypot((x - FX) / 420, (y - FY) / 120) < 1) continue;
          for (let j = 0; j < 5; j++) { const a = j / 5 * 6.283, px = x + Math.cos(a) * 3 * k, py = y + Math.sin(a) * 2 * k;
            d += `M${n1(px - 1.8 * k)} ${n1(py)}a${n1(1.8 * k)} ${n1(1.5 * k)} 0 1 0 ${n1(3.6 * k)} 0a${n1(1.8 * k)} ${n1(1.5 * k)} 0 1 0 ${n1(-3.6 * k)} 0`; }
        }
        return `<path d="${d}" fill="${C.w}" opacity=".85"/>`;
      })();

      // him, on his back with his hands behind his head and one knee up, the slope tilting him a little
      const me = FIG.side({y: -11, lean: -90, neck: -94, head: -100, legs: [{thigh: 128, knee: 96}, {thigh: 92, knee: 4}],
        arms: [{upper: -140, elbow: 162}, {upper: -152, elbow: 166}]});
      const body = K.fig(me.d, FX + 30, FY + 10, FS, {cls: 'breathe', rot: -5});

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

      // right against the lens: big soft flowers and grass at the bottom corners
      let fg = '';
      for (const [x, y, sc, c] of [[90, 900, 2.6, C.b4], [300, 1000, 2, C.b3], [-60, 740, 1.8, C.b4], [1500, 940, 2.4, C.b4], [1320, 1040, 1.8, C.b3]])
        fg += `<g transform="translate(${x} ${y}) scale(${sc})" fill="${c}"><circle cx="0" cy="-22" r="20"/><circle cx="22" cy="0" r="20"/><circle cx="0" cy="22" r="20"/><circle cx="-22" cy="0" r="20"/><circle r="14" fill="${C.b5}"/></g>`;
      const bladesFg = PAL.map(() => '');
      for (let i = 0; i < 16; i++) fountain(r, bladesFg, i % 2 ? -120 + r() * 400 : 1260 + r() * 500, 1000, 4 + r() * 2, .2, 8);
      fg += bladesFg.map((d, c) => d && `<path d="${d}" stroke="${PAL[Math.max(0, c - 1)]}" stroke-width="7" stroke-linecap="round" fill="none"/>`).join('');

      return [
        {z: .95, svg: sky},
        {z: .96, html: `<svg class="hdrift" viewBox="0 0 1600 900" overflow="visible">${clouds}</svg>`},
        {z: .96, svg: `<g style="color:${C.b3}">${birds}</g>`},
        {z: .98, svg: far},
        {z: 1, svg: ground + flats + fl},
        {z: 1, html: slope(r, false)},
        {z: 1, svg: body + `<g id="hflies">${FLY.map((_, i) => fly(i)).join('')}</g>`},
        {z: 1, html: slope(r, true)},
        {z: 1.12, cls: 'blur2', svg: canopy},
        {z: 1.15, cls: 'blur12', svg: trunk},
        {z: 1.3, cls: 'blur12', svg: fg},
        {z: 0, html: '<div class="hbloom"></div>'},
      ];
    },
    // ease in on him, then tilt up past the tree into the sky
    cam: p => ({zoom: keys(p, [[0, 1.01], [.42, 1.06], [.62, 1.02], [1, 1]]), ox: FX + 40, oy: FY, y: keys(p, [[0, 0], [.48, 0], [.98, -1160]])}),
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
