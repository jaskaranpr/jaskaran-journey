// Photoshop. A teenager at a desk with a big monitor. On the screen, one picture: a night sky with the moon, the
// village roofs, a boy, and the title "jaskaran.psd". The picture comes apart into its layers, which fan out of
// the screen like sheets of glass, then fold back in. Then the screen turns into a video editor: the picture
// shrinks into the preview, tracks of clips fill the bottom, and a playhead runs across while the moon moves.
chapter('psd', (() => {
  const {GY, ln, draw, show, box, circ, rng, keys, fit, n1} = L;
  const S = 140, X = 440;                                       // his scale; where he sits (feet)
  // the screen's picture area, and how far each layer travels when the file comes apart
  const SX = 612, SY = 352, SW = 336, SH = 198;
  const FAN = [[0, 0], [150, -54], [300, -108], [450, -162]], FAN_TALL = [[0, 0], [20, -62], [40, -124], [60, -186]];   // phones fan upward

  // the desk he works at, shared with the next chapter so the two read as one room
  function desk(r = 0) {
    const seatY = GY - .45 * S, seatX = X - .33 * S;
    const chair = `M${n1(seatX - 44)} ${n1(seatY)}H${n1(seatX + 40)}M${n1(seatX - 40)} ${n1(seatY)}V${GY}M${n1(seatX + 36)} ${n1(seatY)}V${GY}` +
      `M${n1(seatX - 44)} ${n1(seatY)}V${n1(seatY - 118)}${r ? `q0 -14 14 -14h10q14 0 14 14V${n1(seatY)}` : `h24V${n1(seatY)}`}`;
    const top = r ? box(470, 588, 560, 16, 8) : `M470 588H1030V604H470Z`;
    const legs = `M486 604V${GY}M1014 604V${GY}M842 604V${GY}M842 640H1014`;
    const mon = box(SX - 12, SY - 12, SW + 24, SH + 24, r ? 26 : 4);
    const stand = r ? `M760 ${SY + SH + 12}q0 14 0 26M732 588q20 -14 56 0` : `M760 ${SY + SH + 12}V578M726 588V578H794V588`;
    const keys_ = box(482, 576, 150, 10, r ? 5 : 1), mouse = r ? circ(664, 581, 8) : box(656, 574, 16, 12, 2);
    const mug = `M968 588V556H998V588M998 564q14 0 14 10q0 10 -14 10`, cable = `M800 ${SY + SH + 4}q60 10 70 70T940 ${GY}`;
    return ln(chair, 'thin') + ln(top) + ln(legs, 'thin') + ln(mon) + ln(stand, 'thin') + ln(keys_ + mouse, 'thin') + ln(mug + cable, 'hair');
  }

  // the four layers of the picture, each a group that can slide out of the screen
  function layers() {
    const r = rng(21);
    let stars = '';
    for (let i = 0; i < 14; i++) stars += `M${n1(SX + 14 + r() * (SW - 28))} ${n1(SY + 12 + r() * 90)}v.1`;
    let roofs = `M${SX} ${SY + SH - 8}`, x = SX;
    while (x < SX + SW - 30) { const w = 26 + r() * 30, h = 14 + r() * 24; roofs += `V${n1(SY + SH - 8 - h)}H${n1(Math.min(x + w, SX + SW))}`; x += w; if (r() < .4) roofs += `M${n1(x - 12)} ${n1(SY + SH - 8 - h)}v-8h8v8M${n1(x)} ${n1(SY + SH - 8 - h)}`; }
    roofs += `V${SY + SH - 8}`;
    const poplars = [0, 1, 2].map(i => { const px = SX + 250 + i * 16, ph = 50 + i * 6, b = SY + SH - 8; return `M${px} ${b}C${px - 8} ${b - ph * .4} ${px - 4} ${b - ph * .9} ${px} ${b - ph}C${px + 4} ${b - ph * .9} ${px + 8} ${b - ph * .4} ${px} ${b}`; }).join('');
    // a boy with curly hair, the way he'd draw himself
    const bx = SX + 96, by = SY + SH - 8;
    const boy = `${circ(bx, by - 74, 11)}M${bx - 9} ${by - 82}q-6 -10 4 -14q4 -8 12 -2q10 -2 8 8q8 4 2 12` +
      `M${bx - 14} ${by}V${by - 46}q0 -12 14 -14q14 2 14 14V${by}M${bx} ${by - 60}v-4`;
    const frame = (k, inner) => `<g class="lay lay${k}"><g class="lay-in">${ln(box(SX, SY, SW, SH, 2), 'thin frame')}${k ? ln(checker(), 'hair chk') : ''}${inner}</g></g>`;
    return frame(0, ln(stars, 'bold stars') + ln(circ(SX + 286, SY + 46, 20), 'moon')) +
      frame(1, ln(roofs, 'thin roofs') + ln(poplars, 'thin roofs')) +
      frame(2, ln(boy, 'thin boy')) +
      frame(3, `<text class="ttl" x="${SX + 124}" y="${SY + 64}" text-anchor="middle">jaskaran.psd</text>`);
  }
  // Photoshop's grey-and-white check for "transparent", as a fine grid of strokes
  function checker() {
    let d = '';
    for (let y = SY + 16; y < SY + SH; y += 16) for (let x = SX + ((y - SY) / 16 % 2) * 16; x < SX + SW; x += 32) d += `M${x} ${y}h16`;
    return d;
  }
  // the video editor: a ruler, three tracks of clips, an audio waveform, and the playhead
  function editor() {
    const ty = SY + 124, r = rng(5);
    let ruler = `M${SX + 8} ${ty}H${SX + SW - 8}`;
    for (let x = SX + 8; x < SX + SW - 6; x += 12) ruler += `M${x} ${ty}v${(x - SX - 8) % 48 ? -3 : -6}`;
    let clips = '';
    for (const [row, cuts] of [[0, [0, 70, 150, 230, 320]], [1, [30, 120, 210, 300]]]) for (let i = 0; i < cuts.length - 1; i++) clips += box(SX + 10 + cuts[i], ty + 8 + row * 20, cuts[i + 1] - cuts[i] - 4, 14, 3);
    let wave = `M${SX + 10} ${ty + 58}`;
    for (let x = SX + 12; x < SX + SW - 10; x += 3) wave += `L${x} ${n1(ty + 58 + (r() - .5) * 14 * Math.sin((x - SX) / 23) ** 2)}`;
    const preview = box(SX + 70, SY + 8, SW - 140, 104, 3);
    return `<g class="ed">${ln(preview, 'thin pv')}${ln(ruler, 'hair')}${ln(clips, 'thin clips')}${ln(wave, 'hair wave')}</g>` +
      `<g class="ph">${ln(`M${SX + 10} ${ty - 10}V${ty + 70}M${SX + 4} ${ty - 16}h12l-6 6Z`, '')}</g>`;
  }

  return {
    // the long line sits under the big one; the layers fan out to the free right side
    text: [
      {at: [.45, 2.2], h: 'Design came first.', p: 'I taught myself Photoshop, one layer at a time. That’s where my Instagram name comes from: jaskaran.psd', layout: 'stack'},
      {at: [2.45, 3.8], h: 'Then I tried video editing.'}],
    css: `.ch-psd .ttl{font:600 30px var(--font);letter-spacing:-.03em;fill:currentColor}
      .ch-psd .lay-in{transform-box:view-box}`,
    desk,
    backArt: () => `${ln(`M-300 ${GY}H1900`, 'floor')}<g class="room">${desk()}</g>
      <rect class="glass" x="${SX}" y="${SY}" width="${SW}" height="${SH}" fill="#aed1ea" opacity="0" filter="url(#b8)"/>
      <g class="pic">${layers()}</g>${editor()}`,
    build(tl, $) {
      draw(tl, $('.floor'), 0, .5);
      draw(tl, $('.room .ln'), .05, .8, .03);
      tl.fromTo($('.glass'), {opacity: 0}, {opacity: .16, duration: .5}, .5);
      // the picture paints itself in, layer by layer
      draw(tl, $('.lay0 .ln:not(.frame)'), .6, .45, .05);
      draw(tl, $('.roofs'), .72, .5, .05);
      draw(tl, $('.boy'), .85, .45);
      show(tl, $('.ttl'), .95, .3);
      gsap.set($('.frame,.chk'), {opacity: 0});
      // it comes apart: each layer slides out and tilts like a sheet of glass, its outline and check showing
      $('.lay').forEach((g, k) => {
        if (!k) return;
        const [dx, dy] = (innerWidth / innerHeight < 1.05 ? FAN_TALL : FAN)[k], inner = g.querySelector('.lay-in');
        tl.fromTo(g, {x: 0, y: 0}, {x: dx, y: dy, duration: .55, ease: 'power3.inOut'}, 1.2 + k * .06);
        tl.fromTo(inner, {skewY: 0, scaleX: 1}, {skewY: -9, scaleX: .9, svgOrigin: `${SX} ${SY + SH / 2}`, duration: .55, ease: 'power3.inOut'}, 1.2 + k * .06);
        tl.to(inner.querySelectorAll('.frame'), {opacity: 1, duration: .3}, 1.3 + k * .06);
        tl.to(inner.querySelectorAll('.chk'), {opacity: .22, duration: .3}, 1.35 + k * .06);
        // and folds back in
        tl.to(g, {x: 0, y: 0, duration: .45, ease: 'power3.inOut'}, 2.22 - k * .04);
        tl.to(inner, {skewY: 0, scaleX: 1, duration: .45, ease: 'power3.inOut'}, 2.22 - k * .04);
        tl.to(inner.querySelectorAll('.frame,.chk'), {opacity: 0, duration: .25}, 2.3 - k * .04);
      });
      // the screen becomes an editor: the picture shrinks into the preview, the tracks draw in, the playhead runs
      tl.fromTo($('.pic'), {scale: 1}, {scale: .52, svgOrigin: `${SX + SW / 2} ${SY + 6}`, duration: .45, ease: 'power3.inOut'}, 2.62);
      draw(tl, $('.ed .ln'), 2.72, .5, .06);
      tl.fromTo($('.ph'), {opacity: 0, x: 0}, {opacity: 1, duration: .15}, 2.95);
      tl.to($('.ph'), {x: SW - 22, duration: .95, ease: 'none'}, 3.0);
      tl.fromTo($('.lay0 .moon'), {x: 0, y: 0}, {x: -150, y: 44, duration: .95, ease: 'none'}, 3.0);
    },
    alive: true,
    fig: (t, life = 0) => ({lib: 'a', clip: 'Sitting_Talking_Loop', ct: t * .8 + life * .5, x: X, y: GY, s: S, yaw: 90}),
    view: (t, narrow) => narrow
      ? {x: 640, y: 400, zoom: .74}
      : {x: keys(t, [[0, 800], [3.6, 820]]), y: keys(t, [[0, 450], [3.6, 466]]), zoom: keys(t, [[0, 1], [3.6, 1.05]])},   // ends where the next chapter's camera starts
  };
})());
