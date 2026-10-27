// Quiet background music, played live in the browser. No recording to download and it never repeats exactly:
// a handful of soft electric-piano notes each loop on their own period, like the tape loops in Brian Eno's
// Music for Airports, so they keep meeting in new combinations. Under them a slow pad changes chord with each
// chapter, and everything sits in a long reverb.
window.SOUND = (() => {
  // chords per chapter, as MIDI notes. The loops only use D E F# A B, which sit well over all of them
  const MOODS = {
    intro:   {pad: [38, 50, 57, 64, 66], tone: 1300, notes: .8},  // D add9
    village: {pad: [43, 50, 59, 66], tone: 1800, notes: 1},       // G maj7
    night:   {pad: [47, 54, 62, 69], tone: 950, notes: .75},      // B min7
    wonder:  {pad: [40, 47, 55, 62, 66], tone: 1500, notes: .95}, // E min9
    bright:  {pad: [38, 50, 57, 64, 66], tone: 2600, notes: 1},   // D add9, opened up
    build:   {pad: [45, 52, 59, 64, 69], tone: 2000, notes: 1},   // A sus2
    drop:    {pad: [62, 69], tone: 800, notes: .4},               // the leap: nearly nothing
    bloom:   {pad: [43, 50, 57, 59, 66], tone: 2900, notes: 1},   // G 6/9
    resolve: {pad: [38, 50, 54, 57, 62], tone: 1700, notes: .9},  // D
    end:     {pad: [38, 50, 57, 62, 66], tone: 1200, notes: .7},
  };
  // [note, seconds between repeats, first entry]
  const LOOPS = [[66, 19.7, 1.5], [69, 17.8, 6.2], [74, 21.3, 9.9], [76, 24.7, 13.4], [71, 27.9, 3.6], [62, 31.6, 11.9], [81, 37.1, 16.7], [78, 41.3, 22.4], [57, 45.7, 27.3]];
  const hz = m => 440 * 2 ** ((m - 69) / 12);
  const LEVEL = 1.9;  // about -22 LUFS: present on laptop speakers, still well under the words you're reading

  // a long, dark hall: decaying noise, a little different in each ear
  function hall(ctx, secs = 5.2) {
    const n = Math.floor(ctx.sampleRate * secs), buf = ctx.createBuffer(2, n, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      let lp = 0;
      for (let i = 0; i < n; i++) {
        const t = i / n, k = .16 + .7 * t;                 // the tail darkens as it fades
        lp += (Math.random() * 2 - 1 - lp) * (1 - k);
        d[i] = lp * Math.pow(1 - t, 2.4) * (i < 400 ? i / 400 : 1);
      }
    }
    const c = ctx.createConvolver();
    c.buffer = buf;
    return c;
  }

  // the whole instrument, on any audio context (live, or offline for tests)
  function rig(ctx) {
    const out = ctx.createGain(); out.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -22; comp.knee.value = 14; comp.ratio.value = 2.4; comp.attack.value = .04; comp.release.value = .5;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 38; hp.Q.value = .5;  // no rumble, no DC from the FM
    out.connect(hp).connect(comp).connect(ctx.destination);
    const tone = ctx.createBiquadFilter(); tone.type = 'lowpass'; tone.frequency.value = 1300; tone.Q.value = .3;
    tone.connect(out);
    const pre = ctx.createDelay(); pre.delayTime.value = .035;
    const verb = hall(ctx), wet = ctx.createGain(); wet.gain.value = .9;
    pre.connect(verb).connect(wet).connect(tone);
    const keys = ctx.createGain(); keys.gain.value = .9;              // piano bus: some dry, lots of hall
    const kdry = ctx.createGain(); kdry.gain.value = .42;
    keys.connect(kdry).connect(tone); keys.connect(pre);
    const pads = ctx.createGain(); pads.gain.value = .55;
    const pdry = ctx.createGain(); pdry.gain.value = .5;
    pads.connect(pdry).connect(tone); pads.connect(pre);
    // air: filtered noise breathing very slowly underneath
    const nb = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate), nd = nb.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    const air = ctx.createBufferSource(); air.buffer = nb; air.loop = true;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 520; bp.Q.value = .5;
    const ag = ctx.createGain(); ag.gain.value = .012;
    const lfo = ctx.createOscillator(); lfo.frequency.value = .045;
    const lg = ctx.createGain(); lg.gain.value = .008;
    lfo.connect(lg).connect(ag.gain);
    air.connect(bp).connect(ag).connect(pre);
    air.start(); lfo.start();

    // one electric-piano note: a soft FM tone with a short bright tine on top
    function key(t, m, vel, pan) {
      const f = hz(m), end = t + 7.5;
      const car = ctx.createOscillator(), mod = ctx.createOscillator(), mg = ctx.createGain();
      car.frequency.value = f; mod.frequency.value = f;
      mg.gain.setValueAtTime(f * 1.25 * vel, t);
      mg.gain.exponentialRampToValueAtTime(f * .03, t + 2.6);
      mod.connect(mg).connect(car.frequency);
      const tine = ctx.createOscillator(), tg = ctx.createGain();
      tine.frequency.value = f * 4.01;
      tg.gain.setValueAtTime(.022 * vel, t); tg.gain.exponentialRampToValueAtTime(.0001, t + .5);
      const amp = ctx.createGain();
      amp.gain.setValueAtTime(0, t);
      amp.gain.linearRampToValueAtTime(.075 * vel, t + .014);
      amp.gain.exponentialRampToValueAtTime(.03 * vel, t + .9);
      amp.gain.exponentialRampToValueAtTime(.0001, end);
      const p = ctx.createStereoPanner(); p.pan.value = pan;
      car.connect(amp); tine.connect(tg).connect(amp);
      amp.connect(p).connect(keys);
      for (const o of [car, mod, tine]) { o.start(t); o.stop(end); }
    }

    // a held chord tone: two detuned saws through a soft filter, slow to swell and slow to fade
    function hold(m, t, level) {
      const f = hz(m), lp = ctx.createBiquadFilter(), g = ctx.createGain();
      lp.type = 'lowpass'; lp.frequency.value = Math.min(1500, 260 + f * 1.6); lp.Q.value = .4;
      g.gain.setValueAtTime(0, t); g.gain.setTargetAtTime(level, t, 2.2);
      // low notes get one clean oscillator (two detuned ones would wobble in the bass); higher ones a gentle chorus
      const os = (m < 50 ? [0] : [-4, 4]).map(c => { const o = ctx.createOscillator(); o.type = m < 50 ? 'triangle' : 'sawtooth'; o.frequency.value = f; o.detune.value = c; o.connect(lp); o.start(t); return o; });
      const p = ctx.createStereoPanner(); p.pan.value = (Math.random() - .5) * .7;
      lp.connect(g).connect(p).connect(pads);
      return at => { g.gain.cancelScheduledValues(at); g.gain.setTargetAtTime(0, at, 2.6); os.forEach(o => o.stop(at + 16)); };
    }

    let held = [], moodAt = [{t: 0, m: MOODS.intro}];
    const moodWhen = t => { let m = moodAt[0].m; for (const x of moodAt) if (x.t <= t) m = x.m; return m; };
    function mood(name, t) {
      const M = MOODS[name] || MOODS.intro;
      moodAt.push({t, m: M});
      held.forEach(stop => stop(t));
      held = M.pad.map(m => hold(m, t, m < 50 ? .04 : .032));
      tone.frequency.cancelScheduledValues(t);
      tone.frequency.setTargetAtTime(M.tone, t, 1.8);
    }
    const loops = LOOPS.map(([m, every, first]) => ({m, every, next: first, pan: (Math.random() - .5) * 1.2}));
    function schedule(until) {
      for (const L of loops) {
        while (L.next < until) {
          const M = moodWhen(L.next);
          if (Math.random() < M.notes) key(L.next, L.m, .55 + Math.random() * .4, L.pan);
          L.next += L.every;
        }
      }
    }
    return {out, mood, schedule, ctx};
  }

  // ---- live ----
  let ctx, r, timer, want = 'intro', applied = '', wait, on = false;
  function apply() {
    if (!r || want === applied) return;
    applied = want;
    r.mood(want, ctx.currentTime + .05);
  }
  function start() {
    on = true;
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      r = rig(ctx);
      applied = '';
      apply();
    }
    ctx.resume();
    const g = r.out.gain, t = ctx.currentTime;
    g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(LEVEL, t + 4);
    clearInterval(timer);
    timer = setInterval(() => r.schedule(ctx.currentTime + 1.5), 300);
    r.schedule(ctx.currentTime + 1.5);
  }
  function stop() {
    on = false;
    if (!ctx) return;
    const g = r.out.gain, t = ctx.currentTime;
    g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(0, t + 1.2);
    setTimeout(() => { if (!on) { clearInterval(timer); ctx.suspend(); } }, 1400);
  }
  // chapters can flash past while scrolling fast, so a chord only changes once a chapter has settled
  function mood(name) {
    want = name;
    clearTimeout(wait);
    wait = setTimeout(apply, 650);
  }
  document.addEventListener('visibilitychange', () => {
    if (!ctx || !on) return;
    if (document.hidden) ctx.suspend(); else ctx.resume();
  });

  // ---- offline, for checking the mix: render(seconds, [[time, mood], ...]) resolves to an AudioBuffer ----
  function render(secs, plan = [[0, 'intro']]) {
    const oc = new OfflineAudioContext(2, Math.ceil(44100 * secs), 44100), o = rig(oc);
    o.out.gain.setValueAtTime(0, 0); o.out.gain.linearRampToValueAtTime(LEVEL, 4);
    plan.forEach(([t, m]) => o.mood(m, t));
    o.schedule(secs);
    return oc.startRendering();
  }

  return {start, stop, mood, render, MOODS};
})();
