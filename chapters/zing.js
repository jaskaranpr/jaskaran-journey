// Zing Trade. White, like the product cards at the end of the film. A giant browser window: he drops out of the
// sky from the last chapter and lands on its top edge, which bounces; the extension slides out of its side and
// its strategies switch on one by one, while the tabs run through the apps people already trade in.
chapter('zing', (() => {
  const {ln, draw, show, box, circ, keys, span, lerp, fit, rng, n1} = L;
  const S = 128, FX = 1030;                                       // his scale; where he lands
  const BX = 300, BX2 = 1210, BT = 470, TB = BT + 46, AB = TB + 40;  // window, tab bar, address bar
  const BROKERS = ['Groww', 'Kite', 'Upstox', 'Dhan'], TW = 132;
  const tabX = i => BX + 96 + i * TW;
  const PX = BX2 + 18, PW = 232;                                 // the extension panel, open
  const FALL = .3, LAND = .78, STAND = 1.45, YES = 2.55, DONE = 3.35;

  // the page inside: a symbol, a candle chart, buy and sell
  function page() {
    const r = rng(17), cx = BX + 44, cy = AB + 70, cw = 560, chh = 230;
    let candles = '', wicks = '', p = cy + chh * .55;
    for (let i = 0; i < 24; i++) {
      const o = p, c = Math.max(cy + 20, Math.min(cy + chh - 20, p + (r() - .56) * 34)), x = cx + 14 + i * 22.5;
      wicks += `M${n1(x + 5)} ${n1(Math.min(o, c) - 6 - r() * 10)}V${n1(Math.max(o, c) + 6 + r() * 10)}`;
      candles += box(x, n1(Math.min(o, c)), 10, n1(Math.max(4, Math.abs(c - o))), 1.5);
      p = c;
    }
    return `<g class="page">${ln(`M${cx} ${AB + 30}h150`, 'bold')}${ln(`M${cx + 168} ${AB + 30}h70`, 'thin')}${ln(box(cx, cy, cw, chh, 8), 'thin')}` +
      `${ln(`M${cx} ${cy + chh * .33}h${cw}M${cx} ${cy + chh * .66}h${cw}`, 'hair')}${ln(wicks, 'hair candles')}${ln(candles, 'thin candles')}` +
      `${ln(box(BX + 640, cy, 220, 44, 22))}<text class="t" x="${BX + 750}" y="${cy + 28}" text-anchor="middle">Buy</text>` +
      `${ln(box(BX + 640, cy + 58, 220, 44, 22), 'thin')}<text class="t" x="${BX + 750}" y="${cy + 86}" text-anchor="middle">Sell</text>` +
      `${ln([0, 1, 2, 3, 4].map(i => `M${BX + 640} ${cy + 136 + i * 22}h${120 + (i % 3) * 30}`).join(''), 'hair')}` +
      // each strategy marks the chart: an entry line and a buy arrow
      [0, 1, 2].map(i => { const x = cx + 110 + i * 150, y = cy + 64 + i * 32;
        return `<g class="mark mk${i}"><path class="dash" d="M${x - 50} ${y}h160" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M${x} ${y + 36}l-10 15h20Z" fill="currentColor"/></g>`; }).join('') + `</g>`;
  }
  // the window: frame, the four tabs, the address bar with the extension's icon
  function browser() {
    const tabs = BROKERS.map((b, i) => { const x = tabX(i);
      return ln(`M${x} ${TB}V${BT + 18}Q${x} ${BT + 10} ${x + 8} ${BT + 10}H${x + 116}Q${x + 124} ${BT + 10} ${x + 124} ${BT + 18}V${TB}`, 'thin tab') +
        `<text class="t tab-t" x="${x + 62}" y="${BT + 35}" text-anchor="middle">${b}</text>`; }).join('');
    return `<g class="win"><path d="${box(BX, BT, BX2 - BX, 560, 18)}" fill="#fdfdfd"/>${ln(box(BX, BT, BX2 - BX, 560, 18), 'frame')}` +
      `<rect class="active" x="${tabX(0) + 2}" y="${BT + 12}" width="120" height="${TB - BT - 12}" rx="7" fill="currentColor" opacity=".08"/>` +
      `${ln(circ(BX + 24, BT + 24, 6) + circ(BX + 44, BT + 24, 6) + circ(BX + 64, BT + 24, 6), 'thin dots')}${tabs}` +
      `${ln(`M${BX} ${TB}H${BX2}M${BX} ${AB}H${BX2}`, 'thin bars')}` +
      `${ln(box(BX + 96, TB + 8, 560, 25, 12.5), 'thin addr')}${ln(`M${BX + 114} ${TB + 24}v-5a4 4 0 0 1 8 0v5Zm24 -4h120m14 0h60`, 'hair addr')}` +
      `<g class="icon"><rect x="${BX2 - 62}" y="${TB + 8}" width="25" height="25" rx="7" fill="currentColor" opacity="0"/>${ln(box(BX2 - 62, TB + 8, 25, 25, 7) + `M${BX2 - 55} ${TB + 15}h11l-11 11h11`, 'thin icn')}</g>` +
      `${page()}</g>`;
  }
  // the extension: a header, three strategies with switches
  function panel() {
    const rows = [0, 1, 2].map(i => { const y = BT + 112 + i * 70;
      return ln(`M${PX + 18} ${y}h70`, 'bold') + ln(`M${PX + 18} ${y + 18}h110`, 'hair') +
        `<g class="sw sw${i}"><rect class="trk" x="${PX + PW - 64}" y="${y - 4}" width="44" height="24" rx="12" fill="currentColor" opacity="0"/>` +
        `${ln(box(PX + PW - 64, y - 4, 44, 24, 12), 'thin')}<circle class="knob" cx="${PX + PW - 52}" cy="${y + 8}" r="8" fill="currentColor"/></g>`; }).join('');
    return `<g class="panel"><path d="${box(PX, BT + 56, PW, 300, 16)}" fill="#fdfdfd"/>${ln(box(PX, BT + 56, PW, 300, 16))}` +
      `<text class="t hd" x="${PX + 18}" y="${BT + 88}">Zing Trade</text>${ln(`M${PX} ${BT + 100}h${PW}`, 'hair')}${rows}` +
      `${ln(box(PX + 18, BT + 314, PW - 36, 28, 14), 'thin')}</g>`;
  }
  const r = rng(5), BURST = Array.from({length: 7}, (_, i) => { const a = Math.PI * (1.08 + i * .14), l = 16 + r() * 14;
    return `M${n1(FX + Math.cos(a) * 34)} ${n1(BT - 4 + Math.sin(a) * 10)}l${n1(Math.cos(a) * l)} ${n1(Math.sin(a) * l * .7)}`; }).join('');

  return {
    text: [{at: [.45, 3.6], h: 'I started Zing Trade.', p: 'A browser extension that brings our trading strategies into the apps people already use, like Groww, Kite, Upstox and Dhan.', layout: 'stack'}],
    css: `.ch-zing .t{font:500 15px var(--font);fill:currentColor}.ch-zing .tab-t{font-size:14px}.ch-zing .hd{font-weight:600;font-size:16px}
      .ch-zing .dash{stroke-dasharray:6 6}`,
    backArt: () => `${panel()}${browser()}`,
    frontArt: () => ln(BURST, 'thin burst'),
    build(tl, $) {
      // the window draws itself, then its contents
      show(tl, $('.win > path:not(.ln)'), 0, .4);
      draw(tl, $('.frame'), .05, .55);
      draw(tl, $('.dots, .tab, .bars'), .3, .45, .04);
      show(tl, $('.tab-t'), .45, .3);
      draw(tl, $('.addr, .icn'), .45, .4, .05);
      draw(tl, $('.page > .ln:not(.candles)'), .55, .5, .03);
      draw(tl, $('.candles'), .7, .55, .1);
      show(tl, $('.page .t'), .8, .3);
      // he lands: the window dips under him and springs back, a puff of lines at his feet
      tl.to($('.win'), {y: 9, duration: .05, ease: 'power2.in'}, LAND).to($('.win'), {y: 0, duration: .35, ease: 'elastic.out(1, .35)'}, LAND + .05);
      draw(tl, $('.burst'), LAND, .12, 0, 'power2.out');
      tl.to($('.burst'), {opacity: 0, duration: .2}, LAND + .14);
      // the extension's icon lights and its panel slides out from behind the window
      tl.to($('.icon rect'), {opacity: .16, duration: .1}, .9);
      tl.fromTo($('.panel'), {x: -(PW + 40), opacity: 0}, {x: 0, opacity: 1, duration: .45, ease: 'power3.out'}, .95);
      draw(tl, $('.panel .ln'), 1.05, .4, .02);
      show(tl, $('.panel .t'), 1.15, .25);
      tl.fromTo($('.knob'), {opacity: 0}, {opacity: 1, duration: .2, stagger: .05}, 1.2);
      // each strategy switches on, and the tabs run through the apps, the chart marked in each
      for (let i = 0; i < 3; i++) {
        const at = 1.55 + i * .42;
        tl.to($(`.sw${i} .knob`), {attr: {cx: PX + PW - 32}, duration: .14, ease: 'power2.out'}, at);
        tl.to($(`.sw${i} .trk`), {opacity: .9, duration: .14}, at);
        tl.to($(`.sw${i} .knob`), {fill: '#fdfdfd', duration: .1}, at + .04);
        tl.to($('.active'), {attr: {x: tabX(i + 1) + 2}, duration: .22, ease: 'power2.inOut'}, at + .12);
        tl.fromTo($(`.mk${i}`), {opacity: 0, y: 8}, {opacity: 1, y: 0, duration: .2, ease: 'power2.out'}, at + .2);
      }
    },
    alive: true,
    // falls in tucked, lands, stands; thumbs up at the switches; then stands easy
    fig(t, life = 0) {
      if (t < LAND) return {lib: 'b', clip: 'NinjaJump_Land', ct: 0, hold: true, x: FX, y: lerp(-260, BT, span(t, FALL, LAND) ** 2), s: S, yaw: 90};
      if (t < STAND) return {lib: 'b', clip: 'NinjaJump_Land', ct: lerp(.12, 1.26, span(t, LAND, STAND)), hold: true, x: FX, y: BT, s: S, yaw: 90};
      if (t >= YES && t < DONE) return {lib: 'b', clip: 'Yes', ct: lerp(0, 2.45, span(t, YES, DONE)), hold: true, x: FX, y: BT, s: S, yaw: 90};
      return {lib: 'b', clip: 'Idle_No_Loop', ct: t + life * .35, x: FX, y: BT, s: S, yaw: 90};
    },
    view: (t, narrow) => ({x: fit(narrow, 800, 1130), y: narrow ? 330 : 450, zoom: keys(t, [[0, 1], [4, 1.03]])}),
  };
})());
