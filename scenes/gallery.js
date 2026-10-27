// A quiet gallery at night. His CodePen pieces hang like paintings, each under its own light, and he walks the hall,
// stopping at each one. The last frame holds a tree that draws itself while he watches.
(() => {
  const {C, rng, keys, span, n1, beam, pool, dust} = K;
  const FLOOR = 640, FEET = 732, S = 1.35, X0 = 300;
  const STEP = FIG.STRIDE * S;                                   // board units per full stride
  const STOPS = [2.5, 6.5, 10.5].map(k => X0 + k * STEP);       // half strides, so he stops with both feet down
  // [centre x, centre y, width, height, piece, plaque]
  const ART = [
    [STOPS[0] + 132, 366, 166, 226, 'iphone', 'A phone'],
    [STOPS[1] + 146, 362, 320, 214, 'bus', 'A bus'],
    [STOPS[2] + 156, 360, 322, 226, 'tree', 'A tree'],
    [X0 - 360, 384, 150, 108, 'netflix', ''],
    [STOPS[2] + 760, 380, 150, 108, 'slack', ''],
  ];
  const DOOR = 1240;                                              // an archway through to the next room
  const walkX = p => keys(p, [[0, X0], [.2, STOPS[0]], [.3, STOPS[0]], [.5, STOPS[1]], [.6, STOPS[1]], [.82, STOPS[2]], [1, STOPS[2]]]);
  const camX = p => keys(p, [[0, 0], [.2, STOPS[0] - 620], [.3, STOPS[0] - 600], [.5, STOPS[1] - 620], [.6, STOPS[1] - 600], [.82, STOPS[2] - 640], [1, STOPS[2] - 610]]);
  const look = p => keys(p, [[0, 1], [.17, 1], [.22, -13], [.28, -13], [.33, 1], [.47, 1], [.52, -11], [.58, -11], [.63, 1], [.79, 1], [.85, -9], [1, -9]]);
  const still = p => keys(p, [[0, 0], [.185, 0], [.215, 1], [.285, 1], [.31, 0], [.485, 0], [.515, 1], [.585, 1], [.61, 0], [.8, 0], [.84, 1], [1, 1]]);
  // when he stops he settles from the stride (the walk cycle at half a step) into standing, weight on both feet
  const STRIDE_POSE = {legs: [{thigh: -16, knee: 9, ankle: 8}, {thigh: 21, knee: 3, ankle: -12}], arms: [{upper: 19, elbow: 26}, {upper: -15, elbow: 14}]};
  const STAND_POSE = {legs: [{thigh: -3, knee: 3, ankle: 0}, {thigh: 4, knee: 2, ankle: 0}], arms: [{upper: 4, elbow: 10}, {upper: -3, elbow: 14}]};
  function settle(k, head) {
    const mix = (a, b) => Object.fromEntries(Object.keys(a).map(n => [n, a[n] + (b[n] - a[n]) * k]));
    const pose = {lean: 4 - 2.5 * k, neck: head * .4 + 2, head, y: -FIG.BUILD.adult.hip,
      legs: STRIDE_POSE.legs.map((L, i) => mix(L, STAND_POSE.legs[i])), arms: STRIDE_POSE.arms.map((A, i) => mix(A, STAND_POSE.arms[i]))};
    const j = FIG.side(pose).joints;
    pose.y -= Math.max(j.ankle0.y, j.ankle1.y) + 8.6;               // feet back on the floor
    return FIG.side(pose);
  }

  // a framed piece: dark moulding, a pale mat, the work itself
  function framed([x, y, w, h, kind, label], dim) {
    const x0 = x - w / 2, y0 = y - h / 2, m = Math.min(w, h) * .12;
    const art = kind === 'tree'
      ? `<rect x="${x0 + m}" y="${y0 + m}" width="${w - 2 * m}" height="${h - 2 * m}" fill="${C.b7}"/>`
      : `<image href="pens/${kind}.jpg" x="${x0 + m}" y="${y0 + m}" width="${w - 2 * m}" height="${h - 2 * m}" preserveAspectRatio="xMidYMid slice" filter="url(#gaDuo)"/>`;
    return `<g opacity="${dim ? .5 : 1}"><rect x="${x0 - 9}" y="${y0 - 9}" width="${w + 18}" height="${h + 18}" fill="${C.b0}"/>
      <rect x="${x0 - 9}" y="${y0 - 9}" width="${w + 18}" height="3" fill="${C.b4}" opacity=".7"/>
      <rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="${C.w}"/>${art}
      <rect x="${x0 + m}" y="${y0 + m}" width="${w - 2 * m}" height="${h - 2 * m}" fill="none" stroke="${C.b6}" stroke-width="1.2"/></g>` +
      (label ? `<g transform="translate(${x + w / 2 + 26} ${y + h / 2 - 34})"><rect width="54" height="30" rx="1.5" fill="${C.b7}"/>
        <text x="7" y="13" font-family="Figtree, sans-serif" font-size="8.5" font-weight="600" fill="${C.ink}">${label}</text>
        <path d="M7 21H40" stroke="${C.b5}" stroke-width="1.6"/></g>` : '');
  }

  // a tree that draws itself, like his pen: every branch splits in two, level by level
  function tree(x, y, len, ang, d, max, r, out) {
    const x2 = x + Math.sin(ang) * len, y2 = y - Math.cos(ang) * len;
    out.push(`<path style="--d:${(d / (max + 1)).toFixed(3)}" pathLength="1" d="M${n1(x)} ${n1(y)}L${n1(x2)} ${n1(y2)}" stroke-width="${n1(Math.max(.45, 3.4 - d * .38))}"/>`);
    if (d === max) { out.push(`<circle class="lf" cx="${n1(x2)}" cy="${n1(y2)}" r="${n1(1 + r() * 1.4)}"/>`); return; }
    const spread = .36 + r() * .14;
    tree(x2, y2, len * (.72 + r() * .06), ang - spread, d + 1, max, r, out);
    tree(x2, y2, len * (.72 + r() * .06), ang + spread, d + 1, max, r, out);
  }

  let me, meShadow, grow;
  scene('gallery', {
    bg: C.b0,
    focus: 730,
    css: `
      .ga-tree path{fill:none;stroke:${C.ink};stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:calc(1 - clamp(0,(var(--g,0) - var(--d))*8,1))}
      .ga-tree .lf{fill:${C.b4};opacity:clamp(0,(var(--g,0) - .92)*10,1)}
      .ga-glow{animation:flicker 9s infinite}`,
    layers() {
      const r = rng(31);
      const duo = `<filter id="gaDuo" color-interpolation-filters="sRGB" x="0" y="0" width="100%" height="100%">
        <feColorMatrix type="matrix" values=".3 .59 .11 0 0 .3 .59 .11 0 0 .3 .59 .11 0 0 0 0 0 1 0"/>
        <feComponentTransfer><feFuncR type="table" tableValues=".008 .028 .05 .208 .96"/><feFuncG type="table" tableValues=".082 .184 .212 .412 .98"/><feFuncB type="table" tableValues=".2 .408 .451 .678 .99"/></feComponentTransfer></filter>`;

      // the next room, seen through the archway: darker, one small lit piece, a bench
      const back = `<rect x="${DOOR - 400}" y="-200" width="800" height="${FLOOR + 160}" fill="#031a40"/>
        <rect x="${DOOR - 400}" y="${FLOOR - 28}" width="800" height="300" fill="${C.b0}"/>
        <ellipse cx="${DOOR + 30}" cy="330" rx="120" ry="150" fill="${C.b2}" opacity=".7" filter="url(#b30)"/>
        <rect x="${DOOR - 10}" y="300" width="84" height="62" fill="${C.b0}"/><rect x="${DOOR - 2}" y="308" width="68" height="46" fill="${C.b5}" opacity=".55"/>
        ${beam({x: DOOR + 30, y: 120, top: 18, spread: 200, h: 520, o: .3})}
        <rect x="${DOOR - 70}" y="${FLOOR - 52}" width="170" height="12" rx="3" fill="#03183a"/><path d="M${DOOR - 56} ${FLOOR - 40}V${FLOOR - 24}M${DOOR + 86} ${FLOOR - 40}V${FLOOR - 24}" stroke="#03183a" stroke-width="6"/>`;

      // the hall: a long wall with an archway cut through it, track lights on the ceiling, the pieces, a glossy floor
      const hole = `M${DOOR - 92} ${FLOOR}V420A92 92 0 0 1 ${DOOR + 92} 420V${FLOOR}Z`;
      let wall = `<linearGradient id="gaWall" gradientUnits="userSpaceOnUse" x1="0" y1="-200" x2="0" y2="${FLOOR}"><stop offset="0" stop-color="${C.b0}"/><stop offset=".3" stop-color="#05214f"/><stop offset="1" stop-color="${C.b1}"/></linearGradient>
        <path fill-rule="evenodd" fill="url(#gaWall)" d="M-800 -300H3800V${FLOOR}H-800Z${hole}"/>`;
      for (let x = -700; x < 3800; x += 230) wall += `<path d="M${x} 130V${FLOOR - 16}" stroke="#04204d" stroke-width="2" opacity=".8"/>`;
      wall += `<path d="M${DOOR - 104} ${FLOOR}V418A104 104 0 0 1 ${DOOR + 104} 418V${FLOOR}" fill="none" stroke="#04204d" stroke-width="12"/>
        <rect x="-800" y="${FLOOR - 18}" width="4600" height="18" fill="#03183a"/>
        <rect x="-800" y="96" width="4600" height="8" fill="#03183a"/><rect x="-800" y="103" width="4600" height="1.5" fill="${C.b3}" opacity=".6"/>`;
      // a wash of light on the wall around each piece, then the pieces and their lamps
      let lit = '', lamps = '', beams = '', motes = '', pools = '';
      ART.forEach((a, i) => {
        const [x, y, w, h] = a, dim = i > 2, lx = x - 150;
        lit += `<ellipse cx="${x}" cy="${y + 20}" rx="${w * .95 + 60}" ry="${h * .9 + 90}" fill="${C.b3}" opacity="${dim ? .3 : .55}" filter="url(#b30)"/>
          <path d="M${x - 40} 112Q${x - w * .62 - 30} ${y + 60} ${x - w * .7 - 60} ${FLOOR - 20}H${x + w * .7 + 60}Q${x + w * .62 + 30} ${y + 60} ${x + 40} 112Z" fill="url(#gaScallop)" opacity="${dim ? .35 : .7}" filter="url(#b16)"/>`;
        lamps += `<g transform="translate(${lx} 104)"><path d="M0 0V10" stroke="${C.b0}" stroke-width="3"/><g transform="translate(0 12) rotate(-38)"><rect x="-9" y="-6" width="18" height="30" rx="4" fill="${C.b0}"/>
          <ellipse cx="0" cy="24" rx="8" ry="3" fill="${C.w}" class="ga-glow"/></g></g>`;
        beams += beam({x: lx + 14, y: 122, top: 22, spread: dim ? 300 : 430, h: FEET + 10 - 122, tilt: 150, o: dim ? .3 : .62});
        if (!dim) motes += dust([[lx + 4, 124], [lx + 26, 124], [x + 214, FEET], [x - 214, FEET]], 34, 40 + i);
        pools += pool(x, FEET + 6, dim ? 120 : 190, dim ? 16 : 26, dim ? .35 : .6);
      });
      const pieces = ART.map((a, i) => framed(a, i > 2)).join('');
      // floor: glossy, with seams that crowd together towards the wall, and the pieces reflected in it
      let floor = `<linearGradient id="gaFloor" gradientUnits="userSpaceOnUse" x1="0" y1="${FLOOR}" x2="0" y2="1000"><stop offset="0" stop-color="#062657"/><stop offset=".35" stop-color="#041d45"/><stop offset="1" stop-color="${C.b0}"/></linearGradient>
        <rect x="-800" y="${FLOOR}" width="4600" height="600" fill="url(#gaFloor)"/>`;
      wall = `<linearGradient id="gaScallop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.b5}" stop-opacity=".8"/><stop offset=".45" stop-color="${C.b4}" stop-opacity=".45"/><stop offset="1" stop-color="${C.b3}" stop-opacity="0"/></linearGradient>` + wall;
      for (let k = 1; k < 9; k++) floor += `<path d="M-800 ${n1(FLOOR + k * k * 5.2)}H3800" stroke="#03183a" stroke-width="${n1(.6 + k * .25)}" opacity=".9"/>`;
      floor += `<g opacity=".16" filter="url(#b3)"><g transform="translate(0 ${2 * FLOOR}) scale(1 -1)" mask="url(#mRefl)">${pieces}</g></g>`;

      // the tree, grown later by frame()
      const out = [], tr = rng(7), t = ART[2];
      tree(t[0], t[1] + t[3] / 2 - t[3] * .14, t[3] * .2, 0, 0, 9, tr, out);

      // him, his reflection, and a soft shadow on the floor
      const fig = `<g fill="${C.w}"><path id="gaMe" filter="url(#fuzz)"/></g>`;
      const refl = `<g opacity=".2" filter="url(#b3)"><g transform="translate(0 ${2 * FEET}) scale(1 -1)" mask="url(#mRefl)"><use href="#gaMe"/></g></g>`;

      // foreground, out of focus: a bench, and a pillar the camera slides past
      const fg = `<g fill="${C.b0}"><rect x="${DOOR - 260}" y="842" width="520" height="40" rx="8"/><rect x="${DOOR - 230}" y="880" width="22" height="120"/><rect x="${DOOR + 208}" y="880" width="22" height="120"/>
        <rect x="${STOPS[2] - 520}" y="-200" width="130" height="1300"/><rect x="${STOPS[2] - 524}" y="-200" width="10" height="1300" fill="${C.b2}" opacity=".6"/>
        <rect x="${STOPS[2] + 260}" y="856" width="440" height="36" rx="8"/></g>`;

      return [
        {z: .82, svg: back},
        {z: 1, svg: duo + wall + lit + lamps + pieces + floor + pools + `<g class="ga-tree">${out.join('')}</g>`},
        {z: 1, svg: beams},
        {z: 1, html: motes},
        {z: 1, svg: `<path id="gaShadow" fill="${C.b0}" opacity=".5" filter="url(#b3)"/>` + refl + fig},
        {z: 1.45, cls: 'blur6', svg: fg},
      ];
    },
    init(st) {
      me = st.querySelector('#gaMe');
      meShadow = st.querySelector('#gaShadow');
      grow = st.querySelector('.ga-tree');
    },
    cam: p => ({x: camX(p), zoom: keys(p, [[0, 1.02], [.5, 1], [.85, 1.05], [1, 1.07]]), ox: 900, oy: 380}),
    frame(p) {
      if (!me) return;
      const x = walkX(p), ph = (x - X0) / STEP;
      const k = still(p), w = k > 0 ? settle(k, look(p)) : FIG.walk(ph, 'adult', {head: look(p), neck: look(p) * .4 + 2});
      me.setAttribute('d', w.d);
      me.setAttribute('transform', `translate(${n1(x)} ${FEET}) scale(${S})`);
      meShadow.setAttribute('d', w.d);
      meShadow.setAttribute('transform', `translate(${n1(x)} ${FEET}) matrix(${S} 0 ${n1(-S * .35)} ${n1(-S * .16)} 0 0)`);
      grow.style.setProperty('--g', (span(p, .6, .97) * 1.12).toFixed(3));
    },
  });
})();
