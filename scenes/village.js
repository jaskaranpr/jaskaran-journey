// Chakar at dawn. Fields to the horizon, the water tower and the gurdwara far off, poplars along the field edge,
// and a kid riding his bicycle down the dirt road to the government school. The camera follows him.
(() => {
  const {C, rng, keys, n1, fog, bird} = K;
  const ROAD = 806, S = 1.18, X0 = 240, X1 = 1835, HZ = 548;  // HZ: the horizon    // he rides from X0 to X1 on the road, S board units per cm
  const R = 28, CRANK = 14;                          // bicycle wheel radius and crank length (cm)

  // a classic black roadster, kid-sized, with a carrier on the back and his school bag strapped to it
  const BB = {x: 36, y: -26}, SEAT = {x: 24, y: -74}, GRIP = {x: 70, y: -80};
  const wheel = (cx, id) => {
    let spokes = '';
    for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; spokes += `M${n1(Math.cos(a) * 3)} ${n1(Math.sin(a) * 3)}L${n1(Math.cos(a + .3) * (R - 2.5))} ${n1(Math.sin(a + .3) * (R - 2.5))}`; }
    return `<g transform="translate(${cx} ${-R})"><circle r="${R - 1.4}" fill="none" stroke="${C.b7}" stroke-width="2.6"/>` +
      `<circle r="${R - 3.4}" fill="none" stroke="${C.b6}" stroke-width=".7" opacity=".7"/><g id="${id}"><path d="${spokes}" stroke="${C.b6}" stroke-width=".45" opacity=".8"/></g>` +
      `<circle r="2.6" fill="${C.b7}"/><path d="M${-R - 3} -6A${R + 4} ${R + 4} 0 0 1 ${R + 2} -8" fill="none" stroke="${C.b6}" stroke-width="2.2"/></g>`;
  };
  const bike = `<g class="bike" stroke-linecap="round" stroke-linejoin="round">
    ${wheel(0, 'vwr')}${wheel(98, 'vwf')}
    <path d="M0 ${-R}L${BB.x} ${BB.y}L28 -66L0 ${-R}M28 -66L84 -68L${BB.x} ${BB.y}M84 -68L87 -56L95 -38L98 ${-R}M84 -68L82 -78L${GRIP.x} ${GRIP.y}" fill="none" stroke="${C.b7}" stroke-width="2.4"/>
    <path d="M-14 -58H22M-10 -58L0 ${-R}M18 -58L6 ${-R}" fill="none" stroke="${C.b6}" stroke-width="1.6"/>
    <rect x="-12" y="-75" width="27" height="17" rx="4" fill="${C.b6}"/><path d="M-8 -75V-58M10 -75V-58" stroke="${C.b4}" stroke-width="1.4"/>
    <path d="M15 -76Q24 -79 33 -75Q24 -72 15 -76Z" fill="${C.b7}"/>
    <circle cx="${BB.x}" cy="${BB.y}" r="8" fill="none" stroke="${C.b7}" stroke-width="1.8"/>
    <g id="vcrank" transform="translate(${BB.x} ${BB.y})"><path d="M0 0L${CRANK} 0M0 0L${-CRANK} 0" stroke="${C.b7}" stroke-width="2.4"/></g></g>`;

  // tree shapes: an acacia's flat umbrella, a round neem, a narrow poplar
  const kikar = (x, y, s, col, lit, seed = 1) => {
    const r = rng(seed);
    let out = `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0C3 -26 -4 -46 -26 -66M-1 -24C10 -40 26 -54 44 -62M-5 -40C-16 -52 -34 -58 -52 -60M8 -44C6 -56 4 -64 -2 -74" stroke="${col}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
    for (const [cx, cy, w] of [[-34, -66, 34], [26, -70, 40], [-6, -78, 36], [42, -62, 20], [-52, -60, 18]])
      for (let i = 0; i < 9; i++) out += `<ellipse cx="${n1(cx + (r() - .5) * w * 1.6)}" cy="${n1(cy + (r() - .5) * 7)}" rx="${n1(8 + r() * 10)}" ry="${n1(3.5 + r() * 3)}" fill="${col}"/>`;
    for (let i = 0; i < 7; i++) out += `<ellipse cx="${n1(-10 + r() * 60)}" cy="${n1(-84 + r() * 16)}" rx="${n1(6 + r() * 8)}" ry="2.4" fill="${lit}" opacity=".45"/>`;
    return out + '</g>';
  };
  const round = (x, y, s, col, lit, seed) => {
    const r = rng(seed);
    let out = `<path d="M${x} ${y}L${x} ${y - 46 * s}" stroke="${col}" stroke-width="${6 * s}"/>`;
    for (let i = 0; i < 9; i++) out += `<circle cx="${n1(x + (r() - .5) * 70 * s)}" cy="${n1(y - 62 * s - r() * 44 * s)}" r="${n1((18 + r() * 14) * s)}" fill="${col}"/>`;
    for (let i = 0; i < 4; i++) out += `<circle cx="${n1(x + (8 + r() * 26) * s)}" cy="${n1(y - (80 + r() * 30) * s)}" r="${n1((7 + r() * 6) * s)}" fill="${lit}" opacity=".22"/>`;
    return out;
  };
  const poplar = (x, y, h, col, lit, r) => {
    const w = h * (.05 + r() * .03), lean = (r() - .5) * 6;
    let out = `<path d="M${x} ${y}L${n1(x + lean * .3)} ${n1(y - h * .25)}" stroke="${col}" stroke-width="${n1(w * .35)}"/>`;
    for (let i = 0; i < 7; i++) {
      const t = .2 + i * .11, ww = w * (1 - Math.abs(t - .5) * 1.1) * (.8 + r() * .5);
      out += `<ellipse cx="${n1(x + lean * t + (r() - .5) * w * .5)}" cy="${n1(y - h * t - h * .06)}" rx="${n1(ww)}" ry="${n1(h * .1)}" fill="${col}"/>`;
    }
    return out + `<ellipse cx="${n1(x + w * .35 + lean * .5)}" cy="${n1(y - h * .58)}" rx="${n1(w * .3)}" ry="${n1(h * .26)}" fill="${lit}" opacity=".35"/>`;
  };
  // a flat-roofed brick house: parapet, a window or two, often a water tank or a dish on the roof
  const house = (x, y, w, h, r, col, dark, lit) => {
    let out = `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${col}"/><rect x="${x - 2}" y="${y - h - 5}" width="${w + 4}" height="5" fill="${lit}" opacity=".6"/>` +
      `<rect x="${x + w - 4}" y="${y - h}" width="4" height="${h}" fill="${lit}" opacity=".35"/>`;
    const nw = Math.max(1, Math.floor(w / 36));
    for (let i = 0; i < nw; i++) out += `<rect x="${n1(x + 10 + i * (w - 20) / nw)}" y="${n1(y - h * .62)}" width="8" height="11" fill="${dark}"/>`;
    if (r() < .5) out += `<rect x="${n1(x + w * .3)}" y="${y - 22}" width="12" height="22" fill="${dark}"/>`;
    const k = r();
    if (k < .45) out += `<rect x="${n1(x + w * .55)}" y="${y - h - 17}" width="16" height="13" rx="3" fill="${dark}"/>`;          // water tank
    else if (k < .7) out += `<path d="M${n1(x + w * .3)} ${y - h - 5}l4 -9M${n1(x + w * .3 - 6)} ${y - h - 20}a9 9 0 0 0 14 8z" stroke="${dark}" stroke-width="1.5" fill="${dark}"/>`; // dish
    return out;
  };

  scene('village', {
    bg: C.b2,
    // on phones, keep the kid in frame as he rides (his x on screen, after the camera)
    focus: p => keys(p, [[0, X0], [.08, X0 + 40], [.9, X1 - 40], [.97, X1]]) - keys(p, [[0, 0], [.08, 0], [.97, 900]]) + 60,
    layers() {
      const r = rng(21);
      // sky: deep blue overhead, pale at the horizon, the sun just up
      const sky = `<linearGradient id="vSky" gradientUnits="userSpaceOnUse" x1="0" y1="-300" x2="0" y2="${HZ + 40}">
          <stop offset="0" stop-color="${C.b2}"/><stop offset=".4" stop-color="${C.b3}"/><stop offset=".72" stop-color="${C.b5}"/><stop offset=".9" stop-color="${C.b6}"/><stop offset="1" stop-color="${C.b7}"/></linearGradient>
        <rect x="-400" y="-300" width="2600" height="1500" fill="url(#vSky)"/>
        <circle cx="1160" cy="${HZ - 10}" r="460" fill="url(#gGlow)" opacity=".7"/>
        <circle cx="1160" cy="${HZ - 14}" r="34" fill="${C.w}" filter="url(#b1)"/>
        ${Array.from({length: 30}, () => `<circle cx="${n1(r() * 1700 - 50)}" cy="${n1(r() * 180)}" r="${n1(.6 + r())}" fill="${C.w}" opacity="${n1(.15 + r() * .45)}"/>`).join('')}`;
      // soft clouds: long thin streaks high up, a few low puffs lit from below near the sun
      let clouds = [[260, 150, 560, 10, .22], [880, 236, 700, 9, .28], [1350, 120, 460, 8, .18], [520, 330, 760, 11, .24], [1460, 380, 520, 9, .3]]
        .map(([x, y, w, h, o]) => `<ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="${h}" fill="${C.w}" opacity="${o}" filter="url(#b8)"/>`).join('');
      for (const [cx, cy, sc] of [[860, 480, 1], [1420, 470, .8], [300, 494, .7]]) {
        let puff = '';
        for (let i = 0; i < 9; i++) puff += `<circle cx="${n1(cx + (i - 4) * 22 * sc + (r() - .5) * 10)}" cy="${n1(cy - Math.sin(i / 8 * Math.PI) * 22 * sc)}" r="${n1((16 + r() * 14) * sc)}" fill="${C.b7}"/>`;
        clouds += `<g opacity=".55" filter="url(#b3)">${puff}<ellipse cx="${cx}" cy="${cy + 10 * sc}" rx="${110 * sc}" ry="${12 * sc}" fill="${C.w}"/></g>`;
      }
      const rays = [-150, -128, -104, -62, -40].map((a, i) => {
        const l = 1300, w = 5 + i % 3 * 2, ax = Math.cos(a * Math.PI / 180), ay = Math.sin(a * Math.PI / 180);
        return `<path d="M1160 ${HZ}L${n1(1160 + ax * l - ay * l * w / 100)} ${n1(HZ + ay * l + ax * l * w / 100)}L${n1(1160 + ax * l + ay * l * w / 100)} ${n1(HZ + ay * l - ax * l * w / 100)}Z" fill="${C.w}" opacity=".045"/>`;
      }).join('');

      // far: a hazy tree line, the water tower, the gurdwara with its flag, rows of poplars
      let far = '';
      for (let x = -300; x < 2300; x += 14 + r() * 22) far += `<circle cx="${n1(x)}" cy="${n1(HZ - 2 - r() * 8)}" r="${n1(8 + r() * 22)}" fill="${C.b5}"/>`;
      far += `<g fill="${C.b5}" transform="translate(0 ${HZ - 590})"><path d="M400 590L408 500M440 590L432 500M400 590L440 520M440 590L400 520" stroke="${C.b5}" stroke-width="2.4" fill="none"/>
        <rect x="392" y="468" width="56" height="34" rx="6"/><path d="M392 470Q420 452 448 470Z"/><rect x="418" y="446" width="4" height="10"/></g>
        <g fill="${C.b5}" transform="translate(0 ${HZ - 592})"><rect x="1390" y="540" width="120" height="52"/><rect x="1384" y="534" width="132" height="8"/>
        <path d="M1422 534Q1422 498 1450 486Q1478 498 1478 534Z"/><path d="M1450 486V472" stroke="${C.b5}" stroke-width="2"/><circle cx="1450" cy="471" r="3"/>
        <path d="M1394 534Q1394 518 1402 512Q1410 518 1410 534ZM1490 534Q1490 518 1498 512Q1506 518 1506 534Z"/>
        <rect x="1414" y="556" width="10" height="20" fill="${C.b6}" opacity=".6"/><rect x="1444" y="552" width="12" height="24" fill="${C.b6}" opacity=".6"/><rect x="1476" y="556" width="10" height="20" fill="${C.b6}" opacity=".6"/>
        <path d="M1560 592V430" stroke="${C.b5}" stroke-width="2.6"/><path class="sway" d="M1561 432L1600 446L1561 458Z"/></g>`;
      for (let i = 0; i < 18; i++) far += poplar(n1(660 + i * 19 + r() * 8), HZ + 2, 46 + r() * 22, C.b5, C.b7, r);

      // middle: the fields, the village, an acacia, poplars along a field edge, smoke from a kitchen fire
      const VP = 820;
      let mid = `<linearGradient id="vField" gradientUnits="userSpaceOnUse" x1="0" y1="${HZ}" x2="0" y2="760"><stop offset="0" stop-color="${C.b5}"/><stop offset=".25" stop-color="${C.b4}"/><stop offset="1" stop-color="${C.b3}"/></linearGradient>
        <rect x="-400" y="${HZ}" width="3000" height="500" fill="url(#vField)"/>`;
      for (let i = -50; i <= 50; i++) mid += `<path d="M${VP + i * 5} ${HZ}L${VP + i * 150} 1000" stroke="${i % 2 ? C.b3 : C.b5}" stroke-width="${n1(.8 + Math.abs(i) * .05)}" opacity=".28"/>`;
      [[120, 44, 42], [168, 60, 52], [232, 40, 34], [276, 70, 46], [352, 52, 38], [408, 78, 60], [492, 46, 40], [542, 64, 50], [612, 44, 34]]
        .forEach(([x, w, h]) => mid += house(x, HZ + 38, w, h, r, C.b4, C.b2, C.b6));
      mid += round(90, HZ + 40, 1.1, C.b3, C.b5, 4) + round(680, HZ + 38, .9, C.b3, C.b5, 5) +
        kikar(990, HZ + 46, 1.5, C.b2, C.b5, 3) +
        `<g transform="translate(760 ${HZ + 30}) scale(.9)" fill="${C.b2}"><ellipse cx="-40" cy="-6" rx="34" ry="5" fill="${C.b6}" opacity=".45" filter="url(#b3)"/>
          <rect x="-16" y="-24" width="30" height="12" rx="2"/><rect x="-6" y="-38" width="14" height="15" rx="2"/><path d="M10 -24V-36" stroke="${C.b2}" stroke-width="2"/>
          <circle cx="-10" cy="-8" r="10"/><circle cx="16" cy="-5" r="6"/><circle cx="-10" cy="-8" r="3.5" fill="${C.b4}"/><path d="M-22 -12L-44 -4" stroke="${C.b2}" stroke-width="2.4"/></g>`;
      for (let i = 0; i < 14; i++) mid += poplar(n1(1190 + i * 30 + r() * 10), HZ + 44 + i * 1.2, 120 + r() * 40, C.b2, C.b5, r);
      for (let i = 0; i < 8; i++) mid += kikar(n1(1720 + i * 110 + r() * 30), HZ + 40, .7 + r() * .25, C.b3, C.b5, 10 + i);

      // nearer: a wheat field, every stalk drawn, catching the low sun on its right side
      let wheat = `<rect x="-400" y="640" width="3400" height="400" fill="${C.b3}"/><rect x="-400" y="636" width="3400" height="10" fill="${C.b4}" filter="url(#b3)"/>`;
      for (let g = 0; g < 8; g++) {
        let grp = '';
        for (let i = 0; i < 150; i++) {
          const x = -300 + g * 400 + r() * 420, y = 650 + Math.pow(r(), .8) * 140, h = 22 + (y - 650) * .3 + r() * 16, l = (r() - .4) * 9;
          const ex = x + l, ey = y - h;
          grp += `<path d="M${n1(x)} ${n1(y)}Q${n1(x + l * .4)} ${n1(y - h * .5)} ${n1(ex)} ${n1(ey)}" stroke="${r() < .5 ? C.b2 : C.b3}" stroke-width="1.5" fill="none"/>` +
            `<ellipse cx="${n1(ex)}" cy="${n1(ey - 5)}" rx="2.6" ry="7" fill="${r() < .3 ? C.b5 : C.b4}" transform="rotate(${n1(l * 3)} ${n1(ex)} ${n1(ey - 5)})"/>` +
            (r() < .45 ? `<path d="M${n1(ex + 1.6)} ${n1(ey - 11)}q1 6 0 11" stroke="${C.b6}" stroke-width="1.1" fill="none" opacity=".7"/>` : '');
        }
        wheat += grp;
      }

      // near: the road, power lines and the school at the end of the road
      const poles = [120, 640, 1160, 1680, 2200, 2720], top = 530, base = ROAD - 24;
      let near = '';
      poles.forEach((x, i) => {
        near += `<path d="M${x} ${base}V${top - 8}" stroke="${C.b1}" stroke-width="7"/><path d="M${x - 34} ${top + 6}H${x + 34}" stroke="${C.b1}" stroke-width="5"/>` +
          `<circle cx="${x - 28}" cy="${top}" r="3" fill="${C.b6}"/><circle cx="${x + 28}" cy="${top}" r="3" fill="${C.b6}"/>`;
        if (i) for (const dx of [-28, 28]) near += `<path d="M${poles[i - 1] + dx} ${top}Q${(poles[i - 1] + x) / 2 + dx} ${top + 48} ${x + dx} ${top}" fill="none" stroke="${C.b1}" stroke-width="1.6"/>`;
      });
      [[300, 1], [318, 1], [356, 1], [820, 0], [846, 0], [1450, 1]].forEach(([x, w]) => {     // birds sitting on the wires
        const i = Math.floor((x - 120) / 520) + 1, a = poles[i - 1] + (w ? 28 : -28), b = poles[i] + (w ? 28 : -28), t = (x - a) / (b - a), y = top + 2 * t * (1 - t) * 48;
        near += `<g transform="translate(${x} ${n1(y)})"><ellipse cx="0" cy="-4" rx="4.5" ry="3.6" fill="${C.b1}"/><circle cx="3" cy="-8" r="2.4" fill="${C.b1}"/><path d="M-4 -3L-9 1" stroke="${C.b1}" stroke-width="1.6"/></g>`;
      });
      near += `<g>${round(1950, base - 52, 1.35, C.b2, C.b5, 9)}
        <rect x="1960" y="604" width="500" height="130" fill="${C.b4}"/><rect x="1950" y="594" width="520" height="12" fill="${C.b6}" opacity=".75"/>
        <rect x="2380" y="572" width="44" height="24" rx="4" fill="${C.b2}"/>
        ${[0, 1, 2, 3, 4].map(i => `<path d="M${2000 + i * 88} 734V664A31 31 0 0 1 ${2062 + i * 88} 664V734Z" fill="${C.b1}"/>`).join('')}
        <rect x="1720" y="${base - 58}" width="900" height="58" fill="${C.b3}"/><rect x="1716" y="${base - 64}" width="908" height="8" fill="${C.b6}" opacity=".8"/>
        <rect x="1880" y="${base - 112}" width="26" height="112" fill="${C.b4}"/><rect x="1984" y="${base - 112}" width="26" height="112" fill="${C.b4}"/>
        <path d="M1880 ${base - 112}A65 44 0 0 1 2010 ${base - 112}" stroke="${C.b4}" stroke-width="12" fill="none"/>
        <rect x="1898" y="${base - 172}" width="94" height="30" rx="2" fill="${C.w}"/>
        <text x="1945" y="${base - 151}" text-anchor="middle" font-family="Noto Sans Gurmukhi, sans-serif" font-size="15" font-weight="500" fill="${C.ink}">ਸਰਕਾਰੀ ਸਕੂਲ</text>
        <path d="M1916 ${base - 142}V${base - 112}M1974 ${base - 142}V${base - 112}" stroke="${C.b4}" stroke-width="3"/>
        <rect x="1906" y="${base - 60}" width="78" height="60" fill="${C.b1}"/></g>`;
      near += `<path d="M-400 ${ROAD - 26}C400 ${ROAD - 32} 1200 ${ROAD - 20} 3000 ${ROAD - 28}L3000 1000L-400 1000Z" fill="${C.b4}"/>
        <path d="M-400 ${ROAD - 8}C600 ${ROAD - 14} 1500 ${ROAD - 2} 3000 ${ROAD - 10}M-400 ${ROAD + 14}C600 ${ROAD + 8} 1500 ${ROAD + 20} 3000 ${ROAD + 12}" stroke="${C.b3}" stroke-width="3" fill="none" opacity=".7"/>
        <path d="M-400 ${ROAD + 30}C700 ${ROAD + 24} 1600 ${ROAD + 36} 3000 ${ROAD + 28}L3000 1100L-400 1100Z" fill="${C.b2}"/>
        ${Array.from({length: 90}, () => `<ellipse cx="${n1(-300 + r() * 3200)}" cy="${n1(ROAD - 22 + r() * 50)}" rx="${n1(1 + r() * 3)}" ry="${n1(.8 + r() * 1.5)}" fill="${C.b5}" opacity=".6"/>`).join('')}`;
      for (let i = 0; i < 300; i++) {
        const x = -300 + r() * 3000, y = ROAD + 34 + r() * 70, h = 10 + r() * 22, l = (r() - .5) * 10;
        near += `<path d="M${n1(x)} ${n1(y)}q${n1(l / 2)} ${n1(-h / 2)} ${n1(l)} ${n1(-h)}" stroke="${r() < .5 ? C.b1 : C.b3}" stroke-width="2" fill="none"/>`;
      }

      // foreground: tall wheat right against the lens, out of focus
      let fg = '';
      for (let i = 0; i < 40; i++) {
        const side = i % 2 ? -1 : 1, x = side > 0 ? -220 + r() * 520 : 1300 + r() * 1500, h = 120 + r() * 200, l = (r() - .5) * 50;
        fg += `<g><path d="M${n1(x)} 980Q${n1(x + l / 2)} ${n1(980 - h / 2)} ${n1(x + l)} ${n1(980 - h)}" stroke="${C.b0}" stroke-width="8" fill="none"/>` +
          `<ellipse cx="${n1(x + l)}" cy="${n1(966 - h)}" rx="9" ry="28" fill="${C.b1}" transform="rotate(${n1(l)} ${n1(x + l)} ${n1(966 - h)})"/></g>`;
      }
      const flock = Array.from({length: 9}, (_, i) => bird(n1(i * 26 + r() * 20), n1(Math.abs(i - 4) * 12 + r() * 8), .9 + r() * .3, r())).join('');

      return [
        {z: .03, svg: sky},
        {z: .05, cls: 'drift-l', svg: clouds},
        {z: .05, svg: `<g filter="url(#b8)">${rays}</g>`},
        {z: .1, svg: `<g id="vflock" style="color:${C.b1}">${flock}</g>`},
        {z: .3, svg: `<g class="kite"><path d="M470 300C520 380 400 460 432 ${HZ - 20}" stroke="${C.b1}" stroke-width="1" fill="none" opacity=".55"/>
          <path d="M470 286L482 300L470 316L458 300Z" fill="${C.b1}"/><path d="M470 316q-6 10 2 18q-8 8 0 16" stroke="${C.b1}" stroke-width="1.2" fill="none"/></g>`},
        {z: .18, svg: far + fog(HZ + 4, 24, .6, C.b7, 1700, 900)},
        {z: .4, svg: mid + fog(HZ + 70, 26, .2, C.b7, 1800, 1000)},
        {z: .4, svg: `<g class="smoke">${[0, 1, 2, 3].map(i => `<circle cx="300" cy="${HZ - 40}" r="${6 + i * 2}" fill="${C.b7}" style="animation-delay:-${i * 1.6}s" filter="url(#b3)"/>`).join('')}</g>`},
        {z: .7, svg: wheat},
        {z: 1, svg: near + `<g id="vrider"><g id="vbike">${bike}</g><path id="vkid" filter="url(#fuzz)" fill="${C.w}"/></g>`},
        {z: 1.5, cls: 'blur6 breeze', svg: fg},
      ];
    },
    cam: p => ({x: keys(p, [[0, 0], [.08, 0], [.97, 900]]), zoom: keys(p, [[0, 1.05], [.5, 1], [1, 1.04]]), oy: 760}),
    frame(p, st) {
      const rider = st.querySelector('#vrider');
      if (!rider) return;
      const x = keys(p, [[0, X0], [.08, X0 + 40], [.9, X1 - 40], [.97, X1]]);
      const dist = (x - X0) / S;                                       // centimetres ridden
      const crank = dist / 380 * 360;                                 // one turn of the pedals every 3.8 m
      st.querySelector('#vwr').setAttribute('transform', `rotate(${n1(dist / R * 57.3)})`);
      st.querySelector('#vwf').setAttribute('transform', `rotate(${n1(dist / R * 57.3)})`);
      st.querySelector('#vcrank').setAttribute('transform', `translate(${BB.x} ${BB.y}) rotate(${n1(crank)})`);
      const ped = a => ({x: BB.x + Math.cos(a * Math.PI / 180) * CRANK - 6, y: BB.y + Math.sin(a * Math.PI / 180) * CRANK - 6});
      const kid = FIG.side({x: SEAT.x, y: SEAT.y - 2, lean: 22, neck: 12, head: 2,
        legs: [{to: ped(crank), footAng: 8}, {to: ped(crank + 180), footAng: 8}],
        arms: [{to: GRIP}, {to: {x: GRIP.x - 3, y: GRIP.y + 1}}]}, 'kid', 13);
      st.querySelector('#vkid').setAttribute('d', kid.d);
      rider.setAttribute('transform', `translate(${n1(x)} ${ROAD}) scale(${S})`);
      st.querySelector('#vflock').setAttribute('transform', `translate(${n1(200 + p * 900)} ${n1(330 - p * 120)})`);
    },
  });
})();
