// Start: a dark stage and one light. He stands in it while his name comes up, then the line he stands on runs out
// to both edges, he turns, and walks off to the right, into the story.
chapter('open', (() => {
  const {GY, ln, draw, stride, span, keys, lerp, fit} = L;
  const S = 150, X0 = 800, WALK = 1.62;                       // his scale, where he stands, when he sets off
  const walkX = t => X0 + Math.max(0, t - WALK) * 520;
  return {
    backArt: () => `
      <polygon class="beam" points="770,-80 830,-80 1015,${GY} 585,${GY}" fill="url(#gBeam)" filter="url(#b8)"/>
      <ellipse class="pool" cx="${X0}" cy="${GY + 2}" rx="250" ry="26" fill="url(#gPool)"/>
      ${ln(`M${X0} ${GY}H-300`, 'ground')}${ln(`M${X0} ${GY}H1900`, 'ground')}
      ${ln(`M${X0 - 140} ${GY + 16}H${X0 + 140}`, 'hair shade')}`,
    build(tl, $) {
      draw(tl, $('.ground'), .9, .9, 0, 'power2.inOut');
      draw(tl, $('.shade'), 1, .6);
      tl.to($('.beam'), {opacity: 0, duration: .5}, 2.2);
      tl.to($('.pool'), {opacity: 0, duration: .5}, 2.2);
    },
    // stand in the light, then turn and walk off to the right
    alive: true,
    fig(t, life = 0) {
      if (t < WALK) return {lib: 'b', clip: 'Idle_No_Loop', ct: t * 1.1 + life * .35, x: X0, y: GY, s: S, yaw: 58};
      const x = walkX(t), turn = span(t, WALK, WALK + .22);
      return {lib: 'a', clip: 'Walk_Loop', ct: .33 + stride(x - X0, S), x, y: GY, s: S, yaw: lerp(58, 90, turn)};
    },
    view: (t, narrow) => ({x: fit(narrow, keys(t, [[0, 800], [WALK, 800], [3.4, 1060]]), walkX(t) - 40), y: 450, zoom: keys(t, [[0, 1], [1.4, 1.07], [WALK + .4, 1.02], [3.4, 1]])}),
  };
})());
