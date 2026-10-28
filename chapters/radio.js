// A room at night. An old computer glows on the desk by the window; the kid kneels on the floor under its lamp with a radio he's
// opened up, its circuit board laid out beside it. He works at it, and at the end it comes alive: the dial lights
// up and sound rings out of it.
chapter('radio', (() => {
  const {GY, ln, draw, show, box, circ, rng, keys, span, fit, n1} = L;
  const S = 172, KX = 700;                                       // his scale; where he kneels
  // radio and board on the floor in front of him
  const RX = 812, RY = GY - 86;
  function radio() {
    const body = ln(box(RX, RY, 150, 86, 10));
    const grille = ln(circ(RX + 46, RY + 43, 27), 'thin') + ln(circ(RX + 46, RY + 43, 16), 'hair') + ln(circ(RX + 46, RY + 43, 6), 'hair');
    const dial = ln(box(RX + 86, RY + 18, 48, 22, 4), 'thin') + ln(`M${RX + 92} ${RY + 34}h36M${RX + 98} ${RY + 34}v-4M${RX + 106} ${RY + 34}v-6M${RX + 114} ${RY + 34}v-4M${RX + 122} ${RY + 34}v-6`, 'hair');
    const knobs = ln(circ(RX + 98, RY + 62, 8), 'thin') + ln(circ(RX + 124, RY + 62, 8), 'thin');
    const antenna = ln(`M${RX + 128} ${RY}L${RX + 96} ${RY - 112}`, 'thin');
    return `<g class="radio">${body}${grille}${dial}${knobs}${antenna}</g>`;
  }
  function board() {
    const bx = RX + 182, by = GY - 34, r = rng(4);
    let d = box(bx, by, 170, 30, 3), parts = '';
    for (let i = 0; i < 7; i++) { const x = bx + 12 + i * 22, y = by + 8 + (i % 2) * 10;
      parts += i % 3 === 0 ? `M${x} ${y}h4l2 -3l3 6l3 -6l3 6l2 -3h4` : i % 3 === 1 ? `M${x} ${y - 2}v8M${x + 5} ${y - 2}v8M${x - 3} ${y + 2}h3M${x + 5} ${y + 2}h3` : `M${x} ${y - 3}h12v8h-12Z`; }
    let wires = '';
    for (let i = 0; i < 4; i++) wires += `M${n1(bx + 30 + i * 30)} ${by}C${n1(bx + 20 + i * 28)} ${by - 30 - r() * 20} ${n1(RX + 150 - i * 6)} ${RY + 40 + i * 6} ${RX + 150} ${RY + 46 + i * 8}`;
    return `<g class="board">${ln(d, 'thin')}${ln(parts, 'hair')}${ln(wires, 'hair wires')}</g>`;
  }
  // the desk on the right with the old computer, the window above it with the moon, a lamp bending over him
  const DX = 1130;
  const desk = () => ln(`M${DX} ${GY}V520H${DX + 400}V${GY}M${DX + 10} 520V${GY}M${DX + 390} 520V${GY}M${DX} 540H${DX + 400}`, 'thin') +
    ln(`${box(DX + 120, 380, 176, 140, 16)}M${DX + 146} 404h124v86h-124Z`) + ln(`M${DX + 190} 520l-8 0M${DX + 226} 520l8 0`, 'thin') + ln(box(DX + 120, 498, 0, 0, 0) + box(DX + 300, 500, 84, 14, 4), 'thin');
  const win = () => ln(box(DX - 20, 120, 300, 210, 4) + `M${DX + 130} 120V330M${DX - 20} 225H${DX + 280}`, 'thin') + ln(circ(DX + 214, 172, 24), '') +
    ln(`M${DX + 20} 160v.1M${DX + 80} 196v.1M${DX + 250} 290v.1M${DX + 30} 296v.1M${DX + 180} 306v.1`, 'bold stars');
  const HX = DX - 100, HY = 356;                                                        // the lamp's head
  const lamp = () => ln(`M${DX + 18} 520h64M${DX + 30} 520q20 -16 40 0M${DX + 46} 508L${DX + 8} 404M${DX + 54} 506L${DX + 16} 402`, '') + ln(circ(DX + 12, 400, 7), 'thin') +
    ln(`M${DX + 8} 396L${HX + 6} ${HY - 2}M${DX + 14} 404L${HX + 10} ${HY + 6}`, '') +
    ln(`M${HX + 10} ${HY - 8}L${HX - 44} ${HY + 30}Q${HX - 30} ${HY + 54} ${HX - 8} ${HY + 48}L${HX + 18} ${HY + 4}Z`, '');
  return {
    backArt: () => `
      <g class="room">${desk()}${win()}${lamp()}</g>
      <polygon class="beam" points="${HX - 40},${HY + 34} ${HX - 6},${HY + 46} 1070,${GY} 690,${GY}" fill="url(#gBeam)" opacity="0" filter="url(#b8)"/>
      <ellipse class="pool" cx="880" cy="${GY + 2}" rx="250" ry="24" fill="url(#gPool)" opacity="0"/>
      <rect class="screen" x="${DX + 146}" y="404" width="124" height="86" fill="#aed1ea" opacity="0" filter="url(#b8)"/>
      ${ln(`M-300 ${GY}H1900`, 'floor')}
      ${radio()}${board()}
      <circle class="glow" cx="${RX + 110}" cy="${RY + 30}" r="40" fill="url(#gGlow)" opacity="0"/>
      ${ln(`M${RX + 168} ${RY + 6}a40 40 0 0 1 0 64M${RX + 186} ${RY - 10}a62 62 0 0 1 0 96M${RX + 204} ${RY - 26}a86 86 0 0 1 0 128`, 'thin waves')}`,
    build(tl, $) {
      draw(tl, $('.floor'), 0, .5);
      draw(tl, $('.room .ln'), .05, .9, .015);
      tl.fromTo($('.beam'), {opacity: 0}, {opacity: .9, duration: .5}, .35);
      tl.fromTo($('.pool'), {opacity: 0}, {opacity: 1, duration: .5}, .4);
      tl.fromTo($('.screen'), {opacity: 0}, {opacity: .35, duration: .6}, .5);
      draw(tl, $('.radio .ln'), .55, .8, .03);
      draw(tl, $('.board .ln'), 1.1, .9, .1);
      // it works: the dial lights, the sound rings out
      tl.fromTo($('.glow'), {opacity: 0}, {opacity: .9, duration: .25}, 2.2);
      draw(tl, $('.waves'), 2.3, .5, 0, 'power2.out');
      tl.to($('.waves'), {opacity: 0, duration: .3}, 3.05);
    },
    // kneeling at the radio, working on it the whole time
    fig: t => ({lib: 'a', clip: 'Fixing_Kneeling', ct: keys(t, [[0, 1.05], [3.8, 4.15]]), hold: true, x: KX, y: GY, s: S, yaw: 90, kid: true}),
    view: (t, narrow) => ({x: fit(narrow, keys(t, [[0, 800], [3.8, 840]]), 820), y: keys(t, [[0, 450], [3.8, 470]]), zoom: keys(t, [[0, 1], [3.8, 1.08]])}),
  };
})());
