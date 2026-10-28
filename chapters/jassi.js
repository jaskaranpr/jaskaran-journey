// Jassi. Night. He's asleep; across the room a small bot sits on the desk with the film's eye, watching a heartbeat
// line on a monitor. The line spikes, the bot's eye goes wide and turns to the bed, the phone on the bedside table
// lights up and buzzes, and he gets up and answers it.
chapter('jassi', (() => {
  const {GY, ln, draw, wipe, show, box, circ, keys, span, lerp, fit, rng, n1} = L;
  const S = 150, BED = 640, HX = 489;                            // his scale; the mattress top; where he lies
  const ALERT = 2.15, WAKE = 2.45, UP = 3.1;                      // the spike; he starts to get up; he's up
  const EYE = {x: 1128, y: 521}, MX = 1236, MY = 472;            // the bot's eye; the heartbeat's baseline

  // a heartbeat across the monitor: calm, then out of control
  const beat = (x0, x1, y, k, wild) => {
    const r = rng(wild ? 9 : 3);
    let d = `M${x0} ${y}`, x = x0;
    while (x < x1 - 40) {
      const a = wild ? 1.6 + r() * 1.3 : 1;
      d += `h${n1(10 + r() * 6)}q4 -${n1(4 * a)} 8 0h4l3 ${n1(5 * a)}l4 -${n1(26 * a * k)}l4 ${n1(32 * a * k)}l3 -${n1(11 * a)}h6q6 -${n1(7 * a)} 12 0`;
      x += 58 + (wild ? -10 : 0);
    }
    return d + `H${x1}`;
  };
  // the bot: a round body on two stubby feet, a pale face plate with the eye, an antenna with a light on it
  const bot = () => `<g transform="translate(1128 560) scale(1.45) translate(-1128 -560)"><g class="bot">${ln(box(1088, 486, 80, 72, 24))}<path d="${box(1098, 498, 60, 40, 15)}" fill="#d6e9f6"/>` +
    `<g class="botEye">${window.FIG ? FIG.eye(EYE, 3, 1, -6) : ''}</g>` +
    `${ln(`M1128 486V456M1106 558v6M1150 558v6`, 'thin')}<circle class="bulb" cx="1128" cy="451" r="5" fill="currentColor"/>` +
    `<circle class="botGlow" cx="1128" cy="518" r="70" fill="url(#gGlow)" opacity=".16"/></g></g>`;
  function room() {
    const r = rng(12);
    // the window: night sky, the moon, a skyline with a few windows still lit
    let sky = '', lit = '';
    for (const [x, w, h] of [[1070, 40, 58], [1112, 30, 96], [1144, 52, 70], [1198, 26, 120], [1226, 48, 84], [1276, 36, 104], [1314, 54, 66], [1370, 44, 92]]) {
      sky += `M${x} 340V${340 - h}H${x + w}V340`;
      for (let y = 340 - h + 10; y < 330; y += 14) for (let wx = x + 6; wx < x + w - 6; wx += 11) if (r() < .22) lit += `M${wx} ${y}h4v5h-4Z`;
    }
    const win = ln(box(1060, 110, 360, 240, 4) + `M1240 110V350M1060 230H1420`, 'thin') + ln(circ(1352, 162, 22)) + ln(sky, 'hair') +
      `<path d="${lit}" fill="currentColor" opacity=".7"/>` + ln(`M1100 140v.1M1170 176v.1M1290 132v.1M1400 198v.1M1210 150v.1`, 'bold stars');
    // the bed: headboard, mattress, pillow, legs; the bedside table with the phone lying on it
    const bed = ln(`M300 ${GY}V520Q300 506 314 506H346Q360 506 360 520V${BED}M300 ${BED}H724Q732 ${BED} 732 ${BED + 8}V676H300M712 676V${GY}M318 676V${GY}`) +
      ln(`M316 ${BED}C318 ${BED - 30} 348 ${BED - 34} 392 ${BED - 26}C410 ${BED - 22} 410 ${BED - 4} 400 ${BED}`, 'thin');
    const table = ln(`M748 ${GY}V604H832V${GY}M748 640H832`, 'thin') + ln(`M786 622h12`, 'hair');
    const phone = `<g class="phone"><circle class="ring" cx="790" cy="596" r="60" fill="url(#gGlow)" opacity="0"/>${ln(box(768, 590, 44, 10, 3), 'thin')}` +
      `${ln('M758 582q-6 8 0 16M750 576q-10 14 0 28M822 582q6 8 0 16M830 576q10 14 0 28', 'thin buzz')}</g>`;
    // the desk with the monitor and the bot
    const desk = ln(`M1020 ${GY}V560H1480V${GY}M1030 560V${GY}M1470 560V${GY}`, 'thin') +
      ln(box(1218, 396, 226, 146, 12) + `M1316 542v18M1290 560h52`) + ln(box(1232, 410, 198, 118, 6), 'hair');
    const screen = `<rect class="scr" x="1232" y="410" width="198" height="118" rx="6" fill="#aed1ea" opacity="0"/>` +
      ln(beat(MX, 1424, MY, 1, false), 'thin calm') + ln(beat(MX, 1424, MY, 1.15, true), 'alert') + ln(`M1404 418l10 18h-20Z M1414 426v5M1414 433v.1`, 'thin warn');
    return `<g class="room"><g class="win-art">${win}</g>${bed}${table}${desk}</g>${phone}${screen}${bot()}`;
  }
  return {
    css: `@media (max-width:760px){.ch-jassi .win-art{opacity:.3}}`,                 // phones: the window sits under the words
    backArt: () => `${room()}${ln(`M-300 ${GY}H1900`, 'floor')}`,
    // the blanket over him while he sleeps, in front of him
    frontArt: () => `<g class="blanket"><path d="M412 ${BED + 2}C424 ${BED - 46} 470 ${BED - 50} 522 ${BED - 44}C600 ${BED - 38} 662 ${BED - 44} 716 ${BED - 30}L720 676H412Z" fill="#021533"/>` +
      ln(`M412 ${BED + 2}C424 ${BED - 46} 470 ${BED - 50} 522 ${BED - 44}C600 ${BED - 38} 662 ${BED - 44} 716 ${BED - 30}L720 676`) + ln(`M470 ${BED - 30}q40 14 64 40M600 ${BED - 34}q20 22 22 50`, 'hair') + `</g>`,
    build(tl, $) {
      draw(tl, $('.floor'), 0, .5);
      draw(tl, $('.room .ln'), .05, .8, .012);
      draw(tl, $('.blanket .ln'), .1, .5);
      show(tl, $('.blanket > path:not(.ln)'), .05, .35);
      draw(tl, $('.bot .ln'), .3, .5, .05);
      tl.fromTo($('.botEye'), {opacity: 0}, {opacity: 1, duration: .25}, .55);
      // calm: the heartbeat runs across the screen while he sleeps
      draw(tl, $('.calm'), .5, ALERT - .55, 0, 'none');
      // something breaks: the line spikes, the screen flares, the bot's eye opens wide and turns to the bed
      wipe(tl, $('.calm'), ALERT, .12);
      draw(tl, $('.alert'), ALERT, .22, 0, 'power2.out');
      draw(tl, $('.warn'), ALERT + .1, .15);
      tl.fromTo($('.scr'), {opacity: 0}, {opacity: .25, duration: .08, repeat: 3, yoyo: true}, ALERT);
      tl.to($('.botEye'), {scale: 1.45, transformOrigin: '50% 60%', duration: .14, ease: 'back.out(2)'}, ALERT + .05);
      tl.to($('.botEye circle'), {attr: {cx: -1.4}, duration: .2, ease: 'power2.inOut'}, ALERT + .22);
      tl.to($('.botGlow'), {opacity: .45, duration: .12}, ALERT + .05);
      tl.fromTo($('.bulb'), {opacity: 1}, {opacity: .2, duration: .06, repeat: 5, yoyo: true}, ALERT);
      // the phone lights and buzzes; he throws the blanket off and gets up; he takes the phone
      tl.to($('.ring'), {opacity: .9, duration: .12}, ALERT + .2);
      draw(tl, $('.buzz'), ALERT + .2, .1);
      tl.fromTo($('.buzz'), {opacity: 1}, {opacity: .15, duration: .05, repeat: 7, yoyo: true, immediateRender: false}, ALERT + .3);
      tl.to($('.blanket'), {x: 46, y: 18, opacity: 0, duration: .3, ease: 'power2.in'}, WAKE);
      tl.to($('.phone'), {opacity: 0, duration: .15}, UP - .1);
    },
    alive: true,
    // asleep on his back; up (the lying-down clip, forward) and off the bed; on the phone
    fig(t, life = 0) {
      if (t < WAKE) return {lib: 'b', clip: 'LayToIdle', ct: 0, hold: true, x: HX, y: BED, s: S, yaw: 90};
      if (t < UP) { const u = span(t, WAKE, UP), off = span(u, .35, .75);
        return {lib: 'b', clip: 'LayToIdle', ct: u * 1.52, hold: true, x: lerp(HX, 600, off), y: lerp(BED, GY, off), s: S, yaw: 90}; }
      return {lib: 'b', clip: 'Idle_TalkingPhone_Loop', ct: (t - UP) + life * .4, x: 600, y: GY, s: S, yaw: lerp(90, 62, span(t, UP, UP + .3)), props: ['phone']};
    },
    view: (t, narrow) => ({x: fit(narrow, keys(t, [[0, 820], [2.1, 850], [2.7, 780], [4, 760]]), keys(t, [[0, 1170], [2.2, 1170], [2.7, 600]])), y: keys(t, [[0, 450], [4, 470]]), zoom: keys(t, [[0, 1], [2.1, 1.05], [4, 1.06]])}),
  };
})());
