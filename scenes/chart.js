// The Lemonn years. Late at night at his desk, a chart drawing itself candle by candle on a wide monitor,
// the city lights out the window. Then the camera goes into the screen, and the chart turns into a mountain
// built from candles, rising piece by piece until he stands on top of it in the light.
(() => {
  const {C, rng, keys, span, clamp, n1, beam, pool, fog, dust, fig} = K;

  // one believable day of prices: an early dip, a wobble, then a long climb
  const N = 56, DAY = [];
  { const r = rng(42); let v = 52;
    for (let i = 0; i < N; i++) {
      const o = v, trend = keys(i / (N - 1), [[0, 52], [.28, 41], [.5, 48], [.62, 46], [1, 77]]);
      v += (trend - v) * .38 + (r() - .5) * 5.2;
      DAY.push({o, c: v, h: Math.max(o, v) + .6 + r() * 2.4, l: Math.min(o, v) - .6 - r() * 2.4});
    } }
  const price = v => (24380 + v * 7.3).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2});

  // the monitor and the plot inside it, in board units
  const MX = 740, MY = 188, MW = 640, MH = 330;                       // screen
  const PX = MX + 22, PY = MY + 52, PW = MW - 96, PH = MH - 92;       // plot
  const lo = Math.min(...DAY.map(d => d.l)) - 4, hi = Math.max(...DAY.map(d => d.h)) + 14;
  const cx = i => PX + (i + .5) * PW * .8 / N, cy = v => PY + (hi - v) / (hi - lo) * PH;
  const CW = PW * .8 / N;
  const ENTRY = DAY[N - 1].c, TARGET = ENTRY + 9, STOP = ENTRY - 5.5;
  const TEST = [5, 33], MARKS = [8, 13, 19, 24, 30];                 // the stretch of past days the plan is tried on
  // summit of the mountain, right where the screen was
  const SX = MX + MW / 2, SY = 400, TOP = 548;                        // TOP: back edge of the desk

  const candle = (d, i, x, w, up, down) => {
    const c = d.c >= d.o, top = cy(Math.max(d.o, d.c)), bot = cy(Math.min(d.o, d.c));
    return `<path d="M${n1(x)} ${n1(cy(d.h))}V${n1(cy(d.l))}" stroke="${c ? up : down}" stroke-width="1.2"/>` +
      `<rect x="${n1(x - w / 2)}" y="${n1(top)}" width="${n1(w)}" height="${n1(Math.max(1.2, bot - top))}" fill="${c ? up : down}" rx=".6"/>`;
  };

  function office() {
    const r = rng(7);
    // the city through a wall of glass: towers with a few lit windows, the street far below out of focus
    let city = `<linearGradient id="chNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.b0}"/><stop offset=".55" stop-color="#05214f"/><stop offset="1" stop-color="${C.b2}"/></linearGradient>
      <rect x="-300" y="-200" width="2200" height="900" fill="url(#chNight)"/>
      <ellipse cx="800" cy="520" rx="1100" ry="110" fill="${C.b3}" opacity=".45" filter="url(#b30)"/>
      <path d="M1388 96a26 26 0 1 0 22 40a21 21 0 1 1 -22 -40z" fill="${C.b7}" opacity=".85"/>
      <circle cx="1392" cy="118" r="60" fill="url(#gGlow)" opacity=".18"/>`;
    for (let i = 0; i < 70; i++) city += `<circle cx="${n1(r() * 1700 - 50)}" cy="${n1(r() * 260)}" r="${n1(.5 + r() * .9)}" fill="${C.w}" opacity="${n1(.15 + r() * .4)}"/>`;
    for (let x = -120; x < 1760;) {
      const w = 40 + r() * 80, h = 90 + r() * 250, top = 536 - h, far = r() < .45;
      const col = far ? '#0a2a5c' : '#04204d';
      city += `<rect x="${n1(x)}" y="${n1(top)}" width="${n1(w)}" height="${n1(h + 40)}" fill="${col}"/>`;
      if (!far) city += `<rect x="${n1(x + w - 3)}" y="${n1(top)}" width="3" height="${n1(h)}" fill="${C.b3}" opacity=".5"/>`;
      for (let wy = top + 10; wy < 526; wy += 14) for (let wx = x + 6; wx < x + w - 8; wx += 11)
        if (r() < .09) city += `<rect x="${n1(wx)}" y="${n1(wy)}" width="5" height="6" fill="${r() < .3 ? C.b7 : C.b5}" opacity="${n1(.35 + r() * .55)}"/>`;
      if (h > 290) city += `<circle class="ch-blink" cx="${n1(x + w / 2)}" cy="${n1(top - 6)}" r="2.2" fill="${C.w}" style="animation-delay:-${n1(r() * 3)}s"/>`;
      x += w + 4 + r() * 22;
    }
    let bokeh = '';
    for (let i = 0; i < 34; i++) bokeh += `<circle cx="${n1(r() * 1700 - 50)}" cy="${n1(440 + r() * 100)}" r="${n1(8 + r() * 26)}" fill="${[C.b5, C.b6, C.w][i % 3]}" opacity="${n1(.12 + r() * .25)}"/>`;
    const glass = `<path d="M-40 520L300 40H420L80 520ZM520 560L860 40H900L560 560Z" fill="${C.w}" opacity=".035"/>` +
      [180, 560, 940, 1320].map(x => `<rect x="${x}" y="-60" width="12" height="640" fill="${C.b0}"/>`).join('') +
      `<rect x="-300" y="${TOP - 14}" width="2200" height="14" fill="${C.b0}"/>`;

    // the monitor, its glow on the wall and the desk, and the chart on it
    let chart = `<rect x="${MX}" y="${MY}" width="${MW}" height="${MH}" fill="#031a40"/>
      <rect x="${MX}" y="${MY}" width="${MW}" height="${MH}" fill="url(#chScreen)"/>`;
    for (let k = 0; k <= 5; k++) chart += `<path d="M${PX} ${n1(PY + k * PH / 5)}H${PX + PW}" stroke="${C.b2}" stroke-width="1"/>` +
      `<text x="${PX + PW + 10}" y="${n1(PY + k * PH / 5 + 4)}" class="ch-ax">${price(hi - k * (hi - lo) / 5).slice(0, -3)}</text>`;
    for (let k = 0; k < 6; k++) chart += `<path d="M${n1(PX + k * PW / 6)} ${PY}V${PY + PH}" stroke="${C.b2}" stroke-width="1" opacity=".7"/>` +
      `<text x="${n1(PX + k * PW / 6)}" y="${PY + PH + 18}" class="ch-ax">${String(9 + Math.floor((15 + k * 75) / 60)).padStart(2, '0')}:${String((15 + k * 75) % 60).padStart(2, '0')}</text>`;
    chart += `<text x="${MX + 22}" y="${MY + 30}" class="ch-brand">Lemonn</text>
      <rect x="${MX + 96}" y="${MY + 15}" width="86" height="22" rx="11" fill="${C.b2}"/><text x="${MX + 139}" y="${MY + 30}" class="ch-pill">NIFTY 50</text>
      ${['5m', '15m', '1h', '1D'].map((t, k) => `<rect x="${MX + 196 + k * 40}" y="${MY + 15}" width="34" height="22" rx="11" fill="${k === 1 ? C.b4 : 'none'}"/><text x="${MX + 213 + k * 40}" y="${MY + 30}" class="ch-pill">${t}</text>`).join('')}
      <circle cx="${MX + MW - 26}" cy="${MY + 26}" r="5" fill="${C.b4}"/><circle cx="${MX + MW - 44}" cy="${MY + 26}" r="5" fill="${C.b3}"/>`;
    // candles, an average line, and the live price, revealed left to right as you scroll
    let avg = '', sum = 0;
    DAY.forEach((d, i) => { sum += d.c - (i >= 8 ? DAY[i - 8].c : 0); if (i >= 7) avg += `${avg ? 'L' : 'M'}${n1(cx(i))} ${n1(cy(sum / 8))}`; });
    chart += `<g clip-path="url(#chReveal)">${DAY.map((d, i) => candle(d, i, cx(i), CW * .62, C.b6, C.b4)).join('')}
        <path d="${avg}" fill="none" stroke="${C.w}" stroke-width="1.6" opacity=".55" filter="url(#glow)"/></g>
      <g id="chLast"><path d="M${PX} 0H${PX + PW}" stroke="${C.b7}" stroke-width="1" stroke-dasharray="3 4" opacity=".7"/>
        <rect x="${PX + PW + 2}" y="-10" width="66" height="20" rx="3" fill="${C.b6}"/><text id="chPrice" x="${PX + PW + 35}" y="4" class="ch-tag">0</text>
        <circle id="chDot" cx="0" cy="0" r="3.4" fill="${C.w}" filter="url(#glow)"/></g>`;
    // the plan: where to take profit, where to step out, and the stretch of past days it was tried on
    const ex = cx(N - 9), fx = PX + PW;
    chart += `<g id="chPlan" opacity="0">
        <rect id="chTest" x="${n1(cx(TEST[0]) - 6)}" y="${PY}" width="${n1(cx(TEST[1]) - cx(TEST[0]) + 12)}" height="${PH}" fill="${C.w}" opacity=".06"/>
        <text x="${n1(cx(TEST[0]) - 2)}" y="${PY + 16}" class="ch-note">Tested on past days</text>
        <path id="chHead" d="M0 ${PY}V${PY + PH}" stroke="${C.w}" stroke-width="1.4" opacity=".8"/>
        ${MARKS.map((i, k) => `<path id="chM${k}" d="M${n1(cx(i))} ${n1(cy(DAY[i].l) + 8)}l-5 8h10z" fill="${C.b7}" opacity="0"/>`).join('')}
        <g id="chZones">
          <rect x="${n1(ex)}" y="${n1(cy(TARGET))}" width="${n1(fx - ex)}" height="${n1(cy(ENTRY) - cy(TARGET))}" fill="${C.b6}" opacity=".16"/>
          <rect x="${n1(ex)}" y="${n1(cy(ENTRY))}" width="${n1(fx - ex)}" height="${n1(cy(STOP) - cy(ENTRY))}" fill="${C.b4}" opacity=".28"/>
          <path d="M${n1(ex)} ${n1(cy(TARGET))}H${fx}M${n1(ex)} ${n1(cy(STOP))}H${fx}" stroke="${C.b7}" stroke-width="1.3" stroke-dasharray="5 4"/>
          <path d="M${n1(ex)} ${n1(cy(ENTRY))}H${fx}" stroke="${C.w}" stroke-width="1.5"/>
          <text x="${fx - 8}" y="${n1(cy(TARGET) + 16)}" class="ch-note" text-anchor="end">Target</text>
          <text x="${fx - 8}" y="${n1(cy(STOP) - 7)}" class="ch-note" text-anchor="end">Stop</text></g></g>
      <rect id="chFlash" x="${MX}" y="${MY}" width="${MW}" height="${MH}" fill="${C.b7}" opacity="0"/>`;
    const monitor = `<ellipse cx="${SX}" cy="${MY + MH / 2}" rx="${MW * .78}" ry="${MH * .82}" fill="${C.b3}" opacity=".35" filter="url(#b30)"/>
      <rect x="${MX - 12}" y="${MY - 12}" width="${MW + 24}" height="${MH + 24}" rx="12" fill="#020f26"/>
      <rect x="${MX - 12}" y="${MY - 12}" width="${MW + 24}" height="2" rx="1" fill="${C.b4}" opacity=".6"/>
      <path d="M${SX - 16} ${MY + MH + 12}L${SX - 22} ${TOP + 22}H${SX + 22}L${SX + 16} ${MY + MH + 12}Z" fill="#031737"/>
      <ellipse cx="${SX}" cy="${TOP + 24}" rx="100" ry="11" fill="#031737"/>${chart}`;

    // the desk: a lamp leaning in, a mug still steaming, keyboard, phone, a small plant
    const lamp = `<ellipse cx="1486" cy="${TOP + 14}" rx="34" ry="7" fill="${C.b1}"/><path d="M1486 ${TOP + 10}L1520 390L1430 318" stroke="${C.b1}" stroke-width="8" fill="none" stroke-linecap="round"/>
      <circle cx="1520" cy="390" r="8" fill="${C.b2}"/><g transform="rotate(40 1424 314)"><path d="M1398 296H1450L1468 336H1380Z" fill="${C.b2}"/><path d="M1400 296H1448" stroke="${C.b4}" stroke-width="3"/></g>
      <ellipse cx="1404" cy="346" rx="11" ry="6" fill="${C.w}" filter="url(#glow)"/>`;
    // the desk top runs from the window down past the bottom of the frame, lit by the screen and the lamp
    let desk = `<linearGradient id="chDesk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d3470"/><stop offset=".35" stop-color="#072a5c"/><stop offset="1" stop-color="${C.b0}"/></linearGradient>
      <path d="M-300 ${TOP}H1900V1100H-300Z" fill="url(#chDesk)"/><rect x="-300" y="${TOP - 2}" width="2200" height="4" fill="${C.b4}" opacity=".7"/>`;
    for (let k = -14; k <= 14; k++) desk += `<path d="M${SX + k * 60} ${TOP}L${SX + k * 190} 1100" stroke="${C.b0}" stroke-width="1.2" opacity=".35"/>`;
    desk += `${pool(SX, TOP + 34, 520, 70, .38)}${pool(1270, TOP + 64, 230, 46, .5)}
      <path d="M${SX - 168} 622L${SX + 168} 622L${SX + 196} 676L${SX - 196} 676Z" fill="#0a2550"/><path d="M${SX - 168} 622H${SX + 168}" stroke="${C.b5}" stroke-width="1.6" opacity=".7"/>
      ${[0, 1, 2, 3].map(k => `<path d="M${SX - 160 - k * 7} ${633 + k * 11}H${SX + 160 + k * 7}" stroke="${C.b2}" stroke-width="5" stroke-dasharray="14 4" opacity=".8"/>`).join('')}
      <ellipse cx="${SX + 268}" cy="652" rx="20" ry="12" fill="#0a2550"/><path d="M${SX + 268} 641v10" stroke="${C.b4}" stroke-width="1.5"/>
      <g transform="translate(${SX - 300} 700) rotate(-8)"><rect x="-44" y="-20" width="88" height="44" rx="8" fill="#020f26"/><rect x="-40" y="-16" width="80" height="36" rx="5" fill="${C.b2}"/>
        <rect x="-30" y="-8" width="38" height="4" rx="2" fill="${C.b6}" opacity=".8"/><rect x="-30" y="0" width="54" height="3" rx="1.5" fill="${C.b5}" opacity=".6"/></g>
      <path d="M1340 ${TOP + 8}h44v42a8 8 0 0 1 -8 8h-28a8 8 0 0 1 -8 -8zM1384 ${TOP + 20}a12 12 0 0 1 0 22" fill="${C.b2}" stroke="${C.b2}" stroke-width="4"/>
      <rect x="1340" y="${TOP + 8}" width="44" height="4" fill="${C.b5}" opacity=".7"/>
      ${lamp}`;

    // him, from behind his shoulder, looking up at the screen
    const b = FIG.bust({up: -24}, 9);
    const me = fig(b.d, 352, 812, 4.7, {f: 'fuzzc', extra: FIG.eye(b.eye, .95, 1.1, -32)});
    // leaves of a plant right against the lens
    let leaves = '';
    for (let i = 0; i < 9; i++) {
      const a = -150 + i * 16 + r() * 10, l = 120 + r() * 90;
      leaves += `<path d="M0 0C${n1(l * .2)} ${n1(-l * .25)} ${n1(l * .55)} ${n1(-l * .3)} ${n1(l)} 0C${n1(l * .55)} ${n1(l * .28)} ${n1(l * .2)} ${n1(l * .22)} 0 0Z" transform="translate(1660 960) rotate(${n1(a)})" fill="${i % 2 ? C.b1 : C.b2}"/>`;
    }
    return [
      {z: .3, svg: city},
      {z: .45, svg: `<g filter="url(#b8)">${bokeh}</g>`},
      {z: .7, svg: glass + monitor},
      {z: .7, cls: 'ch-a', html: dust([[1386, 340], [1420, 352], [1412, 614], [1092, 614]], 22, 31)},
      {z: .7, svg: `<g class="ch-steam">${[0, 1, 2].map(k => `<path d="M${1352 + k * 9} ${TOP - 2}q-6 -14 0 -26t0 -26" fill="none" stroke="${C.b7}" stroke-width="2.4" stroke-linecap="round" style="animation-delay:-${k * 1.2}s" filter="url(#b1)"/>`).join('')}</g>` +
        beam({x: 1402, y: 344, top: 40, spread: 320, h: 270, o: .5, tilt: -150}) + desk},
      {z: 1, svg: me},
      {z: 1.35, cls: 'blur6', svg: leaves},
    ];
  }

  function summit() {
    const r = rng(11);
    const sky = `<radialGradient id="chSky" cx=".5" cy="0" r="1"><stop offset="0" stop-color="${C.b3}"/><stop offset=".45" stop-color="${C.b2}"/><stop offset="1" stop-color="${C.b0}"/></radialGradient>
      <rect x="-600" y="-600" width="2800" height="2000" fill="url(#chSky)"/>
      ${Array.from({length: 110}, () => `<circle cx="${n1(r() * 2400 - 400)}" cy="${n1(r() * 640 - 120)}" r="${n1(.5 + r() * 1.1)}" fill="${C.w}" opacity="${n1(.15 + r() * .55)}"/>`).join('')}`;
    // a ridge of candles: wick, body, a lit top and a lit side facing the summit's light; lower ones rise first
    const ridge = (x0, x1, py, slope, base, cols, seed, rise, wMin = 16, wVar = 14) => {
      const rr = rng(seed);
      let out = '';
      for (let x = x0; x < x1;) {
        const w = wMin + rr() * wVar, mid = x + w / 2, d = Math.abs(mid - SX), top = py + d * slope + (rr() - .3) * 30, up = rr() < .55;
        if (top < base - 10) {
          const wick = 6 + rr() * 30, lit = mid < SX ? x + w - 3 : x;
          const a = rise ? n1((.6 + .17 * (1 - clamp((top - SY) / (base - SY))) + rr() * .025) * 1000) / 1000 : 0;
          out += `<g${rise ? ` class="ch-col" style="--a:${a}"` : ''}><path d="M${n1(mid)} ${n1(top - wick)}V${n1(top)}" stroke="${cols[2]}" stroke-width="1.6"/>` +
            `<rect x="${n1(x)}" y="${n1(top)}" width="${n1(w)}" height="${n1(base - top + 300)}" fill="${up ? cols[0] : cols[1]}"/>` +
            `<rect x="${n1(lit)}" y="${n1(top)}" width="3" height="${n1(base - top + 300)}" fill="${cols[2]}" opacity=".22"/>` +
            `<rect x="${n1(x)}" y="${n1(top)}" width="${n1(w)}" height="2.5" fill="${cols[2]}" opacity=".9"/></g>`;
        }
        x += w + 2 + rr() * 4;
      }
      return out;
    };
    const haze = ['#0d3570', '#0a2f66', C.b4];
    const far = ridge(-700, 2300, 540, .42, 1000, haze, 3, false, 12, 10) + fog(700, 120, .35, C.b4, 1800, 800);
    const back = ridge(SX - 900, SX + 900, SY + 120, .55, 1100, [C.b2, '#0b326c', C.b5], 5, false, 14, 12) + fog(760, 80, .3, C.b5, 1500, SX);
    let main = ridge(SX - 760, SX - 22, SY + 22, .74, 1150, [C.b3, C.b2, C.b6], 8, true) + ridge(SX + 22, SX + 760, SY + 22, .74, 1150, [C.b3, C.b2, C.b6], 9, true);
    const me = FIG.front({}, 5);
    main += `<g class="ch-col" style="--a:.8"><path d="M${SX} ${SY - 36}V${SY}" stroke="${C.b7}" stroke-width="2"/>
      <rect x="${SX - 19}" y="${SY}" width="38" height="800" fill="${C.b4}"/><rect x="${SX - 19}" y="${SY}" width="4" height="800" fill="${C.b6}" opacity=".35"/>
      <rect x="${SX - 19}" y="${SY}" width="38" height="4" fill="${C.w}"/>${pool(SX, SY + 2, 54, 8, .95)}${fig(me.d, SX, SY + 1, .52)}</g>`;
    const front = ridge(SX - 1100, SX + 1100, 760, .5, 1200, [C.b1, '#05214d', C.b4], 13, false, 34, 26);
    return [
      {z: .05, cls: 'ch-b', svg: sky + `<ellipse cx="${SX}" cy="-60" rx="560" ry="280" fill="${C.b4}" opacity=".4" filter="url(#b30)"/>`},
      {z: .2, cls: 'ch-b', svg: far},
      {z: .5, cls: 'ch-b', svg: back},
      {z: .8, cls: 'ch-b ch-peak', svg: beam({x: SX, y: -140, top: 90, spread: 380, h: 640, o: .8}) + beam({x: SX - 280, y: -140, top: 40, spread: 240, h: 900, o: .2, tilt: 140}) +
        beam({x: SX + 300, y: -140, top: 40, spread: 220, h: 900, o: .16, tilt: -150}) + `<circle cx="${SX}" cy="${SY - 40}" r="190" fill="url(#gGlow)" opacity=".22"/>` + main +
        fog(SY + 330, 50, .22, C.b6, 900, SX)},
      {z: .8, cls: 'ch-b', html: dust([[SX - 45, -100], [SX + 45, -100], [SX + 190, SY + 20], [SX - 190, SY + 20]], 34, 17)},
      {z: 1.05, cls: 'ch-b', svg: front},
      {z: 1.3, cls: 'ch-b blur6', svg: `<g class="drift">${fog(980, 90, .32, C.b5, 1300, 500)}${fog(1010, 80, .28, C.b5, 1200, 1400)}</g>`},
    ];
  }

  let A = [], B = [], els = {};
  scene('chart', {
    bg: C.b0,
    focus: p => keys(p, [[.6, SX - 40], [.66, SX + 150]]),
    css: `.ch-ax{font:500 10.5px Figtree,sans-serif;fill:${C.b5}}.ch-brand{font:700 14px Figtree,sans-serif;fill:${C.b7};letter-spacing:-.01em}
      .ch-pill{font:600 10.5px Figtree,sans-serif;fill:${C.b7};text-anchor:middle}.ch-tag{font:700 10.5px Figtree,sans-serif;fill:${C.ink};text-anchor:middle}
      .ch-note{font:600 11px Figtree,sans-serif;fill:${C.b7};letter-spacing:.02em}
      .ch-blink{animation:chBlink 2.8s steps(1) infinite}@keyframes chBlink{50%{opacity:.15}}
      .ch-steam path{animation:chSteam 3.6s ease-in-out infinite;opacity:0}@keyframes chSteam{0%{transform:translateY(6px);opacity:0}30%{opacity:.5}100%{transform:translateY(-26px);opacity:0}}
      .ch-col{--t:clamp(0,(var(--p,0) - var(--a))/.07,1);transform:translateY(calc((1 - var(--t))*(1 - var(--t))*620px))}
      .ch-b{opacity:0}`,
    layers() {
      const a = office(), b = summit();
      a[0].svg = `<defs><clipPath id="chReveal"><rect id="chClip" x="${PX - 4}" y="${PY - 40}" width="0" height="${PH + 80}"/></clipPath>
        <linearGradient id="chScreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.b1}" stop-opacity=".5"/><stop offset="1" stop-color="${C.b0}" stop-opacity="0"/></linearGradient></defs>` + a[0].svg;
      return [...a, ...b];
    },
    init(st, s) {
      const n = 7;                                                    // the office is the first seven layers
      A = s.layers.slice(0, n).map(L => L.node); B = s.layers.slice(n).map(L => L.node);
      for (const id of ['chClip', 'chLast', 'chPrice', 'chDot', 'chPlan', 'chHead', 'chZones', 'chFlash']) els[id] = st.querySelector('#' + id);
      els.marks = MARKS.map((_, k) => st.querySelector('#chM' + k));
      els.peak = st.querySelector('.ch-peak');
    },
    cam: p => ({zoom: keys(p, [[0, 1.02], [.3, 1.08], [.5, 1.16], [.56, 1.2], [.645, 4.2], [.88, 1], [1, .98]]), ox: SX, oy: MY + MH / 2,
      x: keys(p, [[0, -40], [.3, -50], [.45, -80], [.56, -80], [.64, 0], [.88, 190]]), y: keys(p, [[.645, 0], [.9, -30]])}),
    frame(p) {
      if (!els.chClip) return;
      // the chart draws itself
      const rv = span(p, .04, .33), k = Math.min(N - 1, Math.floor(rv * N));
      els.chClip.setAttribute('width', n1(rv * (PW * .8 + 6)));
      const d = DAY[k], y = cy(d.c);
      els.chLast.setAttribute('transform', `translate(0 ${n1(y)})`);
      els.chLast.style.opacity = rv > .01 ? 1 : 0;
      els.chDot.setAttribute('cx', n1(cx(k) + CW * .3));
      els.chPrice.textContent = price(d.c);
      // the plan, then a replay over past days
      els.chPlan.setAttribute('opacity', n1(span(p, .37, .43) * 1000) / 1000);
      const zw = span(p, .4, .47);
      els.chZones.setAttribute('transform', `translate(${n1(cx(N - 9) * (1 - zw))} 0) scale(${zw.toFixed(3)} 1)`);
      const hx = cx(TEST[0]) + (cx(TEST[1]) - cx(TEST[0])) * span(p, .46, .58);
      els.chHead.setAttribute('transform', `translate(${n1(hx)} 0)`);
      els.marks.forEach((m, j) => m.setAttribute('opacity', hx > cx(MARKS[j]) + 2 ? 1 : 0));
      // into the screen, out onto the mountain
      els.chFlash.setAttribute('opacity', n1(span(p, .575, .626) * 100) / 100);
      const a = 1 - span(p, .626, .642), b = span(p, .622, .652);
      A.forEach(n => n.style.opacity = a);
      B.forEach(n => n.style.opacity = b);
      els.peak.style.setProperty('--p', p.toFixed(4));
    },
  });
})();
