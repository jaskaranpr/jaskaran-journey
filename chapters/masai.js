// 2021, on white. He sits at a desk with his laptop; a phone, taller than he is, draws itself beside him. First it
// plays the ad that led him to Masai School (a school on screen, an "Ad" badge, a "Skip" he never presses).
// Then a line runs from his laptop to the phone and the screen redraws as the Instagram copy he built, then
// the YouTube one.
chapter('masai', (() => {
  const {GY, ln, draw, show, box, circ, keys, n1} = L;
  const S = 165, X0 = 600;                                     // his scale; where his feet are
  const PX = 1010, PY = 300, PW = 200, PH = 400;               // the phone
  const SX = PX + 14, SY = PY + 14, SW = PW - 28;              // its screen
  const heart = (x, y, k = 1) => `M${x} ${y + 3 * k}c${-6 * k} ${-5 * k} ${-6 * k} ${-11 * k} 0 ${-8 * k}c${6 * k} ${-3 * k} ${6 * k} ${3 * k} 0 ${8 * k}Z`;
  const play = (x, y, k = 1) => `M${x - 5 * k} ${y - 6 * k}L${x + 7 * k} ${y}L${x - 5 * k} ${y + 6 * k}Z`;

  // the desk, the chair under him, the laptop open in front of him
  const seat = GY - .45 * S, top = GY - .74 * S;
  const furniture = () =>
    ln(`M${X0 - 110} ${n1(seat)}H${X0 - 10}M${X0 - 100} ${n1(seat)}L${X0 - 106} ${GY}M${X0 - 20} ${n1(seat)}L${X0 - 14} ${GY}M${X0 - 104} ${n1(seat)}L${X0 - 112} ${n1(seat - 90)}`) +
    ln(`M${X0 + 8} ${n1(top)}H${X0 + 250}M${X0 + 22} ${n1(top)}V${GY}M${X0 + 236} ${n1(top)}V${GY}M${X0 + 22} ${n1(top + 14)}H${X0 + 236}`, 'thin') +
    ln(`M${X0 + 40} ${n1(top - 3)}H${X0 + 132}M${X0 + 132} ${n1(top - 3)}L${X0 + 150} ${n1(top - 86)}`, 'bold laptop');

  // the phone: body, the notch, side buttons, the bar at the bottom
  const phone = () => ln(box(PX, PY, PW, PH, 30)) + ln(box(SX, SY, SW, PH - 28, 20), 'hair') +
    ln(`M${PX + 82} ${PY + 26}h36M${PX + PW} ${PY + 90}v34M${PX + PW} ${PY + 136}v22M${PX + 76} ${PY + PH - 16}h48`, 'thin');

  // beat 1: the ad. a school on the video, the badge, the skip button, the bar running, a call to action
  const VX = SX + 6, VY = SY + 34, VW = SW - 12, VH = 92;
  const ad = () => {
    const bx = VX + VW / 2, by = VY + 74;
    const school = `M${bx - 46} ${by}H${bx + 46}M${bx - 40} ${by - 4}H${bx + 40}M${bx - 34} ${by - 8}V${by - 36}M${bx - 17} ${by - 8}V${by - 36}M${bx} ${by - 8}V${by - 36}M${bx + 17} ${by - 8}V${by - 36}M${bx + 34} ${by - 8}V${by - 36}` +
      `M${bx - 42} ${by - 36}H${bx + 42}L${bx} ${by - 58}Z`;
    return `<g class="ad">${ln(box(VX, VY, VW, VH, 6), 'thin')}${ln(school, 'thin')}${ln(`M${bx} ${by - 58}v-12l14 4l-14 4`, 'hair')}` +
      `${ln(box(VX + 6, VY + VH - 20, 22, 13, 3), 'hair')}<text class="ui" x="${VX + 17}" y="${VY + VH - 10.5}" text-anchor="middle">Ad</text>` +
      `${ln(box(VX + VW - 52, VY + VH - 22, 46, 15, 3), 'hair')}<text class="ui" x="${VX + VW - 29}" y="${VY + VH - 11.5}" text-anchor="middle">Skip ›</text>` +
      `${ln(`M${VX} ${VY + VH + 6}H${VX + VW}`, 'hair')}${ln(`M${VX} ${VY + VH + 6}H${VX + VW}`, 'bold adbar')}` +
      `${ln(circ(VX + 10, VY + VH + 30, 9), 'thin')}${ln(`M${VX + 26} ${VY + VH + 26}h88M${VX + 26} ${VY + VH + 36}h56`, 'hair')}` +
      `${ln(box(VX, VY + VH + 50, VW, 26, 13), 'thin')}${ln(`M${VX + VW / 2 - 26} ${VY + VH + 63}h52`, 'thin')}` +
      `${[0, 1, 2].map(k => ln(box(VX, VY + VH + 92 + k * 46, 58, 34, 4) + `M${VX + 68} ${VY + VH + 100 + k * 46}h88M${VX + 68} ${VY + VH + 112 + k * 46}h60`, 'hair')).join('')}</g>`;
  };

  // beat 2a: the Instagram copy. a header, stories, a post with its picture, actions, a caption
  const insta = () => {
    let st = '';
    for (let k = 0; k < 5; k++) st += circ(SX + 20 + k * 33, SY + 66, 13) + circ(SX + 20 + k * 33, SY + 66, 10);
    const iy = SY + 112, im = SW;
    const pic = `M${SX} ${iy + im * .78}L${SX + im * .32} ${iy + im * .46}L${SX + im * .5} ${iy + im * .64}L${SX + im * .68} ${iy + im * .4}L${SX + im} ${iy + im * .76}` + circ(SX + im * .76, iy + im * .22, 12);
    const act = iy + im + 16;
    const icons = heart(SX + 12, act - 2, 1.1) + `M${SX + 34} ${act}a8 7 0 1 1 4 6l-6 2l2 -5` + `M${SX + 56} ${act - 7}l18 -2l-8 17l-2 -8z` + `M${SX + SW - 16} ${act - 8}v15l6 -5l6 5v-15z`;
    return `<g class="insta">${ln(`M${SX + 6} ${SY + 32}q8 -10 16 0t16 0t16 0`, 'thin')}${ln(heart(SX + SW - 42, SY + 30) + `M${SX + SW - 22} ${SY + 22}l14 5l-14 6z`, 'thin')}` +
      `${ln(st, 'thin')}${ln(circ(SX + 12, iy - 14, 7) + `M${SX + 26} ${iy - 14}h60`, 'thin')}${ln(`M${SX} ${iy}h${im}v${im}h${-im}Z`, 'thin')}${ln(pic, 'hair')}` +
      `${ln(icons, 'thin')}${ln(`M${SX + 4} ${act + 22}h120M${SX + 4} ${act + 34}h86`, 'hair')}</g>`;
  };

  // beat 2b: the YouTube copy. a header, then videos one under another, each with its channel and title
  const tube = () => {
    let v = '';
    for (let k = 0; k < 3; k++) {
      const y = SY + 46 + k * 112;
      v += box(SX, y, SW, 76, 6) + play(SX + SW / 2, y + 38, 1.5) + circ(SX + 10, y + 90, 7) + `M${SX + 24} ${y + 86}h110M${SX + 24} ${y + 96}h70`;
    }
    return `<g class="tube">${ln(box(SX + 6, SY + 18, 26, 18, 5) + play(SX + 19, SY + 27, .8), 'thin')}${ln(`M${SX + 38} ${SY + 27}h40` + circ(SX + SW - 18, SY + 26, 7) + `M${SX + SW - 13} ${SY + 31}l6 6`, 'thin')}${ln(v, 'thin')}</g>`;
  };

  return {
    css: `.ch-masai .ui{font:600 9px var(--font);fill:currentColor;letter-spacing:.02em}`,
    backArt: () => `
      ${ln(`M-300 ${GY}H1900`, 'ground')}
      <g class="furn">${furniture()}</g>
      <g class="phone">${phone()}</g>
      <g class="screen">${ad()}${insta()}${tube()}</g>
      ${ln(`M${X0 + 150} ${n1(top - 86)}C${X0 + 260} ${n1(top - 200)} ${PX - 140} ${GY - 10} ${PX} ${PY + PH - 60}`, 'thin cable')}`,
    build(tl, $) {
      draw(tl, $('.ground'), 0, .3);
      draw(tl, $('.furn .ln'), .05, .55, .05);
      draw(tl, $('.phone .ln'), .3, .7, .08, 'power2.out');
      // the ad plays; the bar runs to the end; nobody skips it
      draw(tl, $('.ad .ln:not(.adbar)'), .75, .6, .025);
      show(tl, $('.ad text'), 1.05, .2);
      draw(tl, $('.adbar'), 1.1, .8, 0, 'none');
      // the line from his laptop to the phone, and the screen becomes what he built
      tl.to($('.ad'), {opacity: 0, duration: .15}, 2.05);
      draw(tl, $('.cable'), 2.05, .4, 0, 'power2.inOut');
      draw(tl, $('.insta .ln'), 2.25, .55, .03);
      tl.to($('.insta'), {opacity: 0, duration: .15}, 2.95);
      draw(tl, $('.tube .ln'), 3.0, .5, .05);
    },
    alive: true,
    fig: (t, life = 0) => ({lib: 'a', clip: 'Sitting_Talking_Loop', ct: t * .6 + life * .35, x: X0, y: GY, s: S, yaw: 90}),
    view: (t, narrow) => narrow ? {x: 858, y: 400, zoom: .55} : {x: keys(t, [[0, 790], [4, 830]]), y: 450, zoom: keys(t, [[0, 1], [4, 1.04]])},
  };
})());
