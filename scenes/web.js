// Class 11, late at night. A tutorial plays on a phone propped against schoolbooks while he builds a page on the laptop;
// tea going cold, the clock past eleven. Then one change sweeps across the room and repaints all of it as morning.
(() => {
  const {C, rng, keys, span, n1, beam, pool, dust, fig} = K;
  const FLOOR = 740, DESK = 610, TS = 1.65, TX = 640;    // floor and desk-top lines, board units per cm, where he sits
  const CAM = p => ({zoom: keys(p, [[0, 1.02], [.42, 1.12], [.6, 1.14], [.8, 1.04], [1, 1]]), x: keys(p, [[0, -30], [.6, 20], [1, 0]]), y: 70, ox: 850, oy: 560});
  const WIPE = p => keys(p, [[.64, -160], [.8, 1760]]);  // where the repaint has reached, across the screen

  const NIGHT = {wall: ['#041d45', C.b1, C.b2], stain: C.b0, floor: '#041d45', tile: C.b2, wood: C.b2, top: C.b3, edge: C.b4, thing: C.b3, lit: C.b4, paper: C.b5, note: C.b4,
    sky: [C.b2, C.b4], roof: C.b1, bar: C.b1, curtain: C.b3, fold: C.b4, screen: C.b7, ui: C.b5, uiHi: C.b4, night: true};
  const DAY = {wall: [C.b5, C.b5, C.b4], stain: C.b6, floor: C.b3, tile: C.b4, wood: C.b3, top: C.b5, edge: C.b6, thing: C.b4, lit: C.b6, paper: C.w, note: C.b7,
    sky: [C.b6, C.b7], roof: C.b5, bar: C.b3, curtain: C.b6, fold: C.b7, screen: C.w, ui: C.b6, uiHi: C.b4, night: false};

  // the room in one light; drawn twice, night and morning, at three depths
  function room(P, r) {
    const id = P.night ? 'n' : 'd';
    // ---- the wall: plaster, sticky notes, a clock, a calendar, the window ----
    let back = `<linearGradient id="wbW${id}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${FLOOR}"><stop offset="0" stop-color="${P.wall[0]}"/><stop offset=".55" stop-color="${P.wall[1]}"/><stop offset="1" stop-color="${P.wall[2]}"/></linearGradient>
      <rect x="-600" y="-300" width="2900" height="${FLOOR + 300}" fill="url(#wbW${id})"/>`;
    for (let i = 0; i < 8; i++) back += `<ellipse cx="${n1(r() * 1700)}" cy="${n1(100 + r() * 500)}" rx="${n1(70 + r() * 120)}" ry="${n1(50 + r() * 80)}" fill="${P.stain}" opacity=".3" filter="url(#b30)"/>`;
    const notes = [[700, 300, -6], [748, 292, 4], [796, 304, -3], [724, 352, 5], [780, 350, -5]];
    notes.forEach(([x, y, a], i) => back += `<g transform="rotate(${a} ${x + 20} ${y + 20})"><rect x="${x}" y="${y}" width="40" height="40" fill="${i % 2 ? P.note : P.paper}" opacity="${P.night ? .7 : .95}"/>` +
      `<path d="M${x + 7} ${y + 13}H${x + 32}M${x + 7} ${y + 21}H${x + 28}M${x + 7} ${y + 29}H${x + 22}" stroke="${P.night ? C.b2 : C.b4}" stroke-width="2"/></g>`);
    // the clock: past eleven at night, just after eight in the morning
    const hr = P.night ? 350 : 244, mn = P.night ? 240 : 30;
    back += `<g transform="translate(600 420)"><circle r="44" fill="${P.paper}" opacity="${P.night ? .55 : 1}"/><circle r="44" fill="none" stroke="${P.thing}" stroke-width="5"/>
      ${Array.from({length: 12}, (_, i) => `<path d="M0 -36V-31" stroke="${P.night ? C.b2 : C.b4}" stroke-width="2.4" transform="rotate(${i * 30})"/>`).join('')}
      <path d="M0 4V-22" stroke="${C.ink}" stroke-width="4" stroke-linecap="round" transform="rotate(${hr})"/><path d="M0 5V-32" stroke="${C.ink}" stroke-width="2.6" stroke-linecap="round" transform="rotate(${mn})"/><circle r="3.4" fill="${C.ink}"/></g>`;
    back += `<g transform="translate(150 470)"><rect width="300" height="10" fill="${P.top}"/><path d="M24 10l12 18M276 10l-12 18" stroke="${P.wood}" stroke-width="5"/>
      ${[[10, 54], [24, 62], [38, 48], [52, 58], [66, 40]].map(([x, h], i) => `<rect x="${x}" y="${-h}" width="12" height="${h}" fill="${[P.thing, P.lit, P.wood][i % 3]}"/>`).join('')}
      <rect x="82" y="-20" width="70" height="20" fill="${P.lit}" transform="rotate(-8 82 0)"/>
      <path d="M190 0V-8H214V0ZM196 -8V-18H208V-8ZM190 -46C190 -30 214 -30 214 -46ZM188 -46H216" fill="${P.paper}" opacity="${P.night ? .6 : 1}"/>
      <rect x="236" y="-64" width="48" height="64" fill="${P.thing}"/><rect x="242" y="-58" width="36" height="52" fill="${P.paper}" opacity="${P.night ? .5 : .9}"/>
      <circle cx="260" cy="-38" r="7" fill="${P.lit}"/><path d="M248 -10C250 -24 270 -24 272 -10Z" fill="${P.lit}"/></g>`;
    back += `<g transform="translate(930 230)"><rect width="112" height="136" fill="${P.paper}" opacity="${P.night ? .5 : .95}"/><rect width="112" height="30" fill="${P.lit}"/>
      ${Array.from({length: 20}, (_, i) => `<rect x="${9 + (i % 5) * 20}" y="${40 + Math.floor(i / 5) * 22}" width="14" height="14" fill="${P.ui}" opacity=".7"/>`).join('')}
      <path d="M${9 + 3 * 20} 84l14 14M${9 + 3 * 20 + 14} 84l-14 14" stroke="${C.ink}" stroke-width="2"/></g>`;
    // the window, its bars and curtains; moon and a phone tower's light at night, sun and clouds in the morning
    let win = `<rect x="1110" y="140" width="320" height="314" fill="${P.wood}"/>
      <linearGradient id="wbS${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.sky[0]}"/><stop offset="1" stop-color="${P.sky[1]}"/></linearGradient>
      <rect x="1124" y="154" width="292" height="286" fill="url(#wbS${id})"/>`;
    if (P.night) win += `<circle cx="1352" cy="214" r="80" fill="url(#gGlow)" opacity=".5"/><circle cx="1352" cy="214" r="17" fill="${C.w}"/>` +
      Array.from({length: 14}, () => `<circle cx="${n1(1130 + r() * 280)}" cy="${n1(160 + r() * 170)}" r="${n1(.6 + r())}" fill="${C.w}" opacity=".8"/>`).join('') +
      '';
    else win += `<circle cx="1360" cy="206" r="120" fill="url(#gGlow)" opacity=".9"/><circle cx="1360" cy="206" r="24" fill="${C.w}"/>` +
      [[1190, 214, 1], [1290, 300, .8]].map(([x, y, s]) => `<g opacity=".9">${[-30, -12, 6, 24].map((dx, i) => `<circle cx="${x + dx * s}" cy="${y - (i % 2) * 8 * s}" r="${(14 + (i % 3) * 4) * s}" fill="${C.w}"/>`).join('')}</g>`).join('') +
      [[1240, 250], [1252, 244], [1262, 252]].map(([x, y]) => `<path d="M${x - 5} ${y}q2.5 -3 5 0q2.5 -3 5 0" stroke="${C.b3}" stroke-width="1.4" fill="none"/>`).join('');
    win += `<path d="M1124 440V360H1176V376H1226V346H1240V318H1262V346H1310V384H1352V366H1416V440Z" fill="${P.roof}"/>
      <path d="M1200 440V266M1192 300L1208 300M1194 330L1206 330" stroke="${P.roof}" stroke-width="4"/><rect x="1272" y="330" width="26" height="18" rx="3" fill="${P.roof}"/>
      ${[0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="${1146 + i * 40}" y="154" width="5" height="286" fill="${P.bar}"/>`).join('')}<rect x="1124" y="300" width="292" height="6" fill="${P.bar}"/>
      <rect x="1100" y="450" width="340" height="14" fill="${P.top}"/>
      <path d="M1084 120C1104 230 1078 360 1104 470L1136 470C1124 360 1142 230 1120 120Z" fill="${P.curtain}"/><path d="M1098 126C1112 230 1094 360 1114 466" stroke="${P.fold}" stroke-width="4" fill="none"/>
      <path d="M1456 120C1436 230 1462 360 1436 470L1404 470C1416 360 1398 230 1420 120Z" fill="${P.curtain}"/><path d="M1442 126C1428 230 1446 360 1426 466" stroke="${P.fold}" stroke-width="4" fill="none"/>
      <rect x="1070" y="112" width="400" height="10" rx="5" fill="${P.thing}"/>`;
    back += win + `<rect x="-600" y="${FLOOR - 14}" width="2900" height="14" fill="${P.wood}"/>`;

    // ---- floor: tiles, a striped rug, light from the window ----
    let floor = `<rect x="-600" y="${FLOOR}" width="2900" height="400" fill="${P.floor}"/>`;
    for (let i = -16; i <= 16; i++) floor += `<path d="M${850 + i * 64} ${FLOOR}L${850 + i * 140} ${FLOOR + 260}" stroke="${P.tile}" stroke-width="1.2" opacity=".55"/>`;
    for (const y of [FLOOR + 20, FLOOR + 52, FLOOR + 100]) floor += `<path d="M-600 ${y}H2300" stroke="${P.tile}" stroke-width="1.2" opacity=".55"/>`;
    floor += `<g transform="translate(560 ${FLOOR + 50})"><ellipse rx="300" ry="34" fill="${P.thing}"/>${[-1, 0, 1].map(k => `<ellipse rx="${300 - 40 * (k + 2)}" ry="${34 - 5 * (k + 2)}" fill="none" stroke="${P.lit}" stroke-width="3" opacity=".6"/>`).join('')}</g>`;
    floor += P.night ? `<path d="M900 ${FLOOR + 10}L1250 ${FLOOR + 10}L1180 ${FLOOR + 120}L760 ${FLOOR + 120}Z" fill="${C.b6}" opacity=".08" filter="url(#b8)"/>`
      : `<path d="M760 ${FLOOR + 6}L1210 ${FLOOR + 6}L1080 ${FLOOR + 130}L540 ${FLOOR + 130}Z" fill="${C.w}" opacity=".28" filter="url(#b8)"/>`;

    // ---- the desk and everything on it ----
    const top = DESK;
    let desk = `<g fill="${P.wood}"><path d="M${TX - 92} ${top - 150}L${TX - 76} ${top - 150}L${TX - 68} ${top + 74}L${TX - 82} ${top + 74}Z"/><rect x="${TX - 98}" y="${top - 158}" width="30" height="14" rx="5" fill="${P.top}"/>
      <rect x="${TX - 84}" y="${top + 50}" width="130" height="13" rx="4" fill="${P.top}"/><path d="M${TX - 76} ${top + 63}L${TX - 84} ${FLOOR}M${TX + 36} ${top + 63}L${TX + 44} ${FLOOR}" stroke="${P.wood}" stroke-width="9"/></g>
      <path d="M672 ${top - 12}L1372 ${top - 12}L1358 ${top}L686 ${top}Z" fill="${P.top}"/><rect x="680" y="${top}" width="686" height="16" fill="${P.wood}"/>
      <rect x="690" y="${top + 16}" width="16" height="${FLOOR - top - 16}" fill="${P.wood}"/><rect x="1336" y="${top + 16}" width="16" height="${FLOOR - top - 16}" fill="${P.wood}"/>
      <rect x="706" y="${top + 16}" width="630" height="10" fill="${P.thing}" opacity=".6"/>`;
    // laptop, turned a little towards us; a simple page being built on it
    desk += `<path d="M712 ${top - 13}L878 ${top - 13}L890 ${top - 5}L702 ${top - 5}Z" fill="${P.lit}"/>${Array.from({length: 14}, (_, i) => `<rect x="${724 + i * 10.6}" y="${top - 11}" width="7" height="2" fill="${P.thing}"/>`).join('')}
      <path d="M716 ${top - 14}L742 ${top - 150}L896 ${top - 140}L876 ${top - 14}Z" fill="${P.thing}"/>
      <path d="M726 ${top - 22}L749 ${top - 141}L887 ${top - 132}L868 ${top - 22}Z" fill="${P.screen}"/>
      <g fill="${P.ui}"><path d="M747 ${top - 130}L884 ${top - 122}L882 ${top - 112}L745 ${top - 120}Z" fill="${P.uiHi}"/>
        <path d="M742 ${top - 108}L812 ${top - 104}L806 ${top - 66}L736 ${top - 70}Z"/><path d="M820 ${top - 103}L878 ${top - 100}L874 ${top - 88}L818 ${top - 91}Z" opacity=".7"/>
        <path d="M818 ${top - 84}L872 ${top - 81}L870 ${top - 73}L816 ${top - 76}Z" opacity=".5"/>
        ${[0, 1, 2].map(k => `<path d="M${734 + k * 44} ${top - 58}L${770 + k * 44} ${top - 56}L${767 + k * 44} ${top - 30}L${731 + k * 44} ${top - 32}Z" opacity=".75"/>`).join('')}</g>`;
    // schoolbooks with the phone leaning on them, a tutorial playing
    desk += `<g><rect x="900" y="${top - 26}" width="104" height="14" fill="${P.lit}"/><rect x="906" y="${top - 40}" width="94" height="14" fill="${P.thing}"/><rect x="896" y="${top - 52}" width="100" height="12" fill="${P.lit}"/>
      <path d="M902 ${top - 22}H1000M910 ${top - 35}H996" stroke="${P.paper}" stroke-width="1.4" opacity=".6"/>
      <g transform="rotate(-8 950 ${top - 52})"><rect x="908" y="${top - 104}" width="92" height="52" rx="7" fill="${C.ink}"/><rect x="913" y="${top - 99}" width="82" height="42" rx="3" fill="${P.night ? C.b3 : C.b5}"/>
      <rect x="918" y="${top - 94}" width="34" height="24" fill="${P.screen}" opacity=".9"/><path d="M922 ${top - 88}H946M922 ${top - 82}H940M922 ${top - 76}H944" stroke="${C.b4}" stroke-width="1.4"/>
      <circle cx="972" cy="${top - 86}" r="6" fill="${C.w}"/><path d="M968 ${top - 70}q4 -10 8 0z" fill="${C.w}"/>
      <path d="M916 ${top - 62}H992" stroke="${C.b6}" stroke-width="2" opacity=".5"/><path d="M916 ${top - 62}H958" stroke="${C.w}" stroke-width="2"/><circle cx="958" cy="${top - 62}" r="3" fill="${C.w}"/>
      <circle cx="954" cy="${top - 82}" r="9" fill="${C.ink}" opacity=".35"/><path d="M951 ${top - 86}L959 ${top - 82}L951 ${top - 78}Z" fill="${C.w}"/></g></g>`;
    // tea, a notebook with a pen, the desk lamp
    desk += `<path d="M1026 ${top - 40}L1060 ${top - 40}L1056 ${top - 12}L1030 ${top - 12}Z" fill="${P.paper}" opacity="${P.night ? .8 : 1}"/><path d="M1059 ${top - 34}c12 0 12 14 -1 14" stroke="${P.paper}" stroke-width="3" fill="none"/>
      <path d="M1084 ${top - 13}L1206 ${top - 13}L1214 ${top - 5}L1078 ${top - 5}Z" fill="${P.paper}"/><path d="M1146 ${top - 13}V${top - 5}" stroke="${P.thing}" stroke-width="1.2"/>
      ${[0, 1, 2].map(k => `<path d="M${1090 + k} ${top - 11 + k * 2.4}H${1140}M${1152} ${top - 11 + k * 2.4}H${1204}" stroke="${P.ui}" stroke-width=".9"/>`).join('')}
      <path d="M1170 ${top - 16}L1220 ${top - 26}" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>
      <g><ellipse cx="1262" cy="${top - 14}" rx="28" ry="6" fill="${P.wood}"/><path d="M1262 ${top - 16}L1288 ${top - 150}L1186 ${top - 182}" fill="none" stroke="${P.thing}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="1288" cy="${top - 150}" r="6" fill="${P.lit}"/>
        <g transform="translate(1180 ${top - 182}) rotate(22)"><path d="M-28 0L28 0L17 -28L-17 -28Z" fill="${P.thing}"/>
        ${P.night ? `<ellipse cx="0" cy="1" rx="29" ry="6" fill="${C.b7}"/><circle cx="0" cy="3" r="8" fill="${C.w}"/>` : `<ellipse cx="0" cy="1" rx="29" ry="6" fill="${P.wood}"/>`}</g></g>`;
    // his schoolbag on the floor against the desk leg
    desk += `<g transform="translate(1280 ${FLOOR})"><path d="M-46 0C-52 -40 -48 -92 -10 -100C30 -104 44 -70 40 0Z" fill="${P.thing}"/><path d="M-34 0C-36 -26 -30 -46 -4 -48C22 -48 30 -30 28 0Z" fill="${P.lit}"/>
      <path d="M-20 -98C-22 -118 10 -120 10 -100" stroke="${P.wood}" stroke-width="5" fill="none"/><path d="M-30 -40H20" stroke="${P.wood}" stroke-width="3"/></g>`;
    return {back, floor, desk};
  }

  scene('web', {
    bg: C.b0,
    focus: 795,
    layers() {
      const r1 = rng(71), r2 = rng(71), N = room(NIGHT, r1), D = room(DAY, r2), top = DESK;
      // the two rooms share each layer; the morning one is clipped to the part of the screen the sweep has passed
      const both = (n, d, i) => `<clipPath id="wbN${i}"><rect class="wb-n" x="-3000" y="-2000" width="9000" height="5000"/></clipPath><clipPath id="wbD${i}"><rect class="wb-d" x="-3000" y="-2000" width="0" height="5000"/></clipPath>` +
        `<g clip-path="url(#wbN${i})">${n}</g><g clip-path="url(#wbD${i})">${d}</g>`;
      const me = fig(this.pose(0), TX, FLOOR, TS, {id: 'wbMe'});
      const night = `<g class="wb-night">${beam({x: 1180, y: top - 182, top: 46, spread: 200, h: 172, o: .45, tilt: -60})}${pool(1130, top - 9, 90, 9, .7)}
        <circle cx="800" cy="${top - 80}" r="230" fill="url(#gGlow)" opacity=".3"/><circle cx="950" cy="${top - 76}" r="120" fill="url(#gGlow)" opacity=".25"/>
</g>`;
      const steam = [0, 1, 2].map(i => `<path class="wb-steam" style="animation-delay:-${i * 1.7}s" d="M1043 ${top - 44}c-5 -10 6 -16 0 -26s6 -16 -2 -26" fill="none" stroke="${C.b7}" stroke-width="2" stroke-linecap="round" filter="url(#b1)"/>`).join('');
      const sun = `<path d="M1124 154L1416 154L1150 ${FLOOR + 130}L520 ${FLOOR + 130}Z" fill="${C.w}" opacity=".16" filter="url(#b16)"/>
        <path d="M1180 154L1300 154L1000 ${FLOOR + 130}L760 ${FLOOR + 130}Z" fill="${C.w}" opacity=".14" filter="url(#b8)"/>`;
      const fg = (P, i) => `<g><path d="M-80 960C-40 820 160 800 300 840L320 960Z" fill="${P.thing}"/><path d="M-60 880C60 846 180 840 290 856" stroke="${P.lit}" stroke-width="10" fill="none"/></g>` +
        Array.from({length: 7}, (_, k) => `<path d="M${1480 + k * 28} 980C${1440 + k * 18} 900 ${1420 + k * 40} ${820 - k * 16} ${1380 + k * 52} ${760 - (k % 3) * 40}C${1460 + k * 30} ${830 - k * 10} ${1490 + k * 20} 900 ${1500 + k * 28} 980Z" fill="${k % 2 ? P.wood : P.thing}"/>`).join('');
      const L = [
        {z: .6, svg: both(N.back, D.back, 0)},
        {z: .8, svg: both(N.floor, D.floor, 1)},
        {z: .6, svg: `<g class="wb-sun">${sun}</g>`},
        {z: 1, svg: both(N.desk + night, D.desk, 2) + me},
        {z: .8, cls: 'wb-dn', html: dust([[1124, 154], [1416, 154], [1150, 870], [520, 870]], 40, 6, .12)},
        {z: 1, cls: 'wb-dd', html: dust([[1162, top - 182], [1198, top - 182], [1190, top - 10], [1000, top - 10]], 16, 2, .1)},
        {z: 1, svg: steam},
        {z: .6, cls: 'wb-tower', svg: `<circle class="wb-blink" cx="1200" cy="262" r="3.2" fill="${C.w}"/>`},
        {z: 1.5, cls: 'blur6', svg: both(fg(NIGHT), fg(DAY), 3)},
        {z: 0, svg: `<g id="wbSweep"><rect x="-70" y="-300" width="140" height="1500" fill="url(#wbGlowG)" opacity=".85"/><rect x="-3" y="-300" width="6" height="1500" fill="${C.w}"/></g>
          <linearGradient id="wbGlowG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.w}" stop-opacity="0"/><stop offset=".5" stop-color="${C.w}" stop-opacity=".55"/><stop offset="1" stop-color="${C.w}" stop-opacity="0"/></linearGradient>`},
        {z: 0, svg: `<rect id="wbDim" x="-400" y="-300" width="2600" height="1500" fill="${C.b0}" opacity="0"/>`},
      ];
      this.z = L.map(l => l.z);
      return L;
    },
    // sitting forward at the laptop, typing; t nudges his hands
    pose: t => FIG.side({x: 0, y: -52, lean: 15, neck: 20, head: 12, legs: [{thigh: 86, knee: 90}, {thigh: 82, knee: 84}],
      arms: [{to: {x: 50 + t * 3, y: -82}}, {to: {x: 42 - t * 2, y: -81.5}}]}, 'adult', 29).d,
    cam: CAM,
    init(st) {
      const zOf = c => [.6, .8, 1, 1.5][+c.parentNode.id.slice(3)];
      this.ds = [...st.querySelectorAll('.wb-d')].map(c => [c, zOf(c)]);
      this.ns = [...st.querySelectorAll('.wb-n')].map(c => [c, zOf(c)]);
      this.tower = st.querySelector('.wb-tower');
      this.sweep = st.querySelector('#wbSweep');
      this.dim = st.querySelector('#wbDim');
      this.me = st.querySelector('#wbMe path');
      this.sun = st.querySelector('.wb-sun');
      this.dn = st.querySelector('.wb-dn'); this.dd = st.querySelector('.wb-dd');
    },
    frame(p) {
      if (!this.sweep) return;
      // the sweep is a straight line on screen, so each layer clips at its own spot under the camera
      const c = CAM(p), w = WIPE(p), ox = c.ox, zm = c.zoom;
      const at = z => ox + (w + c.x * z - ox) / (1 + (zm - 1) * z);
      this.ds.forEach(([cut, z]) => cut.setAttribute('width', n1(at(z) + 3000)));
      this.ns.forEach(([cut, z]) => cut.setAttribute('x', n1(at(z))));
      const on = span(p, .62, .66) * (1 - span(p, .78, .82));
      this.sweep.setAttribute('transform', `translate(${n1(w)} 0)`);
      this.sweep.style.opacity = on.toFixed(3);
      const day = span(p, .66, .8);
      this.sun.style.opacity = day.toFixed(3);
      this.dn.style.opacity = day.toFixed(3);
      this.dd.style.opacity = (1 - day).toFixed(3);
      this.tower.style.opacity = (1 - day).toFixed(3);
      this.dim.setAttribute('opacity', (span(p, .4, .46) * (1 - span(p, .58, .64)) * .5).toFixed(3));   // the room dims for the big line
      this.me.setAttribute('d', this.pose(Math.sin(p * 70) * .5 + .5));
    },
    css: `.wb-steam{animation:wbsteam 5.1s ease-in infinite;opacity:0;transform-box:fill-box;transform-origin:50% 100%}
      @keyframes wbsteam{0%{opacity:0;transform:translateY(4px) scaleY(.7)}30%{opacity:.45}100%{opacity:0;transform:translate(6px,-26px) scaleY(1.2)}}
      .wb-blink{animation:wbblink 2.4s steps(1) infinite}@keyframes wbblink{50%{opacity:.15}}
      .wb-sun,.wb-dn{opacity:0}`,
  });
})();
