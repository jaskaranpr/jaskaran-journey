// Chakar at dawn. He's small, a school bag on his back, walking the village road to the government school.
// The camera travels with him; the line draws the world just ahead of him: flat-roofed houses with water tanks,
// the water tower, the gurdwara and its flag, rows of poplars, wheat, power lines with birds,
// farmers bent over the crop, shade trees, and at the end of the road the school gate with its sign.
chapter('chakar', (() => {
  const {GY, ln, draw, show, stride, par, fit, box, circ, tree, rng, keys, clamp, n1} = L;
  const S = 150, HZ = 560;                                    // his scale; the far horizon
  const kidX = t => keys(t, [[0, 330], [.25, 330], [4.35, 2920]]);
  const camX = t => clamp(kidX(t) + 230, 800, 2450);
  const LEN = 4.6;
  // when something at board x, on a layer at depth d, slides in from the right edge
  const enters = (x, d) => { for (let t = 0; t <= LEN; t += .02) { const v = camX(t); if (x + (v - 800) * (1 - d) < v + 860) return t; } return LEN; };

  // ---- far: houses, water tower, gurdwara, poplars (depth .4) ----
  const house = (x, w, h, r) => {
    const y = HZ - h;
    let d = `M${x} ${HZ}V${y}H${x + w}V${HZ}`, f = `M${x - 3} ${y}H${x + w + 3}`;   // walls, roof slab
    for (let px = x + 4; px < x + w - 6; px += 9) f += `M${px} ${y}v-6`;            // the jali parapet
    f += `M${x - 1} ${y - 6}H${x + w + 1}`;
    const door = `M${x + w * .3} ${HZ}v-${n1(h * .48)}h${n1(w * .16)}v${n1(h * .48)}`;
    const win = `M${x + w * .62} ${n1(y + h * .3)}h${n1(w * .18)}v${n1(h * .2)}h-${n1(w * .18)}Z`;
    const tank = r() < .55 ? `M${x + w * .6} ${y - 6}v-16a9 4 0 0 1 18 0v16` : '';
    const mumty = r() < .4 ? `M${x + 6} ${y - 6}v-22h${n1(w * .3)}v22` : '';
    return ln(d) + ln(f, 'thin') + ln(door + win, 'thin') + (tank ? ln(tank, 'thin') : '') + (mumty ? ln(mumty, 'thin') : '');
  };
  const poplar = (x, h, w) => ln(`M${x} ${HZ}V${HZ - h * .18}M${x} ${HZ - h * .12}C${x - w} ${HZ - h * .4} ${n1(x - w * .55)} ${HZ - h * .92} ${x} ${HZ - h}C${n1(x + w * .55)} ${HZ - h * .92} ${x + w} ${HZ - h * .4} ${x} ${HZ - h * .12}`, 'thin');
  function far() {
    const r = rng(14);
    let g = ln(`M-500 ${HZ}H2700`, 'thin horizon');
    let x = 120;
    while (x < 860) { const w = 46 + r() * 50; g += `<g class="f" data-x="${x}">${house(x, w, 34 + r() * 32, r)}</g>`; x += w + 4 + r() * 16; }
    // the water tower, on four legs
    g += `<g class="f" data-x="980">${ln(`M962 ${HZ}L972 ${HZ - 88}M998 ${HZ}L988 ${HZ - 88}M962 ${HZ}L988 ${HZ - 60}M998 ${HZ}L972 ${HZ - 60}M966 ${HZ - 44}L994 ${HZ - 44}`, 'thin')}${ln(box(950, HZ - 122, 60, 34, 8))}${ln(`M950 ${HZ - 114}Q980 ${HZ - 136} 1010 ${HZ - 114}`, 'thin')}</g>`;
    // the gurdwara: a white block, the onion dome, small domes on the corners, and the Nishan Sahib beside it
    const gx = 1300;
    g += `<g class="f" data-x="${gx}">${ln(`M${gx} ${HZ}V${HZ - 46}H${gx + 130}V${HZ}`)}${ln(`M${gx + 42} ${HZ - 46}C${gx + 40} ${HZ - 74} ${gx + 56} ${HZ - 84} ${gx + 65} ${HZ - 98}C${gx + 74} ${HZ - 84} ${gx + 90} ${HZ - 74} ${gx + 88} ${HZ - 46}M${gx + 65} ${HZ - 98}v-10`)}` +
      `${ln(`M${gx + 4} ${HZ - 46}v-12a8 8 0 0 1 16 0v12M${gx + 110} ${HZ - 46}v-12a8 8 0 0 1 16 0v12M${gx + 50} ${HZ}v-24a15 15 0 0 1 30 0v24`, 'thin')}` +
      `${ln(`M${gx + 170} ${HZ}V${HZ - 150}`, 'thin')}<path class="flag" d="M${gx + 170} ${HZ - 150}L${gx + 214} ${HZ - 138}L${gx + 170} ${HZ - 124}Z" fill="currentColor" opacity=".9"/></g>`;
    // a line of poplars
    for (let i = 0; i < 19; i++) { const px = 1560 + i * 26 + r() * 10; g += `<g class="f" data-x="${n1(px)}">${poplar(n1(px), 70 + r() * 50, 9 + r() * 4)}</g>`; }
    return g;
  }

  // ---- mid: furrows, wheat, power lines, shade trees (depth .7) ----
  function mid() {
    const r = rng(31);
    let g = '';
    // a few field edges running away to the horizon
    let fur = '';
    for (const i of [-9, -4, 3, 8, 15]) fur += `M${n1(1100 + i * 34)} ${HZ + 6}L${n1(1100 + i * 150)} 646`;
    g += `<g class="m" data-x="0">${ln(fur, 'hair furrows')}</g>`;
    // the power line, pole to pole, with birds sitting on it
    const poles = [380, 1150, 1920, 2690];
    for (const [i, x] of poles.entries()) {
      let d = `M${x} 688V470M${x - 30} 486H${x + 30}M${x - 24} 486v-8M${x} 486v-8M${x + 24} 486v-8`;
      if (i) for (const k of [-24, 0, 24]) d += `M${poles[i - 1] + k} 478Q${(poles[i - 1] + x) / 2 + k} 512 ${x + k} 478`;
      g += `<g class="m" data-x="${x}">${ln(d, 'thin')}</g>`;
    }
    let birds = '';
    for (const [x, y] of [[700, 495], [730, 497], [758, 497], [1500, 497], [1530, 496], [2210, 494]]) birds += `M${x} ${y}q5 -7 10 0`;
    g += `<g class="m" data-x="700">${ln(birds, 'thin')}</g>`;
    // two big shade trees by the road, the kind every village field has
    for (const [tx, w, h, seed] of [[1760, 250, 190, 3]]) {
      const [outline, inner] = tree(tx, 690, w, h, seed);
      g += `<g class="m" data-x="${tx - w / 2}">${ln(outline)}${ln(inner, 'hair')}</g>`;
    }
    // wheat: a stalk and a slim ear, shoulder to shoulder, all one path per shade
    const w = ['', ''];
    const patches = [[-160, 520], [880, 1220], [1500, 1980]];               // wheat in patches, not wall to wall
    for (let i = 0; i < 200; i++) {
      const [a, b] = patches[i % 3], x = a + r() * (b - a), y = 690 - r() * 8, h = 22 + r() * 26, lean = (r() - .45) * 8, ex = x + lean, ey = y - h;
      const ear = `M${n1(ex)} ${n1(ey)}q-2.4 -6 ${n1(lean * .2)} -13q2.4 7 ${n1(-lean * .2)} 13`;
      w[r() < .5 ? 0 : 1] += `M${n1(x)} ${n1(y)}Q${n1(x + lean * .4)} ${n1(y - h * .5)} ${n1(ex)} ${n1(ey)}` + ear;
    }
    g += `<g class="m" data-x="0">${ln(w[0], 'thin wheat')}${ln(w[1], 'hair wheat')}</g>`;
    return g;
  }

  // ---- near: the road, and the school at the end of it (depth 1) ----
  function near() {
    let g = `<g class="n" data-x="0">${ln(`M-300 ${GY}H3500`, 'road')}${ln(`M-300 ${GY + 22}H3500`, 'hair')}</g>`;
    // the boundary wall, the gate with its sign, the building behind with its verandah of arches
    const wx = 2460, gx = 2860;
    let wall = `M${wx} ${GY}V640H${gx}M${gx + 120} 640H3400`, coping = `M${wx - 4} 640H${gx}M${gx + 120} 640H3404`;
    for (let x = wx + 60; x < 3400; x += 80) if (x < gx - 10 || x > gx + 130) coping += `M${x} 640v60`;
    g += `<g class="n" data-x="${wx}">${ln(wall)}${ln(coping, 'thin')}</g>`;
    let arches = `M2520 640V520H3360V640M2510 520H3370M2510 508H3370`;
    for (let x = 2540; x < 3340; x += 70) arches += `M${x} 640V575a26 26 0 0 1 52 0V640`;
    g += `<g class="n" data-x="2520">${ln(arches, 'thin')}${ln(`M3290 520V380`, 'thin')}<path class="flag" d="M3290 380h52v30h-52Z" fill="none" stroke="currentColor" stroke-width="1.4" opacity=".7"/></g>`;
    g += `<g class="n" data-x="${gx}">${ln(`M${gx - 14} ${GY}V560H${gx + 10}V${GY}M${gx + 110} ${GY}V560H${gx + 134}V${GY}`)}${ln(`M${gx - 14} 560Q${gx + 60} 500 ${gx + 134} 560`)}` +
      `${ln(box(gx - 6, 516, 132, 34, 6), 'thin')}<text class="sign pa" x="${gx + 60}" y="539" text-anchor="middle">ਸਰਕਾਰੀ ਸਕੂਲ</text></g>`;
    return g;
  }

  return {
    css: `.ch-chakar .sign{font:500 19px "Noto Sans Gurmukhi",sans-serif;fill:currentColor}`,
    backArt: () => `
      <g data-depth=".15"><circle class="sun" cx="1240" cy="${HZ}" r="230" fill="url(#gGlow)" opacity=".28"/>${ln(`M1194 ${HZ}a46 46 0 0 1 92 0`, 'sunline')}</g>
      <g data-depth=".4">${far()}</g>
      <g data-depth=".7">${mid()}</g>
      <g>${near()}</g>`,
    build(tl, $, c) {
      draw(tl, $('.road'), 0, .5);
      draw(tl, $('.sunline'), .15, .6);
      show(tl, $('.sun'), 0, .8, .28);
      draw(tl, $('.horizon'), 0, .5);
      draw(tl, $('.furrows'), .1, .9);
      // everything else draws itself as it comes into view
      for (const [cls, d] of [['.f', .4], ['.m', .7], ['.n', 1]]) for (const g of $(cls)) {
        const at = Math.max(0, enters(+g.dataset.x, d) - .2);
        draw(tl, g.querySelectorAll('.ln:not(.wheat)'), at, .55, .04);
        show(tl, g.querySelectorAll('.flag,.sign'), at + .35, .3, .9);
      }
      draw(tl, $('.wheat'), .05, 1.6);
    },
    // the kid with his bag, and two farmers out in the wheat already
    fig(t) {
      const x = kidX(t), v = camX(t);
      return [
        {lib: 'a', clip: 'Walk_Loop', ct: .2 + stride(x - 330, S, true), x, y: GY, s: S, yaw: 90, kid: true, props: ['bag']},
        {lib: 'b', clip: 'Farm_Harvest', ct: t * .9, x: par(990, .7, v), y: 652, z: -50, s: 64, yaw: 120, far: true},
        {lib: 'b', clip: 'Farm_Harvest', ct: t * .9 + 1.2, x: par(1110, .7, v), y: 656, z: -50, s: 64, yaw: 70, far: true},
      ];
    },
    view: (t, narrow) => ({x: fit(narrow, camX(t), kidX(t) + 30, 0, 3200), y: 450, zoom: 1}),
  };
})());
