// Say hello: the white card. Low on the page and faint, the far horizon of Chakar draws itself in ink as the card
// arrives: the plain, the water tower and a few houses, a line of poplars, and him, small, standing on the line.
chapter('end', (() => {
  const {ln, draw, box, rng, n1, fit} = L;
  const HZ = 790, ME = 740;                                          // the horizon; where he stands on it
  function far() {
    const r = rng(33);
    let pop = '';
    for (let i = 0; i < 11; i++) { const x = 1080 + i * 22 + r() * 8, h = 40 + r() * 26, w = 6 + r() * 3;
      pop += `M${n1(x)} ${HZ}V${n1(HZ - h * .16)}M${n1(x)} ${n1(HZ - h * .1)}C${n1(x - w)} ${n1(HZ - h * .4)} ${n1(x - w * .55)} ${n1(HZ - h * .92)} ${n1(x)} ${n1(HZ - h)}C${n1(x + w * .55)} ${n1(HZ - h * .92)} ${n1(x + w)} ${n1(HZ - h * .4)} ${n1(x)} ${n1(HZ - h * .1)}`; }
    const tower = `M332 ${HZ}L340 ${HZ - 58}M356 ${HZ}L348 ${HZ - 58}M332 ${HZ}L348 ${HZ - 40}M356 ${HZ}L340 ${HZ - 40}` + box(324, HZ - 82, 40, 24, 6);
    const houses = `M226 ${HZ}V${HZ - 22}H264V${HZ}M268 ${HZ}V${HZ - 30}H302V${HZ}M384 ${HZ}V${HZ - 20}H420V${HZ}`;
    let fields = '';
    for (let i = -10; i <= 10; i++) fields += `M${n1(800 + i * 70)} ${HZ + 6}L${n1(800 + i * 210)} ${HZ + 120}`;
    return ln(`M-600 ${HZ}H2200`, 'thin horizon') + ln(tower + houses, 'hair vil') + ln(pop, 'hair vil') + ln(fields, 'hair fields');
  }
  return {
    css: `.ch-end .far{opacity:.5}@media (max-width:760px){.ch-end .endcard{top:50%}}`,
    backArt: () => `<g class="far">${far()}</g>`,
    build(tl, $) {
      tl.set($('.endcard'), {visibility: 'visible'}, 0);   // the engine only fades the card's children in
      draw(tl, $('.horizon'), .15, .8, 0, 'power2.inOut');
      draw(tl, $('.vil'), .35, .7, .1);
      draw(tl, $('.fields'), .45, .8);
    },
    // small, in ink, standing on the line and looking out at it
    alive: true,
    fig: (t, life = 0) => ({lib: 'b', clip: 'Idle_No_Loop', ct: t * .5 + life * .3, x: ME, y: HZ, s: 58, yaw: 120}),
    view: (t, narrow) => ({x: fit(narrow, 800, 800), y: 450, zoom: 1}),
  };
})());
