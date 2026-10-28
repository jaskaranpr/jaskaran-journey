// The leap. Pale morning above the clouds: the line he climbed in the last chapter ends at a cliff. He stands at
// the edge, crouches, and jumps; then he's falling, tucked, through a sea of clouds that rushes up past him (the
// nearest ones pass in front of him), and drops out of the bottom of the frame into the white of the next chapter.
chapter('leap', (() => {
  const {ln, draw, show, keys, span, lerp, clamp, fit, rng, n1} = L;
  const S = 150, EX = 830, CY = 600, X0 = 760;               // his scale; the cliff edge; where he stands
  const CROUCH = .95, JUMP = 1.22, AIR = 1.5;                 // he crouches, springs, then he's in the air
  // flying: a short rise off the edge, then gravity, while he keeps travelling forward
  const fx = t => t < JUMP ? X0 : X0 + (t - JUMP) * 300;
  const fy = t => { if (t < JUMP) return CY; const a = t - JUMP, top = .3; return a < top ? CY - 70 * Math.sin(a / top * Math.PI / 2) : CY - 70 + 860 * (a - top) ** 2; };
  const camY = t => keys(t, [[0, 450], [1.55, 450], [2.95, 1100], [3.4, 1150]]);

  // a cumulus: lobes swelling over the top, biggest in the middle, pinched where they meet; a soft underside;
  // a filled body (so it hides what's behind it) under an outline, and a curl or two of shading inside
  const cloud = (x, y, w, seed, cls) => {
    const r = rng(seed), n = 3 + Math.floor(r() * 3);
    const ws = Array.from({length: n}, (_, i) => .6 + Math.sin((i + .5) / n * Math.PI) * .95 + r() * .3), k = w / ws.reduce((a, b) => a + b);
    let d = `M${n1(x)} ${n1(y)}`, cx = x, py = y, inner = '';
    for (let i = 0; i < n; i++) {
      const bw = ws[i] * k, ny = i === n - 1 ? y : y - bw * (.16 + r() * .2), ch = Math.hypot(bw, ny - py);
      d += `A${n1(ch / 2 * 1.04)} ${n1(bw * (.5 + r() * .16))} 0 0 1 ${n1(cx + bw)} ${n1(ny)}`;
      if (i && i < n - 1 && r() < .7) inner += `M${n1(cx - bw * .05)} ${n1(y - bw * .12)}q${n1(bw * .14)} ${n1(-bw * .32)} ${n1(bw * .42)} ${n1(-bw * .34)}`;
      cx += bw; py = ny;
    }
    d += `Q${n1(x + w * .5)} ${n1(y + w * .035)} ${n1(x)} ${n1(y)}Z`;
    return `<path d="${d}" fill="#fdfdfd" fill-opacity="${cls === 'hair' ? .45 : .8}"/>` + ln(d, `${cls} edge`) + (inner ? ln(inner, 'hair') : '');
  };
  // [x, y, width, depth]: a sea of cloud below the peak, then more of it all the way down
  const r = rng(21), SEA = [], FALL = [], NEAR = [];
  for (let i = 0; i < 8; i++) SEA.push([-260 + i * 270 + r() * 60, 806 + r() * 40, 300 + r() * 120, .6]);
  for (let i = 0; i < 11; i++) FALL.push([(i % 2 ? 860 : -40) + r() * 640, 1020 + i * 95 + r() * 40, 200 + r() * 170, i % 3 ? .8 : 1]);
  for (let i = 0; i < 5; i++) NEAR.push([(i % 2 ? 1060 : -140) + r() * 380, 1260 + i * 230, 420 + r() * 160, 1.35]);
  // when a cloud at depth d first shows at the bottom of the frame
  const enters = (y, d) => { for (let t = 0; t <= 3.4; t += .02) { const v = camY(t); if (y + (v - 450) * (1 - d) < v + 470) return t; } return 3.4; };
  const clouds = (list, seed) => list.map(([x, y, w, d], i) => `<g class="cl" data-depth="${d}" data-y="${n1(y)}">${cloud(x, y, w, seed + i, d < .7 ? 'hair' : d > 1 ? '' : 'thin')}</g>`).join('');

  // the ridge he climbed, the peak, and the cliff falling away under it
  function mountain() {
    const ridge = `M-400 860L-120 800L60 770L200 720L330 706L450 668L560 652L660 624L760 606L${EX} ${CY}`;
    const face = `M${EX} ${CY}L846 668L834 742L866 838L852 950L884 1080L870 1240L902 1420L888 1640`;
    let rock = '';
    for (const [x, y, l] of [[320, 724, 40], [480, 690, 54], [610, 662, 36], [700, 634, 30], [846, 700, 46], [858, 880, 60], [872, 1120, 54], [884, 1330, 60]])
      rock += `M${x} ${y}l${n1(l * .55)} ${n1(l * .45)}M${x + 12} ${y + 6}l${n1(l * .3)} ${n1(l * .3)}`;
    return `<g class="mtn">${ln(ridge, 'ridge')}${ln(face, 'ridge')}${ln(rock, 'hair rock')}</g>`;
  }
  return {
    backArt: () => `
      <g data-depth=".2"><circle cx="1290" cy="300" r="190" fill="url(#gGlow)" opacity=".55"/>${ln('M-300 760L80 720L190 742L330 700L470 736L620 712M1000 744L1160 704L1270 730L1420 690L1580 726L1900 708', 'hair far')}</g>
      ${mountain()}${clouds(SEA, 3)}${clouds(FALL, 40)}`,
    frontArt: () => clouds(NEAR, 80),
    build(tl, $) {
      draw(tl, $('.ridge'), 0, .55, .1);
      draw(tl, $('.rock'), .25, .5);
      draw(tl, $('.far'), .1, .7);
      for (const g of $('.cl')) {
        const at = Math.max(0, enters(+g.dataset.y, +g.dataset.depth) - .3);
        draw(tl, g.querySelectorAll('.ln'), at, .45, .08);
        show(tl, g.querySelectorAll('path:not(.ln)'), at, .3);
      }
      // the peak slides up behind the words as he falls: let it go before it gets there
      tl.to($('.mtn'), {opacity: 0, duration: .4}, 2.05);
    },
    alive: true,
    // stand at the edge; crouch (the landing, played backwards); spring; tuck and fall
    fig(t, life = 0) {
      if (t < CROUCH) return {lib: 'b', clip: 'Idle_No_Loop', ct: t * 1.1 + life * .35, x: X0, y: CY, s: S, yaw: 90};
      if (t < JUMP) return {lib: 'b', clip: 'NinjaJump_Land', ct: lerp(1.25, .3, span(t, CROUCH, JUMP)), hold: true, x: X0, y: CY, s: S, yaw: 90};
      if (t < AIR) return {lib: 'b', clip: 'NinjaJump_Start', ct: lerp(0, .5, span(t, JUMP, AIR)), hold: true, x: fx(t), y: fy(t), s: S, yaw: 90};
      return {lib: 'b', clip: 'NinjaJump_Idle_Loop', ct: (t - AIR) * 1.4, x: fx(t), y: fy(t), s: S, yaw: 90, roll: -38 * span(t, AIR, 3.1)};
    },
    view: (t, narrow) => ({x: fit(narrow, keys(t, [[0, 800], [1.5, 800], [3.4, 960]]), clamp(fx(t), 0, 1600)), y: camY(t), zoom: 1}),
  };
})());
