// Bengaluru, 2022, early morning. Towers going up into a pale sky, the metro sliding past on its viaduct, rain trees
// over the road, an auto overtaking. He walks to his first day at Peepal Co with his bag on his back. The camera walks with him.
(() => {
  const {C, rng, keys, span, n1, beam, fog, bird} = K;
  const FEET = 830, S = 2.2, X0 = 960, STEP = FIG.STRIDE * S;
  const X1 = X0 + 4 * STEP;                                       // four strides, so he stops with both feet down
  const walkX = p => keys(p, [[0, X0], [.88, X1 - 40], [1, X1]]);
  const BAG = [[-10, -52], [-18, -55], [-25, -51], [-28.5, -37], [-27.5, -22], [-21, -16.5], [-12, -17], [-9, -30]].map(([x, y]) => FIG.P(x, y));

  // a tower seen from below: a little narrower at the top and leaning in towards the middle of the street
  function tower(x, w, top, base, r, o) {
    const lean = (1050 - x - w / 2) * .06, tw = w * .9, tl = x + (w - tw) / 2 + lean;
    const body = `M${x} ${base}L${n1(tl)} ${top}L${n1(tl + tw)} ${top}L${x + w} ${base}Z`;
    const at = (t, u) => [x + (tl - x) * t + (w + (tw - w) * t) * u, base + (top - base) * t];   // t: 0 base..1 top, u: 0 left..1 right
    let out = `<path d="${body}" fill="${o.col}"/><path d="M${x + w - 10} ${base}L${n1(tl + tw - 9)} ${top}L${n1(tl + tw)} ${top}L${x + w} ${base}Z" fill="${C.b5}" opacity=".45"/>`;
    if (o.glass) {
      for (let u = .08; u < 1; u += .085) { const [ax, ay] = at(0, u), [bx, by] = at(1, u); out += `<path d="M${n1(ax)} ${ay}L${n1(bx)} ${by}" stroke="${C.b1}" stroke-width="1.6" opacity=".6"/>`; }
      for (let t = .04; t < 1; t += .045) { const [ax, ay] = at(t, 0), [bx, by] = at(t, 1); out += `<path d="M${n1(ax)} ${n1(ay)}L${n1(bx)} ${n1(by)}" stroke="${C.b1}" stroke-width="1" opacity=".45"/>`; }
      const [a1, b1] = at(.15, .2), [a2, b2] = at(.75, .05), [a3, b3] = at(.95, .55), [a4, b4] = at(.32, .78);
      out += `<path d="M${n1(a1)} ${n1(b1)}L${n1(a2)} ${n1(b2)}L${n1(a3)} ${n1(b3)}L${n1(a4)} ${n1(b4)}Z" fill="${C.w}" opacity=".1"/>`;
    } else {
      const rows = Math.floor((base - top) / o.row), cols = Math.max(3, Math.floor(w / o.col2));
      for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
        const t = (i + .3) / rows, u = (j + .22) / cols, [wx, wy] = at(t, u), ww = (w + (tw - w) * t) / cols * .56;
        const k = r(), fill = k < .03 ? C.b7 : k < .1 ? C.b5 : C.b1;
        out += `<rect x="${n1(wx)}" y="${n1(wy - o.row * .58)}" width="${n1(ww)}" height="${n1(o.row * .46)}" fill="${fill}" opacity="${k < .1 ? .75 : .55}"/>`;
      }
    }
    return out;
  }

  // a rain tree: a short thick trunk, limbs reaching out, and a wide flat-topped canopy over the road
  function rainTree(x, base, s, r) {
    let out = `<path d="M${x - 14 * s} ${base}C${x - 8 * s} ${base - 90 * s} ${x - 20 * s} ${base - 150 * s} ${x - 6 * s} ${base - 190 * s}L${x + 12 * s} ${base - 190 * s}C${x + 6 * s} ${base - 140 * s} ${x + 18 * s} ${base - 80 * s} ${x + 16 * s} ${base}Z" fill="${C.b1}"/>`;
    for (const [dx, dy] of [[-150, -270], [-70, -300], [40, -305], [150, -265], [-200, -230], [210, -225]])
      out += `<path d="M${x} ${base - 180 * s}Q${x + dx * .4 * s} ${base - 230 * s} ${x + dx * s} ${base + dy * s}" stroke="${C.b1}" stroke-width="${n1(9 * s)}" fill="none" stroke-linecap="round"/>`;
    for (let i = 0; i < 70; i++) {
      const a = r() * Math.PI, rr = 230 * s * Math.sqrt(r()), cx = x + Math.cos(a) * rr * 1.15, cy = base - 250 * s - Math.sin(a) * rr * .58;
      out += `<ellipse cx="${n1(cx)}" cy="${n1(cy)}" rx="${n1((22 + r() * 24) * s)}" ry="${n1((12 + r() * 10) * s)}" fill="${r() < .55 ? C.b2 : C.b1}"/>`;
    }
    for (let i = 0; i < 18; i++) { const a = .15 + r() * 1.3, rr = 200 * s; out += `<ellipse cx="${n1(x + Math.cos(a) * rr * (.4 + r() * .7))}" cy="${n1(base - 250 * s - Math.sin(a) * rr * .58 - 6 * s)}" rx="${n1((14 + r() * 20) * s)}" ry="${n1(6 * s)}" fill="${C.b4}" opacity=".55"/>`; }
    return out;
  }

  // an auto-rickshaw, side on, facing right
  const auto = `<g><path d="M8 -30Q6 -60 30 -66H128Q150 -66 168 -40L176 -26Q178 -14 166 -14H18Q8 -14 8 -30Z" fill="${C.b4}"/>
    <path d="M18 -66Q22 -124 70 -128H130Q150 -126 154 -104L160 -66Z" fill="${C.b1}"/><path d="M40 -112Q46 -120 70 -120H120V-70H40Z" fill="${C.b0}" opacity=".8"/>
    <path d="M136 -112L152 -72H128V-112Z" fill="${C.b6}" opacity=".5"/><path d="M12 -40H170" stroke="${C.b7}" stroke-width="4" opacity=".8"/>
    ${[40, 158].map(x => `<circle cx="${x}" cy="-12" r="17" fill="${C.b0}"/><circle cx="${x}" cy="-12" r="6" fill="${C.b5}"/>`).join('')}
    <ellipse cx="96" cy="0" rx="96" ry="6" fill="${C.b0}" opacity=".35" filter="url(#b3)"/></g>`;

  // a metro train: five cars with a band of windows, nose at each end
  const train = Array.from({length: 5}, (_, i) => {
    const x = i * 238, nose = i === 0 ? `<path d="M0 -6Q-26 -8 -30 -30L-24 -48Q-14 -56 0 -56Z" fill="${C.b7}"/>` : '';
    return `${nose}<rect x="${x}" y="-56" width="230" height="50" rx="7" fill="${C.b7}"/><rect x="${x + 10}" y="-46" width="210" height="16" rx="3" fill="${C.b2}"/>
      ${[0, 1, 2, 3].map(k => `<rect x="${x + 24 + k * 52}" y="-26" width="3" height="18" fill="${C.b5}"/>`).join('')}<rect x="${x}" y="-58" width="230" height="4" rx="2" fill="${C.w}"/>`;
  }).join('');

  let me, shadow, autoEl, trainEl;
  scene('city', {
    bg: C.b3,
    focus: 960,
    layers() {
      const r = rng(52);
      const sky = `<linearGradient id="ctSky" gradientUnits="userSpaceOnUse" x1="0" y1="-300" x2="0" y2="760"><stop offset="0" stop-color="${C.b3}"/><stop offset=".45" stop-color="${C.b5}"/><stop offset=".8" stop-color="${C.b6}"/><stop offset="1" stop-color="${C.b7}"/></linearGradient>
        <rect x="-800" y="-400" width="3600" height="1600" fill="url(#ctSky)"/>
        <circle cx="1380" cy="40" r="560" fill="url(#gGlow)" opacity=".75"/>
        ${[[300, 120, 620, 12, .3], [1000, 210, 700, 10, .34], [520, 300, 520, 9, .26], [1500, 330, 600, 11, .3]].map(([x, y, w, h, o]) => `<ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="${h}" fill="${C.w}" opacity="${o}" filter="url(#b8)"/>`).join('')}`;
      // morning sun coming down between the towers
      const shafts = [[1060, 260, -330, .34], [1420, 180, -300, .22], [760, 140, -260, .2]].map(([x, sp, tilt, o]) => beam({x, y: -120, top: 60, spread: sp, h: 900, tilt, o})).join('');
      const motes = K.dust([[1030, -100], [1090, -100], [860, 780], [600, 780]], 40, 61);
      const flock = Array.from({length: 6}, (_, i) => bird(n1(500 + i * 34 + r() * 30), n1(200 + Math.abs(i - 2.5) * 14 + r() * 10), .9 + r() * .3, r())).join('');

      // far skyline in the haze, with two cranes
      let far = '';
      for (let x = -300; x < 2500; x += 70 + r() * 90) {
        const w = 60 + r() * 90, h = 120 + r() * 260;
        far += `<rect x="${n1(x)}" y="${n1(700 - h)}" width="${n1(w)}" height="${n1(h + 80)}" fill="${C.b5}"/>`;
        for (let y = 700 - h + 14; y < 690; y += 16) far += `<path d="M${n1(x + 8)} ${n1(y)}H${n1(x + w - 8)}" stroke="${C.b6}" stroke-width="1.2" opacity=".5"/>`;
      }
      for (const [cx, top] of [[420, 330], [1620, 300]])
        far += `<g stroke="${C.b5}" fill="none"><path d="M${cx} 700V${top}M${cx + 10} 700V${top}" stroke-width="3"/><path d="M${cx - 90} ${top + 6}H${cx + 260}M${cx} ${top - 30}L${cx - 90} ${top + 6}M${cx + 10} ${top - 30}L${cx + 260} ${top + 6}" stroke-width="2.4"/>
          ${Array.from({length: 18}, (_, k) => `<path d="M${cx} ${700 - k * 20}L${cx + 10} ${690 - k * 20}"/>`).join('')}<path d="M${cx + 200} ${top + 6}V${top + 90}" stroke-width="1.2"/></g>`;

      // the metro viaduct, on pillars, with a train that slides through
      let metro = `<rect x="-900" y="548" width="4200" height="34" fill="${C.b4}"/><rect x="-900" y="540" width="4200" height="10" fill="${C.b5}"/><rect x="-900" y="580" width="4200" height="6" fill="${C.b3}"/>`;
      for (let x = -800; x < 3300; x += 300) metro += `<path d="M${x - 46} 586H${x + 46}L${x + 22} 616V900H${x - 22}V616Z" fill="${C.b4}"/><rect x="${x + 12}" y="616" width="10" height="290" fill="${C.b5}" opacity=".5"/>`;
      metro += `<g id="ctTrain" transform="translate(2900 540)">${train}</g>`;

      // the towers along the far side of the street
      const towers = [[-420, 270, -240, 'grid'], [-110, 200, 90, 'glass'], [300, 290, -420, 'grid'], [650, 190, 170, 'grid'], [1130, 300, -360, 'glass'], [1500, 220, 60, 'grid'], [1840, 320, -460, 'grid'], [2240, 250, -120, 'glass']]
        .map(([x, w, top, kind]) => tower(x, w, top, 780, r, {glass: kind === 'glass', col: kind === 'glass' ? C.b2 : [C.b3, '#17427f', C.b2][Math.floor(r() * 3)], row: 26 + r() * 8, col2: 34 + r() * 14})).join('');

      // street level: the road, rain trees, lamps, and the auto
      let street = `<rect x="-900" y="740" width="4400" height="24" fill="${C.b4}"/><rect x="-900" y="736" width="4400" height="5" fill="${C.b6}" opacity=".6"/>
        <rect x="-900" y="764" width="4400" height="60" fill="${C.b2}"/>${Array.from({length: 40}, (_, i) => `<rect x="${-880 + i * 110}" y="792" width="56" height="4" fill="${C.b6}" opacity=".5"/>`).join('')}`;
      for (const [x, s] of [[-80, 1.05], [620, 1.2], [1380, 1.1], [2120, 1.25], [2900, 1.1]]) street += rainTree(x, 752, s, r);
      for (let x = 260; x < 3400; x += 760) street += `<path d="M${x} 742V420Q${x} 396 ${x + 40} 394H${x + 70}" stroke="${C.b1}" stroke-width="6" fill="none"/><rect x="${x + 58}" y="388" width="40" height="10" rx="4" fill="${C.b1}"/><ellipse cx="${x + 78}" cy="400" rx="16" ry="3" fill="${C.b7}" opacity=".7"/>`;
      street += `<g id="ctAuto" transform="translate(-400 806)">${auto}</g>`;

      // the near pavement, lamp posts, and the office he's walking to
      let near = `<rect x="-900" y="812" width="4600" height="300" fill="${C.b2}"/><rect x="-900" y="804" width="4600" height="10" fill="${C.b5}"/><rect x="-900" y="814" width="4600" height="4" fill="${C.b1}" opacity=".6"/>`;
      for (let x = -880; x < 3600; x += 92) near += `<path d="M${x} 818L${x - 40} 1000" stroke="${C.b1}" stroke-width="1.6" opacity=".55"/>`;
      for (const y of [846, 884, 940]) near += `<path d="M-900 ${y}H3700" stroke="${C.b1}" stroke-width="1.6" opacity=".5"/>`;
      for (const x of [150, 1250, 2000]) near += `<rect x="${x}" y="-200" width="16" height="1040" fill="${C.b0}"/><rect x="${x + 11}" y="-200" width="4" height="1040" fill="${C.b4}" opacity=".6"/><rect x="${x - 6}" y="826" width="28" height="14" rx="3" fill="${C.b0}"/>`;
      const OX = X1 + 300;
      near += `<g><rect x="${OX}" y="-260" width="1000" height="1090" fill="${C.b1}"/>${Array.from({length: 12}, (_, k) => `<path d="M${OX + 40 + k * 80} -260V700" stroke="${C.b0}" stroke-width="3" opacity=".7"/>`).join('')}
        ${Array.from({length: 14}, (_, k) => `<path d="M${OX} ${-230 + k * 70}H${OX + 1000}" stroke="${C.b0}" stroke-width="2" opacity=".6"/>`).join('')}
        <path d="M${OX + 60} -260L${OX + 380} 700L${OX + 520} 700L${OX + 200} -260Z" fill="${C.w}" opacity=".07"/>
        <rect x="${OX + 120}" y="560" width="300" height="270" fill="${C.b6}" opacity=".9"/><rect x="${OX + 120}" y="560" width="300" height="270" fill="url(#gGlow)" opacity=".6"/>
        <path d="M${OX + 270} 560V830M${OX + 120} 690H${OX + 420}" stroke="${C.b1}" stroke-width="4"/><path d="M${OX + 254} 700V760M${OX + 286} 700V760" stroke="${C.b0}" stroke-width="5" stroke-linecap="round"/>
        <rect x="${OX + 80}" y="530" width="380" height="30" fill="${C.b0}"/><text x="${OX + 270}" y="551" text-anchor="middle" font-family="Figtree, sans-serif" font-size="17" font-weight="600" letter-spacing=".5" fill="${C.w}">Peepal Co</text></g>`;
      // a peepal tree by the door, all heart-shaped leaves
      let peepal = `<path d="M${OX - 40} 830C${OX - 50} 740 ${OX - 30} 660 ${OX - 60} 560M${OX - 48} 700C${OX - 10} 650 ${OX + 10} 610 ${OX + 30} 590M${OX - 52} 640C${OX - 100} 600 ${OX - 130} 580 ${OX - 150} 560" stroke="${C.b0}" stroke-width="10" fill="none" stroke-linecap="round"/>`;
      for (let i = 0; i < 110; i++) {
        const a = r() * Math.PI * 2, d = Math.sqrt(r()), x = OX - 60 + Math.cos(a) * d * 150, y = 530 + Math.sin(a) * d * 90;
        peepal += `<path transform="translate(${n1(x)} ${n1(y)}) rotate(${n1(r() * 360)}) scale(${n1(1.4 + r() * .8)})" d="M0 0C-6 -5 -9 -13 -5 -17C-2 -19 0 -17 0 -15C0 -17 2 -19 5 -17C9 -13 6 -5 0 0L0 6Z" fill="${r() < .3 ? C.b3 : r() < .6 ? C.b2 : C.b1}"/>`;
      }
      near += peepal + `<rect x="${OX - 90}" y="790" width="100" height="44" rx="4" fill="${C.b0}"/>`;

      // foreground: leaves hanging into the top of the frame, a railing at the bottom
      let fg = '';
      for (const [cx, cy, n] of [[-80, -70, 18], [1560, -90, 16], [3040, -70, 18]])
        for (let i = 0; i < n; i++) fg += `<ellipse cx="${n1(cx + (r() - .5) * 320)}" cy="${n1(cy + r() * 110)}" rx="${n1(22 + r() * 26)}" ry="${n1(12 + r() * 10)}" transform="rotate(${n1(r() * 60 - 30)} ${n1(cx)} ${n1(cy)})" fill="${r() < .5 ? C.b0 : C.b1}"/>`;
      for (let x = -900; x < 3800; x += 520) fg += `<rect x="${x}" y="900" width="26" height="200" fill="${C.b0}"/>`;
      fg += `<rect x="-900" y="908" width="4800" height="12" fill="${C.b0}"/>`;

      return [
        {z: .04, svg: sky},
        {z: .08, svg: `<g style="color:${C.b1}">${flock}</g>`},
        {z: .2, svg: far + fog(690, 40, .55, C.b7, 2200, 1100)},
        {z: .45, svg: towers + fog(700, 70, .4, C.b6, 2600, 1200)},
        {z: .5, svg: shafts},
        {z: .5, html: motes},
        {z: .62, svg: metro + fog(800, 40, .3, C.b6, 2400, 1100)},
        {z: .78, svg: street},
        {z: 1, svg: near},
        {z: 1, svg: `<path id="ctShadow" fill="${C.b0}" opacity=".45" filter="url(#b3)" transform="translate(${X0} ${FEET}) scale(${S})"/>
          <path id="ctMe" fill="${C.w}" filter="url(#fuzz)" transform="translate(${X0} ${FEET}) scale(${S})"/>`},
        {z: 1.5, cls: 'blur6', svg: fg},
      ];
    },
    init(st) {
      me = st.querySelector('#ctMe');
      shadow = st.querySelector('#ctShadow');
      autoEl = st.querySelector('#ctAuto');
      trainEl = st.querySelector('#ctTrain');
    },
    cam: p => ({x: walkX(p) - X0 + 60 * p, zoom: keys(p, [[0, 1.06], [.5, 1.02], [1, 1]]), ox: 960, oy: 640}),
    frame(p) {
      if (!me) return;
      const x = walkX(p), w = FIG.walk((x - X0) / STEP, 'adult', {head: -2});
      const d = w.d + FIG.path([FIG.place(FIG.smooth(BAG, 3), w.joints.root, 4)]);   // his laptop bag
      me.setAttribute('d', d);
      me.setAttribute('transform', `translate(${n1(x)} ${FEET}) scale(${S})`);
      shadow.setAttribute('d', d);
      shadow.setAttribute('transform', `translate(${n1(x)} ${FEET}) matrix(${S} 0 ${n1(S * .95)} ${n1(-S * .09)} 0 0)`);
      autoEl.setAttribute('transform', `translate(${n1(keys(p, [[0, -500], [.08, -500], [.62, 3000]]))} 806)`);
      trainEl.setAttribute('transform', `translate(${n1(keys(p, [[0, 2900], [.1, 2900], [.72, -1500]]))} 540)`);
    },
  });
})();
