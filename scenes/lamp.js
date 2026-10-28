// Night, a small room. The kid sits on a chair too big for him, feet not reaching the floor, with a radio opened up
// under the desk lamp and an old monitor glowing beside it. Moonlight comes through the window bars. The camera moves in,
// cuts to his face in the screen's light, then drifts into the glow.
(() => {
  const {C, rng, keys, span, n1, beam, pool, dust, fig} = K;
  const FLOOR = 770, DESK = 612, KS = 1.95, KX = 668;   // floor and desk-top lines, board units per cm, where he sits
  // the close-up: his head and shoulders, scaled from the bust's centimetres; it pushes in towards the screen at the right
  const BUST = FIG.bust({up: -6}, 23), BX = 1010, BY = 600, BS = 8, EX = BX + BUST.eye.x * BS;
  const push = p => keys(p, [[.46, 1.05], [.84, 1.11], [1, 1.8]]);
  const drift = p => keys(p, [[.46, 30], [.84, 0], [1, -140]]);
  const tall = () => innerWidth < innerHeight;

  // smoke curling off the soldering iron's tip
  const wisps = (x, y) => [0, 1, 2].map(i => `<path class="lp-wisp" style="animation-delay:-${i * 1.9}s" d="M${x} ${y}c-6 -14 8 -22 0 -36s8 -24 -2 -40" fill="none" stroke="${C.b7}" stroke-width="2.2" stroke-linecap="round" filter="url(#b1)"/>`).join('');

  // the room, drawn at night
  function room(r) {
    // back wall with soft plaster stains, skirting, tiled floor
    let wall = `<linearGradient id="lpWall" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${FLOOR}"><stop offset="0" stop-color="#041d45"/><stop offset=".6" stop-color="${C.b1}"/><stop offset="1" stop-color="${C.b2}"/></linearGradient>
      <rect x="-500" y="-300" width="2700" height="${FLOOR + 300}" fill="url(#lpWall)"/>`;
    for (let i = 0; i < 9; i++) wall += `<ellipse cx="${n1(r() * 1700 - 50)}" cy="${n1(120 + r() * 520)}" rx="${n1(60 + r() * 140)}" ry="${n1(40 + r() * 90)}" fill="${r() < .5 ? C.b0 : C.b2}" opacity=".35" filter="url(#b30)"/>`;
    // a planet poster, a calendar, the switchboard with its wire
    wall += `<g transform="translate(770 190)"><rect width="150" height="196" fill="${C.b2}"/><rect x="7" y="7" width="136" height="182" fill="#041d45"/>
        <circle cx="76" cy="92" r="40" fill="${C.b4}"/><ellipse cx="76" cy="92" rx="66" ry="12" fill="none" stroke="${C.b6}" stroke-width="3" transform="rotate(-16 76 92)"/>
        <path d="M36 96A40 40 0 0 0 116 88" fill="${C.b3}" opacity=".7"/>${Array.from({length: 14}, () => `<circle cx="${n1(12 + r() * 126)}" cy="${n1(12 + r() * 170)}" r="${n1(.7 + r() * 1.3)}" fill="${C.w}"/>`).join('')}
        <rect x="18" y="160" width="70" height="6" fill="${C.b4}"/><rect x="18" y="172" width="44" height="4" fill="${C.b3}"/></g>
      <g transform="translate(1440 214)"><rect width="104" height="128" fill="${C.b6}" opacity=".85"/><rect y="0" width="104" height="30" fill="${C.b4}"/>
        ${Array.from({length: 20}, (_, i) => `<rect x="${8 + (i % 5) * 19}" y="${40 + Math.floor(i / 5) * 21}" width="13" height="13" fill="${C.b5}" opacity=".7"/>`).join('')}<circle cx="52" cy="-6" r="3" fill="${C.b3}"/></g>
      <g transform="translate(1356 470)"><rect width="66" height="44" rx="3" fill="${C.b4}"/>${[10, 24, 38].map(x => `<rect x="${x}" y="10" width="8" height="12" rx="1.5" fill="${C.b7}"/>`).join('')}
        <circle cx="52" cy="22" r="7" fill="${C.b3}"/><circle cx="49.5" cy="20" r="1.4" fill="${C.b1}"/><circle cx="54.5" cy="20" r="1.4" fill="${C.b1}"/></g>
      <path d="M1400 514C1398 560 1350 572 1290 590" fill="none" stroke="${C.b0}" stroke-width="3"/>
      <rect x="-500" y="${FLOOR - 16}" width="2700" height="16" fill="${C.b2}"/>`;
    // shelf above the desk: books, a cassette player, a box of parts
    let shelf = `<rect x="1060" y="300" width="370" height="10" fill="${C.b3}"/><rect x="1060" y="310" width="370" height="4" fill="#041d45"/>
      <path d="M1090 314l14 22M1400 314l-14 22" stroke="${C.b2}" stroke-width="5"/>`;
    let bx = 1072;
    for (let i = 0; i < 11; i++) { const w = 9 + r() * 9, h = 40 + r() * 34, lean = i === 6 ? -12 : 0;
      shelf += `<rect x="${n1(bx)}" y="${n1(300 - h)}" width="${n1(w)}" height="${n1(h)}" fill="${[C.b3, C.b4, C.b2][i % 3]}" transform="rotate(${lean} ${n1(bx)} 300)"/><rect x="${n1(bx + 2)}" y="${n1(300 - h + 8)}" width="${n1(w - 4)}" height="3" fill="${C.b5}" opacity=".5"/>`;
      bx += w + 1.5 + (i === 6 ? 8 : 0); }
    shelf += `<rect x="1262" y="252" width="96" height="48" rx="5" fill="${C.b3}"/><circle cx="1284" cy="276" r="13" fill="${C.b2}"/><circle cx="1336" cy="276" r="13" fill="${C.b2}"/>
      <circle cx="1284" cy="276" r="5" fill="${C.b4}"/><circle cx="1336" cy="276" r="5" fill="${C.b4}"/><rect x="1300" y="258" width="20" height="10" fill="${C.b5}" opacity=".6"/>
      <rect x="1370" y="266" width="50" height="34" fill="${C.b2}"/><path d="M1376 266l10 -14M1392 266l2 -18M1404 266l8 -12" stroke="${C.b5}" stroke-width="2"/>`;
    // the window: moon, a neighbour's roof and water tank, iron bars, a curtain tied back
    const win = `<g><rect x="316" y="288" width="268" height="290" fill="${C.b2}"/>
      <linearGradient id="lpNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.b2}"/><stop offset="1" stop-color="${C.b4}"/></linearGradient>
      <rect x="330" y="300" width="240" height="264" fill="url(#lpNight)"/>
      <circle cx="510" cy="350" r="70" fill="url(#gGlow)" opacity=".55"/><circle cx="510" cy="350" r="19" fill="${C.w}"/>
      ${Array.from({length: 12}, () => `<circle cx="${n1(340 + r() * 220)}" cy="${n1(306 + r() * 150)}" r="${n1(.6 + r())}" fill="${C.w}" opacity=".8"/>`).join('')}
      <path d="M330 500H420V478H470V510H520V488H570V564H330Z" fill="${C.b1}"/><rect x="430" y="462" width="24" height="18" rx="3" fill="${C.b1}"/>
      <circle cx="372" cy="476" r="26" fill="${C.b1}"/><circle cx="350" cy="490" r="20" fill="${C.b1}"/>
      ${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${352 + i * 37}" y="300" width="5" height="264" fill="${C.b1}"/>`).join('')}
      <rect x="330" y="424" width="240" height="6" fill="${C.b1}"/>
      <rect x="306" y="576" width="288" height="12" fill="${C.b3}"/><rect x="306" y="576" width="288" height="3" fill="${C.b5}" opacity=".6"/>
      <path d="M300 270C318 360 296 470 322 584L346 584C336 470 352 360 332 270Z" fill="${C.b3}"/><path d="M314 276C326 360 312 470 330 580" stroke="${C.b4}" stroke-width="3" fill="none"/>
      <rect x="290" y="262" width="320" height="8" rx="4" fill="${C.b3}"/></g>`;
    // moonlight: a faint shaft from the window, and the barred patch it leaves on the floor
    let moon = `<path d="M330 300L570 300L700 ${FLOOR + 110}L280 ${FLOOR + 110}Z" fill="${C.b6}" opacity=".07" filter="url(#b16)"/>
      <g opacity=".38" filter="url(#b3)"><path d="M300 ${FLOOR + 20}L560 ${FLOOR + 20}L640 ${FLOOR + 110}L250 ${FLOOR + 110}Z" fill="${C.b6}"/>`;
    for (let i = 0; i < 6; i++) moon += `<path d="M${336 + i * 40} ${FLOOR + 20}L${348 + i * 40} ${FLOOR + 20}L${358 + i * 52} ${FLOOR + 110}L${344 + i * 52} ${FLOOR + 110}Z" fill="${C.b1}"/>`;
    moon += `</g>`;
    // the floor: mosaic tiles in perspective, glints of the lamp and the screen
    let floor = `<rect x="-500" y="${FLOOR}" width="2700" height="400" fill="#041d45"/>`;
    for (let i = -14; i <= 14; i++) floor += `<path d="M${800 + i * 70} ${FLOOR}L${800 + i * 150} ${FLOOR + 260}" stroke="${C.b2}" stroke-width="1.2" opacity=".6"/>`;
    for (const y of [FLOOR + 22, FLOOR + 56, FLOOR + 104]) floor += `<path d="M-500 ${y}H2200" stroke="${C.b2}" stroke-width="1.2" opacity=".6"/>`;
    floor += `<ellipse cx="900" cy="${FLOOR + 40}" rx="300" ry="30" fill="${C.b4}" opacity=".25" filter="url(#b16)"/><ellipse cx="1110" cy="${FLOOR + 36}" rx="160" ry="20" fill="${C.b6}" opacity=".18" filter="url(#b16)"/>`;
    return {wall: wall + shelf + win, moon, floor};
  }

  // furniture and things on the desk
  function desk(r) {
    const top = DESK;
    // the chair he sits on, too tall for him
    const chair = `<g fill="${C.b2}" transform="translate(${KX - 620} 0)"><path d="M552 ${top - 156}L568 ${top - 156}L574 ${top + 86}L560 ${top + 86}Z"/><rect x="548" y="${top - 162}" width="28" height="12" rx="4" fill="${C.b3}"/>
      <path d="M556 ${top - 110}H574M557 ${top - 70}H575" stroke="${C.b3}" stroke-width="5"/>
      <rect x="556" y="${top + 72}" width="112" height="12" rx="3" fill="${C.b3}"/><path d="M564 ${top + 84}L558 ${FLOOR}M656 ${top + 84}L662 ${FLOOR}" stroke="${C.b2}" stroke-width="9"/>
      <path d="M561 ${top + 130}H659" stroke="${C.b2}" stroke-width="5"/></g>`;
    // desk with a drawer
    const table = `<g><path d="M680 ${top - 14}L1350 ${top - 14}L1336 ${top}L694 ${top}Z" fill="${C.b4}"/><rect x="690" y="${top}" width="650" height="18" fill="${C.b2}"/>
      <rect x="690" y="${top + 18}" width="650" height="34" fill="#041d45"/><rect x="980" y="${top + 24}" width="170" height="22" rx="2" fill="${C.b1}"/><rect x="1056" y="${top + 32}" width="18" height="5" rx="2" fill="${C.b4}"/>
      <rect x="700" y="${top + 52}" width="16" height="${FLOOR - top - 52}" fill="${C.b1}"/><rect x="1314" y="${top + 52}" width="16" height="${FLOOR - top - 52}" fill="${C.b1}"/></g>`;
    // the radio with its back off: board, parts, speaker, antenna
    let radio = `<g transform="translate(756 ${top - 14})"><path d="M120 -48L138 -112" stroke="${C.b5}" stroke-width="2.4" stroke-linecap="round"/><circle cx="138" cy="-112" r="3" fill="${C.b6}"/>
      <rect x="0" y="-50" width="132" height="50" rx="7" fill="${C.b3}"/><rect x="6" y="-44" width="120" height="38" rx="3" fill="${C.b2}"/>
      <rect x="10" y="-41" width="84" height="32" fill="${C.b4}"/>`;
    for (let i = 0; i < 16; i++) radio += r() < .5 ? `<rect x="${n1(14 + r() * 72)}" y="${n1(-38 + r() * 24)}" width="${n1(4 + r() * 6)}" height="3" rx="1" fill="${r() < .5 ? C.b6 : C.b7}"/>`
      : `<circle cx="${n1(16 + r() * 70)}" cy="${n1(-34 + r() * 22)}" r="${n1(1.6 + r() * 2.2)}" fill="${r() < .5 ? C.b6 : C.b5}"/>`;
    radio += `<path d="M20 -12C40 -30 60 -6 86 -28" stroke="${C.b6}" stroke-width="1.2" fill="none"/>
      <circle cx="110" cy="-25" r="13" fill="${C.b1}"/><circle cx="110" cy="-25" r="9" fill="none" stroke="${C.b3}" stroke-width="1.5"/><circle cx="110" cy="-25" r="3" fill="${C.b4}"/>
      <path d="M-4 -2L10 -66L136 -60L140 -4" fill="none" stroke="${C.b3}" stroke-width="0"/></g>
      <path d="M752 ${top - 14}L742 ${top - 76}L836 ${top - 70}" fill="none" stroke="none"/>
      <rect x="704" y="${top - 70}" width="44" height="56" rx="4" fill="${C.b3}" transform="rotate(-14 726 ${top - 14})"/>`;
    // soldering iron resting in its coil, tip glowing; a screwdriver; a few loose screws
    let iron = `<g><ellipse cx="928" cy="${top - 15}" rx="24" ry="5" fill="${C.b1}"/>`;
    for (let i = 0; i < 6; i++) iron += `<ellipse cx="${926 + i * 4}" cy="${top - 22 - i * 7}" rx="9" ry="3.6" fill="none" stroke="${C.b5}" stroke-width="1.6"/>`;
    iron += `<path d="M960 ${top - 66}L900 ${top - 34}" stroke="${C.b4}" stroke-width="9" stroke-linecap="round"/><path d="M900 ${top - 34}L884 ${top - 26}" stroke="${C.b6}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="883" cy="${top - 26}" r="7" fill="url(#gGlow)"/><circle cx="883" cy="${top - 26}" r="2" fill="${C.w}"/>
      <path d="M960 ${top - 66}C990 ${top - 80} 1000 ${top - 20} 1030 ${top - 16}" stroke="${C.b0}" stroke-width="2.4" fill="none"/></g>
      <g><path d="M790 ${top - 9}L842 ${top - 6}" stroke="${C.b6}" stroke-width="2.4" stroke-linecap="round"/><path d="M842 ${top - 6}L868 ${top - 5}" stroke="${C.b4}" stroke-width="6" stroke-linecap="round"/></g>
      ${[0, 1, 2, 3].map(i => `<circle cx="${n1(800 + r() * 120)}" cy="${n1(top - 4 - r() * 6)}" r="1.8" fill="${C.b6}"/>`).join('')}`;
    // anglepoise lamp leaning over the radio
    const lamp = `<g><ellipse cx="970" cy="${top - 15}" rx="30" ry="6" fill="${C.b2}"/><rect x="964" y="${top - 26}" width="12" height="12" fill="${C.b3}"/>
      <path d="M970 ${top - 22}L998 ${top - 150}L912 ${top - 186}" fill="none" stroke="${C.b3}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="998" cy="${top - 150}" r="6" fill="${C.b4}"/><path d="M984 ${top - 100}L1012 ${top - 120}" stroke="${C.b2}" stroke-width="2"/>
      <g transform="translate(906 ${top - 186}) rotate(28)"><path d="M-30 0L30 0L18 -30L-18 -30Z" fill="${C.b3}"/><path d="M-18 -30L18 -30" stroke="${C.b5}" stroke-width="3"/>
      <ellipse cx="0" cy="1" rx="31" ry="7" fill="${C.b7}"/><circle cx="0" cy="3" r="9" fill="${C.w}"/></g></g>`;
    // the old monitor, turned three-quarters towards him and us, a paint drawing on screen; keyboard and a mug of pens
    const crt = `<g><path d="M1112 ${top - 190}L1250 ${top - 168}L1250 ${top - 44}L1112 ${top - 26}Z" fill="${C.b2}"/>
      <path d="M1112 ${top - 190}L1250 ${top - 168}L1250 ${top - 160}L1112 ${top - 180}Z" fill="${C.b3}"/>
      <path d="M1004 ${top - 204}L1116 ${top - 190}L1116 ${top - 24}L1004 ${top - 20}Z" fill="${C.b4}"/>
      <path d="M1004 ${top - 204}L1116 ${top - 190}L1116 ${top - 184}L1004 ${top - 197}Z" fill="${C.b6}" opacity=".5"/>
      <path d="M1016 ${top - 188}L1104 ${top - 177}L1104 ${top - 52}L1016 ${top - 46}Z" fill="url(#lpScreen)"/>
      <g stroke="${C.b4}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".85">
        <path d="M1032 ${top - 76}L1032 ${top - 104}L1050 ${top - 120}L1068 ${top - 106}L1068 ${top - 78}Z"/><path d="M1046 ${top - 78}V${top - 94}H1054V${top - 79}"/>
        <circle cx="1086" cy="${top - 148}" r="9"/><path d="M1086 ${top - 164}v-5M1100 ${top - 148}h5M1097 ${top - 159}l4 -4M1072 ${top - 159}l-4 -4"/>
        <path d="M1024 ${top - 66}C1050 ${top - 72} 1080 ${top - 64} 1100 ${top - 70}"/></g>
      <path d="M1022 ${top - 182}L1052 ${top - 178}L1028 ${top - 120}Z" fill="${C.w}" opacity=".22"/>
      ${Array.from({length: 26}, (_, i) => `<path d="M1016 ${n1(top - 186 + i * 5.2)}L1104 ${n1(top - 176 + i * 4.8)}" stroke="${C.b5}" stroke-width=".6" opacity=".18"/>`).join('')}
      <path d="M1030 ${top - 20}L1096 ${top - 22}L1110 ${top - 14}L1016 ${top - 14}Z" fill="${C.b3}"/>
      <path d="M906 ${top - 16}L1000 ${top - 18}L1004 ${top - 12}L900 ${top - 11}Z" fill="${C.b4}"/>${Array.from({length: 12}, (_, i) => `<rect x="${910 + i * 7.5}" y="${top - 17}" width="5" height="2.4" fill="${C.b6}" opacity=".7"/>`).join('')}
      <rect x="1268" y="${top - 46}" width="30" height="32" rx="3" fill="${C.b3}"/><path d="M1274 ${top - 46}l-6 -26M1282 ${top - 46}l2 -30M1292 ${top - 46}l8 -22" stroke="${C.b5}" stroke-width="2.4" stroke-linecap="round"/></g>`;
    return {chair, table: table + radio + iron + lamp + crt};
  }

  // what's on the screen, seen nearly side-on: a pale glow and a little paint drawing
  const screenDefs = `<linearGradient id="lpScreen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.b7}"/><stop offset=".55" stop-color="${C.w}"/><stop offset="1" stop-color="${C.b6}"/></linearGradient>`;

  scene('lamp', {
    bg: C.b0,
    layers() {
      const r = rng(41), R = room(r), D = desk(r);
      const top = DESK;
      // the kid: sitting forward, working on the radio, feet dangling
      const kidPose = t => FIG.side({x: 0, y: -50, lean: 20 + t * 2, neck: 30, head: 30 + t * 3,
        legs: [{thigh: 82, knee: 70}, {thigh: 78, knee: 96}],
        arms: [{to: {x: 46 + t * 5, y: -80 - t * 2}}, {to: {x: 38, y: -81}}]}, 'kid', 17).d;
      const kid = fig(kidPose(0), KX, FLOOR, KS, {id: 'lpKid'});
      // glows
      const glow = `<circle cx="1060" cy="${top - 118}" r="380" fill="url(#gGlow)" opacity=".36"/>
        <path d="M884 ${top - 200}L928 ${top - 176}L960 ${top - 8}L770 ${top - 8}Z" fill="${C.w}" opacity=".16" filter="url(#b8)"/>
        ${pool(860, top - 10, 120, 12, .8)}`;
      const L = [
        {z: .55, role: 'room', svg: R.wall},
        {z: .75, role: 'room', svg: R.moon + R.floor},
        {z: .75, role: 'room', html: dust([[330, 300], [570, 300], [690, 860], [290, 860]], 18, 3, .05)},
        {z: 1, role: 'room', svg: screenDefs + D.chair + D.table + kid},
        {z: 1, role: 'room', svg: glow + beam({x: 906, y: top - 186, top: 50, spread: 220, h: 176, o: .5, tilt: -40})},
        {z: 1, role: 'room', svg: wisps(883, top - 30)},
        {z: 1, role: 'room', html: dust([[886, top - 186], [928, top - 186], [970, top - 8], [776, top - 8]], 22, 9, .1)},
        {z: 1.5, role: 'room', cls: 'blur6', svg: `<g><path d="M-60 900L-40 712L250 700L270 900Z" fill="${C.b1}"/><path d="M-40 712L250 700" stroke="${C.b3}" stroke-width="6"/>
          <path d="M40 706C60 650 120 660 110 700M150 702C150 640 210 630 220 690" fill="none" stroke="${C.b4}" stroke-width="8"/><rect x="60" y="676" width="80" height="28" fill="${C.b3}" transform="rotate(-12 100 690)"/></g>
          <path d="M1660 -40C1620 200 1700 380 1600 560" fill="none" stroke="${C.b0}" stroke-width="12"/>`},
      ];
      // the close-up: his head and shoulders in the light of the screen
      const b = BUST;
      const eye = FIG.eye(b.eye, 1.25, 1, b.tilt);
      const cbg = `<linearGradient id="lpCbg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#041d45"/><stop offset=".7" stop-color="${C.b1}"/><stop offset="1" stop-color="${C.b3}"/></linearGradient>
        <rect x="-400" y="-300" width="2600" height="1500" fill="url(#lpCbg)"/>
        <rect x="120" y="120" width="300" height="360" fill="${C.b3}" opacity=".5" filter="url(#b30)"/>
        <path d="M150 140V470M210 140V470M270 140V470M330 140V470M390 140V470" stroke="${C.b1}" stroke-width="10" opacity=".5" filter="url(#b8)"/>
        <rect x="380" y="120" width="420" height="10" fill="${C.b3}" opacity=".4" filter="url(#b8)"/>
        ${[[640, 210, 16], [700, 260, 10], [560, 330, 22], [760, 380, 8], [470, 600, 14]].map(([x, y, rr]) => `<circle cx="${x}" cy="${y}" r="${rr}" fill="${C.b5}" opacity=".25" filter="url(#b3)"/>`).join('')}`;
      const cglow = `<ellipse cx="1640" cy="440" rx="760" ry="620" fill="url(#gGlow)" opacity=".85"/>`;
      const ckid = `<g transform="translate(${BX} ${BY}) scale(${BS})"><path d="${b.d}" filter="url(#fuzzc)" fill="${C.w}"/>${eye}</g>`;
      const cfg = `<path d="M1430 -60L1720 -80L1720 980L1460 980Z" fill="${C.b2}"/><path d="M1452 40L1720 30L1720 860L1470 850Z" fill="${C.b7}" opacity=".95"/>`;
      L.push(
        {z: 0, role: 'close', d: .45, svg: cbg},
        {z: 0, role: 'close', d: .8, svg: cglow},
        {z: 0, role: 'close', d: 1, html: dust([[1040, 60], [1700, 0], [1700, 900], [1040, 860]], 34, 12, .2)},
        {z: 0, role: 'close', d: 1, svg: ckid},
        {z: 0, role: 'close', d: 1.3, cls: 'blur12', svg: cfg},
        {z: 0, role: 'scrim', d: 0, svg: `<linearGradient id="lpScrim" x1="0" y1="0" x2="0" y2="1"><stop offset=".6" stop-color="${C.b0}" stop-opacity="0"/><stop offset=".77" stop-color="${C.b0}" stop-opacity=".78"/><stop offset="1" stop-color="${C.b0}" stop-opacity=".92"/></linearGradient><rect x="-400" y="0" width="2600" height="900" fill="url(#lpScrim)"/>`},
        {z: 0, role: 'white', d: 0, svg: `<rect x="-400" y="-300" width="2600" height="1500" fill="${C.w}"/>`},
      );
      this.roles = L.map(l => l.role); this.depth = L.map(l => l.d || 0);
      this.kidPose = kidPose;
      return L;
    },
    cam: p => ({zoom: keys(p, [[0, 1], [.5, 1.34]]), ox: 860, oy: 560, x: keys(p, [[0, -20], [.5, 30]])}),
    // on a portrait phone the board slides from the desk to his eye as the shot changes
    focus: p => tall() ? K.lerp(740, 1488 + (EX - 1488) * push(p) + drift(p), span(p, .44, .56)) : 740,
    frame(p, st, s) {
      const cut = span(p, .46, .56);                       // wide shot -> close-up
      const pu = push(p), dr = drift(p), t = tall();
      s.layers.forEach((L, i) => {
        const role = this.roles[i], n = L.node;
        if (role === 'room') { n.style.opacity = (1 - cut).toFixed(3); return; }
        n.style.transform = 'none';
        if (role === 'white') { n.style.opacity = (span(p, .88, 1) * .9).toFixed(3); return; }
        if (role === 'scrim') { n.style.opacity = (t ? cut : 0).toFixed(3); return; }   // shade his shoulders under the words on phones
        const d = this.depth[i];
        n.style.transformOrigin = '93% 50%';
        n.style.transform = `translate3d(${n1(dr * d / 16)}%,0,0) scale(${(1 + (pu - 1) * d).toFixed(4)})`;
        n.style.opacity = cut.toFixed(3);
      });
      const kid = st.querySelector('#lpKid path');
      if (kid && cut < 1) kid.setAttribute('d', this.kidPose(Math.sin(p * 40) * .5 + .5));
    },
    css: `.lp-wisp{animation:lpwisp 5.7s ease-in infinite;opacity:0;transform-box:fill-box;transform-origin:50% 100%}
      @keyframes lpwisp{0%{opacity:0;transform:translateY(6px) scaleY(.6)}25%{opacity:.5}100%{opacity:0;transform:translate(10px,-34px) scaleY(1.3)}}`,
  });
})();
