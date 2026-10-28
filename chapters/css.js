// Class 11. The same desk. On the screen a tutorial plays beside a code editor, and the code types itself in
// as he follows along. Then the camera leans in on one line: "border-radius: 0" becomes "32px", and from that
// line a circle opens across the whole frame, repainting the room in a new colour with every corner rounded.
chapter('css', (() => {
  const {GY, ln, draw, show, box, circ, keys, fit, n1} = L;
  const S = 140, X = 440;                                       // same seat as the last chapter
  const SX = 612, SY = 352, SW = 336, SH = 198;                 // same screen
  const CODE = ['.card {', '  padding: 24px;', '  background: white;', '  border-radius: 0;', '}', '.card h1 {', '  font-weight: 600;', '}'];
  const CX = SX + 24, CY = SY + 46, LH = 15, CW = 6.9;          // code origin, line height, character width
  const EDIT = 3, EY = CY + EDIT * LH, PRE = 17 * CW;             // the line that changes, and the width of "  border-radius: "

  // what's on the screen, before (r = 0) and after (r = 1) the change
  function screen(r) {
    const k = r ? 1 : 0, px = SX + 204, py = SY + 14;
    const tab = box(SX + 8, SY + 8, 78, 18, 3 + 5 * k) + `M${SX + 8} ${SY + 30}H${SX + 192}`;
    const player = box(px, py, 124, 70, 2 + 12 * k) + `M${px + 54} ${py + 22}L${px + 76} ${py + 35}L${px + 54} ${py + 48}Z`;
    const bar = `M${px + 8} ${py + 62}H${px + 116}`;
    const below = `M${px + 16} ${py + 86}h92M${px + 16} ${py + 96}h60` + circ(px + 6, py + 89, 4);
    const thumbs = box(px, py + 110, 46, 28, 2 + 7 * k) + `M${px + 54} ${py + 116}h62M${px + 54} ${py + 126}h40` + box(px, py + 146, 46, 28, 2 + 7 * k) + `M${px + 54} ${py + 152}h62M${px + 54} ${py + 162}h34`;
    const hl = box(CX - 6, EY - 11, r ? 160 : 132, 15, 1 + 5 * k);
    return `${ln(tab, 'hair')}${ln(player, 'thin')}${ln(bar, 'hair')}${ln(below + thumbs, 'hair')}${ln(hl, 'thin hl')}` +
      `<g class="code">${CODE.map((c, i) => `<text class="mono" x="${CX}" y="${CY + i * LH}" xml:space="preserve">${i === EDIT ? (r ? '  border-radius: 32px;' : c) : c}</text>` +
        `<text class="mono num" x="${SX + 10}" y="${CY + i * LH}">${i + 1}</text>`).join('')}</g>` +
      `<text class="mono tabname" x="${SX + 18}" y="${SY + 21}">style.css</text>`;
  }

  return {
    keep: true,                                              // the same shot as psd: no fade between them
    css: `.ch-css .mono{font:500 11.5px ui-monospace,Menlo,Consolas,monospace;fill:currentColor;white-space:pre}
      .ch-css .num{opacity:.4;font-size:9px}.ch-css .tabname{font-size:9.5px;opacity:.8}`,
    backArt: () => {
      const desk = window.CHAPTERS.psd.desk;
      return `<defs><clipPath id="cssWipe"><circle class="wipe" cx="${CX + PRE}" cy="${EY - 4}" r="0"/></clipPath>
          <clipPath id="cssType"><rect class="type" x="${CX - 2}" y="${EY - 14}" width="${PRE + 2}" height="20"/></clipPath></defs>
        ${ln(`M-300 ${GY}H1900`, 'floor')}<g class="room">${desk(0)}</g>
        <rect class="glass" x="${SX}" y="${SY}" width="${SW}" height="${SH}" fill="#aed1ea" opacity=".16" filter="url(#b8)"/>
        <g class="before">${screen(0)}</g>
        <circle class="dot" cx="${SX + 212}" cy="${SY + 76}" r="3.5" fill="currentColor"/>
        <text class="mono new" x="${CX}" y="${EY}" clip-path="url(#cssType)" xml:space="preserve" opacity="0">  border-radius: 32px;</text>
        <rect class="caret" x="${CX + PRE}" y="${EY - 10}" width="1.6" height="12" fill="currentColor" opacity="0"/>
        <g class="after" clip-path="url(#cssWipe)">
          <rect x="-2400" y="-2000" width="6400" height="5000" fill="#3569ad"/>
          ${ln(`M-300 ${GY}H1900`, 'bold')}<g class="room2">${desk(1)}</g>
          <rect x="${SX}" y="${SY}" width="${SW}" height="${SH}" rx="18" fill="#aed1ea" opacity=".2" filter="url(#b8)"/>
          ${screen(1)}<circle cx="${SX + 300}" cy="${SY + 76}" r="4.5" fill="currentColor"/>
        </g>`;
    },
    build(tl, $) {
      draw(tl, $('.floor'), 0, .4);
      draw(tl, $('.room .ln'), 0, .5, .02);
      // the tutorial plays; he types along
      draw(tl, $('.before .ln'), .25, .6, .04);
      tl.fromTo($('.before .code text'), {opacity: 0}, {opacity: 1, duration: .08, stagger: .1}, .6);
      tl.fromTo($('.before .tabname'), {opacity: 0}, {opacity: .8, duration: .2}, .4);
      tl.fromTo($('.dot'), {x: 0}, {x: 92, duration: 1.7, ease: 'none'}, .45);
      // one line changes: the old value goes, the new one types in
      tl.fromTo($('.caret'), {opacity: 0}, {opacity: 1, duration: .05}, 2.1);
      tl.to($('.before .code text:nth-child(' + (EDIT * 2 + 1) + ')'), {opacity: 0, duration: .05}, 2.32);
      tl.set($('.new'), {opacity: 1}, 2.32);
      tl.fromTo($('.type'), {attr: {width: PRE + 2}}, {attr: {width: PRE + 70}, duration: .22, ease: 'steps(5)'}, 2.32);
      tl.fromTo($('.caret'), {x: 0}, {x: 5 * CW, duration: .22, ease: 'steps(5)'}, 2.32);
      tl.to($('.caret'), {opacity: 0, duration: .05}, 2.6);
      // and from that line, the whole room is redrawn
      tl.fromTo($('.wipe'), {attr: {r: 0}}, {attr: {r: 2400}, duration: .75, ease: 'power2.in'}, 2.6);
    },
    alive: true,
    fig: (t, life = 0) => ({lib: 'a', clip: 'Sitting_Talking_Loop', ct: t * .8 + life * .5, x: X, y: GY, s: S, yaw: 90}),
    // lean in on the screen for the change, then ease back to see the new room
    view: (t, narrow) => narrow
      ? {x: keys(t, [[0, 640], [1.9, 760]]), y: keys(t, [[0, 400], [1.9, 430], [3.8, 450]]), zoom: keys(t, [[0, .74], [1.9, .82], [2.1, 1.05], [2.7, 1.05], [3.3, .82]])}
      : {x: keys(t, [[0, 820], [.6, 820], [1.9, 800], [2.2, CX + PRE + 30], [2.7, CX + PRE + 30], [3.4, 800]]), y: keys(t, [[0, 466], [.6, 466], [1.9, 452], [2.2, EY - 10], [2.7, EY - 10], [3.4, 460]]),
         zoom: keys(t, [[0, 1.05], [.6, 1.05], [1.9, 1.04], [2.25, 1.9], [2.7, 1.9], [3.35, 1.04]])},
  };
})());
