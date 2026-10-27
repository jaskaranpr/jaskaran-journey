// Runs the story. Each scene is a stretch of page you scroll through; while you do, its stage stays fixed on screen,
// a camera drifts through its layers and the words fade in and out. The scroll is eased, so the camera glides.
(() => {
  const BW = 1600, BH = 900;
  const $ = s => document.querySelector(s);
  const clamp = K.clamp;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  // ---- build the page from the story ----
  const scenes = STORY.map((st, i) => {
    const def = SCENES[st.id] || {};
    const el = document.createElement('section');
    el.className = 'scene';
    el.dataset.id = st.id;
    el.style.setProperty('--len', st.len);
    const stage = document.createElement('div');
    stage.className = `stage s-${st.id}${st.light ? ' light' : ''}`;
    if (def.bg) stage.style.background = def.bg;
    const world = document.createElement('div');
    world.className = 'world';
    world.setAttribute('aria-hidden', 'true');
    const copy = document.createElement('div');
    copy.className = 'copy';
    // word fades take about half a screen of scrolling, whatever the scene's length
    copy.style.cssText = `--fi:${(.42 / st.len).toFixed(4)};--fo:${(.3 / st.len).toFixed(4)}`;
    copy.innerHTML = st.beats.map(b => {
      const a = b.at[0] <= 0 ? -1 : b.at[0];   // a beat that starts at 0 is already showing when you arrive
      const cls = `beat pos-${b.pos || 'bottom'} size-${b.size || 'l'}${b.ink ? ' ink' : ''}`;
      if (b.html) return `<div class="${cls} whole" style="--a:${a};--b:${b.at[1]}">${b.html}</div>`;
      const words = b.text.split(' ');
      const st2 = Math.min(.012, .32 * (b.at[1] - b.at[0]) / words.length);
      return `<p class="${cls}" style="--a:${a};--b:${b.at[1]};--st:${st2.toFixed(4)}">` +
        words.map((w, k) => `<span class="w" style="--k:${k}">${esc(w)}</span>`).join(' ') + '</p>';
    }).join('');
    stage.append(world, copy);
    el.append(stage);
    $('#story').append(el);
    return {i, st, def, el, stage, world, copy, layers: [], built: false, live: false};
  });
  const lastScene = scenes[scenes.length - 1];

  // paint a scene's layers the first time it's needed (or when the browser is idle)
  function build(s) {
    if (s.built) return;
    s.built = true;
    const list = typeof s.def.layers === 'function' ? s.def.layers() : (s.def.layers || []);
    s.world.innerHTML = list.map(L => {
      const cls = `L${L.cls ? ' ' + L.cls : ''}`, st = L.style ? ` style="${L.style}"` : '';
      return L.html != null ? `<div class="${cls}"${st}>${L.html}</div>`
        : `<svg class="${cls}"${st} viewBox="0 0 ${BW} ${BH}" overflow="visible">${L.svg || ''}</svg>`;
    }).join('');
    s.layers = [...s.world.children].map((node, k) => ({node, z: list[k].z ?? 1}));
    if (s.def.css) document.head.insertAdjacentHTML('beforeend', `<style>${s.def.css}</style>`);
    s.def.init?.(s.stage, s);
    place(s);
  }
  const idle = window.requestIdleCallback || (f => setTimeout(f, 120));
  const buildSoon = k => { if (k < scenes.length) idle(() => { build(scenes[k]); buildSoon(k + 1); }); };

  // ---- sizing: the 1600 x 900 board covers the screen; on narrow screens it slides to keep the scene's subject in view.
  // focus is the board x of the subject, or a function of progress when the subject moves ----
  let W, H, S, vh;
  function place(s, p = s.p || 0) {
    const f = s.def.focus, fx = typeof f === 'function' ? f(p) : f ?? 800;
    const left = Math.min(0, Math.max(W - BW * S, W / 2 - fx * S));
    if (s.size !== S) { s.size = S; s.world.style.cssText = `width:${BW * S}px;height:${BH * S}px`; }
    s.world.style.transform = `translate3d(${left.toFixed(1)}px,${((H - BH * S) / 2).toFixed(1)}px,0)`;
  }
  function measure() {
    W = innerWidth; H = innerHeight; vh = H;
    S = Math.max(W / BW, H / BH);
    document.documentElement.style.setProperty('--S', S);
    scenes.forEach(s => { s.top = s.el.offsetTop; s.h = s.el.offsetHeight; s.size = 0; if (s.built) place(s); });
    render(true);
  }
  const span = s => s.h - (s === lastScene ? vh : 0);

  // ---- the camera and everything else that follows the scroll ----
  const veil = $('#veil'), chapter = $('#chapter'), prog = $('#prog'), rail = $('#rail');
  let cur = scrollY, target = scrollY, active = -1, onLight = false;
  function render(force) {
    let now = 0, veilA = 0, veilC = '';
    for (const s of scenes) {
      const d = cur - s.top, next = scenes[s.i + 1];
      if (cur >= s.top - .45 * vh) now = s.i;
      if (s.i && (s.st.cut === 'black' || s.st.cut === 'white') && Math.abs(d) < .5 * vh) {
        const a = 1 - Math.abs(d) / (.5 * vh);
        if (a > veilA) { veilA = a; veilC = s.st.cut; }
      }
      const fade = s.i && s.st.cut === 'fade' ? .8 * vh : 0;
      const live = cur >= s.top - fade && (!next || cur < next.top);
      if (live !== s.live) { s.stage.classList.toggle('on', live); s.live = live; }
      if (!live) continue;
      build(s);
      const p = clamp(d / span(s));
      s.stage.style.opacity = fade ? clamp((d + fade) / fade).toFixed(3) : '';
      if (s.p === p && !force) continue;
      s.p = p;
      s.copy.style.setProperty('--p', p.toFixed(4));
      const c = s.def.cam ? s.def.cam(p) : {};
      const x = c.x || 0, y = c.y || 0, zoom = c.zoom || 1, ox = (c.ox ?? 800) * S, oy = (c.oy ?? 450) * S;
      for (const L of s.layers) {
        const k = 1 + (zoom - 1) * L.z;
        L.node.style.transformOrigin = `${ox}px ${oy}px`;
        L.node.style.transform = `translate3d(${(-x * L.z * S).toFixed(2)}px,${(-y * L.z * S).toFixed(2)}px,0) scale(${k.toFixed(4)})`;
      }
      if (typeof s.def.focus === 'function') place(s, p);
      s.def.frame?.(p, s.stage, s);
    }
    veil.style.opacity = veilA.toFixed(3);
    if (veilC) veil.dataset.c = veilC;
    if (now !== active) {
      const s = scenes[now];
      rail.children[active]?.removeAttribute('aria-current');
      rail.children[now]?.setAttribute('aria-current', 'true');
      chapter.textContent = now ? s.st.label : '';
      window.SOUND?.mood(s.st.mood);
      active = now;
    }
    // light scenes (or the light end of one, from lightFrom on) turn the page chrome dark
    const A = scenes[active], light = !!A.st.light || (A.st.lightFrom != null && (A.p || 0) >= A.st.lightFrom);
    if (light !== onLight) { document.body.classList.toggle('on-light', light); onLight = light; }
    prog.style.transform = `scaleX(${clamp(cur / (document.documentElement.scrollHeight - vh)).toFixed(4)})`;
  }

  // eased scroll: the page scrolls natively, the camera catches up a beat later
  let running = false, then = 0;
  function tick(t) {
    const dt = Math.min(64, t - (then || t));
    then = t;
    const d = target - cur;
    cur = reduce || Math.abs(d) < .4 ? target : cur + d * (1 - Math.exp(-dt / 105));
    render();
    if (cur !== target) requestAnimationFrame(tick); else { running = false; then = 0; }
  }
  const kick = () => { if (!running) { running = true; requestAnimationFrame(tick); } };
  // long jumps skip straight to the neighbourhood of the target, so they don't flash through every scene on the way
  function jump(y) {
    target = y;
    if (Math.abs(target - cur) > 1.5 * vh) cur = target - Math.sign(target - cur) * .35 * vh;
    scrollTo(0, y);
    kick();
  }

  // ---- chapters rail ----
  scenes.forEach(s => {
    const b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = `<span>${s.st.label}</span>`;
    b.setAttribute('aria-label', s.st.label);
    b.onclick = () => jump(s.top + (s.i ? 2 : 0));
    rail.append(b);
  });

  // ---- sound and the opening gate ----
  const gate = $('#gate'), snd = $('#sound');
  const setSound = on => {
    snd.setAttribute('aria-pressed', on);
    snd.querySelector('span').textContent = on ? 'Sound on' : 'Sound off';
    if (on) SOUND.start(); else SOUND.stop();
  };
  $('#begin').onclick = () => { setSound(true); gate.classList.add('chosen'); };
  $('#quiet').onclick = () => { gate.classList.add('chosen'); jump(.6 * vh); };
  snd.onclick = () => setSound(snd.getAttribute('aria-pressed') !== 'true');
  document.querySelector('.again')?.addEventListener('click', () => jump(0));

  addEventListener('scroll', () => {
    target = scrollY;
    if (scrollY > 40) gate.classList.add('chosen', 'off');
    kick();
  }, {passive: true});
  addEventListener('resize', measure);
  document.fonts.ready.then(measure);
  measure();
  buildSoon(0);
})();
