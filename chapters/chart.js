// Lemonn. The ground line lifts into a price line and a chart draws itself around it: frame, grid, axes, candles.
// He stands beside it, arms folded. Then he points: a trade gets planned on it (entry, target, stop) and a replay
// runs the past days back through. Then the chart outgrows its frame and becomes a mountain of candles, and he
// walks up the ridge to the summit, where the line drops away. (The next chapter, the leap, starts at that edge.)
chapter('chart', (() => {
  const {GY, ln, draw, show, stride, fit, box, rng, keys, span, clamp, lerp, n1} = L;
  const S = 150, FX = 350, FW = 1090, FT = 400;                 // his scale; the chart frame (bottom on the ground)
  const STAND = 252;                                             // where he stands beside it

  // candles: a seeded walk that starts on the ground and climbs, every candle and every line
  const N = 25, X0 = 386, DX = 27, CW = 12;
  const candles = (() => {
    const r = rng(41), out = [];
    let p = 672;
    for (let i = 0; i < N; i++) {
      const o = p, c = clamp(o - 6 + (r() - .5) * 40, 524, 684), hi = Math.min(o, c) - 6 - r() * 16, lo = Math.max(o, c) + 6 + r() * 14;
      out.push({x: X0 + i * DX, o, c, hi, lo}); p = c;
    }
    return out;
  })();
  const LAST = candles[N - 1];
  const candle = k => {
    const {x, o, c, hi, lo} = k, top = Math.min(o, c), h = Math.max(4, Math.abs(c - o));
    const wick = ln(`M${n1(x)} ${n1(hi)}V${n1(top)}M${n1(x)} ${n1(top + h)}V${n1(lo)}`, 'thin');
    return c < o ? wick + ln(`M${n1(x - CW / 2)} ${n1(top)}h${CW}v${n1(h)}h${-CW}Z`, 'thin')              // up: hollow
      : wick + `<path class="cbody" d="M${n1(x - CW / 2)} ${n1(top)}h${CW}v${n1(h)}h${-CW}Z" fill="currentColor"/>`;   // down: filled
  };
  const priceLine = `M${FX - 90} ${GY}H${FX}L${n1(candles[0].x)} ${n1(candles[0].c)}` + candles.slice(1).map(k => `L${n1(k.x)} ${n1(k.c)}`).join('');

  // the frame: timeframes in the header, tools at the right, a grid, the price axis with its ticks, time ticks
  const frame = () => {
    let grid = '', ticks = '';
    for (let y = FT + 70; y < GY - 20; y += 58) { grid += `M${FX + 16} ${y}H${FX + FW - 70}`; ticks += `M${FX + FW - 70} ${y}h8`; }
    for (let x = FX + 150; x < FX + FW - 80; x += 150) { grid += `M${x} ${FT + 46}V${GY - 8}`; ticks += `M${x} ${GY}v-8`; }
    const chips = ['5m', '15m', '1H', '1D'].map((s, i) => `${ln(box(FX + 18 + i * 44, FT + 14, 38, 20, 10), i === 1 ? 'thin on' : 'hair')}<text class="ui" x="${FX + 37 + i * 44}" y="${FT + 28}" text-anchor="middle">${s}</text>`).join('');
    const tools = ln(`M${FX + FW - 92} ${FT + 24}h16M${FX + FW - 84} ${FT + 16}v16` + `M${FX + FW - 58} ${FT + 31}l12 -14l4 4l-12 14h-4z` + `M${FX + FW - 30} ${FT + 16}v16M${FX + FW - 38} ${FT + 24}h16`, 'thin');
    return ln(box(FX, FT, FW, GY - FT, 14), 'thin') + ln(`M${FX} ${FT + 44}H${FX + FW}M${FX + FW - 70} ${FT + 44}V${GY}`, 'hair') + ln(grid, 'hair') + ln(ticks, 'thin') + chips + tools +
      ln(box(FX + FW - 66, n1(LAST.c - 10), 58, 20, 4), 'thin') + ln(`M${FX + FW - 56} ${n1(LAST.c)}h38`, 'hair') + ln(`M${n1(LAST.x + 10)} ${n1(LAST.c)}H${FX + FW - 70}`, 'hair');
  };

  // the plan, in the space after the last candle: entry, a target above, a stop below, each with its tag
  const PL = LAST.x + 40, PR = FX + FW - 90, TGT = LAST.c - 62, STP = LAST.c + 38;
  const dash = (y) => { let d = ''; for (let x = PL; x < PR; x += 14) d += `M${n1(x)} ${n1(y)}h8`; return d; };
  const plan = () => `<rect class="zone" x="${n1(PL)}" y="${n1(TGT)}" width="${n1(PR - PL)}" height="${n1(LAST.c - TGT)}" fill="currentColor" fill-opacity=".1"/>` +
    `<rect class="zone" x="${n1(PL)}" y="${n1(LAST.c)}" width="${n1(PR - PL)}" height="${n1(STP - LAST.c)}" fill="currentColor" fill-opacity=".05"/>` +
    ln(`M${n1(PL)} ${n1(LAST.c)}H${n1(PR)}`, 'bold plan') + ln(dash(TGT), 'thin plan') + ln(dash(STP), 'thin plan') +
    [['Target', TGT], ['Entry', LAST.c], ['Stop', STP]].map(([s, y]) => `<g class="tag">${ln(box(n1(PR - 64), n1(y - 22), 60, 16, 8), 'thin')}<text class="ui" x="${n1(PR - 34)}" y="${n1(y - 10.5)}" text-anchor="middle">${s}</text></g>`).join('');

  // the replay: a control pill at the bottom of the chart, and a scrubber that runs back over the past days
  const RX0 = candles[8].x - 14;
  const replay = () => `<g class="pill">${ln(box(FX + FW / 2 - 130, GY - 44, 150, 28, 14), 'thin')}` +
    ln(`M${FX + FW / 2 - 104} ${GY - 36}v12l-9 -6zM${FX + FW / 2 - 92} ${GY - 36}v12l-9 -6z` + `M${FX + FW / 2 - 66} ${GY - 37}l13 7l-13 7z` + `M${FX + FW / 2 - 34} ${GY - 36}v12l9 -6zM${FX + FW / 2 - 22} ${GY - 36}v12l9 -6z`, 'thin') + '</g>' +
    `<g class="scrub">${ln(`M${n1(RX0)} ${FT + 52}V${GY - 6}`, 'bold')}<circle cx="${n1(RX0)}" cy="${FT + 52}" r="6" fill="currentColor"/></g>`;

  // the mountain: a ridge that climbs from the ground to a summit, candles along it, and a cliff
  const RIDGE = [[STAND, GY], [400, 676], [520, 640], [610, 652], [780, 576], [880, 590], [1040, 506], [1150, 520], [1300, 440], [1452, 404]];
  const ridgePts = (() => {                                       // Catmull-Rom through the points, sampled densely
    const out = [], P = RIDGE;
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      for (let s = 0; s < 1; s += .05) {
        const s2 = s * s, s3 = s2 * s, f = (a, b, c, d) => .5 * (2 * b + (-a + c) * s + (2 * a - 5 * b + 4 * c - d) * s2 + (-a + 3 * b - 3 * c + d) * s3);
        out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
      }
    }
    out.push(P[P.length - 1]);
    return out;
  })();
  const ridgeY = x => { for (let i = 1; i < ridgePts.length; i++) if (x <= ridgePts[i][0]) { const a = ridgePts[i - 1], b = ridgePts[i]; return lerp(a[1], b[1], (x - a[0]) / (b[0] - a[0] || 1)); } return ridgePts[ridgePts.length - 1][1]; };
  const SUMMIT = RIDGE[RIDGE.length - 1];
  const mountain = () => {
    const r = rng(7);
    let c = '', fill = '', bodies = '';
    for (let x = 300; x < SUMMIT[0] - 8; x += 24) {
      const y = ridgeY(x) + 16, h = 14 + r() * 26, up = r() < .72;
      if (y > GY - 50) continue;                                       // nothing hangs below the ground
      c += `M${x} ${n1(y - 10 - r() * 8)}V${n1(y + h + 10 + r() * 10)}`;
      (up ? (c += `M${x - 6} ${n1(y)}h12v${n1(h)}h-12Z`) : (bodies += `M${x - 6} ${n1(y)}h12v${n1(h)}h-12Z`));
      fill += `M${x} ${n1(y + h + 24)}V${GY}`;
    }
    const ridge = 'M' + ridgePts.map(p => `${n1(p[0])} ${n1(p[1])}`).join('L');
    const cliff = `M${SUMMIT[0]} ${SUMMIT[1]}L${SUMMIT[0] + 12} 470L${SUMMIT[0] + 4} 540L${SUMMIT[0] + 18} 620L${SUMMIT[0] + 10} ${GY}`;
    return ln(fill, 'hair mfill') + ln(c, 'thin mcandles') + `<path class="mbodies" d="${bodies}" fill="currentColor"/>` + ln(ridge, 'bold ridge') + ln(cliff, 'thin cliff');
  };

  const WALK = 3.55, TOP = 4.5;
  const walkX = t => keys(t, [[WALK, STAND], [TOP, SUMMIT[0] - 22]]);
  return {
    css: `.ch-chart .ui{font:600 10px var(--font);fill:currentColor;letter-spacing:.02em}`,
    backArt: () => `
      ${ln(`M-400 ${GY}H2000`, 'ground')}
      <g class="chart"><g class="frm">${frame()}</g><g class="cdl">${candles.map(k => `<g data-x="${n1(k.x)}">${candle(k)}</g>`).join('')}</g>${ln(priceLine, 'bold price')}${plan()}${replay()}</g>
      <g class="mtn">${mountain()}</g>`,
    build(tl, $) {
      draw(tl, $('.ground'), 0, .3);
      // the line lifts off the ground into a price line, the chart draws itself around it, candles follow the line
      draw(tl, $('.price'), .3, .9, 0, 'power1.inOut');
      draw(tl, $('.frm .ln'), .5, .7, .02);
      show(tl, $('.frm text'), .7, .3);
      const groups = $('.cdl > g');
      groups.forEach((g, i) => { draw(tl, g.querySelectorAll('.ln'), .75 + i * .035, .2); show(tl, g.querySelectorAll('.cbody'), .8 + i * .035, .1); });
      tl.to($('.price'), {opacity: .3, duration: .3}, 1.7);
      // plan a trade: entry, target, stop, the zones between them
      show(tl, $('.zone'), 2.3, .3, 1);
      draw(tl, $('.plan'), 2.25, .45, .08);
      show(tl, $('.tag'), 2.5, .25);
      // test it on past days: the scrubber jumps back, the later candles dim, then return one by one as it runs
      show(tl, $('.pill'), 2.7, .2);
      show(tl, $('.scrub'), 2.75, .1);
      const later = groups.filter(g => +g.dataset.x > RX0);
      tl.to(later, {opacity: .12, duration: .08}, 2.8);
      tl.fromTo($('.scrub'), {x: 0}, {x: LAST.x - RX0 + 8, duration: .5, ease: 'none'}, 2.9);
      later.forEach(g => tl.to(g, {opacity: 1, duration: .05}, 2.9 + (+g.dataset.x - RX0) / (LAST.x - RX0 + 8) * .5));
      tl.to($('.scrub, .pill'), {opacity: 0, duration: .2}, 3.45);
      // it grows: the frame goes, the chart becomes a mountain, the ridge draws ahead of him as he climbs
      tl.to($('.chart'), {opacity: 0, duration: .35}, 3.45);
      draw(tl, $('.mfill'), 3.5, .9);
      draw(tl, $('.mcandles'), 3.5, 1);
      show(tl, $('.mbodies'), 3.8, .5);
      draw(tl, $('.ridge'), 3.5, TOP - 3.5, 0, 'none');
      draw(tl, $('.cliff'), TOP - .2, .3);
    },
    alive: true,
    fig(t, life = 0) {
      if (t < 2.15) return {lib: 'b', clip: 'Idle_FoldArms_Loop', ct: t * .7 + life * .3, x: STAND, y: GY, s: S, yaw: 90};
      if (t < WALK) return {lib: 'b', clip: 'Yes', ct: (t - 2.15) * 1.6, hold: true, x: STAND, y: GY, s: S, yaw: 90};
      if (t < TOP) { const x = walkX(t); return {lib: 'a', clip: 'Walk_Loop', ct: .2 + stride(x - STAND, S), x, y: ridgeY(x), s: S, yaw: 90}; }
      return {lib: 'b', clip: 'Idle_No_Loop', ct: (t - TOP) + life * .35, x: SUMMIT[0] - 22, y: ridgeY(SUMMIT[0] - 22), s: S, yaw: 90};
    },
    view(t, narrow) {
      const climb = span(t, WALK, TOP + .1), fx = t < WALK ? STAND : t < TOP ? walkX(t) : SUMMIT[0] - 22, fy = t < WALK ? GY : ridgeY(fx);
      if (narrow) return {x: t < WALK ? keys(t, [[0, 640], [2, 900], [2.4, 1200], [3.4, 980]]) : clamp(fx + 40, 300, 1500), y: lerp(430, fy - 230, climb), zoom: lerp(.52, .78, climb)};
      return {x: lerp(830, clamp(fx + 120, 830, 1180), climb), y: lerp(450, Math.min(450, fy - 180), climb), zoom: 1};
    },
  };
})());
