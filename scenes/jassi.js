// Jassi: night in his room in Bengaluru. He's asleep; on the windowsill a small round bot watches a pulse line.
// Something breaks, the line jumps, Jassi hops up, sends word out across the city, and one window far off lights
// up: the right person wakes. He sleeps on.
(() => {
  const {C, rng, keys, span, n1} = K;
  const WIN = [860, 100, 1420, 520];                    // the window opening: x0 y0 x1 y1
  const BOT = {x: 1176, y: 520};                        // where Jassi sits on the sill
  const MON = {x: 1250, y: 436, w: 108, h: 70};         // the little screen with the pulse
  const FAR = {x: 1004, y: 370, z: .25};                // the window that lights up, on the skyline layer
  const BED = 700, FS = 2.2;                            // mattress top, his scale
  // ease in toward the sill, drift a little toward the city while the word goes out, ease back
  const cam = p => ({zoom: keys(p, [[0, 1], [.5, 1.08], [.74, 1.12], [1, 1.05]]), ox: 1180, oy: 520, x: keys(p, [[0, 0], [.6, 0], [.8, -20], [1, 0]])});

  // a city at night: blocks with grids of windows, a few lit, tanks and masts on the roofs
  function skyline(r, base, n, h0, h1, col, lit, dim) {
    let out = '', x = 560;
    for (let i = 0; i < n && x < 1760; i++) {
      const w = 24 + r() * 56, h = h0 + r() * (h1 - h0), top = base - h;
      out += `<rect x="${n1(x)}" y="${n1(top)}" width="${n1(w)}" height="${n1(h + 500)}" fill="${col}"/>`;
      if (r() < .3) out += `<rect x="${n1(x + w * .2)}" y="${n1(top - 8)}" width="${n1(w * .3)}" height="8" fill="${col}"/>`;
      else if (r() < .2) out += `<path d="M${n1(x + w * .6)} ${n1(top)}V${n1(top - 26)}" stroke="${col}" stroke-width="2"/><circle class="jblink" cx="${n1(x + w * .6)}" cy="${n1(top - 27)}" r="2" fill="${C.w}" style="animation-delay:-${n1(r() * 3)}s"/>`;
      for (let wy = top + 8; wy < base - 6; wy += 12) for (let wx = x + 5; wx < x + w - 6; wx += 10)
        if (r() < lit) out += `<rect x="${n1(wx)}" y="${n1(wy)}" width="4" height="5" fill="${C.b6}" opacity="${n1(dim + r() * .4)}"/>`;
      x += w + (r() < .3 ? 6 + r() * 20 : 0);
    }
    return out;
  }
  // the pulse: a calm beat that jumps into a jagged spike while something is wrong
  function pulse(p) {
    const fault = span(p, .5, .56) * (1 - span(p, .7, .82)), ph = p * 26;
    let d = '';
    for (let i = 0; i <= 48; i++) {
      const u = i / 48, x = MON.x + 8 + u * (MON.w - 16);
      const beat = ((u * 3 + ph) % 1), calm = beat > .42 && beat < .5 ? Math.sin((beat - .42) / .08 * Math.PI) * 9 : 0;
      const wild = Math.sin(u * 47 + ph * 9) * 14 + Math.sin(u * 23 - ph * 5) * 8;
      d += `${i ? 'L' : 'M'}${n1(x)} ${n1(MON.y + MON.h * .55 - calm * (1 - fault) - wild * fault)}`;
    }
    return d;
  }
  // where a point on another layer appears, in the room layer's coordinates (the camera moves layers by depth)
  const seen = (pt, z, c) => {
    const kz = 1 + (c.zoom - 1) * z, kr = c.zoom;
    const sx = c.ox + (pt.x - c.ox) * kz - c.x * z, sy = c.oy + (pt.y - c.oy) * kz;
    return {x: c.ox + (sx - c.ox + c.x) / kr, y: c.oy + (sy - c.oy) / kr};
  };

  scene('jassi', {
    bg: C.b0,
    focus: p => keys(p, [[0, 1170], [.6, 1170], [.78, 1100], [1, 1080]]),   // on phones: Jassi and its screen, then the city
    css: `.jblink{animation:jblink 2.6s steps(1) infinite}@keyframes jblink{50%{opacity:.15}}
      .s-jassi .jstar{animation:twinkle 3.4s ease-in-out infinite alternate}
      .s-jassi .jbob{animation:jbob 2.4s ease-in-out infinite alternate}@keyframes jbob{to{transform:translateY(-2.5px)}}
      .s-jassi .jhalo{transform-box:fill-box;transform-origin:50% 50%;animation:jhalo 3s ease-in-out infinite alternate}@keyframes jhalo{from{opacity:.35;transform:scale(.92)}to{opacity:.6;transform:scale(1.06)}}
      .s-jassi .jcurt{transform-box:fill-box;transform-origin:50% 0;animation:jcurt 7s ease-in-out infinite alternate}@keyframes jcurt{from{transform:skewX(-1.2deg)}to{transform:skewX(1.4deg)}}
      .s-jassi .jbreath{transform-box:fill-box;transform-origin:50% 100%;animation:jbreath 4.8s ease-in-out infinite alternate}@keyframes jbreath{to{transform:scaleY(1.035)}}
      @media (prefers-reduced-motion:reduce){.jblink,.s-jassi .jstar,.s-jassi .jbob,.s-jassi .jhalo,.s-jassi .jcurt,.s-jassi .jbreath{animation:none}}`,
    layers() {
      const r = rng(31);
      const [wx0, wy0, wx1, wy1] = WIN;
      // night sky over the city: the glow of streetlights low down, the moon up and to the right
      const sky = `<linearGradient id="jSky" gradientUnits="userSpaceOnUse" x1="0" y1="-100" x2="0" y2="560"><stop offset="0" stop-color="${C.b0}"/><stop offset=".55" stop-color="${C.b1}"/><stop offset="1" stop-color="${C.b3}"/></linearGradient>
        <rect x="300" y="-300" width="1700" height="1000" fill="url(#jSky)"/>
        <circle cx="1330" cy="170" r="150" fill="url(#gGlow)" opacity=".5"/><circle cx="1330" cy="170" r="24" fill="${C.b7}"/><circle cx="1338" cy="164" r="21" fill="${C.b1}" opacity=".18"/>
        ${[[1250, 210, 300, 8, .25], [980, 160, 380, 7, .18]].map(([x, y, w, h, o]) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${h}" fill="${C.b6}" opacity="${o}" filter="url(#b8)"/>`).join('')}`;
      const stars = Array.from({length: 46}, () => `<circle class="jstar" cx="${n1(600 + r() * 1100)}" cy="${n1(-60 + r() * 330)}" r="${n1(.6 + r() * 1.1)}" fill="${C.w}" style="animation-delay:-${n1(r() * 4)}s"/>`).join('');
      // three depths of skyline, and the tower with the one window that matters
      const far = skyline(r, 470, 40, 40, 150, C.b2, .1, .25) + K.fog(470, 26, .35, C.b3, 900, 1150);
      const tower = `<rect x="${FAR.x - 24}" y="250" width="66" height="400" fill="${C.b1}"/><rect x="${FAR.x - 30}" y="244" width="78" height="8" fill="${C.b1}"/>
        ${Array.from({length: 18}, (_, i) => Array.from({length: 4}, (_, j) => { const x = FAR.x - 16 + j * 15, y = 262 + i * 15;
          return x === FAR.x - 1 && y === FAR.y - 3 ? '' : `<rect x="${x}" y="${y}" width="6" height="8" fill="${C.b6}" opacity="${r() < .12 ? n1(.4 + r() * .4) : .05}"/>`; }).join('')).join('')}
        <g id="jfar" opacity="0"><circle cx="${FAR.x + 2}" cy="${FAR.y + 1}" r="26" fill="url(#gGlow)"/><rect x="${FAR.x - 1}" y="${FAR.y - 3}" width="6" height="8" fill="${C.w}"/>
          <path d="M${FAR.x + .4} ${FAR.y + 5}c0-2.4 .9-3.6 1.6-3.8c-.8-.6-.9-2.4.4-2.6c1.3.2 1.2 2 .4 2.6c.7.2 1.6 1.4 1.6 3.8z" fill="${C.b2}"/></g>`;
      const mid = skyline(r, 500, 40, 70, 230, C.b1, .14, .3) + tower;
      const near = skyline(r, 540, 40, 30, 110, C.b0, .06, .3);

      // the room: a dark wall with the window cut out of it, moonlight lying across the bed and floor
      const wall = `<linearGradient id="jWall" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="900"><stop offset="0" stop-color="${C.b0}"/><stop offset="1" stop-color="#041d45"/></linearGradient>
        <path fill-rule="evenodd" d="M-700 -500H2300V1500H-700ZM${wx0} ${wy0}H${wx1}V${wy1}H${wx0}Z" fill="url(#jWall)"/>
        <ellipse cx="1140" cy="300" rx="520" ry="320" fill="${C.b2}" opacity=".35" filter="url(#b30)"/>
        <rect x="-700" y="790" width="3000" height="700" fill="#03183c"/>
        ${Array.from({length: 9}, (_, i) => `<path d="M-700 ${800 + i * i * 4}H2300" stroke="${C.b0}" stroke-width="1.5" opacity=".6"/>`).join('')}`;
      // window frame, cross bars, glass glints, the sill
      const frame = `<g fill="${C.b2}"><rect x="${wx0 - 14}" y="${wy0 - 14}" width="${wx1 - wx0 + 28}" height="14"/><rect x="${wx0 - 14}" y="${wy0}" width="14" height="${wy1 - wy0}"/>
          <rect x="${wx1}" y="${wy0}" width="14" height="${wy1 - wy0}"/><rect x="${(wx0 + wx1) / 2 - 5}" y="${wy0}" width="10" height="${wy1 - wy0}"/><rect x="${wx0}" y="${wy0 + 150}" width="${wx1 - wx0}" height="8"/></g>
        <path d="M${wx0 + 40} ${wy1}L${wx0 + 200} ${wy0}M${wx0 + 90} ${wy1}L${wx0 + 230} ${wy0 + 60}M${wx1 - 200} ${wy1}L${wx1 - 60} ${wy0 + 150}" stroke="${C.w}" stroke-width="10" opacity=".035"/>
        <rect x="${wx0 - 34}" y="${wy1}" width="${wx1 - wx0 + 68}" height="16" fill="${C.b3}"/><rect x="${wx0 - 34}" y="${wy1}" width="${wx1 - wx0 + 68}" height="3" fill="${C.b5}" opacity=".7"/>
        <rect x="${wx0 - 20}" y="${wy1 + 16}" width="${wx1 - wx0 + 40}" height="10" fill="${C.b1}"/>`;
      // things on the sill: a plant, a mug, the little screen on its stand
      const sill = `<path d="M920 ${wy1}l-6 -34h40l-6 34z" fill="${C.b2}"/>${Array.from({length: 9}, (_, i) => { const a = -150 + i * 15 + r() * 8;
          return `<path d="M934 ${wy1 - 34}q${n1(Math.cos(a * Math.PI / 180) * 20)} ${n1(Math.sin(a * Math.PI / 180) * 30 - 6)} ${n1(Math.cos(a * Math.PI / 180) * 36)} ${n1(Math.sin(a * Math.PI / 180) * 44)}" stroke="${C.b3}" stroke-width="5" fill="none" stroke-linecap="round"/>`; }).join('')}
        <rect x="1012" y="${wy1 - 22}" width="20" height="22" rx="3" fill="${C.b3}"/><path d="M1032 ${wy1 - 16}h5a4 4 0 0 1 0 8h-5" stroke="${C.b3}" stroke-width="2.5" fill="none"/>
        <path d="M${MON.x + MON.w / 2} ${MON.y + MON.h}V${wy1}M${MON.x + MON.w / 2 - 22} ${wy1 - 1}H${MON.x + MON.w / 2 + 22}" stroke="${C.b2}" stroke-width="6"/>
        <rect x="${MON.x - 6}" y="${MON.y - 6}" width="${MON.w + 12}" height="${MON.h + 12}" rx="8" fill="${C.b2}"/><rect x="${MON.x}" y="${MON.y}" width="${MON.w}" height="${MON.h}" rx="4" fill="${C.b0}"/>
        ${[.3, .55, .8].map(f => `<path d="M${MON.x + 6} ${n1(MON.y + MON.h * f)}H${MON.x + MON.w - 6}" stroke="${C.b2}" stroke-width="1"/>`).join('')}`;
      // the bed below the window: headboard on the left, pillow, him asleep on his back, the blanket up to his chest
      const me = FIG.side({y: -11, lean: -90, neck: -88, head: -84, legs: [{thigh: 102, knee: 22}, {thigh: 93, knee: 4}],
        arms: [{upper: 84, elbow: 12}, {upper: 88, elbow: 8}]});
      const PX = 1088, B0 = 892, B1 = 1392;              // his hips; the mattress from B0 to B1
      const bed = `<rect x="${B0 - 46}" y="560" width="46" height="250" rx="12" fill="${C.b1}"/><rect x="${B0 - 46}" y="560" width="46" height="5" rx="2" fill="${C.b3}"/>
        <rect x="${B0}" y="${BED}" width="${B1 - B0}" height="64" rx="10" fill="${C.b2}"/><rect x="${B0}" y="${BED + 58}" width="${B1 - B0}" height="30" fill="${C.b1}"/>
        <rect x="${B0 + 8}" y="${BED + 86}" width="16" height="26" fill="${C.b1}"/><rect x="${B1 - 24}" y="${BED + 86}" width="16" height="26" fill="${C.b1}"/>
        <path d="M${B0 + 8} ${BED + 4}q-8 -40 30 -46h80q26 6 20 46z" fill="${C.b4}"/><path d="M${B0 + 16} ${BED - 26}q34 -12 110 -4" stroke="${C.b5}" stroke-width="3" opacity=".6" fill="none"/>`;
      const body = `<g class="jbreath">${K.fig(me.d, PX, BED, FS)}</g>`;
      // the blanket is a soft mound over his chest, a knee, his feet, then falls over the end and side of the bed
      const blanket = `<path d="M${PX - 112} ${BED + 6}C${PX - 118} ${BED - 40} ${PX - 104} ${BED - 62} ${PX - 80} ${BED - 62}C${PX - 40} ${BED - 62} ${PX - 10} ${BED - 50} ${PX + 40} ${BED - 52}
          C${PX + 80} ${BED - 54} ${PX + 96} ${BED - 66} ${PX + 128} ${BED - 58}C${PX + 160} ${BED - 50} ${PX + 172} ${BED - 40} ${PX + 200} ${BED - 44}C${PX + 222} ${BED - 46} ${PX + 236} ${BED - 30} ${B1 + 4} ${BED - 2}
          L${B1 + 10} ${BED + 74}C${B1 - 120} ${BED + 82} ${PX} ${BED + 70} ${PX - 120} ${BED + 76}Z" fill="${C.b3}"/>
        <path d="M${PX - 106} ${BED - 44}C${PX - 96} ${BED - 60} ${PX - 40} ${BED - 60} ${PX + 40} ${BED - 52}C${PX + 80} ${BED - 54} ${PX + 100} ${BED - 66} ${PX + 128} ${BED - 58}" stroke="${C.b5}" stroke-width="3" opacity=".55" fill="none"/>
        <path d="M${PX - 112} ${BED - 30}c18 -4 30 6 46 0" stroke="${C.b4}" stroke-width="7" stroke-linecap="round" fill="none"/>
        ${[[PX + 20, 30], [PX + 110, 40], [PX + 190, 34], [PX + 262, 24]].map(([x, h]) => `<path d="M${x} ${BED - 34}q14 ${h * .6} 4 ${h + 70}" stroke="${C.b2}" stroke-width="3" fill="none" opacity=".75"/>`).join('')}`;
      // nightstand by the headboard: lamp (off), a glass of water, his phone lying face down, its cable
      const NX = B0 - 150;
      const stand = `<g transform="translate(${NX - 636} 0)"><rect x="636" y="652" width="100" height="150" rx="5" fill="${C.b1}"/><rect x="636" y="652" width="100" height="5" fill="${C.b3}"/>
        <rect x="646" y="700" width="80" height="3" fill="${C.b0}"/><rect x="644" y="800" width="10" height="14" fill="${C.b1}"/><rect x="718" y="800" width="10" height="14" fill="${C.b1}"/>
        <path d="M652 652v-44M640 608h24l-6 -26h-12z" stroke="${C.b2}" stroke-width="4" fill="${C.b2}"/>
        <rect x="704" y="626" width="16" height="26" rx="2" fill="${C.b4}" opacity=".45"/><rect x="706" y="636" width="12" height="15" fill="${C.b5}" opacity=".35"/>
        <path d="M694 650c10 20 -18 40 -4 70s20 50 6 84" stroke="${C.b0}" stroke-width="2" fill="none"/>
        <g id="jphone"><rect x="664" y="644" width="40" height="8" rx="2.5" fill="${C.b0}"/><rect id="jscreen" x="666" y="644" width="36" height="3" rx="1" fill="${C.w}" opacity="0"/>
          <linearGradient id="jPg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${C.w}" stop-opacity=".8"/><stop offset="1" stop-color="${C.b7}" stop-opacity="0"/></linearGradient>
          <path id="jglow" d="M668 644L700 644L770 330L598 330Z" fill="url(#jPg)" opacity="0" filter="url(#b8)"/></g></g>
        <path d="M${B0 + 20} 822q10 -12 30 -10t20 10zM${B0 + 76} 826q10 -12 30 -10t20 10z" fill="${C.b2}"/>`;
      // a small framed photo of home on the wall, and a shelf
      const decor = `<rect x="330" y="372" width="120" height="92" fill="${C.b1}"/><rect x="340" y="382" width="100" height="72" fill="${C.b2}"/>
        <path d="M340 440h100v14H340z" fill="${C.b3}"/>${Array.from({length: 6}, (_, i) => `<ellipse cx="${400 + i * 6}" cy="430" rx="2.2" ry="10" fill="${C.b3}"/>`).join('')}
        <path d="M356 440l2 -18M366 440l-2 -18M354 424h16" stroke="${C.b3}" stroke-width="1.5"/><rect x="354" y="414" width="16" height="9" rx="2" fill="${C.b3}"/>
        <rect x="150" y="560" width="280" height="8" fill="${C.b2}"/>${[[160, 34], [176, 40], [190, 30], [204, 42], [222, 36]].map(([x, h]) => `<rect x="${x}" y="${560 - h}" width="12" height="${h}" fill="${[C.b1, C.b2, C.b3][x % 3]}"/>`).join('')}
        <rect x="380" y="532" width="22" height="28" rx="3" fill="${C.b2}"/>`;
      // moonlight through the window: a soft beam, and the window's bright shape lying across the bed
      const moon = `<path d="M${wx0} ${wy0}L${wx1} ${wy0}L${wx1 - 160} ${BED - 20}L${wx0 - 330} ${BED + 40}Z" fill="url(#gBeam)" opacity=".22" filter="url(#b16)"/>
        <path d="M${wx0 - 120} ${BED - 26}L${wx1 - 200} ${BED - 34}L${wx1 - 250} ${BED + 66}L${wx0 - 250} ${BED + 80}Z" fill="${C.b6}" opacity=".12" filter="url(#b8)"/>`;
      // Jassi: a round little bot with one eye and an antenna, glowing softly
      const bot = `<g id="jbot" transform="translate(${BOT.x} ${BOT.y})"><g class="jbob"><circle class="jhalo" cx="0" cy="-26" r="64" fill="url(#gGlow)"/>
        <path d="M2 -50v-14" stroke="${C.ink}" stroke-width="2.4" stroke-linecap="round"/><circle cx="2" cy="-66" r="4" fill="${C.w}"/>
        <path d="M-24 -26C-24 -46 -12 -52 0 -52C14 -52 26 -44 26 -24C26 -8 16 0 0 0C-14 0 -24 -8 -24 -26Z" fill="${C.w}" filter="url(#fuzzc)"/>
        <path d="M-25 -16q-8 4 -7 12M26 -16q8 4 7 12" stroke="${C.w}" stroke-width="5" stroke-linecap="round" fill="none"/>
        <g id="jeye">${FIG.eye({x: 6, y: -27}, 1.15, 1, -12)}</g></g></g>`;
      // the flash when it breaks, the word going out, the rings where it lands
      const fx = `<circle id="jflash" cx="${MON.x + MON.w / 2}" cy="${MON.y + MON.h / 2}" r="140" fill="url(#gGlow)" opacity="0"/>
        <path id="jsig" d="" fill="none" stroke="${C.b7}" stroke-width="2.4" stroke-dasharray="2 9" stroke-linecap="round" opacity="0"/>
        <g id="jping" opacity="0"><circle r="10" fill="none" stroke="${C.w}" stroke-width="1.5"/><circle r="20" fill="none" stroke="${C.w}" stroke-width="1" opacity=".5"/></g>`;
      const curtains = (x, w, dir) => `<g class="jcurt"><path d="M${x} ${wy0 - 30}h${w}c${dir * 10} 160 ${-dir * 14} 330 ${dir * 6} ${wy1 - wy0 + 80}h${-w}c${dir * 12} -150 ${-dir * 8} -320 0 -${wy1 - wy0 + 80}z" fill="${C.b5}" opacity=".16"/>
        ${[.25, .55, .8].map(f => `<path d="M${n1(x + w * f)} ${wy0 - 30}c4 140 -6 330 3 ${wy1 - wy0 + 80}" stroke="${C.b6}" stroke-width="2" opacity=".14" fill="none"/>`).join('')}</g>`;
      // out of focus in front: the dark leaves of a big pot plant in the right corner
      const fg = Array.from({length: 9}, (_, i) => { const a = -150 + i * 16 + r() * 10, l = 220 + r() * 160, x = 1640, y = 1000;
        const ex = x + Math.cos(a * Math.PI / 180) * l, ey = y + Math.sin(a * Math.PI / 180) * l;
        return `<path d="M${x} ${y}Q${n1((x + ex) / 2 + 40)} ${n1((y + ey) / 2 - 60)} ${n1(ex)} ${n1(ey)}Q${n1((x + ex) / 2 - 30)} ${n1((y + ey) / 2 + 30)} ${x} ${y}Z" fill="${C.b0}"/>`; }).join('');

      return [
        {z: .1, svg: sky},
        {z: .1, svg: stars},
        {z: .16, svg: far},
        {z: FAR.z, svg: mid},
        {z: .34, svg: near + K.fog(560, 30, .3, C.b3, 900, 1150)},
        {z: 1, svg: wall + moon + frame + sill + decor + bed + body + blanket + stand},
        {z: 1, svg: curtains(wx0 - 70, 92, 1) + curtains(wx1 - 22, 92, -1)},
        {z: 1, html: K.dust([[wx0 + 20, wy0 + 20], [wx1 - 40, wy0 + 20], [wx1 - 200, BED - 10], [wx0 - 300, BED + 30]], 40, 9, .1)},
        {z: 1, svg: bot + fx + `<path id="jline" d="" fill="none" stroke="${C.b6}" stroke-width="2.2" stroke-linejoin="round" filter="url(#glow)"/>`},
        {z: 1.4, cls: 'blur12', svg: fg},
      ];
    },
    cam,
    frame(p, st) {
      const $ = id => st.querySelector('#' + id);
      if (!$('jbot')) return;
      $('jline').setAttribute('d', pulse(p));
      // it breaks: a flash at the screen, Jassi's eye goes wide and it hops
      const flash = span(p, .52, .56) * (1 - span(p, .58, .66));
      $('jflash').setAttribute('opacity', (flash * .9).toFixed(3));
      const hop = Math.sin(Math.PI * span(p, .57, .66)) * 26;
      $('jbot').setAttribute('transform', `translate(${BOT.x} ${n1(BOT.y - hop)})`);
      const wide = 1 + span(p, .53, .57) * .35 * (1 - span(p, .84, .92));
      $('jeye').setAttribute('transform', `translate(6 -27) scale(${(Math.round(wide * 100) / 100)}) translate(-6 27)`);
      $('jeye').querySelector('circle').setAttribute('cx', n1(1.4 * (1 - 2 * span(p, .86, .94))));   // at the end it glances back at him
      // word goes out: the phone lights and buzzes, a dotted line runs from Jassi to one window across the city
      const ph = span(p, .62, .66) * (1 - span(p, .8, .9)), buzz = ph > .05 && p < .74 ? Math.sin(p * 900) * 1.6 : 0;
      $('jscreen').setAttribute('opacity', (ph * .95).toFixed(3));
      $('jglow').setAttribute('opacity', (ph * .5).toFixed(3));
      $('jphone').setAttribute('transform', `translate(${n1(buzz)} 0)`);
      const c = {...{x: 0, zoom: 1, ox: 1080, oy: 470}, ...cam(p)}, to = seen(FAR, FAR.z, c), from = {x: BOT.x + 4, y: BOT.y - hop - 70};
      const go = span(p, .64, .76);
      const mx = (from.x + to.x) / 2 + 30, my = Math.min(from.y, to.y) - 120;
      let d = '';
      for (let i = 0; i <= 30; i++) { const t = go * i / 30, u = 1 - t;    // the arc so far
        d += `${i ? 'L' : 'M'}${n1(u * u * from.x + 2 * u * t * mx + t * t * to.x)} ${n1(u * u * from.y + 2 * u * t * my + t * t * to.y)}`; }
      $('jsig').setAttribute('d', d);
      $('jsig').setAttribute('opacity', (span(p, .63, .66) * (1 - span(p, .82, .9)) * .85).toFixed(3));
      const land = span(p, .75, .8);
      $('jping').setAttribute('transform', `translate(${n1(to.x)} ${n1(to.y)}) scale(${n1(.6 + land * 1.6)})`);
      $('jping').setAttribute('opacity', (land * (1 - span(p, .8, .88))).toFixed(3));
      $('jfar').setAttribute('opacity', span(p, .76, .82).toFixed(3));
    },
  });
})();
