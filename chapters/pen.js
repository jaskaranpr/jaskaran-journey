// CodePen. He walks the line, and the line keeps rising into the things he made just to see if he could:
// a phone as tall as he is, a bus, and at the end a tree that draws itself, branch by branch, while he stops
// to watch it grow.
chapter('pen', (() => {
  const {GY, ln, draw, box, circ, rng, keys, clamp, stride, n1} = L;
  const S = 150, X0 = 240, X1 = 1650, T0 = .25, T1 = 2.7;      // his scale; where he walks from and to, and when
  const LEN = 4;
  const walkX = t => keys(t, [[0, X0], [T0, X0], [T1, X1]]);
  const camX = t => clamp(walkX(t) + 260, 800, 1500);
  const enters = x => { for (let t = 0; t <= LEN; t += .02) if (x < camX(t) + 860) return t; return LEN; };

  // a phone, standing on the line like a monument: body, screen, notch, buttons, a profile and two cards
  const PX = 600, PY = 352;
  function phone() {
    const body = `M${PX} ${GY}V${PY + 30}Q${PX} ${PY} ${PX + 30} ${PY}H${PX + 160}Q${PX + 190} ${PY} ${PX + 190} ${PY + 30}V${GY}`;
    const screen = box(PX + 12, PY + 14, 166, 300, 20) + `M${PX + 76} ${PY + 22}h38`;
    const buttons = `M${PX - 3} ${PY + 80}v34M${PX - 3} ${PY + 126}v46M${PX + 193} ${PY + 104}v52`;
    const ui = `M${PX + 26} ${PY + 42}h20M${PX + 150} ${PY + 42}h14` + circ(PX + 95, PY + 92, 26) + `M${PX + 58} ${PY + 136}h74M${PX + 70} ${PY + 148}h50` +
      box(PX + 26, PY + 168, 138, 52, 10) + box(PX + 26, PY + 230, 138, 52, 10) + `M${PX + 70} ${PY + 302}h50`;
    const card = `M${PX + 40} ${PY + 186}h60M${PX + 40} ${PY + 198}h90M${PX + 40} ${PY + 248}h80M${PX + 40} ${PY + 260}h50`;
    return `<g class="obj" data-x="${PX}">${ln(body)}${ln(screen, 'thin')}${ln(buttons, 'thin')}${ln(ui, 'thin')}${ln(card, 'hair')}</g>`;
  }
  // a bus in side view: windows, door, windscreen, wheels with hubs, lights
  const BX = 1000, BW = 470, BT = 520;
  function bus() {
    const body = `M${BX} ${GY - 30}V${BT + 18}Q${BX} ${BT} ${BX + 18} ${BT}H${BX + BW - 60}Q${BX + BW - 30} ${BT} ${BX + BW - 18} ${BT + 30}L${BX + BW} ${GY - 70}V${GY - 30}` +
      `H${BX + BW - 46}a36 36 0 0 0 -72 0H${BX + 120}a36 36 0 0 0 -72 0Z`;
    let win = '';
    for (let i = 0; i < 6; i++) win += box(BX + 20 + i * 52, BT + 22, 42, 44, 6);
    const front = `M${BX + BW - 104} ${BT + 22}H${BX + BW - 52}L${BX + BW - 26} ${BT + 74}H${BX + BW - 104}Z`;
    const door = `M${BX + 336} ${BT + 22}H${BX + BW - 116}V${GY - 34}H${BX + 336}ZM${BX + 351} ${BT + 22}V${GY - 34}`;
    const trim = `M${BX} ${BT + 92}H${BX + BW - 10}M${BX + BW - 18} ${GY - 52}h12M${BX + 8} ${GY - 52}h12`;
    const wheels = circ(BX + 84, GY - 30, 28) + circ(BX + BW - 82, GY - 30, 28);
    const hubs = circ(BX + 84, GY - 30, 9) + circ(BX + BW - 82, GY - 30, 9);
    return `<g class="obj" data-x="${BX}">${ln(body)}${ln(win, 'thin')}${ln(front + door, 'thin')}${ln(trim, 'hair')}${ln(wheels)}${ln(hubs, 'thin')}</g>`;
  }
  // the tree that draws itself: each generation of branches is one path, so it can grow one generation at a time
  const TX = 1930, DEPTH = 8;
  function tree() {
    const r = rng(17), gens = Array.from({length: DEPTH + 1}, () => '');
    let tips = '';
    const grow = (x, y, a, len, d) => {
      const x2 = x + Math.sin(a) * len, y2 = y - Math.cos(a) * len;
      gens[d] += `M${n1(x)} ${n1(y)}Q${n1((x + x2) / 2 + Math.cos(a) * len * .08)} ${n1((y + y2) / 2 + Math.sin(a) * len * .08)} ${n1(x2)} ${n1(y2)}`;
      if (d === DEPTH) { tips += circ(n1(x2), n1(y2), 2.6); return; }
      const spread = .33 + r() * .12, k = .72 + r() * .07;
      grow(x2, y2, a - spread + (r() - .5) * .12, len * k, d + 1);
      grow(x2, y2, a + spread + (r() - .5) * .12, len * k, d + 1);
    };
    grow(TX, GY, 0, 108, 0);
    return `<g class="tree">${gens.map((d, i) => ln(d, i < 2 ? 'bold' : i < 5 ? '' : i < 7 ? 'thin' : 'hair', `data-gen="${i}"`)).join('')}${ln(tips, 'thin tips')}</g>`;
  }

  return {
    backArt: () => `${ln(`M-300 ${GY}H2600`, 'floor')}${phone()}${bus()}${tree()}`,
    build(tl, $) {
      draw(tl, $('.floor'), 0, .45);
      // each piece rises out of the line as it comes into view
      for (const g of $('.obj')) draw(tl, g.querySelectorAll('.ln'), Math.max(.2, enters(+g.dataset.x) - .15), .7, .07);
      // the tree grows a generation at a time while he watches
      $('.tree [data-gen]').forEach((p, i) => draw(tl, [p], 1.95 + i * .12, .28, 0, 'power1.out'));
      draw(tl, $('.tips'), 1.95 + (DEPTH + 1) * .12, .35);
    },
    alive: true,
    // walk to the tree, then stop and watch it
    fig(t, life = 0) {
      if (t < T1) { const x = walkX(t); return {lib: 'a', clip: 'Walk_Loop', ct: .66 + stride(x - X0, S), x, y: GY, s: S, yaw: 90}; }
      return {lib: 'b', clip: 'Idle_No_Loop', ct: (t - T1) * .9 + life * .35, x: X1, y: GY, s: S, yaw: 82};
    },
    view: (t, narrow) => narrow
      ? {x: clamp(t < T1 ? walkX(t) + 60 : keys(t, [[T1, X1 + 60], [3.3, TX - 90]]), 0, 2200), y: 470, zoom: .78}
      : {x: camX(t), y: 450, zoom: keys(t, [[0, 1], [T1, 1], [3.6, 1.04]])},
  };
})());
