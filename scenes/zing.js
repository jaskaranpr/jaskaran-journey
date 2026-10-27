// Zing Trade. A clean white browser window with a chart; the extension's panel slides in from the side with a
// few strategies, small icons burst out around it like the app shots in the Fold film, and then the apps it
// works inside (Groww, Kite, Upstox, Dhan) drift in and plug into the window one by one.
(() => {
  const {C, rng, keys, span, clamp, n1} = K;
  const WX = 360, WY = 248, WW = 880, WH = 530;                       // the browser window on the board
  const APPS = [['Groww', 196, 318, -1], ['Kite', 168, 470, -1], ['Upstox', 1412, 318, 1], ['Dhan', 1440, 470, 1]];
  const pct = (v, of) => n1(v / of * 1000) / 10 + '%';

  // a morning of prices for the chart on the page
  const DAY = [];
  { const r = rng(9); let v = 50;
    for (let i = 0; i < 48; i++) { const o = v; v += (keys(i / 47, [[0, 50], [.4, 44], [.7, 52], [1, 66]]) - v) * .4 + (r() - .5) * 4.4;
      DAY.push({o, c: v, h: Math.max(o, v) + r() * 2.2 + .4, l: Math.min(o, v) - r() * 2.2 - .4}); } }
  const lo = Math.min(...DAY.map(d => d.l)) - 3, hi = Math.max(...DAY.map(d => d.h)) + 8;
  const gx = i => 14 + i * 10.6, gy = v => 12 + (hi - v) / (hi - lo) * 236;
  const chart = () => {
    let s = '';
    for (let k = 0; k < 5; k++) s += `<path d="M0 ${12 + k * 59}H560" stroke="${C.b7}" stroke-width="1"/>`;
    DAY.forEach((d, i) => {
      const up = d.c >= d.o, col = up ? C.b3 : C.b6, t = gy(Math.max(d.o, d.c)), b = gy(Math.min(d.o, d.c));
      s += `<path d="M${n1(gx(i))} ${n1(gy(d.h))}V${n1(gy(d.l))}" stroke="${col}" stroke-width="1.2"/><rect x="${n1(gx(i) - 3.2)}" y="${n1(t)}" width="6.4" height="${n1(Math.max(1.4, b - t))}" rx=".8" fill="${col}"/>`;
    });
    const e = DAY[36], ey = gy(e.c);
    s += `<g class="zg-mark"><path d="M${n1(gx(36))} ${n1(gy(e.l) + 8)}l-6 10h12z" fill="${C.ink}"/>
      <rect x="${n1(gx(36) - 34)}" y="${n1(gy(e.l) + 22)}" width="68" height="18" rx="9" fill="${C.ink}"/><text x="${n1(gx(36))}" y="${n1(gy(e.l) + 35)}" class="zg-t">Breakout</text>
      <path d="M${n1(gx(36))} ${n1(ey - 34)}H560M${n1(gx(36))} ${n1(ey + 16)}H560" stroke="${C.b4}" stroke-width="1.2" stroke-dasharray="4 4"/>
      <rect x="${n1(gx(36))}" y="${n1(ey - 34)}" width="${n1(560 - gx(36))}" height="34" fill="${C.b6}" opacity=".22"/>
      <rect x="${n1(gx(36))}" y="${n1(ey)}" width="${n1(560 - gx(36))}" height="16" fill="${C.b4}" opacity=".12"/></g>`;
    return s;
  };
  const spark = (seed, up) => { const r = rng(seed); let v = 10, d = 'M0 10';
    for (let i = 1; i < 16; i++) { v += (r() - (up ? .62 : .45)) * 3.4; v = Math.max(1, Math.min(19, v)); d += `L${i * 4} ${n1(v)}`; }
    return `<svg viewBox="0 0 60 20" class="zg-spark"><path d="${d}" fill="none" stroke="${C.b4}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`; };
  const card = (name, note, on, seed, up) => `<div class="zg-card"><div><b>${name}</b><small>${note}</small></div>${spark(seed, up)}<i class="zg-sw${on ? ' on' : ''}"></i></div>`;

  // small line icons that burst out around the window
  const ICONS = {
    candle: 'M8 3v4M8 17v4M5 7h6v10H5zM16 1v6M16 15v5M13 7h6v8h-6z',
    bell: 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0',
    bolt: 'M13 2L5 13h6l-1 9 8-11h-6z',
    clock: 'M12 3a9 9 0 1 0 0.01 0zM12 7v5l3 3',
    target: 'M12 3a9 9 0 1 0 0.01 0zM12 7a5 5 0 1 0 0.01 0zM12 11a1 1 0 1 0 0.01 0z',
    up: 'M3 17l6-6 4 4 8-8M15 7h6v6',
    coin: 'M12 3a9 9 0 1 0 0.01 0zM9 9h6M9 12h6M11 9c4 0 4 6 0 6l4 4',
    shield: 'M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z',
  };
  const iconAt = (k, x, y, s, rot, seed) => `<g class="zg-ic" style="--x:${x};--y:${y}"><g class="zg-bob" style="animation-delay:-${n1(seed)}s">` +
    `<g transform="scale(${n1(s)}) rotate(${rot}) translate(-12 -12)"><path d="${ICONS[k]}" fill="none" stroke="${C.ink}" stroke-width="${n1(2.2 / s)}" stroke-linecap="round" stroke-linejoin="round"/></g></g></g>`;

  let els = {};
  scene('zing', {
    bg: C.w,
    focus: 1000,
    css: `.zg-win{position:absolute;background:${C.w};border-radius:calc(14px*var(--S));overflow:hidden;font-family:Figtree,sans-serif;color:${C.ink};
        box-shadow:0 calc(40px*var(--S)) calc(90px*var(--S)) calc(-30px*var(--S)) rgba(11,29,68,.38),0 0 0 calc(1px*var(--S)) rgba(11,29,68,.07)}
      .zg-bar{height:calc(46px*var(--S));display:flex;align-items:center;gap:calc(8px*var(--S));padding:0 calc(16px*var(--S));background:#f3f8fc;border-bottom:calc(1px*var(--S)) solid ${C.b7}}
      .zg-bar>i{width:calc(11px*var(--S));height:calc(11px*var(--S));border-radius:50%;background:${C.b7}}
      .zg-tab{margin-left:calc(14px*var(--S));height:calc(30px*var(--S));padding:0 calc(16px*var(--S));display:flex;align-items:center;gap:calc(8px*var(--S));background:${C.w};border-radius:calc(8px*var(--S)) calc(8px*var(--S)) 0 0;align-self:flex-end;font:600 calc(12.5px*var(--S))/1 Figtree,sans-serif}
      .zg-tab u{width:calc(8px*var(--S));height:calc(8px*var(--S));border-radius:50%;background:${C.b4};text-decoration:none}
      .zg-url{flex:1;height:calc(26px*var(--S));margin:0 calc(10px*var(--S));border-radius:99px;background:${C.w};border:calc(1px*var(--S)) solid ${C.b7};display:flex;align-items:center;padding:0 calc(12px*var(--S));gap:calc(8px*var(--S))}
      .zg-url span{height:calc(6px*var(--S));width:34%;border-radius:9px;background:${C.b7}}
      .zg-ext{width:calc(26px*var(--S));height:calc(26px*var(--S));border-radius:calc(7px*var(--S));display:grid;place-items:center;background:${C.ink};color:${C.w};transition:box-shadow .4s}
      .zg-ext svg,.zg-logo svg{width:60%;height:60%}
      .zg-page{position:absolute;left:0;right:0;top:calc(46px*var(--S));bottom:0;padding:calc(20px*var(--S)) calc(24px*var(--S))}
      .zg-head{display:flex;align-items:baseline;gap:calc(14px*var(--S));font:500 calc(13px*var(--S)) Figtree,sans-serif;color:${C.b4}}
      .zg-head b{font:700 calc(19px*var(--S)) Figtree,sans-serif;color:${C.ink};letter-spacing:-.01em}
      .zg-head em{font-style:normal;font-weight:700;color:${C.b3}}
      .zg-chart{position:absolute;left:calc(20px*var(--S));top:calc(64px*var(--S));width:calc(560px*var(--S));height:calc(300px*var(--S));overflow:visible}
      .zg-t{font:700 10px Figtree,sans-serif;fill:${C.w};text-anchor:middle}
      .zg-times{position:absolute;left:calc(26px*var(--S));bottom:calc(20px*var(--S));width:calc(540px*var(--S));display:flex;justify-content:space-between;font:500 calc(11px*var(--S)) Figtree,sans-serif;color:${C.b5}}
      .zg-panel{position:absolute;top:calc(46px*var(--S));right:0;bottom:0;width:calc(292px*var(--S));background:${C.w};border-left:calc(1px*var(--S)) solid ${C.b7};
        box-shadow:calc(-24px*var(--S)) 0 calc(40px*var(--S)) calc(-26px*var(--S)) rgba(11,29,68,.3);padding:calc(18px*var(--S));display:grid;align-content:start;gap:calc(10px*var(--S));
        transform:translateX(calc((1 - var(--zp,0))*104%))}
      .zg-top{display:flex;align-items:center;gap:calc(10px*var(--S));font:700 calc(15px*var(--S)) Figtree,sans-serif;margin-bottom:calc(4px*var(--S))}
      .zg-logo{width:calc(28px*var(--S));height:calc(28px*var(--S));border-radius:calc(8px*var(--S));background:${C.ink};color:${C.w};display:grid;place-items:center}
      .zg-top .zg-sw{margin-left:auto}
      .zg-sub{font:600 calc(10.5px*var(--S)) Figtree,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:${C.b5}}
      .zg-card{display:flex;align-items:center;gap:calc(10px*var(--S));padding:calc(12px*var(--S));border:calc(1px*var(--S)) solid ${C.b7};border-radius:calc(11px*var(--S));
        opacity:var(--o,0);transform:translateY(calc((1 - var(--o,0))*14px*var(--S)))}
      .zg-card div{flex:1;display:grid;gap:calc(2px*var(--S))}
      .zg-card b{font:600 calc(13px*var(--S)) Figtree,sans-serif}.zg-card small{font:500 calc(11px*var(--S)) Figtree,sans-serif;color:${C.b5}}
      .zg-spark{width:calc(60px*var(--S));height:calc(20px*var(--S))}
      .zg-sw{position:relative;flex:none;width:calc(28px*var(--S));height:calc(16px*var(--S));border-radius:99px;background:${C.b7}}
      .zg-sw::after{content:"";position:absolute;top:calc(2px*var(--S));left:calc(2px*var(--S));width:calc(12px*var(--S));height:calc(12px*var(--S));border-radius:50%;background:${C.w};box-shadow:0 1px 2px rgba(11,29,68,.25)}
      .zg-sw.on{background:${C.b3}}.zg-sw.on::after{left:calc(14px*var(--S))}
      .zg-foot{margin-top:calc(6px*var(--S));display:flex;align-items:center;gap:calc(8px*var(--S));font:500 calc(11px*var(--S)) Figtree,sans-serif;color:${C.b4}}
      .zg-foot u{width:calc(7px*var(--S));height:calc(7px*var(--S));border-radius:50%;background:${C.b4};text-decoration:none;animation:zgPulse 1.6s ease-in-out infinite}
      @keyframes zgPulse{50%{opacity:.25}}
      .zg-mark{opacity:var(--zm,0)}
      .zg-chip{position:absolute;display:flex;align-items:center;gap:calc(11px*var(--S));padding:calc(14px*var(--S)) calc(24px*var(--S)) calc(14px*var(--S)) calc(17px*var(--S));border-radius:99px;
        background:${C.w};font:600 calc(20px*var(--S)) Figtree,sans-serif;color:${C.ink};translate:-50% -50%;
        box-shadow:0 calc(14px*var(--S)) calc(34px*var(--S)) calc(-12px*var(--S)) rgba(11,29,68,.35),0 0 0 calc(1px*var(--S)) rgba(11,29,68,.06)}
      .zg-chip u{width:calc(11px*var(--S));height:calc(11px*var(--S));border-radius:50%;background:${C.b6};text-decoration:none;transition:background .4s}
      .zg-chip.on u{background:${C.b3};box-shadow:0 0 0 calc(4px*var(--S)) rgba(53,105,173,.18)}
      .zg-ic{transform:translate(calc((1090px + (var(--x)*1px - 1090px)*var(--k,0))),calc((470px + (var(--y)*1px - 470px)*var(--k,0)))) scale(calc(.3 + .7*var(--k,0)));opacity:calc(var(--k,0)*.7)}
      .zg-bob{animation:zgBob 5s ease-in-out infinite alternate}@keyframes zgBob{to{transform:translate(4px,-9px) rotate(6deg)}}`,
    layers() {
      const r = rng(4);
      const back = `<rect x="-600" y="-500" width="2800" height="1900" fill="${C.w}"/>
        <ellipse cx="160" cy="120" rx="520" ry="320" fill="${C.b7}" opacity=".75" filter="url(#b30)"/>
        <ellipse cx="1480" cy="840" rx="560" ry="300" fill="${C.b7}" opacity=".85" filter="url(#b30)"/>
        <ellipse cx="1380" cy="60" rx="380" ry="200" fill="${C.b7}" opacity=".5" filter="url(#b30)"/>
        <ellipse cx="${WX + WW / 2}" cy="${WY + WH + 46}" rx="${WW * .5}" ry="36" fill="${C.b6}" opacity=".55" filter="url(#b16)"/>`;
      // dotted paths from each app to the window, drawn as the app arrives
      const wires = APPS.map(([, x, y, side], i) => {
        const ex = side < 0 ? WX - 4 : WX + WW + 4, ey = WY + 120 + i % 2 * 150;
        return `<path id="zgW${i}" d="M${x + side * -84} ${y}C${n1((x + ex) / 2)} ${y} ${n1((x + ex) / 2)} ${ey} ${ex} ${ey}" pathLength="1" fill="none" stroke="${C.b5}" stroke-width="1.6" stroke-dasharray="1" stroke-dashoffset="1"/>` +
          `<circle id="zgP${i}" cx="${ex}" cy="${ey}" r="4" fill="${C.b4}" opacity="0"/>`;
      }).join('');
      const icons = [['candle', 250, 160], ['bell', 1330, 170], ['bolt', 1290, 640], ['clock', 300, 700], ['target', 1500, 300], ['up', 110, 380],
        ['coin', 1480, 520], ['shield', 200, 560], ['candle', 1180, 110], ['up', 520, 120], ['bell', 600, 800], ['bolt', 1020, 830]]
        .map(([k, x, y], i) => iconAt(k, x, y, 1.2 + r() * .7, n1((r() - .5) * 30), r() * 5)).join('');
      const z = `<svg viewBox="0 0 24 24"><path d="M6 6h12L7 18h11" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      const win = `<div class="zg-win" id="zgWin" style="left:${pct(WX, 1600)};top:${pct(WY, 900)};width:${pct(WW, 1600)};height:${pct(WH, 900)}">
        <div class="zg-bar"><i></i><i></i><i></i><div class="zg-tab"><u></u><span id="zgTab">Groww</span></div><div class="zg-url"><span></span></div><b class="zg-ext" id="zgExt">${z}</b></div>
        <div class="zg-page"><div class="zg-head"><b>NIFTY 50</b><span>24,712.35</span><em>+0.84%</em></div>
          <svg class="zg-chart" viewBox="0 0 560 300">${chart()}</svg>
          <div class="zg-times"><span>09:15</span><span>10:30</span><span>11:45</span><span>13:00</span><span>14:15</span></div></div>
        <aside class="zg-panel" id="zgPanel"><div class="zg-top"><span class="zg-logo">${z}</span>Zing Trade<i class="zg-sw on"></i></div>
          <span class="zg-sub">Your strategies</span>
          ${card('Breakout', 'Watching', true, 3, true)}${card('Crossover', 'Ready', true, 5, true)}${card('Inside candle', 'Paused', false, 8, false)}
          <div class="zg-foot"><u></u>Running on this page</div></aside></div>`;
      const chips = APPS.map(([name, x, y], i) => `<div class="zg-chip" id="zgC${i}" style="left:${pct(x, 1600)};top:${pct(y, 900)}"><u></u>${name}</div>`).join('');
      return [
        {z: .1, svg: back},
        {z: .45, svg: `<g id="zgIcons">${icons}</g>`},
        {z: 1, svg: wires},
        {z: 1, html: win},
        {z: 1, html: chips},
        {z: 1.5, cls: 'blur6', svg: `<g opacity=".5">${iconAt('candle', 90, 820, 3.2, -12, 1)}${iconAt('bolt', 1540, 140, 2.8, 14, 2)}</g>`},
      ];
    },
    init(st, s) {
      els.win = st.querySelector('#zgWin'); els.tab = st.querySelector('#zgTab'); els.ext = st.querySelector('#zgExt');
      els.cards = [...st.querySelectorAll('.zg-card')]; els.mark = st.querySelector('.zg-mark');
      els.chips = APPS.map((_, i) => st.querySelector('#zgC' + i)); els.wires = APPS.map((_, i) => st.querySelector('#zgW' + i)); els.pins = APPS.map((_, i) => st.querySelector('#zgP' + i));
      els.icons = s.layers[1].node; els.fgIcons = s.layers[5].node;
    },
    cam: p => ({zoom: keys(p, [[0, 1.06], [.08, 1], [.42, 1.02], [.54, .75], [1, .73]]), ox: 800, oy: 450, y: keys(p, [[.42, 0], [.54, 146]])}),
    frame(p) {
      if (!els.win) return;
      // the extension wakes up and its panel slides in
      els.ext.style.boxShadow = p > .12 ? `0 0 0 calc(${n1(span(p, .12, .2) * 5)}px*var(--S)) rgba(53,105,173,.25)` : '';
      els.win.style.setProperty('--zp', span(p, .16, .27).toFixed(3));
      els.cards.forEach((c, i) => c.style.setProperty('--o', span(p, .23 + i * .03, .29 + i * .03).toFixed(3)));
      els.mark.style.setProperty('--zm', span(p, .31, .37).toFixed(3));
      const k = span(p, .19, .33).toFixed(3);
      els.icons.style.setProperty('--k', k); els.fgIcons.style.setProperty('--k', k);
      // the apps arrive and plug in, and the window becomes each of them in turn
      let tab = 0;
      els.chips.forEach((c, i) => {
        const t = span(p, .5 + i * .06, .58 + i * .06), side = APPS[i][3];
        c.style.transform = `translate(${n1(side * (1 - t) * 300)}px,${n1((1 - t) * 40)}px) rotate(${n1(side * (1 - t) * 12)}deg)`;
        c.style.opacity = t.toFixed(3);
        const w = span(p, .56 + i * .06, .62 + i * .06);
        els.wires[i].setAttribute('stroke-dashoffset', (1 - w).toFixed(3));
        els.pins[i].setAttribute('opacity', w > .98 ? 1 : 0);
        c.classList.toggle('on', w > .98);
        if (w > .98) tab = i;
      });
      els.tab.textContent = APPS[tab][0];
    },
  });
})();
