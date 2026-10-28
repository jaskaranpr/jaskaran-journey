// Home: the line runs back out to Chakar. A grassy crest, and far off on the plain the village again: a line of
// poplars, the water tower, the gurdwara and its flag. He walks up onto the crest and lies down in the grass. A kite
// hangs over the village on a long string, birds cross, and as the chapter ends the sky fills with light.
chapter('home', (() => {
  const {GY, ln, draw, show, box, circ, pts, rng, keys, span, lerp, fit, stride, n1} = L;
  const S = 150, X0 = 780, HZ = 612, DOWN = [1, 2];                       // his scale, where he lies, the far horizon
  const crest = x => GY + .00012 * Math.max(0, Math.abs(x - 800) - 260) ** 2;
  const heX = t => keys(t, [[0, 170], [.1, 170], [.95, X0]]);
  const KX = 1230, KY = 250, AX = 990;                                    // the kite, and where its string comes down

  // the village far off, small and pale: echoes of the first chapter
  function far() {
    const r = rng(21);
    let pop = '';
    for (let i = 0; i < 13; i++) { const x = 1010 + i * 24 + r() * 8, h = 32 + r() * 22, w = 5 + r() * 2.5;
      pop += `M${n1(x)} ${HZ}V${n1(HZ - h * .16)}M${n1(x)} ${n1(HZ - h * .1)}C${n1(x - w)} ${n1(HZ - h * .4)} ${n1(x - w * .55)} ${n1(HZ - h * .92)} ${n1(x)} ${n1(HZ - h)}C${n1(x + w * .55)} ${n1(HZ - h * .92)} ${n1(x + w)} ${n1(HZ - h * .4)} ${n1(x)} ${n1(HZ - h * .1)}`; }
    const tower = `M552 ${HZ}L558 ${HZ - 46}M572 ${HZ}L566 ${HZ - 46}M552 ${HZ}L566 ${HZ - 32}M572 ${HZ}L558 ${HZ - 32}` + box(546, HZ - 64, 32, 18, 5);
    const houses = `M470 ${HZ}V${HZ - 18}H502V${HZ}M506 ${HZ}V${HZ - 24}H534V${HZ}M590 ${HZ}V${HZ - 16}H620V${HZ}`;
    const gx = 700, gur = `M${gx} ${HZ}V${HZ - 22}H${gx + 62}V${HZ}M${gx + 20} ${HZ - 22}C${gx + 19} ${HZ - 36} ${gx + 27} ${HZ - 41} ${gx + 31} ${HZ - 48}C${gx + 35} ${HZ - 41} ${gx + 43} ${HZ - 36} ${gx + 42} ${HZ - 22}M${gx + 84} ${HZ}V${HZ - 72}`;
    let fields = '';
    for (let i = -9; i <= 9; i++) fields += `M${n1(800 + i * 60)} ${HZ + 5}L${n1(800 + i * 170)} ${HZ + 70}`;
    return ln(`M-600 ${HZ}H2400`, 'hair horizon') + `<g class="vil">${ln(pop, 'thin')}${ln(tower + houses, 'thin')}${ln(gur, 'thin')}` +
      `<path class="flag" d="M${gx + 84} ${HZ - 72}l22 6l-22 7Z" fill="currentColor" opacity=".55"/></g>` + ln(fields, 'hair fields');
  }
  // the crest he lies on, and its grass: tufts all along it, thicker and taller around him, a few small flowers
  const crestLine = () => pts(Array.from({length: 76}, (_, i) => [-600 + i * 40, crest(-600 + i * 40)]));
  function grass() {
    const r = rng(9);
    let near = '', far = '', flowers = '';
    for (let x = -500; x < 2200; x += 14 + r() * 26) {
      const y = crest(x), close = Math.abs(x - X0 + 40) < 260, h = (close ? 13 : 7) + r() * (close ? 12 : 8), l = (r() - .5) * 6;
      const tuft = `M${n1(x)} ${n1(y)}q${n1(-2 + l * .3)} ${n1(-h * .5)} ${n1(-5 + l)} ${n1(-h)}M${n1(x + 2)} ${n1(y)}q${n1(1 + l * .2)} ${n1(-h * .6)} ${n1(2 + l)} ${n1(-h * 1.15)}M${n1(x + 4)} ${n1(y)}q${n1(3 + l * .3)} ${n1(-h * .4)} ${n1(7 + l)} ${n1(-h * .8)}`;
      if (close) near += tuft; else far += tuft;
    }
    for (const [x, h] of [[598, 22], [622, 30], [1010, 26], [1036, 18], [470, 20], [1180, 24]]) {
      const y = crest(x);
      flowers += `M${x} ${n1(y)}q-2 ${-h / 2} 1 ${-h}` + circ(x + 1, n1(y - h - 3), 3);
    }
    return ln(near, 'thin grass') + ln(far, 'hair grass') + ln(flowers, 'thin grass');
  }
  // a kite on its long string, a tail of little bows
  function kite() {
    let tail = `M${KX} ${KY + 30}C${KX - 8} ${KY + 52} ${KX + 10} ${KY + 70} ${KX - 4} ${KY + 92}`;
    for (const [dx, dy] of [[-3, 50], [3, 66], [-3, 82]]) tail += `M${KX + dx - 5} ${KY + dy - 3}l10 6M${KX + dx - 5} ${KY + dy + 3}l10 -6`;
    return `<g class="kite">${ln(`M${KX} ${KY - 26}L${KX + 19} ${KY}L${KX} ${KY + 30}L${KX - 19} ${KY}Z`)}${ln(`M${KX} ${KY - 26}V${KY + 30}M${KX - 19} ${KY}H${KX + 19}`, 'hair')}${ln(tail, 'thin')}` +
      `${ln(`M${KX} ${KY + 4}C${KX - 60} ${KY + 170} ${AX + 120} ${HZ - 140} ${AX} ${HZ - 4}`, 'hair string')}</g>`;
  }
  const birds = () => [[1056, 318], [1082, 304], [1110, 326], [1140, 312]].map(([x, y]) => ln(`M${x} ${y}q6 -7 12 0q6 -7 12 0`, 'thin bird')).join('');

  return {
    backArt: () => `
      <rect class="wash" x="-800" y="-800" width="3200" height="2600" fill="#d6e9f6" opacity="0"/>
      <g class="sky"><circle class="sunglow" cx="1340" cy="420" r="240" fill="url(#gGlow)" opacity="0"/>${ln(circ(1340, 420, 30), 'thin sun')}</g>
      <g data-depth=".55">${far()}</g>
      ${kite()}<g class="birds">${birds()}</g>
      ${ln(crestLine(), 'ground')}
      ${grass()}`,
    build(tl, $) {
      draw(tl, $('.ground'), 0, .6);
      draw(tl, $('.horizon'), .1, .6);
      draw(tl, $('.vil .ln'), .2, .7, .05);
      tl.fromTo($('.vil .flag'), {opacity: 0}, {opacity: .55, duration: .3}, .7);
      draw(tl, $('.fields'), .3, .8);
      show(tl, $('.sunglow'), .25, .6, .35);
      draw(tl, $('.sun'), .3, .6);
      draw(tl, $('.grass'), .35, 1.2, .1);
      draw(tl, $('.kite .ln'), 1.15, .7, .08);
      draw(tl, $('.bird'), 1.5, .4, .06);
      // the kite tugs on its string, the birds drift on
      tl.fromTo($('.kite'), {rotation: -2.5, svgOrigin: `${AX} ${HZ}`}, {rotation: 2.5, duration: 1.4, ease: 'sine.inOut'}, 1.2)
        .to($('.kite'), {rotation: -1.5, duration: 1.4, ease: 'sine.inOut'}, 2.6);
      tl.fromTo($('.birds'), {x: 0}, {x: 160, duration: 2.6}, 1.4);
      // and the sky fills with light, so the white card can arrive
      tl.to($('.sunglow'), {opacity: 1, scale: 7, svgOrigin: '1340 420', duration: .9, ease: 'power2.in'}, 3);
      tl.fromTo($('.wash'), {opacity: 0}, {opacity: .92, duration: .75, ease: 'power1.in'}, 3.15);
    },
    // up onto the crest, then down into the grass: getting up, played backwards, ending knees up, breathing
    alive: true,
    fig(t, life = 0) {
      if (t < DOWN[0]) { const x = heX(t); return {lib: 'a', clip: 'Walk_Loop', ct: .2 + stride(x - 170, S), x, y: crest(x), s: S, yaw: 90}; }
      const k = span(t, DOWN[0], DOWN[1]), e = k * k * (3 - 2 * k);
      const ct = t < DOWN[1] ? lerp(1.532, .1, e) : .1 + .012 * Math.sin(life * 1.3);
      return {lib: 'b', clip: 'LayToIdle', ct, hold: true, x: X0, y: GY, s: S, yaw: 90};
    },
    view: (t, narrow) => ({x: fit(narrow, keys(t, [[0, 740], [2.2, 760], [4, 800]]), t < DOWN[0] ? heX(t) + 30 : X0 - 40, 0, 1600),
      y: keys(t, [[0, 450], [2.2, 480], [3.1, 470], [4, 380]]), zoom: keys(t, [[0, 1], [2.2, 1.1], [4, 1.02]])}),
  };
})());
