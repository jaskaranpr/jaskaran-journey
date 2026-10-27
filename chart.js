// Scroll-scrubbed candlestick chart. draw.chart(p, stage) is a pure function of p (0..1).
(window.draw = window.draw || {}).chart = (function () {
  var WHITE = '#fdfdfd', HAZE = '#aed1ea', NAVY = '#021533';
  var GRID = 'rgba(253,253,253,.07)', LABEL = 'rgba(253,253,253,.55)';
  var FONT = '500 11px Figtree, sans-serif';
  var N = 90, FAST = 9, SLOW = 21;

  // Seeded data, generated once: random walk with a mild uptrend.
  var seed = 20220401;
  function rnd() { return (seed = (seed * 16807) % 2147483647) / 2147483647; }
  var C = [], price = 24480;
  for (var i = 0; i < N; i++) {
    var o = price, c = o + (rnd() - 0.44) * 38;
    C.push({ o: o, c: c, h: Math.max(o, c) + rnd() * 16, l: Math.min(o, c) - rnd() * 16 });
    price = c + (rnd() - 0.5) * 4;
  }
  function ema(n) {
    var k = 2 / (n + 1), out = [], v = C[0].c;
    for (var i = 0; i < N; i++) out.push(v = i ? C[i].c * k + v * (1 - k) : v);
    return out;
  }
  var fast = ema(FAST), slow = ema(SLOW);

  // Crossovers (after slow EMA settles) and a long-only equity curve.
  var marks = [], eq = [0];
  for (i = 1; i < N; i++) {
    var was = fast[i - 1] > slow[i - 1], is = fast[i] > slow[i];
    if (i > SLOW && was !== is) marks.push({ i: i, up: is });
    eq.push(eq[i - 1] + (was ? C[i].c - C[i - 1].c : 0));
  }
  var eqLo = Math.min.apply(null, eq), eqHi = Math.max.apply(null, eq);

  var lo0 = Infinity, hi0 = -Infinity;
  C.forEach(function (d) { lo0 = Math.min(lo0, d.l); hi0 = Math.max(hi0, d.h); });
  var entryIdx = N - 16, entry = C[entryIdx].c;
  var TP = entry + (hi0 - lo0) * 0.16, SL = entry - (hi0 - lo0) * 0.08;
  var lo = Math.min(lo0, SL), hi = Math.max(hi0, TP), pad = (hi - lo) * 0.06;
  lo -= pad; hi += pad;

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function seg(p, a, b) { return clamp((p - a) / (b - a)); }
  function ease(t) { return 1 - Math.pow(1 - t, 3); }
  function px(v) { return Math.round(v) + 0.5; }

  var canvas, ctx, W = 0, H = 0, D = 0, last = -1;

  return function (p, stage) {
    var cv = stage.querySelector('canvas.chart-canvas');
    if (!cv) return;
    var w = cv.clientWidth, h = cv.clientHeight;
    if (!w || !h) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (cv !== canvas || w !== W || h !== H || dpr !== D) {
      canvas = cv; ctx = cv.getContext('2d');
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      W = w; H = h; D = dpr; last = -1;
    }
    if (last >= 0 && Math.abs(p - last) <= 0.0005) return;
    last = p;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.font = FONT;
    ctx.textBaseline = 'middle';

    var narrow = w < 700;
    var x0 = w * (narrow ? 0.04 : 0.06), x1 = w * (narrow ? 0.88 : 0.92);
    var y0 = h * (narrow ? 0.14 : 0.10), y1 = h * (narrow ? 0.58 : 0.62);
    var py0 = h * 0.64, py1 = h * 0.74;
    var slot = (x1 - x0) / N, bw = Math.max(1, Math.round(slot * 0.7));
    function xOf(i) { return x0 + slot * (i + 0.5); }
    function yOf(v) { return y0 + (hi - v) / (hi - lo) * (y1 - y0); }
    function fmt(v) { return narrow ? String(Math.round(v)) : Math.round(v).toLocaleString('en-IN'); }
    function pill(x, y, text, bg, alignRight) {
      var pw = ctx.measureText(text).width + (narrow ? 8 : 12), ph = 18;
      if (alignRight) x -= pw;
      ctx.fillStyle = bg;
      ctx.beginPath(); ctx.roundRect(x, y - ph / 2, pw, ph, ph / 2); ctx.fill();
      ctx.fillStyle = NAVY;
      ctx.fillText(text, x + (narrow ? 4 : 6), y + 0.5);
    }
    function hline(y, xa, color, dash) {
      ctx.strokeStyle = color; ctx.setLineDash(dash || []);
      ctx.beginPath(); ctx.moveTo(xa, px(y)); ctx.lineTo(x1, px(y)); ctx.stroke();
      ctx.setLineDash([]);
    }
    // Polyline over series s up to fractional index t (0..N-1).
    function trace(s, t, yf) {
      var n = Math.floor(t);
      ctx.beginPath(); ctx.moveTo(xOf(0), yf(s[0]));
      for (var i = 1; i <= n; i++) ctx.lineTo(xOf(i), yf(s[i]));
      if (n < N - 1 && t > n) ctx.lineTo(xOf(n + (t - n)), yf(s[n] + (s[n + 1] - s[n]) * (t - n)));
    }

    // Grid + right price axis.
    var a = seg(p, 0, 0.08);
    if (a > 0) {
      ctx.globalAlpha = a; ctx.lineWidth = 1;
      ctx.strokeStyle = GRID;
      for (var g = 0; g <= 5; g++) {
        var gv = lo + (hi - lo) * g / 5, gy = px(yOf(gv));
        ctx.beginPath(); ctx.moveTo(x0, gy); ctx.lineTo(x1, gy); ctx.stroke();
        ctx.fillStyle = LABEL; ctx.fillText(fmt(gv), x1 + 6, gy);
      }
      for (var vi = 0; vi < N; vi += 15) {
        var gx = px(xOf(vi));
        ctx.beginPath(); ctx.moveTo(gx, y0); ctx.lineTo(gx, y1); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // Candles, newest one growing in place.
    var cp = seg(p, 0.04, 0.45) * N, full = Math.min(N, Math.floor(cp)), frac = cp - full;
    var newest = -1, newestClose = 0;
    function candle(i, d, glow) {
      var up = d.c >= d.o, col = up ? WHITE : HAZE, x = xOf(i);
      var top = Math.round(yOf(Math.max(d.o, d.c))), bot = Math.round(yOf(Math.min(d.o, d.c)));
      if (glow) { ctx.shadowBlur = 18; ctx.shadowColor = 'rgba(243,246,255,.8)'; }
      ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px(x), Math.round(yOf(d.h))); ctx.lineTo(px(x), Math.round(yOf(d.l))); ctx.stroke();
      var bx = Math.round(x - bw / 2), bh = Math.max(1, bot - top);
      if (up || bw < 3) ctx.fillRect(bx, top, bw, bh);
      else { ctx.fillStyle = NAVY; ctx.fillRect(bx, top, bw, bh); ctx.strokeRect(bx + 0.5, top + 0.5, bw - 1, bh - 1); }
      ctx.shadowBlur = 0;
    }
    for (i = 0; i < full; i++) candle(i, C[i], false);
    if (full < N && frac > 0) {
      var d = C[full], f = ease(frac), cur = d.o + (d.c - d.o) * f;
      candle(full, {
        o: d.o, c: cur,
        h: Math.max(d.o, cur) + (d.h - Math.max(d.o, d.c)) * frac,
        l: Math.min(d.o, cur) - (Math.min(d.o, d.c) - d.l) * frac
      }, true);
      newest = full; newestClose = cur;
    } else if (full > 0) {
      newest = full - 1; newestClose = C[newest].c;
      candle(newest, C[newest], true);
    }
    if (newest >= 0) {
      ctx.lineWidth = 1;
      hline(yOf(newestClose), x0, 'rgba(243,246,255,.45)', [3, 4]);
      pill(x1 + 4, yOf(newestClose), fmt(newestClose), WHITE);
    }

    // EMAs, never ahead of the candles.
    var et = Math.min(seg(p, 0.30, 0.52) * (N - 1), Math.max(0, cp - 1));
    if (et > 0) {
      ctx.lineWidth = 1.5; ctx.lineJoin = 'round';
      ctx.strokeStyle = HAZE; trace(slow, et, yOf); ctx.stroke();
      ctx.strokeStyle = WHITE; trace(fast, et, yOf); ctx.stroke();
    }

    // Trade overlay: entry, TP/SL dragged out from entry.
    var ta = seg(p, 0.48, 0.52);
    if (ta > 0) {
      var ex = xOf(entryIdx), ey = yOf(entry);
      var tpy = yOf(entry + (TP - entry) * ease(seg(p, 0.50, 0.66)));
      var sly = yOf(entry + (SL - entry) * ease(seg(p, 0.53, 0.68)));
      ctx.globalAlpha = ta; ctx.lineWidth = 1;
      ctx.fillStyle = 'rgba(243,246,255,.06)'; ctx.fillRect(ex, tpy, x1 - ex, ey - tpy);
      ctx.fillStyle = 'rgba(143,178,238,.06)'; ctx.fillRect(ex, ey, x1 - ex, sly - ey);
      hline(ey, ex, WHITE);
      hline(tpy, ex, WHITE, [5, 4]);
      hline(sly, ex, HAZE, [5, 4]);
      ctx.fillStyle = WHITE; ctx.beginPath(); ctx.arc(ex, ey, 3, 0, Math.PI * 2); ctx.fill();
      pill(x1 - 4, tpy, 'Target', WHITE, true);
      pill(x1 - 4, sly, 'Stop', HAZE, true);
      ctx.globalAlpha = 1;
    }

    // Backtest: crossover markers + equity curve.
    var mt = seg(p, 0.62, 0.85) * marks.length;
    for (var m = 0; m < marks.length && m < mt; m++) {
      var mk = marks[m], mx = xOf(mk.i), s = 5;
      ctx.globalAlpha = clamp(mt - m);
      ctx.fillStyle = mk.up ? WHITE : HAZE;
      ctx.beginPath();
      if (mk.up) { var my = yOf(C[mk.i].l) + 8; ctx.moveTo(mx, my); ctx.lineTo(mx - s, my + s * 1.6); ctx.lineTo(mx + s, my + s * 1.6); }
      else { var my2 = yOf(C[mk.i].h) - 8; ctx.moveTo(mx, my2); ctx.lineTo(mx - s, my2 - s * 1.6); ctx.lineTo(mx + s, my2 - s * 1.6); }
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    var pa = seg(p, 0.62, 0.66);
    if (pa > 0) {
      var qt = seg(p, 0.66, 0.92) * (N - 1);
      var qy = function (v) { return py1 - (v - eqLo) / (eqHi - eqLo || 1) * (py1 - py0 - 14); };
      ctx.globalAlpha = pa;
      ctx.fillStyle = LABEL; ctx.textBaseline = 'top'; ctx.fillText('Tested on past days', x0, py0);
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = GRID; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, px(py1)); ctx.lineTo(x1, px(py1)); ctx.stroke();
      if (qt > 0) {
        var endX = xOf(Math.min(qt, N - 1));
        trace(eq, qt, qy);
        ctx.lineTo(endX, py1); ctx.lineTo(xOf(0), py1); ctx.closePath();
        ctx.fillStyle = 'rgba(243,246,255,.12)'; ctx.fill();
        ctx.strokeStyle = WHITE; ctx.lineWidth = 1.5;
        trace(eq, qt, qy); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
  };
})();
