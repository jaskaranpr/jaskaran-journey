// 2021. A phone in his hand plays an ad for Masai School. Then the light opens up to the white product look of the Fold
// film: the phone on its own, his Instagram copy on screen and its icons bursting out around it; then his YouTube copy.
(() => {
  const {C, keys, span, ease, clamp, n1, lerp} = K;
  const W = 278, H = 598;                                       // the screen
  const ICON = {
    heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
    chat: 'M20 11.5a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.5z',
    send: 'M21 3L10 14M21 3l-7 18-4-7-7-4z',
    save: 'M6 3h12v18l-6-4-6 4z',
    camera: 'M3 8.5a2 2 0 0 1 2-2h2.2l1.6-2.2h6.4l1.6 2.2H19a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM12 9.5a3.6 3.6 0 1 0 0 7.2a3.6 3.6 0 1 0 0-7.2z',
    home: 'M4 11l8-7 8 7v9h-5v-6H9v6H4z',
    search: 'M10.5 4a6.5 6.5 0 1 0 0 13a6.5 6.5 0 1 0 0-13zM15.5 15.5L20.5 20.5',
    plus: 'M4 4h16v16H4zM12 8v8M8 12h8',
    user: 'M12 4a4 4 0 1 0 0 8a4 4 0 1 0 0-8zM4 21c0-4.4 3.6-7 8-7s8 2.6 8 7',
    image: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M15.5 8.5a1.5 1.5 0 1 0 .01 0',
    smile: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM8.5 14a4.5 4.5 0 0 0 7 0M9 9.5v.5M15 9.5v.5',
    play: 'M8 5l11 7-11 7z',
    thumb: 'M7 21H4V10h3zM7 10l4-7a2 2 0 0 1 3 2l-1 5h6a2 2 0 0 1 2 2.3l-1.5 7A2 2 0 0 1 17.5 21H7',
    bell: 'M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 21h4',
    share: 'M14 5l7 7-7 7M21 12H10a7 7 0 0 0-7 7',
    film: 'M4 5h16v14H4zM8 5v14M16 5v14M4 9h4M4 15h4M16 9h4M16 15h4',
    music: 'M9 18V6l11-2v12M9 18a3 3 0 1 1-6 0a3 3 0 0 1 6 0zM20 16a3 3 0 1 1-6 0a3 3 0 0 1 6 0z',
  };
  const icon = (n, x, y, s = 1, w = 1.8, col = C.ink) => `<path transform="translate(${x} ${y}) scale(${s}) translate(-12 -12)" d="${ICON[n]}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  // bursts: [icon, dx, dy, scale, delay] around the phone
  const INSTA = [['heart', -238, -218, 2.6, 0], ['chat', -262, 24, 2.3, .012], ['send', -226, 236, 2.4, .024], ['save', 232, -240, 2.2, .006], ['camera', 306, -60, 2.6, .018],
    ['home', 262, 152, 2.2, .03], ['search', 214, 306, 2, .036], ['plus', -150, -336, 1.9, .042], ['user', 336, 268, 2, .048], ['image', 360, -200, 2.1, .02], ['smile', -318, 312, 2, .054], ['heart', 404, 44, 1.6, .06]];
  const TUBE = [['play', -246, -222, 2.6, 0], ['thumb', -272, 30, 2.3, .012], ['bell', -230, 240, 2.3, .024], ['share', 232, -250, 2.1, .006], ['chat', 244, 212, 2.1, .018],
    ['film', -364, -96, 2.2, .03], ['music', -352, 168, 2, .036], ['user', 210, 330, 1.8, .042], ['search', 268, -40, 1.9, .048], ['plus', -150, -338, 1.8, .054]];

  // the little avatar: his curly head and shoulders, white on blue
  const BUST = FIG.bust({up: -6});
  const avatar = (cx, cy, r, id) => `<clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath><circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.b3}"/>` +
    `<g clip-path="url(#${id})"><path d="${BUST.d}" fill="${C.w}" transform="translate(${n1(cx - r * .05)} ${n1(cy + r * .62)}) scale(${n1(r / 52)})"/></g>`;
  const bar = (x, y, w, h, col, o = 1) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${col}" opacity="${o}"/>`;
  const txt = (x, y, s, w, col, t, anchor = 'start') => `<text x="${x}" y="${y}" font-family="Figtree, sans-serif" font-size="${s}" font-weight="${w}" fill="${col}" text-anchor="${anchor}">${t}</text>`;
  const status = col => txt(26, 27, 11, 600, col, '9:41') + `<g fill="${col}"><rect x="210" y="19" width="3" height="7" rx="1"/><rect x="215" y="17" width="3" height="9" rx="1"/><rect x="220" y="15" width="3" height="11" rx="1"/>` +
    `<rect x="233" y="16" width="20" height="10" rx="3" fill="none" stroke="${col}" stroke-width="1.2"/><rect x="235" y="18" width="13" height="6" rx="1.5"/></g>`;

  // tiny scenes from earlier in the story, used as photos and thumbnails
  const stage = (x, y, w, h) => {
    const me = FIG.front({pockets: true}), s = h * .0028, fx = x + w / 2, fy = y + h * .82;
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${C.b1}"/><ellipse cx="${fx}" cy="${y + h * .35}" rx="${w * .5}" ry="${h * .5}" fill="${C.b3}" opacity=".6" filter="url(#b8)"/>` +
      `<path d="M${fx - w * .05} ${y}L${fx + w * .05} ${y}L${fx + w * .26} ${fy}L${fx - w * .26} ${fy}Z" fill="url(#gBeam)" opacity=".7"/>` +
      `<ellipse cx="${fx}" cy="${fy}" rx="${w * .2}" ry="${h * .035}" fill="url(#gPool)"/><path d="${me.d}" fill="${C.w}" transform="translate(${fx} ${fy}) scale(${n1(s * 100) / 100})"/>`;
  };
  const dawn = (x, y, w, h) => {
    let t = '';
    for (let i = 0; i < 9; i++) t += `<ellipse cx="${n1(x + w * (.55 + i * .045))}" cy="${n1(y + h * .63)}" rx="${n1(w * .012)}" ry="${n1(h * .13)}" fill="${C.b2}"/>`;
    return `<linearGradient id="maDawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.b3}"/><stop offset=".62" stop-color="${C.b6}"/><stop offset=".7" stop-color="${C.b7}"/><stop offset="1" stop-color="${C.b3}"/></linearGradient>` +
      `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#maDawn)"/><circle cx="${x + w * .7}" cy="${y + h * .62}" r="${h * .1}" fill="${C.w}"/>` +
      `<rect x="${x}" y="${y + h * .7}" width="${w}" height="${h * .3}" fill="${C.b3}"/>${t}`;
  };

  // the three screens, in screen coordinates (0,0 is the top-left of the glass)
  const adScreen = `<rect width="${W}" height="${H}" fill="${C.w}"/>${status(C.ink)}
    <rect y="40" width="${W}" height="157" fill="${C.b1}"/><ellipse cx="200" cy="80" rx="140" ry="70" fill="${C.b3}" opacity=".7" filter="url(#b16)"/>
    ${txt(W / 2, 114, 21, 600, C.w, 'Masai School', 'middle')}
    <g id="maAd"><rect x="10" y="168" width="58" height="17" rx="3" fill="${C.w}" opacity=".92"/><text id="maAdT" x="17" y="180" font-family="Figtree, sans-serif" font-size="8.5" font-weight="600" fill="${C.ink}">Ad · 0:15</text></g>
    <rect x="188" y="160" width="80" height="26" rx="2" fill="${C.b0}" opacity=".62" stroke="${C.w}" stroke-opacity=".45"/><text id="maSkip" x="228" y="177" text-anchor="middle" font-family="Figtree, sans-serif" font-size="9" font-weight="600" fill="${C.w}">Skip in 5</text>
    <rect y="194" width="${W}" height="3" fill="${C.b4}" opacity=".6"/><rect id="maProg" y="194" width="10" height="3" fill="${C.b6}"/>
    ${bar(14, 212, 216, 10, C.ink, .85)}${bar(14, 229, 150, 8, C.b5)}
    ${avatar(28, 266, 13, 'maAv1')}${bar(48, 257, 92, 8, C.ink, .8)}${bar(48, 270, 60, 6, C.b5)}
    <rect x="196" y="253" width="68" height="25" rx="12.5" fill="${C.ink}"/>${txt(230, 269, 9, 600, C.w, 'Subscribe', 'middle')}
    ${[0, 1, 2, 3].map(i => `<rect x="${14 + i * 64}" y="292" width="56" height="22" rx="11" fill="${C.b7}"/>`).join('')}
    ${[0, 1, 2].map(i => `<rect x="14" y="${332 + i * 84}" width="120" height="68" rx="6" fill="${[C.b5, C.b6, C.b4][i]}"/>${bar(144, 336 + i * 84, 110, 8, C.ink, .75)}${bar(144, 350 + i * 84, 84, 7, C.b5)}${bar(144, 362 + i * 84, 60, 6, C.b6)}`).join('')}`;

  const instaScreen = `<rect width="${W}" height="${H}" fill="${C.w}"/>${status(C.ink)}
    ${txt(16, 66, 17, 700, C.ink, 'Home')}${icon('heart', 214, 60, .95)}${icon('send', 250, 60, .95)}
    <linearGradient id="maRing" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${C.b2}"/><stop offset="1" stop-color="${C.b6}"/></linearGradient>
    ${[0, 1, 2, 3, 4].map(i => `<circle cx="${36 + i * 54}" cy="112" r="23" fill="none" stroke="url(#maRing)" stroke-width="2.6"/>${avatar(36 + i * 54, 112, 19, 'maSt' + i)}${bar(24 + i * 54, 142, 24, 4, C.b6)}`).join('')}
    <path d="M0 160H${W}" stroke="${C.b7}"/>
    ${avatar(26, 180, 13, 'maAv2')}${txt(46, 184, 10.5, 600, C.ink, 'jaskaran.psd')}${txt(258, 184, 12, 700, C.ink, '···', 'middle')}
    <g>${stage(0, 200, W, W)}</g>
    <g id="maLike" opacity="0"><path d="${ICON.heart}" fill="${C.b0}" opacity=".35" filter="url(#b3)" transform="translate(0 1.5)"/><path d="${ICON.heart}" fill="${C.w}"/></g>
    ${icon('heart', 22, 498, 1)}${icon('chat', 56, 498, 1)}${icon('send', 90, 498, 1)}${icon('save', 256, 498, 1)}
    ${bar(14, 516, 122, 8, C.ink, .85)}${bar(14, 532, 228, 7, C.b5)}${bar(14, 545, 170, 7, C.b5)}
    <path d="M0 562H${W}" stroke="${C.b7}"/>${['home', 'search', 'plus', 'play', 'user'].map((n, i) => icon(n, 28 + i * 55.5, 580, .9)).join('')}`;

  const tubeScreen = `<rect width="${W}" height="${H}" fill="${C.w}"/>${status(C.ink)}
    ${txt(16, 66, 17, 700, C.ink, 'Home')}${icon('search', 200, 60, .9)}${icon('bell', 232, 60, .9)}${avatar(262, 60, 11, 'maAv3')}
    <rect x="14" y="84" width="40" height="24" rx="12" fill="${C.ink}"/>${txt(34, 100, 9.5, 600, C.w, 'All', 'middle')}
    ${['Music', 'Design', 'Live'].map((t, i) => `<rect x="${62 + i * 66}" y="84" width="58" height="24" rx="12" fill="${C.b7}"/>${txt(91 + i * 66, 100, 9.5, 600, C.ink, t, 'middle')}`).join('')}
    <g>${dawn(0, 118, W, 156)}</g><rect x="228" y="250" width="38" height="16" rx="3" fill="${C.b0}" opacity=".8"/>${txt(247, 262, 8.5, 600, C.w, '4:21', 'middle')}
    <rect y="271" width="${W}" height="3" fill="${C.b6}"/><rect y="271" width="96" height="3" fill="${C.b3}"/>
    ${avatar(28, 298, 13, 'maAv4')}${bar(50, 288, 200, 9, C.ink, .85)}${bar(50, 303, 140, 7, C.b5)}${bar(50, 315, 96, 6, C.b6)}
    <g>${stage(0, 336, W, 156)}</g><rect x="228" y="468" width="38" height="16" rx="3" fill="${C.b0}" opacity=".8"/>${txt(247, 480, 8.5, 600, C.w, '12:08', 'middle')}
    ${avatar(28, 516, 13, 'maAv5')}${bar(50, 506, 190, 9, C.ink, .85)}${bar(50, 521, 120, 7, C.b5)}
    <path d="M0 562H${W}" stroke="${C.b7}"/>${['home', 'film', 'plus', 'play', 'user'].map((n, i) => icon(n, 28 + i * 55.5, 580, .9)).join('')}`;

  // the phone itself, centred on 0,0
  const phone = `<rect x="-153" y="-313" width="306" height="626" rx="48" fill="${C.ink}"/><rect x="-150" y="-310" width="300" height="620" rx="46" fill="${C.b0}"/>
    <rect x="-156" y="-170" width="4" height="44" rx="2" fill="${C.ink}"/><rect x="-156" y="-110" width="4" height="44" rx="2" fill="${C.ink}"/><rect x="152" y="-150" width="4" height="70" rx="2" fill="${C.ink}"/>
    <clipPath id="maClip"><rect width="${W}" height="${H}" rx="36"/></clipPath>
    <g transform="translate(${-W / 2} ${-H / 2})" clip-path="url(#maClip)">
      <rect width="${W}" height="${H}" fill="${C.w}"/><g id="maS0">${adScreen}</g><g id="maS1" opacity="0">${instaScreen}</g><g id="maS2" opacity="0">${tubeScreen}</g>
      <rect width="${W}" height="${H}" fill="url(#maGlass)"/></g>
    <rect x="-36" y="-289" width="72" height="22" rx="11" fill="${C.b0}"/>`;

  // his right hand round the phone: palm and wrist behind it, fingertips showing past the left edge, thumb on the glass
  const {limb, ring, path, P} = FIG;
  const palm = path([ring(P(60, 318), 176, 112, 24, -12), limb(P(330, 800), 104, P(150, 390), 112),
    ...[[34, 22], [104, 24], [174, 23], [240, 20]].map(([y, r]) => limb(P(-90, y + 6), r, P(-164, y), r * .86))]);
  const grip = path([limb(P(214, 304), 42, P(156, 200), 34), limb(P(156, 200), 33, P(114, 120), 27)]);
  const ME = FIG.bust({up: -14});                                // him, over whose shoulder we watch the ad
  let el = {};
  scene('masai', {
    bg: C.w,
    focus: 800,
    css: `.ma-ic>g{animation:maFloat 5s ease-in-out infinite alternate}.ma-ic:nth-child(3n)>g{animation-duration:6.5s}.ma-ic:nth-child(2n)>g{animation-delay:-2s}
      @keyframes maFloat{to{transform:translateY(-8px)}}`,
    layers() {
      const blobs = [[240, 180, 260, C.b7, .9], [1380, 140, 220, C.b7, .8], [1300, 760, 300, C.b6, .35], [180, 760, 240, C.b6, .3], [820, 120, 180, C.b7, .7]]
        .map(([x, y, r, c, o]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity="${o}" filter="url(#b30)"/>`).join('');
      const rings = [[300, 300, 40], [1250, 620, 26], [1450, 300, 18], [150, 560, 22], [700, 820, 30], [1000, 110, 16]]
        .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${C.b6}" stroke-width="1.5" opacity=".7"/>`).join('');
      const icons = (set, pre) => set.map(([n], i) => `<g class="ma-ic" id="${pre}${i}" opacity="0"><g>${icon(n, 0, 0, 1, 1.7)}</g></g>`).join('');
      const fg = `<g id="maFg" opacity="0">${icon('heart', 120, 140, 7, 1.6)}${icon('play', 1490, 780, 6.5, 1.6)}${icon('chat', 1460, 120, 5, 1.6)}</g>`;
      return [
        {z: .15, svg: `<rect x="-600" y="-400" width="2800" height="1700" fill="${C.w}"/>${blobs}
          <linearGradient id="maWashG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.b7}"/><stop offset=".55" stop-color="${C.b6}"/><stop offset="1" stop-color="${C.b5}"/></linearGradient>
          <rect id="maWash" x="-600" y="-400" width="2800" height="1700" fill="url(#maWashG)"/>`},
        {z: .4, svg: rings},
        {z: 1, svg: `<linearGradient id="maGlass" x1="0" y1="0" x2="1" y2="1"><stop offset=".35" stop-color="${C.w}" stop-opacity="0"/><stop offset=".5" stop-color="${C.w}" stop-opacity=".16"/><stop offset=".62" stop-color="${C.w}" stop-opacity="0"/></linearGradient>
          <ellipse id="maShadow" cx="0" cy="0" rx="190" ry="26" fill="${C.b5}" opacity=".45" filter="url(#b16)"/>
          <g id="maPhone"><circle id="maBloom" r="300" fill="url(#gGlow)" opacity="0"/>
            <g id="maHand"><path d="${palm}" fill="${C.w}" filter="url(#fuzz)"/></g>${phone}<g id="maGrip"><path d="${grip}" fill="${C.w}" filter="url(#fuzz)"/></g></g>`},
        {z: 1.1, svg: icons(INSTA, 'maI') + icons(TUBE, 'maT')},
        {z: 1.25, svg: `<g id="maMe" transform="translate(400 790) scale(5.6)"><path d="${ME.d}" filter="url(#fuzzc)" fill="${C.w}"/>${FIG.eye(ME.eye, .95, 1, -34)}</g>`},
        {z: 1.5, cls: 'blur6', svg: fg},
      ];
    },
    init(st) {
      for (const id of ['maMe', 'maPhone', 'maShadow', 'maHand', 'maGrip', 'maWash', 'maBloom', 'maS0', 'maS1', 'maS2', 'maProg', 'maSkip', 'maAdT', 'maLike', 'maFg'])
        el[id] = st.querySelector('#' + id);
      el.insta = INSTA.map((_, i) => st.querySelector('#maI' + i));
      el.tube = TUBE.map((_, i) => st.querySelector('#maT' + i));
    },
    cam: p => ({zoom: keys(p, [[0, 1.04], [.4, 1], [1, 1.03]]), oy: 470}),
    frame(p) {
      if (!el.maPhone) return;
      const tall = innerWidth < innerHeight;                     // phones in portrait keep it centred and a little smaller
      const k = tall ? .82 : keys(p, [[0, .9], [.37, .9], [.46, 1]]);
      const x = tall ? 800 : keys(p, [[0, 930], [.37, 930], [.46, 1060], [.7, 1060], [.78, 560]]);
      const away = span(p, .32, .43);
      el.maMe.setAttribute('opacity', tall ? 0 : n1(1 - away * .4));
      el.maMe.setAttribute('transform', `translate(${n1(400 - away * 300)} ${n1(790 + away * 600)}) scale(5.6)`);
      const y = keys(p, [[0, tall ? 540 : 618], [.37, tall ? 540 : 618], [.46, tall ? 510 : 470]]) + Math.sin(p * 18) * 4 * (1 - span(p, .36, .46));
      const tilt = keys(p, [[0, -9], [.36, -6], [.46, 0], [.7, 0], [.74, -3], [.78, 0]]);
      el.maPhone.setAttribute('transform', `translate(${n1(x)} ${n1(y)}) rotate(${n1(tilt)}) scale(${k})`);
      el.maShadow.setAttribute('transform', `translate(${n1(x)} ${n1(y + 352 * k)}) scale(${k})`);
      el.maShadow.setAttribute('opacity', n1(.45 * span(p, .38, .48)));
      // the hand lets go and drops out of frame as the light opens up
      const drop = span(p, .35, .45);
      for (const h of [el.maHand, el.maGrip]) { h.setAttribute('transform', `translate(${n1(drop * 120)} ${n1(drop * 760)})`); h.setAttribute('opacity', n1(1 - drop * .6)); }
      el.maWash.setAttribute('opacity', n1(1 - span(p, .36, .47)));
      const bloom = span(p, .34, .41) * (1 - span(p, .41, .52));
      el.maBloom.setAttribute('opacity', n1(bloom * .9));
      el.maBloom.setAttribute('transform', `scale(${n1(.8 + bloom * 1.6)})`);
      // the ad plays, then the screens change over
      const ad = span(p, .02, .36);
      el.maProg.setAttribute('width', n1(W * ad));
      el.maAdT.textContent = `Ad · 0:${String(Math.max(0, Math.round(15 - ad * 15))).padStart(2, '0')}`;
      el.maSkip.textContent = ad > .33 ? 'Skip ad  ›' : `Skip in ${Math.max(1, Math.ceil(5 - ad * 15))}`;
      const o0 = span(p, .38, .405), i1 = span(p, .405, .43), o1 = span(p, .71, .735), i2 = span(p, .735, .76);
      el.maS0.setAttribute('opacity', n1(1 - o0));
      el.maS0.setAttribute('transform', `translate(0 ${n1(-o0 * 40)})`);
      el.maS1.setAttribute('opacity', n1(i1 * (1 - o1)));
      el.maS1.setAttribute('transform', `translate(0 ${n1((1 - i1) * 50 - o1 * 40)})`);
      el.maS2.setAttribute('opacity', n1(i2));
      el.maS2.setAttribute('transform', `translate(0 ${n1((1 - i2) * 50)})`);
      // a double-tap like on his photo
      const like = span(p, .52, .55) * (1 - span(p, .6, .63)), pop = like * (1 + .18 * Math.sin(span(p, .52, .56) * Math.PI));
      el.maLike.setAttribute('opacity', n1(like));
      el.maLike.setAttribute('transform', `translate(${W / 2} 296) scale(${n1(pop * 4.4)}) translate(-12 -12)`);
      // icons burst out from the phone, Instagram's first, then YouTube's
      const burst = (set, els, at, out, cx, cy) => set.forEach(([, dx, dy, s, d], i) => {
        const t = ease(span(p, at + d, at + d + .07)), e = out ? span(p, out, out + .04) : 0, a = t * (1 - e);
        const far = .25 + .75 * t + .45 * e;
        els[i].setAttribute('opacity', n1(a));
        els[i].setAttribute('transform', `translate(${n1(cx + dx * far * k)} ${n1(cy + dy * far * k)}) scale(${n1(s * k * (.35 + .65 * t))}) rotate(${n1((1 - t) * (i % 2 ? 30 : -30))})`);
      });
      const ix = tall ? 800 : 1060, tx = tall ? 800 : 560, iy = tall ? 510 : 470;
      burst(INSTA, el.insta, .43, .7, ix, iy);
      burst(TUBE, el.tube, .75, 0, tx, iy);
      el.maFg.setAttribute('opacity', n1(span(p, .46, .56) * .5));
    },
  });
})();
