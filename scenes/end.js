// The end card: white, the way the Fold film ends. The sun from the last scene fades into pale sky at the top,
// Chakar's poplars and water tower sit small on a far horizon, and the film's eye sits above the words.
(() => {
  const {C, rng, keys, n1, bird} = K;

  // his mark: the eye from the film, in ink, the way the whole story has been looking at things
  function mark() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-7.8 -7.2 13.2 9.6">${FIG.eye(FIG.P(0, 0), 1, 1, -14)}</svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }

  scene('end', {
    bg: C.w,
    css: `.s-end .size-end::before{content:"";width:66px;height:48px;background:var(--mark) center/contain no-repeat;margin-bottom:.1rem}
      .s-end .dust i{background:${C.b5}}
      .s-end .ename{font:500 13px "Noto Sans Gurmukhi",var(--font)}`,
    init(stage) { stage.style.setProperty('--mark', mark()); },
    layers() {
      const r = rng(12);
      // pale sky high up, white everywhere else
      const sky = `<linearGradient id="eSky" gradientUnits="userSpaceOnUse" x1="0" y1="-200" x2="0" y2="560"><stop offset="0" stop-color="${C.b6}" stop-opacity=".55"/><stop offset=".55" stop-color="${C.b7}" stop-opacity=".45"/><stop offset="1" stop-color="${C.w}" stop-opacity="0"/></linearGradient>
        <rect x="-600" y="-400" width="2800" height="1600" fill="${C.w}"/><rect x="-600" y="-400" width="2800" height="960" fill="url(#eSky)"/>
        <circle cx="800" cy="-120" r="520" fill="url(#gGlow)" opacity=".5"/>`;
      // a far horizon low down: a thin line of trees, the poplar row and the water tower, all very faint
      const HZ = 790;
      let far = `<linearGradient id="eLand" gradientUnits="userSpaceOnUse" x1="0" y1="${HZ}" x2="0" y2="${HZ + 160}"><stop offset="0" stop-color="${C.b7}" stop-opacity=".7"/><stop offset="1" stop-color="${C.w}" stop-opacity="0"/></linearGradient>
        <rect x="-600" y="${HZ}" width="2800" height="200" fill="url(#eLand)"/>`;
      for (let x = -500; x < 2100; x += 10 + r() * 26) far += `<ellipse cx="${n1(x)}" cy="${n1(HZ - r() * 3)}" rx="${n1(8 + r() * 18)}" ry="${n1(2 + r() * 4)}" fill="${C.b6}" opacity="${n1(.18 + r() * .2)}"/>`;
      for (let i = 0; i < 18; i++) { const x = 1050 + i * 13 + r() * 5, h = 30 + r() * 16;
        far += `<ellipse cx="${n1(x)}" cy="${n1(HZ - h * .5)}" rx="${n1(h * .07)}" ry="${n1(h * .5)}" fill="${C.b6}" opacity=".5"/>`; }
      far += `<g fill="${C.b6}" opacity=".5" transform="translate(300 ${HZ}) scale(.7)"><path d="M0 0L6 -60M30 0L24 -60M0 0L30 -46M30 0L0 -46" stroke="${C.b6}" stroke-width="2.4" fill="none"/>
        <rect x="-6" y="-86" width="42" height="26" rx="5"/><path d="M-6 -84Q15 -98 36 -84Z"/></g>`;
      const birds = Array.from({length: 5}, (_, i) => bird(n1(1180 + i * 18 + r() * 14), n1(210 + Math.abs(i - 2) * 7 + r() * 6), .65, r())).join('');
      return [
        {z: .15, svg: sky},
        {z: .35, svg: far},
        {z: .4, svg: `<g class="drift" style="color:${C.b5}">${birds}</g>`},
        {z: .5, html: K.dust([[-100, -50], [1700, -50], [1700, 950], [-100, 950]], 34, 4, .2)},
      ];
    },
    cam: p => ({zoom: keys(p, [[0, 1.04], [1, 1]]), oy: 420}),
  });
})();
