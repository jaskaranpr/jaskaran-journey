// Inside the screen. A poster he might have made as a teenager, pulled apart into its Photoshop layers and turned in
// space: background, light, the village, himself, and the title jaskaran.psd. Then the layers fold back together and the
// poster drops into a video editor, where the clips slide under the playhead.
(() => {
  const {C, rng, keys, span, n1, dust} = K;
  const PW = 420, PH = 560, PX = 1110, PY = 450;          // the poster's size and centre on the board
  const pc = (v, of) => `${n1(v / of * 100)}%`;

  // ---- the poster, one layer at a time (each drawn on a 420 x 560 sheet) ----
  function sheets() {
    const r = rng(7);
    const bg = `<linearGradient id="lyBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.b0}"/><stop offset=".55" stop-color="${C.b2}"/><stop offset="1" stop-color="${C.b4}"/></linearGradient>
      <rect width="${PW}" height="${PH}" fill="url(#lyBg)"/><circle cx="300" cy="170" r="260" fill="${C.b3}" opacity=".55" filter="url(#b30)"/>`;
    let light = `<circle cx="300" cy="160" r="150" fill="url(#gGlow)" opacity=".75"/><circle cx="300" cy="160" r="46" fill="${C.w}"/>
      <circle cx="286" cy="150" r="9" fill="${C.b7}"/><circle cx="314" cy="174" r="6" fill="${C.b7}"/><circle cx="296" cy="182" r="4" fill="${C.b7}"/>`;
    for (let i = 0; i < 5; i++) { const a = (200 + i * 14) * Math.PI / 180;
      light += `<path d="M300 160L${n1(300 + Math.cos(a - .04) * 600)} ${n1(160 - Math.sin(a - .04) * -600)}L${n1(300 + Math.cos(a + .04) * 600)} ${n1(160 - Math.sin(a + .04) * -600)}Z" fill="${C.w}" opacity=".05"/>`; }
    for (let i = 0; i < 40; i++) light += `<circle cx="${n1(r() * PW)}" cy="${n1(r() * 300)}" r="${n1(.5 + r() * 1.3)}" fill="${C.w}" opacity="${n1(.3 + r() * .6)}"/>`;
    let town = `<path d="M0 ${PH}V470` ;
    for (let x = 0; x <= PW; x += 14) town += `L${x} ${n1(468 - r() * 14)}`;
    town += `V${PH}Z" fill="${C.b1}"/>`;
    for (let i = 0; i < 9; i++) { const x = 20 + i * 12 + r() * 4, h = 60 + r() * 30; town += `<ellipse cx="${n1(x)}" cy="${n1(470 - h * .5)}" rx="${n1(5 + r() * 2)}" ry="${n1(h * .5)}" fill="${C.b1}"/>`; }
    town += `<g fill="${C.b1}"><path d="M300 470L306 412M330 470L324 412" stroke="${C.b1}" stroke-width="3"/><rect x="292" y="392" width="46" height="24" rx="4"/>
      <path d="M352 470V436H404V470Z"/><path d="M362 436Q378 404 394 436Z"/><path d="M378 412V400" stroke="${C.b1}" stroke-width="2"/></g>`;
    const me = FIG.bust({up: -22}, 31);
    const self = `<g transform="translate(176 548) scale(3.3)"><path d="${me.d}" filter="url(#fuzzc)" fill="${C.w}"/>${FIG.eye(me.eye, 1.25, 1, me.tilt)}</g>`;
    let title = `<text x="210" y="96" text-anchor="middle" font-family="Figtree, sans-serif" font-weight="600" font-size="50" letter-spacing="-1" fill="${C.w}">jaskaran.psd</text>
      <path d="M150 120H270" stroke="${C.b6}" stroke-width="1.5" opacity=".7"/>`;
    for (const [x, y, s] of [[92, 60, 1], [336, 46, .7], [360, 120, .5], [70, 140, .6]])
      title += `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -10L2 -2L10 0L2 2L0 10L-2 2L-10 0L-2 -2Z" fill="${C.w}"/>`;
    return [
      {name: 'Background', svg: bg, solid: true, thumb: C.b2},
      {name: 'Moonlight', svg: light, thumb: C.b6},
      {name: 'Village', svg: town, thumb: C.b1},
      {name: 'Me', svg: self, thumb: C.w},
      {name: 'Title', svg: title, thumb: C.b5},
    ];
  }

  // ---- little films for the editor: each is a 160 x 90 frame ----
  const kid = FIG.side({x: 0, y: -66, lean: 22, neck: 12, head: 2, legs: [{thigh: 60, knee: 80}, {thigh: 100, knee: 60}], arms: [{upper: 60, elbow: 30}, {upper: 54, elbow: 34}]}, 'kid', 13).d;
  const films = [
    // the poster, pillarboxed
    `<rect width="160" height="90" fill="${C.b0}"/><rect x="46" width="68" height="90" fill="${C.b2}"/><circle cx="96" cy="26" r="9" fill="${C.w}"/>
     <rect x="46" y="78" width="68" height="12" fill="${C.b1}"/><text x="80" y="17" text-anchor="middle" font-family="Figtree, sans-serif" font-weight="600" font-size="8" fill="${C.w}">jaskaran.psd</text>
     <path d="M66 90C66 70 74 64 80 64C88 64 92 70 94 90Z" fill="${C.w}"/><circle cx="80" cy="58" r="8" fill="${C.w}"/>`,
    // a ride at dawn
    `<linearGradient id="lyF1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.b3}"/><stop offset=".62" stop-color="${C.b6}"/><stop offset=".63" stop-color="${C.b4}"/><stop offset="1" stop-color="${C.b2}"/></linearGradient>
     <rect width="160" height="90" fill="url(#lyF1)"/><circle cx="118" cy="56" r="7" fill="${C.w}"/><circle cx="118" cy="56" r="20" fill="${C.w}" opacity=".18"/>
     ${[20, 26, 31, 36].map(x => `<ellipse cx="${x}" cy="48" rx="2.4" ry="9" fill="${C.b3}"/>`).join('')}
     <g transform="translate(60 76) scale(.34)"><circle cx="0" cy="-28" r="26" fill="none" stroke="${C.w}" stroke-width="4"/><circle cx="98" cy="-28" r="26" fill="none" stroke="${C.w}" stroke-width="4"/>
     <path d="M0 -28L36 -26L28 -66L84 -68L98 -28M36 -26L84 -68" fill="none" stroke="${C.w}" stroke-width="4"/><path d="${kid}" transform="translate(24 -8)" fill="${C.w}"/></g>`,
    // the lamp at night
    `<rect width="160" height="90" fill="${C.b0}"/><rect x="18" y="16" width="34" height="38" fill="${C.b2}"/><circle cx="42" cy="24" r="4" fill="${C.w}"/>
     <path d="M92 26L106 26L130 76L72 76Z" fill="${C.w}" opacity=".18"/><path d="M90 26L108 26L104 20L94 20Z" fill="${C.b5}"/>
     <rect x="40" y="76" width="110" height="5" fill="${C.b3}"/><rect x="118" y="50" width="26" height="26" fill="${C.b6}"/><circle cx="60" cy="60" r="7" fill="${C.w}"/><path d="M54 68Q60 64 70 66L76 76H50Z" fill="${C.w}"/>`,
    // birds over the fields
    `<linearGradient id="lyF3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.b5}"/><stop offset="1" stop-color="${C.b7}"/></linearGradient>
     <rect width="160" height="90" fill="url(#lyF3)"/><ellipse cx="50" cy="30" rx="30" ry="4" fill="${C.w}" opacity=".7"/><ellipse cx="120" cy="44" rx="26" ry="3" fill="${C.w}" opacity=".6"/>
     <rect y="72" width="160" height="18" fill="${C.b4}"/>${[[70, 40], [80, 36], [88, 42], [98, 34], [106, 40]].map(([x, y]) => `<path d="M${x - 4} ${y}Q${x - 2} ${y - 3} ${x} ${y}Q${x + 2} ${y - 3} ${x + 4} ${y}" stroke="${C.b1}" stroke-width="1.2" fill="none"/>`).join('')}`,
    // a face in profile, looking up
    `<rect width="160" height="90" fill="${C.b2}"/><circle cx="130" cy="18" r="30" fill="${C.b4}" opacity=".6"/>
     <path d="M40 90C40 70 56 64 64 62L66 52C58 50 54 40 58 30C62 18 80 14 90 22C98 28 100 38 96 46L102 52L96 56L98 64C110 66 120 74 122 90Z" fill="${C.w}"/>`,
  ];
  const CLIPS = [[0, 250], [258, 470], [478, 700], [708, 930], [938, 1180]];     // where each film sits on the timeline

  scene('layers', {
    bg: C.b0,
    focus: p => innerWidth < innerHeight ? keys(p, [[.6, PX], [.72, 800]]) : 800,
    layers() {
      const r = rng(19), S = sheets();
      // the workspace: dark, a faint dotted grid, a soft light behind the poster
      let bg = `<radialGradient id="lyWs" cx=".62" cy=".48" r=".7"><stop offset="0" stop-color="${C.b2}"/><stop offset=".6" stop-color="${C.b1}"/><stop offset="1" stop-color="${C.b0}"/></radialGradient>
        <rect x="-400" y="-300" width="2600" height="1500" fill="url(#lyWs)"/>`;
      for (let x = -360; x < 2000; x += 40) for (let y = -280; y < 1180; y += 40) if (r() < .5) bg += `<circle cx="${x}" cy="${y}" r="1.1" fill="${C.b4}" opacity=".35"/>`;
      // pixels drifting in front, out of focus
      let px = '';
      for (let i = 0; i < 22; i++) { const s = 10 + r() * 34; px += `<rect x="${n1(r() * 1800 - 100)}" y="${n1(r() * 1000 - 50)}" width="${n1(s)}" height="${n1(s)}" fill="${r() < .6 ? C.b4 : C.b6}" opacity="${n1(.12 + r() * .25)}" transform="rotate(${n1(r() * 40 - 20)})"/>`; }
      // the poster's layers, stacked in 3D
      const stack = S.map((L, i) => `<div class="ly-sheet${L.solid ? ' solid' : ''}${i === 4 ? ' top' : ''}" style="--i:${i}"><i class="h"></i><i class="h"></i><i class="h"></i><i class="h"></i>` +
        `<svg viewBox="0 0 ${PW} ${PH}" preserveAspectRatio="none">${L.svg}</svg></div>`).join('');
      const poster = `<div class="ly-wrap" style="left:${pc(PX - PW / 2, 1600)};top:${pc(PY - PH / 2, 900)};width:${pc(PW, 1600)};height:${pc(PH, 900)}"><div class="ly-stack">${stack}</div></div>`;
      // the layers panel, as a white card
      const eyeIcon = `<svg viewBox="0 0 24 24"><path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>`;
      const panel = `<div class="ly-panel" style="left:${pc(1280, 1600)};top:${pc(96, 900)};width:${pc(200, 1600)}"><header><b>Layers</b><span>jaskaran.psd</span></header>` +
        S.slice().reverse().map((L, k) => `<p class="ly-row" data-i="${4 - k}">${eyeIcon}<i style="background:${L.thumb}"></i>${L.name}</p>`).join('') + `</div>`;
      // the editor: a viewer on top, tracks below, the playhead in the middle
      const viewer = `<div class="ly-viewer" style="left:${pc(520, 1600)};top:${pc(110, 900)};width:${pc(560, 1600)};height:${pc(315, 900)}">` +
        films.map((f, i) => `<svg class="ly-film" data-i="${i}" viewBox="0 0 160 90" preserveAspectRatio="none">${f.replace(/id="lyF(\d)"/g, 'id="lyV$1"').replace(/url\(#lyF(\d)\)/g, 'url(#lyV$1)')}</svg>`).join('') + `</div>`;
      let tracks = `<g class="ly-ruler">`;
      for (let x = 0; x < 1400; x += 20) tracks += `<path d="M${x} 0V${x % 100 ? 6 : 12}" stroke="${C.b5}" stroke-width="1"/>` + (x % 200 ? '' : `<text x="${x + 4}" y="22" font-family="Figtree, sans-serif" font-size="11" fill="${C.b5}">00:00:${String(x / 50).padStart(2, '0')}</text>`);
      tracks += `</g>`;
      CLIPS.forEach(([a, b], i) => {
        tracks += `<g transform="translate(${a} 80)"><rect width="${b - a}" height="62" rx="8" fill="${[C.b4, C.b3][i % 2]}"/><rect x="1" y="1" width="${b - a - 2}" height="60" rx="7" fill="none" stroke="${C.b6}" stroke-opacity=".35"/>` +
          `<svg x="6" y="6" width="88" height="50" viewBox="0 0 160 90">${films[i].replace(/id="lyF(\d)"/g, `id="lyT$1_${i}"`).replace(/url\(#lyF(\d)\)/g, `url(#lyT$1_${i})`)}</svg>` +
          `<svg x="96" y="6" width="${b - a - 102}" height="50" viewBox="0 0 160 90" preserveAspectRatio="xMinYMid slice" opacity=".55">${films[i].replace(/id="lyF(\d)"/g, `id="lyU$1_${i}"`).replace(/url\(#lyF(\d)\)/g, `url(#lyU$1_${i})`)}</svg></g>`;
      });
      for (const [a, w, label] of [[120, 150, 'Title'], [520, 120, 'Fade'], [860, 170, 'Title']])
        tracks += `<g transform="translate(${a} 40)"><rect width="${w}" height="30" rx="7" fill="${C.b5}"/><text x="10" y="20" font-family="Figtree, sans-serif" font-weight="600" font-size="12" fill="${C.ink}">${label}</text></g>`;
      let wave = '';
      for (let x = 0; x < 1300; x += 5) { const h = 4 + 22 * Math.abs(Math.sin(x * .021) * Math.sin(x * .0053 + 1) + .3 * Math.sin(x * .17)); wave += `M${x} ${n1(184 - h)}V${n1(184 + h)}`; }
      tracks += `<rect x="0" y="152" width="1180" height="64" rx="8" fill="${C.b1}"/><path d="${wave}" stroke="${C.b6}" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>`;
      const editor = `<g class="ly-tl"><rect x="-400" y="488" width="2400" height="250" fill="${C.b0}" opacity=".55"/>
        <g id="lyTracks" transform="translate(560 500)">${tracks}</g>
        <path d="M800 492V736" stroke="${C.w}" stroke-width="2.5"/><path d="M788 486H812V500L800 510L788 500Z" fill="${C.w}"/>
        <g transform="translate(800 470)"><rect x="-54" y="-17" width="108" height="26" rx="13" fill="${C.w}"/><text id="lyTc" x="0" y="1" text-anchor="middle" font-family="Figtree, sans-serif" font-weight="600" font-size="13" fill="${C.ink}">00:00:00:00</text></g></g>`;
      const cursor = `<g id="lyCur"><path d="M0 0V26L7 19L12 30L17 28L12 17H22Z" fill="${C.w}" stroke="${C.ink}" stroke-width="1.6" stroke-linejoin="round"/></g>`;
      return [
        {z: .3, svg: bg},
        {z: .6, html: dust([[400, 0], [1700, 0], [1700, 900], [400, 900]], 30, 4, .25)},
        {z: 1, html: viewer + poster + panel},
        {z: 1, svg: editor + cursor},
        {z: 1.6, cls: 'blur6', svg: px},
      ];
    },
    cam: p => ({zoom: keys(p, [[0, 1.04], [.6, 1], [1, 1.03]]), x: keys(p, [[0, 10], [.6, -10], [1, 0]]), ox: 900}),
    init(st) {
      this.el = {
        wrap: st.querySelector('.ly-wrap'), panel: st.querySelector('.ly-panel'), rows: [...st.querySelectorAll('.ly-row')],
        viewer: st.querySelector('.ly-viewer'), films: [...st.querySelectorAll('.ly-film')], tl: st.querySelector('.ly-tl'),
        tracks: st.querySelector('#lyTracks'), tc: st.querySelector('#lyTc'), cur: st.querySelector('#lyCur'),
      };
    },
    frame(p) {
      const e = this.el;
      if (!e) return;
      const open = span(p, .05, .3), shut = span(p, .56, .65), f = open * (1 - shut);       // how far apart the layers are
      const lift = span(p, .38, .48) * (1 - shut);                                       // the title steps forward for its line
      const fly = span(p, .62, .74);                                                    // the poster drops into the viewer
      const w = e.wrap.style;
      w.setProperty('--gap', n1(72 * f));
      w.setProperty('--ry', n1(-30 * f) + 'deg');
      w.setProperty('--rx', n1(13 * f) + 'deg');
      w.setProperty('--lift', n1(60 * lift));
      w.setProperty('--chk', (f * .9).toFixed(3));
      // phones: a smaller poster, lower down, so the words above it stay clear
      const tall = innerWidth < innerHeight, dy = tall ? 130 : 0, s0 = tall ? .72 : 1;
      w.setProperty('--tx', n1((800 - PX) * fly));
      w.setProperty('--ty', n1(dy * (1 - fly) + (267.5 - PY) * fly));
      w.setProperty('--sc', (s0 + (315 / PH - s0) * fly).toFixed(4));
      w.opacity = (1 - span(p, .72, .78)).toFixed(3);
      // panel: rows light up as their layer lifts away, then the title row for its line
      e.panel.style.opacity = (span(p, .1, .2) * (1 - span(p, .56, .62))).toFixed(3);
      const on = lift > .5 ? 4 : Math.min(4, Math.floor(open * 5.2));
      e.rows.forEach(rw => rw.classList.toggle('on', +rw.dataset.i === on));
      // the editor slides in, then the clips run under the playhead
      const ed = span(p, .64, .76), run = keys(p, [[.74, 0], [1, 1000]]);
      e.viewer.style.opacity = ed.toFixed(3);
      e.tl.style.opacity = ed.toFixed(3);
      e.tl.style.transform = `translateY(${n1((1 - ed) * 60)}px)`;
      e.tracks.setAttribute('transform', `translate(${n1(560 - run)} 500)`);
      const at = 240 + run, clip = CLIPS.findIndex(([a, b]) => at >= a && at < b + 8);
      const landed = span(p, .72, .76);                                                 // the first film shows once the poster has landed
      e.films.forEach(fm => fm.style.opacity = +fm.dataset.i === Math.max(0, clip) ? (clip > 0 ? 1 : landed) : 0);
      const fr = Math.floor(at / 50 * 24), z2 = v => String(v).padStart(2, '0');
      e.tc.textContent = `00:00:${z2(Math.floor(fr / 24))}:${z2(fr % 24)}`;
      // a pointer drags the title forward, then scrubs the timeline
      const cx = keys(p, [[0, 1500], [.3, 1290], [.42, 1110], [.6, 1130], [.72, 1300], [.8, 860], [1, 820]]);
      const cy = keys(p, [[0, 980], [.3, 330], [.42, 250], [.6, 260], [.72, 420], [.8, 560], [1, 600]]);
      e.cur.setAttribute('transform', `translate(${n1(cx)} ${n1(cy)})`);
    },
    css: `.ly-wrap{position:absolute;perspective:calc(1700px*var(--S));--gap:0;--ry:0deg;--rx:0deg;--lift:0;--chk:0;--tx:0;--ty:0;--sc:1}
      .ly-stack{position:absolute;inset:0;transform-style:preserve-3d;transform:translate(calc(var(--tx)*1px*var(--S)),calc(var(--ty)*1px*var(--S))) scale(var(--sc)) rotateY(var(--ry)) rotateX(var(--rx))}
      .ly-sheet{position:absolute;inset:0;overflow:hidden;transform:translateZ(calc(var(--i)*var(--gap)*1px*var(--S)));outline:1px solid rgba(253,253,253,calc(var(--chk)*.55))}
      .ly-sheet.top{transform:translateZ(calc((var(--i)*var(--gap) + var(--lift))*1px*var(--S)));filter:drop-shadow(0 0 calc(var(--lift)*.25px*var(--S)) rgba(214,233,246,.8))}
      .ly-sheet:not(.solid)::before{content:"";position:absolute;inset:0;opacity:var(--chk);background:repeating-conic-gradient(rgba(214,233,246,.16) 0 25%,rgba(214,233,246,.03) 0 50%) 0 0/calc(22px*var(--S)) calc(22px*var(--S))}
      .ly-sheet svg{position:absolute;inset:0;width:100%;height:100%}
      .ly-sheet .h{position:absolute;width:calc(9px*var(--S));height:calc(9px*var(--S));background:#fdfdfd;opacity:var(--chk);z-index:2}
      .ly-sheet .h:nth-child(1){left:0;top:0}.ly-sheet .h:nth-child(2){right:0;top:0}.ly-sheet .h:nth-child(3){left:0;bottom:0}.ly-sheet .h:nth-child(4){right:0;bottom:0}
      @media (max-aspect-ratio:1/1){.ly-panel{display:none}}
      .ly-panel{position:absolute;background:#fdfdfd;color:#0b1d44;border-radius:calc(14px*var(--S));padding:calc(10px*var(--S)) 0;font:500 calc(14px*var(--S))/1 Figtree,sans-serif;box-shadow:0 calc(24px*var(--S)) calc(60px*var(--S)) -20px rgba(2,21,51,.7);opacity:0}
      .ly-panel header{display:flex;justify-content:space-between;align-items:baseline;padding:calc(4px*var(--S)) calc(16px*var(--S)) calc(10px*var(--S));border-bottom:1px solid #d6e9f6;margin-bottom:calc(6px*var(--S))}
      .ly-panel header span{font-size:calc(11px*var(--S));opacity:.55}
      .ly-row{display:flex;align-items:center;gap:calc(10px*var(--S));padding:calc(7px*var(--S)) calc(16px*var(--S));transition:background .35s,color .35s}
      .ly-row svg{width:calc(15px*var(--S));height:calc(15px*var(--S));opacity:.6}
      .ly-row i{width:calc(26px*var(--S));height:calc(20px*var(--S));border-radius:calc(3px*var(--S));border:1px solid #aed1ea}
      .ly-row.on{background:#d6e9f6;color:#0b1d44;font-weight:600}
      .ly-viewer{position:absolute;border-radius:calc(12px*var(--S));overflow:hidden;background:#021533;box-shadow:0 0 0 calc(6px*var(--S)) #fdfdfd,0 calc(30px*var(--S)) calc(80px*var(--S)) -30px rgba(2,21,51,.9);opacity:0}
      .ly-film{position:absolute;inset:0;width:100%;height:100%;transition:opacity .25s}`,
  });
})();
