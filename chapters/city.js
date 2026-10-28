// 2022, Bengaluru. He walks in along a terrace, backpack on, the city spread out behind the railing: towers with
// their window grids, the metro running on its viaduct, rain trees with their big flat canopies, and the Peepal Co
// office. He turns, leans on the rail and looks out, and one window in the office lights up.
chapter('city', (() => {
  const {GY, ln, draw, show, stride, fit, box, circ, tree, rng, keys, span, lerp, n1} = L;
  const S = 150, X0 = 150, XR = 980, LEAN = 2.2;               // his scale; where he walks in from, where he leans
  const RAIL = GY - 1.0 * S;                                   // the top of the railing, at forearm height
  const walkX = t => keys(t, [[0, X0], [.25, X0], [LEAN, XR]]);
  const camX = t => keys(t, [[0, 760], [LEAN, 900], [4.2, 950]]);
  const BASE = 640;                                            // where the far city meets the ground

  // towers: an outline, sometimes a stepped crown or a mast, and a grid of windows
  function towers() {
    const r = rng(22);
    let out = '', win = '', x = -260;
    while (x < 2050) {
      const w = 64 + r() * 84, h = 90 + r() * 150, top = BASE - h;
      let d = `M${n1(x)} ${BASE}V${n1(top)}H${n1(x + w)}V${BASE}`;
      if (r() < .35) d += `M${n1(x + w * .2)} ${n1(top)}v-16h${n1(w * .6)}v16`;
      if (r() < .3) d += `M${n1(x + w * .5)} ${n1(top - (d.includes('v-16') ? 16 : 0))}v-34`;
      out += d;
      for (let wy = top + 14; wy < BASE - 12; wy += 16) if (r() < .7) for (let wx = x + 10; wx < x + w - 14; wx += 14) if (r() < .6) win += `M${n1(wx)} ${n1(wy)}h6`;
      x += w + 26 + r() * 70;
    }
    return ln(out, 'thin') + ln(win, 'hair');
  }
  // the Peepal Co office: a glass block with mullions, a rounded corner, and one window that lights up
  const OX = 1250, OT = 400, OW = 210;
  const office = () => {
    let grid = '';
    for (let y = OT + 40; y < BASE - 10; y += 26) grid += `M${OX + 8} ${y}H${OX + OW - 8}`;
    for (let x = OX + 30; x < OX + OW - 10; x += 32) grid += `M${x} ${OT + 22}V${BASE - 6}`;
    return ln(`M${OX} ${BASE}V${OT + 30}Q${OX} ${OT} ${OX + 30} ${OT}H${OX + OW}V${BASE}M${OX + 40} ${OT}v-14h${OW - 80}v14`) + ln(grid, 'hair') +
      `<rect class="lit" x="${OX + 94}" y="${OT + 93}" width="26" height="20" fill="currentColor"/><circle class="lit" cx="${OX + 107}" cy="${OT + 103}" r="60" fill="url(#gGlow)"/>`;
  };
  // the metro: a viaduct on T-shaped piers, and a three-coach train that runs across it
  const DECK = 488;
  const metro = () => {
    let piers = '';
    for (let x = -200; x < 2100; x += 280) piers += `M${x - 10} ${DECK + 22}V${GY}M${x + 10} ${DECK + 22}V${GY}M${x - 34} ${DECK + 22}Q${x} ${DECK + 40} ${x + 34} ${DECK + 22}`;
    let train = '';
    for (let k = 0; k < 3; k++) {
      const x = k * 166, nose = k === 2;
      train += nose ? `M${x} ${DECK}V${DECK - 34}H${x + 130}Q${x + 158} ${DECK - 32} ${x + 160} ${DECK}Z` : box(x, DECK - 34, 160, 34, 6);
      for (let wx = x + 14; wx < x + 120; wx += 26) train += box(wx, DECK - 26, 18, 12, 3);
      train += `M${x + 4} ${DECK - 8}H${x + (nose ? 150 : 156)}`;
    }
    return `<g class="mline">${ln(`M-400 ${DECK}H2200M-400 ${DECK + 22}H2200M-400 ${DECK - 8}H2200`, 'thin')}${ln(piers, 'thin')}</g>` +
      `<g class="train">${ln(train, 'thin')}</g>`;
  };
  // the terrace he stands on: a railing at forearm height, balusters, a floor
  const railing = () => {
    let bal = '';
    for (let x = 520; x < 2100; x += 52) bal += `M${x} ${n1(RAIL + 6)}V${GY}`;
    return ln(`M500 ${n1(RAIL)}H2100M500 ${n1(RAIL + 6)}H2100`, 'handrail') + ln(bal, 'hair balusters');
  };

  return {
    backArt: () => {
      const [t1, i1] = tree(330, GY, 300, 230, 5), [t2, i2] = tree(1720, GY, 340, 250, 12);
      return `
        <g data-depth=".35" class="far">${towers()}</g>
        <g data-depth=".5" class="off">${office()}</g>
        <g data-depth=".65">${metro()}</g>
        <g data-depth=".8" class="trees">${ln(t1)}${ln(i1, 'hair')}${ln(t2)}${ln(i2, 'hair')}</g>
        <g>${ln(`M-300 ${GY}H2200`, 'ground')}${railing()}</g>`;
    },
    build(tl, $) {
      draw(tl, $('.ground'), 0, .3);
      draw(tl, $('.far .ln'), .05, 1.1, .1);
      draw(tl, $('.trees .ln'), .3, .8, .05);
      draw(tl, $('.mline .ln'), .35, .8, .1);
      draw(tl, $('.handrail'), .5, .9, 0, 'power2.inOut');
      draw(tl, $('.balusters'), .7, 1.2);
      draw(tl, $('.off .ln'), .9, 1, .12);
      // the train comes through behind him
      draw(tl, $('.train .ln'), .6, .01);
      tl.fromTo($('.train'), {x: -700}, {x: 2300, duration: 2.8, ease: 'none'}, .6);
      // he looks out, and the office window lights up
      show(tl, $('.lit'), 2.55, .35, 1);
    },
    alive: true,
    fig(t, life = 0) {
      if (t < LEAN) { const x = walkX(t); return {lib: 'a', clip: 'Walk_Formal_Loop', ct: .3 + stride(x - X0, S), x, y: GY, s: S, yaw: 90, props: ['bag']}; }
      return {lib: 'b', clip: 'Idle_Rail_Loop', ct: (t - LEAN) * .8 + life * .4, x: XR, y: GY, s: S, yaw: lerp(100, 142, span(t, LEAN, LEAN + .25)), props: ['bag']};
    },
    view: (t, narrow) => ({x: fit(narrow, camX(t), walkX(t) + 60, 0, 1600), y: narrow ? 430 : 450, zoom: narrow ? .72 : keys(t, [[0, 1], [4.2, 1.04]])}),
  };
})());
