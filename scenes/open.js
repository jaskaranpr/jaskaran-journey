// Opening: an empty stage, one spotlight, him standing in it with his hands in his pockets.
scene('open', {
  bg: K.C.b0,
  focus: p => p < .5 ? 800 : 700,
  layers() {
    const {C, beam, pool, dust, fig, refl, rng} = K;
    const me = FIG.front({pockets: true}), close = FIG.bust({up: -20});
    const s = 1.55, fx = 800, fy = 668;                     // he stands about 300 units tall
    const body = fig(me.d, fx, fy, s);
    // folds of a stage curtain, for the blurred foreground at both sides
    const curtain = (x0, w, dir) => {
      const r = rng(dir > 0 ? 3 : 7);
      let out = '';
      for (let i = 0; i < 9; i++) {
        const x = x0 + i * w / 9, ww = w / 9 * (1.2 + r() * .5), shade = [C.b0, '#041d45', C.b1][i % 3];
        out += `<path d="M${x} -80C${x + ww * .3} 200 ${x - ww * .2} 600 ${x + ww * .1} 980L${x + ww} 980C${x + ww * .8} 600 ${x + ww * 1.2} 200 ${x + ww * .9} -80Z" fill="${shade}"/>`;
      }
      return out;
    };
    return [
      // back wall: dark, a little lighter where the light falls
      {z: .15, svg: `<radialGradient id="opWall" cx=".5" cy=".36" r=".62"><stop offset="0" stop-color="${C.b3}"/><stop offset=".4" stop-color="${C.b2}" stop-opacity=".75"/><stop offset="1" stop-color="${C.b0}" stop-opacity="0"/></radialGradient>
        <rect x="-600" y="-300" width="2800" height="1500" fill="${C.b0}"/><rect x="-200" y="-200" width="2000" height="1100" fill="url(#opWall)"/>`},
      // floor: a glossy stage that catches the light and his reflection
      {z: .6, svg: `<rect x="-600" y="606" width="2800" height="700" fill="#041d45"/>
        <rect x="-600" y="602" width="2800" height="10" fill="${C.b2}" opacity=".7" filter="url(#b3)"/>
        <ellipse cx="${fx}" cy="668" rx="700" ry="110" fill="${C.b2}" opacity=".6" filter="url(#b30)"/>
        ${pool(fx, fy + 4, 230, 40, .85)}${pool(fx, fy + 4, 110, 18, .9)}`},
      {z: .6, cls: 'lights', svg: beam({x: fx, y: -80, top: 90, spread: 540, h: 790, o: .62})},
      {z: .6, cls: 'lights', html: dust([[fx - 45, -40], [fx + 45, -40], [fx + 270, 668], [fx - 270, 668]], 46, 5)},
      {z: .6, svg: refl(body, fy, .2) + body},
      {z: 1.35, cls: 'blur6', svg: curtain(-260, 380, 1) + curtain(1480, 380, -1)},
      // the close-up the camera cuts to: head and shoulders, looking up into the light, like the film's first shot
      {z: 0, cls: 'oc', svg: `<rect x="-600" y="-300" width="2800" height="1500" fill="${C.b0}"/>
        <radialGradient id="opClose" cx=".62" cy=".05" r=".8"><stop offset="0" stop-color="${C.b4}"/><stop offset=".45" stop-color="${C.b2}"/><stop offset="1" stop-color="${C.b0}"/></radialGradient>
        <rect x="-600" y="-300" width="2800" height="1500" fill="url(#opClose)"/>
        ${beam({x: 1040, y: -120, top: 120, spread: 760, h: 1150, o: .5, tilt: -220})}`},
      {z: 0, cls: 'oc', html: dust([[980, -60], [1100, -60], [1200, 940], [440, 940]], 60, 9, .2)},
      {z: 0, cls: 'oc oc-fig', svg: `<g transform="translate(610 690) scale(7.4)"><path d="${close.d}" filter="url(#fuzzc)" fill="${C.w}"/>${FIG.eye(FIG.add(close.eye, FIG.P(-2.6, .9)), .78, 1, -34)}</g>`},
    ];
  },
  cam: p => ({zoom: 1 + .34 * K.ease(K.clamp(p / .52)), ox: 800, oy: 560, y: -14 * K.clamp(p / .52)}),
  frame(p, st) {
    // dissolve from the wide shot to the close-up, which keeps drifting slowly closer
    const o = K.span(p, .49, .58).toFixed(3), k = (1 + .06 * K.clamp((p - .49) / .51)).toFixed(4);
    st.querySelectorAll('.oc').forEach(el => { el.style.opacity = o; el.style.visibility = +o ? 'visible' : 'hidden'; });
    st.querySelector('.oc-fig').style.scale = k;
  },
  css: '.s-open .oc{opacity:0;visibility:hidden}.s-open .oc-fig{transform-origin:35% 100%}',
});
