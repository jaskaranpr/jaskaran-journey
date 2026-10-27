// One person, drawn as a soft white cut-out like the people in the Fold film.
// The body hangs off a skeleton measured in centimetres (he's 5'10"), so the same code can stand, walk, sit, ride and lie down.
// Feet rest on y = 0 and y grows downwards, as in SVG. Side views face right; flip the group to face left.
window.FIG = (() => {
  const R = Math.PI / 180;
  const P = (x, y) => ({x, y});
  const add = (a, b) => P(a.x + b.x, a.y + b.y);
  const sub = (a, b) => P(a.x - b.x, a.y - b.y);
  const mul = (a, k) => P(a.x * k, a.y * k);
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const rot = (a, d) => { const c = Math.cos(d * R), s = Math.sin(d * R); return P(a.x * c - a.y * s, a.x * s + a.y * c); };
  // a limb hanging d degrees from straight down; positive swings it forward
  const hang = d => P(Math.sin(d * R), Math.cos(d * R));
  const lerp = (a, b, t) => a + (b - a) * t;

  // seeded random, so hair curls stay put from frame to frame
  const rng = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  // closed Catmull-Rom spline through points, sampled into a polygon
  function smooth(pts, n = 5) {
    const out = [], m = pts.length;
    for (let i = 0; i < m; i++) {
      const p0 = pts[(i - 1 + m) % m], p1 = pts[i], p2 = pts[(i + 1) % m], p3 = pts[(i + 2) % m];
      for (let k = 0; k < n; k++) {
        const t = k / n, t2 = t * t, t3 = t2 * t;
        out.push(P(
          .5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
          .5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)));
      }
    }
    return out;
  }
  // every shape winds the same way, so overlaps add up instead of punching holes
  function orient(pts) {
    let a = 0;
    for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; a += p.x * q.y - q.x * p.y; }
    return a < 0 ? pts.slice().reverse() : pts;
  }
  const ring = (c, rx, ry = rx, n = 18, tilt = 0) => Array.from({length: n}, (_, i) => add(c, rot(P(Math.cos(i / n * 2 * Math.PI) * rx, Math.sin(i / n * 2 * Math.PI) * ry), tilt)));
  // a limb segment: round at both ends, thick at a and thinner at b
  function limb(a, ra, b, rb, n = 6) {
    const u = mul(sub(b, a), 1 / (dist(a, b) || 1)), side = P(-u.y, u.x), pts = [];
    for (let i = 0; i <= n; i++) pts.push(add(b, mul(rot(side, -180 * i / n), rb)));       // far cap bulges past b
    for (let i = 0; i <= n; i++) pts.push(add(a, mul(rot(side, -180 - 180 * i / n), ra))); // near cap bulges behind a
    return pts;
  }
  // local shape (x forward, y down) placed at origin o, turned by d degrees
  const place = (pts, o, d = 0, sx = 1) => pts.map(p => add(o, rot(P(p.x * sx, p.y), d)));
  const path = shapes => shapes.map(s => 'M' + orient(s).map(p => p.x.toFixed(1) + ' ' + p.y.toFixed(1)).join('L') + 'Z').join('');

  // two-bone reach: the middle joint (knee, elbow) for a limb from a to target t; side picks which way it bends
  function reach(a, t, l1, l2, side) {
    let d = dist(a, t);
    d = Math.min(d, l1 + l2 - .01);
    const u = mul(sub(t, a), 1 / (dist(a, t) || 1));
    const x = (l1 * l1 - l2 * l2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, l1 * l1 - x * x));
    return add(add(a, mul(u, x)), mul(P(-u.y * side, u.x * side), h));
  }
  const angOf = v => Math.atan2(v.x, v.y) / R; // inverse of hang()

  const BUILD = {
    adult: {hip: 91, torso: 54, neck: 9, thigh: 43, shin: 40, upper: 30, fore: 26, k: 1, head: 1, hair: 1},
    kid:   {hip: 66, torso: 41, neck: 6, thigh: 31, shin: 28, upper: 22, fore: 19, k: .76, head: .93, hair: .9},
  };

  // ---- side view parts, in local frames (x forward, y down) ----
  // torso around the hip joint; t-shirt over a slim frame
  const TORSO = [P(-4, -58), P(2, -59), P(7, -55), P(11, -46), P(12, -37), P(10.5, -26), P(10, -15), P(10.5, -5), P(9, 3), P(3, 8),
    P(-5, 8), P(-11, 3), P(-12, -5), P(-9.5, -15), P(-9.5, -27), P(-11.5, -40), P(-10, -51)];
  // head around the skull centre: forehead, nose, lips, chin, then jaw back to the neck
  const FACE = [P(9.5, -5), P(10.3, 0), P(10.4, 2.5), P(12.8, 6.6), P(10.9, 8.2), P(11.3, 9.8), P(10.6, 11), P(10.8, 12.4), P(9.6, 14.6),
    P(6, 15.3), P(1.5, 13.5), P(-3, 11), P(-7.5, 8), P(-10, 3), P(-10.6, -3), P(-8.5, -9), P(-3, -12.2), P(3.5, -11.6), P(8, -8.8)];
  const SHOE = [P(-7, 3), P(-6.5, -3.5), P(-1.5, -5), P(5, -3.2), P(12, 1), P(19, 3.2), P(21.5, 6), P(20, 8.6), P(6, 9.2), P(-6.5, 8.8)];
  const HAND = [P(0, -3.3), P(6, -4.4), P(12, -3.6), P(17, -1.8), P(18.5, .6), P(15.5, 3.2), P(9, 4.4), P(3, 4), P(-.5, 2.4)];

  // a head in profile facing right, centred on the skull, turned by d degrees: face, then a mop of curls over the crown and back
  function head(c, d, sc, seed) {
    const out = [place(smooth(FACE.map(p => mul(p, sc * .9)), 4), c, d)], r = rng(seed);
    const n = 26;
    for (let i = 0; i < n; i++) {
      const a = lerp(-38, -222, i / (n - 1)) + (r() - .5) * 5;           // from the hairline, over the top, down the back
      const top = Math.max(0, -Math.sin(a * R)), back = Math.max(0, -Math.cos(a * R));
      const rr = (3.2 + r() * 2 + top * 2.6) * sc;
      const off = (10 + top * 3.4 + back * .8 + r() * 1.5) * sc;
      out.push(ring(add(c, rot(P(Math.cos(a * R) * off, Math.sin(a * R) * off), d)), rr, rr, 10));
    }
    for (let i = 0; i < 12; i++) {                                          // loose curls standing proud
      const a = lerp(-50, -205, r()), top = Math.max(0, -Math.sin(a * R));
      const rr = (2 + r() * 1.7) * sc, off = (14.6 + top * 3 + r() * 1.8) * sc;
      out.push(ring(add(c, rot(P(Math.cos(a * R) * off, Math.sin(a * R) * off), d)), rr, rr, 8));
    }
    out.push(ring(add(c, rot(P(-2, 0), d)), 10.4 * sc, 11.2 * sc, 20));     // fill the skull under the curls
    return out;
  }

  // ---- side view: build every shape from a pose ----
  // pose: {x, y: pelvis position (default stands on the ground), lean, neck, head (degrees, + is forward),
  //        legs: [{thigh, knee, ankle} near, far], arms: [{upper, elbow, wrist} near, far],
  //        or reach targets: legs[i].to / arms[i].to = point in body coords}
  function side(pose, build = 'adult', seed = 11) {
    const B = BUILD[build], k = B.k, shapes = [];
    const root = P(pose.x || 0, pose.y ?? -B.hip);
    const lean = pose.lean || 0;
    const spine = rot(P(0, -1), lean);
    const shoulder = add(root, mul(spine, B.torso));
    const neckTop = add(add(root, mul(spine, B.torso + 3 * k)), mul(rot(P(0, -1), pose.neck ?? lean), B.neck));
    const headD = pose.head ?? lean;
    const skull = add(neckTop, rot(P(-1.6 * B.head, -10.6 * B.head), headD));
    const joints = {root, shoulder, skull};

    // legs: hip -> knee -> ankle -> foot
    (pose.legs || []).forEach((L, i) => {
      const hip = add(root, rot(P(i ? -1.5 : 1.5, 0), lean));
      let knee, ankle;
      if (L.to) { ankle = L.to; knee = reach(hip, ankle, B.thigh, B.shin, L.side ?? -1); }
      else { knee = add(hip, mul(hang(L.thigh), B.thigh)); ankle = add(knee, mul(hang(L.thigh - L.knee), B.shin)); }
      const shinD = angOf(sub(ankle, knee));
      const foot = -shinD - (L.ankle || 0) + (L.to ? L.footAng ?? shinD : 0);
      shapes.push(limb(hip, 8.6 * k, knee, 5.9 * k), limb(knee, 5.8 * k, ankle, 4.5 * k));
      shapes.push(place(SHOE.map(p => mul(p, k * .98)), ankle, L.to ? (L.footAng ?? 0) : foot));
      joints['ankle' + i] = ankle; joints['knee' + i] = knee;
    });
    // torso, neck, head
    shapes.push(place(smooth(TORSO.map(p => P(p.x * k, p.y * k)), 4), root, lean));
    shapes.push(limb(add(root, mul(spine, B.torso - 2 * k)), 6.4 * k, neckTop, 5.4 * k));
    shapes.push(...head(skull, headD, B.head, seed));
    // arms: shoulder -> elbow -> wrist -> hand
    (pose.arms || []).forEach((A, i) => {
      const sh = add(shoulder, rot(P(i ? -2.2 : 0, 3 * k), lean));
      let elbow, wrist;
      if (A.to) { wrist = A.to; elbow = reach(sh, wrist, B.upper, B.fore, A.side ?? 1); }
      else { elbow = add(sh, mul(hang(A.upper), B.upper)); wrist = add(elbow, mul(hang(A.upper + A.elbow), B.fore)); }
      const foreD = angOf(sub(wrist, elbow));
      shapes.push(limb(sh, 5.6 * k, elbow, 4.4 * k), limb(elbow, 4.3 * k, wrist, 3.1 * k));
      shapes.push(place(HAND.map(p => mul(p, k * .92)), wrist, 90 - foreD + (A.wrist || 0)));
      joints['wrist' + i] = wrist; joints['elbow' + i] = elbow;
    });
    return {d: path(shapes), joints};
  }

  // ---- walking: one stride every phase 0..1, the near leg strikes at 0 ----
  // keyframes from the classic contact / down / passing / up cycle
  const WK = [ // phase, thigh, knee, ankle
    [0, 21, 3, -12], [.1, 17, 16, 0], [.3, 2, 6, 0], [.5, -16, 9, 8], [.62, -10, 40, 26], [.76, 12, 58, 6], [.9, 25, 14, -8], [1, 21, 3, -12]];
  function cyc(ph, col) {
    ph = ((ph % 1) + 1) % 1;
    for (let i = 0; i < WK.length - 1; i++) {
      const a = WK[i], b = WK[i + 1];
      if (ph <= b[0]) { const t = (ph - a[0]) / (b[0] - a[0]), e = t * t * (3 - 2 * t); return lerp(a[col], b[col], e); }
    }
    return WK[0][col];
  }
  function walk(ph, build = 'adult', extra = {}) {
    const leg = o => ({thigh: cyc(ph + o, 1), knee: cyc(ph + o, 2), ankle: cyc(ph + o, 3)});
    const sw = Math.cos(ph * 2 * Math.PI);
    const pose = {lean: 4, neck: 3, head: 1, ...extra,
      legs: [leg(0), leg(.5)],
      arms: [{upper: -17 * sw + 2, elbow: 14 + 12 * Math.max(0, -sw)}, {upper: 17 * sw + 2, elbow: 14 + 12 * Math.max(0, sw)}]};
    // drop the body until the lowest foot touches the ground
    const B = BUILD[build];
    let low = -1e9;
    pose.y = -B.hip;
    const probe = side(pose, build);
    for (const i of [0, 1]) low = Math.max(low, probe.joints['ankle' + i].y + 8.6 * B.k);
    pose.y = -B.hip - low;
    return side(pose, build);
  }
  const STRIDE = 128; // cm travelled per full cycle, matched so planted feet don't skate

  // ---- front view, standing; hands can go in pockets ----
  function front(o = {}, seed = 5) {
    const s = [], pockets = o.pockets, hs = 1;
    const head = P(0, -165), tilt = o.tilt || 0;
    // legs
    for (const sx of [-1, 1]) {
      const hip = P(sx * 9.5, -90), knee = P(sx * (10 + (o.spread || 0) * .5), -48), ankle = P(sx * (10.5 + (o.spread || 0)), -8);
      s.push(limb(hip, 9.4, knee, 6.4), limb(knee, 6.2, ankle, 4.8));
      s.push(ring(P(ankle.x + sx * 1.5, -4.2), 6.2, 4.8, 12));
    }
    // torso: shoulders, chest, waist, hips
    s.push(smooth([P(-7, -153), P(7, -153), P(16, -149), P(22.5, -144), P(23, -136), P(19, -122), P(17, -106), P(17.5, -92), P(16, -84),
      P(0, -82), P(-16, -84), P(-17.5, -92), P(-17, -106), P(-19, -122), P(-23, -136), P(-22.5, -144), P(-16, -149)], 4));
    s.push(limb(P(0, -150), 6.6, P(0, -158), 6));
    // arms
    for (const sx of [-1, 1]) {
      const sh = P(sx * 19.5, -141);
      if (pockets) {
        const el = P(sx * 25, -113), wr = P(sx * 15.5, -92);
        s.push(limb(sh, 5.6, el, 4.6), limb(el, 4.5, wr, 3.6));
      } else {
        const el = P(sx * 22, -113), wr = P(sx * 21.5, -88);
        s.push(limb(sh, 5.6, el, 4.5), limb(el, 4.4, wr, 3.3), ring(P(sx * 21.2, -80), 3.6, 7, 12, sx * 4));
      }
    }
    // head, ears, curls
    s.push(ring(head, 8.3 * hs, 11.4 * hs, 22, tilt));
    s.push(ring(add(head, P(-8.4, 1.5)), 2.1, 3.3, 8), ring(add(head, P(8.4, 1.5)), 2.1, 3.3, 8));
    const r = rng(seed);
    for (let i = 0; i < 24; i++) {
      const a = lerp(-188, 8, i / 23), top = Math.max(0, -Math.sin(a * R));
      const rr = 3 + r() * 2.2 + top * 1.4, off = 9 + top * 4.2 + r() * 1.4;
      s.push(ring(add(head, P(Math.cos(a * R) * (off - 1.4), Math.sin(a * R) * (off + 1.5) - 2 - top * 1.2)), rr, rr, 10));
    }
    for (let i = 0; i < 6; i++) { const a = lerp(-170, -10, r()), rr = 2 + r() * 1.5, off = 15 + r() * 2; s.push(ring(add(head, P(Math.cos(a * R) * off * .9, Math.sin(a * R) * off - 1)), rr, rr, 8)); }
    return {d: path(s), head};
  }

  // ---- close-up: head and shoulders from behind, face turned up and to the right, like the film's opening shot ----
  // units are centimetres centred on the base of the neck; returns the body and where the eye sits
  function bust(o = {}, seed = 9) {
    const up = o.up ?? -16, c = P(5, -24);
    const s = [smooth([P(-50, 46), P(-48, 28), P(-42, 17), P(-31, 9), P(-19, 3), P(-10, -3), P(-4, -9), P(7, -9), P(13, -3), P(22, 2), P(33, 8), P(43, 16),
      P(49, 28), P(51, 46)], 5)];                                               // shoulders under a t-shirt
    s.push(limb(P(0, 3), 10, add(c, P(-1.5, 8)), 8.2));                         // neck
    s.push(...head(c, up, 1.08, seed));
    return {d: path(s), eye: add(c, rot(P(7.2, -.8), up))};
  }

  // the eye from the film: a heavy brow, and an ink almond with a white ball showing at one side.
  // c is the almond's centre, sc its scale (the almond is 10 units wide), look slides the white ball along it
  let eyes = 0;
  function eye(c, sc = 1, look = 1, tilt = -24) {
    const id = 'eyeclip' + (++eyes);
    return `<g class="eye" transform="translate(${c.x.toFixed(1)} ${c.y.toFixed(1)}) rotate(${tilt}) scale(${sc})">` +
      `<clipPath id="${id}"><path d="M-5 0Q-.5 -7.2 5 0Q0 2.8 -5 0Z"/></clipPath>` +
      `<path class="brow" d="M-8.6 -2.4Q-6.8 -6.8 -1.2 -7.6" fill="none" stroke="#0b1d44" stroke-width="2.1" stroke-linecap="round"/>` +
      `<g class="lid"><path d="M-5 0Q-.5 -7.2 5 0Q0 2.8 -5 0Z" fill="#0b1d44"/><circle clip-path="url(#${id})" cx="${(1.7 * look).toFixed(2)}" cy="1" r="2.35" fill="#fdfdfd"/></g></g>`;
  }

  return {side, walk, front, bust, eye, reach, STRIDE, BUILD, P, smooth, ring, limb, place, path, rot, add};
})();
