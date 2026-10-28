// The engine. The whole story is one GSAP timeline, measured in screens, that the page's scroll position scrubs
// (Lenis smooths the scroll). Every chapter adds its drawing, its words and its camera to that timeline; the 3D
// figure is posed from the same time on every tick, so scrolling back plays everything in reverse, exactly.
import {createFigure} from './figure3d.js';

const {gsap, ScrollTrigger, SplitText, Lenis} = window;
gsap.registerPlugin(ScrollTrigger, SplitText);

const OV = .6;                                             // screens two neighbouring chapters overlap by
const $ = (s, el = document) => el.querySelector(s);
const story = $('#story'), back = $('#back'), front = $('#front'), canvas = $('#fig');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const capture = /[?&]capture\b/.test(location.search);    // for recording a walkthrough: no smoothing, time set directly
const chapters = window.STORY.map(s => ({...s, ...(window.CHAPTERS[s.id] || {})}));

// ---- layout: where each chapter starts on the master timeline ----
let T = 0;
for (const c of chapters) { c.start = T; T += c.len - OV; }
const TOTAL = T + OV;

// ---- markup: a back and a front layer per chapter, the figure canvas between them ----
const svg = (cls, inner) => `<svg class="${cls}" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g class="cam">${inner || ''}</g></svg>`;
for (const [i, c] of chapters.entries()) {
  const tone = c.ink ? ' ink' : '';
  c.back = document.createElement('div'); c.back.className = `ch ch-${c.id}${tone}`;
  c.back.innerHTML = svg('art', c.backArt?.());
  c.front = document.createElement('div'); c.front.className = `ch ch-${c.id}${tone}`;
  c.front.innerHTML = svg('art', c.frontArt?.()) + (c.html?.() || '') + `<div class="txt">${c.text.map((b, k) => beat(c, b, i, k)).join('')}</div>`;
  back.append(c.back); front.append(c.front);
  if (c.css) document.head.insertAdjacentHTML('beforeend', `<style>${c.css}</style>`);
}
function beat(c, b, i, k) {
  if (b.title) return `<div class="beat title" data-k="${k}"><span class="pa">ਜਸਕਰਨ ਸਿੰਘ</span><h1>Jaskaran Singh</h1><span class="role">Frontend engineer, Bengaluru</span></div>`;
  if (b.end) return `<div class="beat endcard" data-k="${k}"><i class="mark" aria-hidden="true"></i><p class="hello">If you’re building something, I’d love to hear from you.</p>
    <a class="mail" href="mailto:jaskaran.psd@gmail.com">jaskaran.psd@gmail.com</a>
    <nav class="links"><a href="https://github.com/jaskaranpr">GitHub</a><a href="https://www.linkedin.com/in/jaskaranpr">LinkedIn</a><a href="https://codepen.io/jaskaranpr">CodePen</a><a href="https://www.instagram.com/jaskaran.psd">Instagram</a></nav>
    <button class="again" type="button">Read it again</button></div>`;
  const lab = i ? `<span class="lab">${String(i).padStart(2, '0')} · ${c.label}</span>` : '';
  return `<div class="beat${b.p ? '' : ' solo'}${b.layout ? ' ' + b.layout : ''}" data-k="${k}">${lab}<h2>${b.h}</h2>${b.p ? `<p>${b.p}</p>` : ''}</div>`;
}

// the film's eye, in ink, sits above the words on the end card
if (window.FIG) document.documentElement.style.setProperty('--mark', `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-7.8 -7.2 13.2 9.6">${FIG.eye(FIG.P(0, 0), 1, 1, -14)}</svg>`)}")`);

// the story as plain text for screen readers; the stage itself is decorative
$('#transcript').innerHTML = '<h1>Jaskaran Singh, frontend engineer in Bengaluru</h1>' + chapters.flatMap(c => c.text.filter(b => b.h).map(b => `<h2>${b.h}</h2>${b.p ? `<p>${b.p}</p>` : ''}`)).join('') +
  '<p>If you’re building something, I’d love to hear from you: <a href="mailto:jaskaran.psd@gmail.com">jaskaran.psd@gmail.com</a></p>';

// ---- the rail of chapters, and the bits of chrome ----
const rail = $('#rail');
rail.innerHTML = chapters.map((c, i) => `<button type="button" data-i="${i}" aria-label="${c.label}"><span>${c.label}</span></button>`).join('');

// ---- the master timeline ----
let master, splits = [], st;
function build() {
  splits.forEach(s => s.revert()); splits = [];
  master?.kill(); st?.kill();
  master = gsap.timeline({paused: true, defaults: {ease: 'none'}});
  for (const [i, c] of chapters.entries()) {
    const els = [c.back, c.front];
    if (i) master.fromTo(els, {autoAlpha: 0}, {autoAlpha: 1, duration: OV}, c.start);
    else gsap.set(els, {autoAlpha: 1});
    if (i < chapters.length - 1) master.to(els, {autoAlpha: 0, duration: OV, immediateRender: false}, c.start + c.len - OV);
    master.to(document.body, {backgroundColor: c.ground, duration: OV}, Math.max(0, c.start));
    // words: the big line rises line by line out of a mask, the small one follows; both leave the same way
    for (const b of c.text) {
      const el = c.front.querySelector(`.beat[data-k="${c.text.indexOf(b)}"]`);
      const tl = gsap.timeline({defaults: {ease: 'none'}});
      if (b.title || b.end) {
        const parts = el.children;
        gsap.set(el, {autoAlpha: 1});                      // (autoAlpha leaves visibility 'inherit', so the box itself must show)
        if (b.at[0] || i) tl.fromTo(parts, {autoAlpha: 0, y: 26}, {autoAlpha: 1, y: 0, duration: .35, stagger: .07, ease: 'power3.out'}, 0);
        else gsap.set([el, ...parts], {autoAlpha: 1});
        if (b.at[1] < c.len) tl.to(parts, {autoAlpha: 0, y: -18, duration: .3, stagger: .04, ease: 'power2.in'}, b.at[1] - b.at[0] - .35);
      } else {
        const h = el.querySelector('h2'), p = el.querySelector('p'), lab = el.querySelector('.lab');
        const sp = SplitText.create(h, {type: 'lines', mask: 'lines', linesClass: 'ln-mask'}); splits.push(sp);
        gsap.set(el, {autoAlpha: 1});
        if (lab) tl.fromTo(lab, {autoAlpha: 0}, {autoAlpha: .7, duration: .25}, 0);
        tl.fromTo(sp.lines, {yPercent: 135}, {yPercent: 0, duration: .5, stagger: .07, ease: 'power3.out'}, 0);
        if (p) tl.fromTo(p, {autoAlpha: 0, y: 16}, {autoAlpha: 1, y: 0, duration: .45, ease: 'power2.out'}, .22);
        const out = b.at[1] - b.at[0];
        tl.to(sp.lines, {yPercent: -135, duration: .38, stagger: .05, ease: 'power2.in'}, out - .4);
        if (p) tl.to(p, {autoAlpha: 0, y: -10, duration: .3, ease: 'power2.in'}, out - .36);
        if (lab) tl.to(lab, {autoAlpha: 0, duration: .2}, out - .25);
      }
      master.add(tl, c.start + Math.max(0, b.at[0]));
    }
    // the chapter's own drawing and moves, in its local time
    if (c.build) {
      const tl = gsap.timeline({defaults: {ease: 'none'}}), $$ = s => [...c.back.querySelectorAll(s), ...c.front.querySelectorAll(s)];
      c.build(tl, $$, c);
      if (tl.duration()) master.add(tl, c.start);
    }
  }
  master.set({}, {}, TOTAL);
  story.style.height = `${(TOTAL + 1) * innerHeight}px`;
  st = capture ? {kill() {}, progress: 0} : ScrollTrigger.create({trigger: story, start: 'top top', end: 'bottom bottom', scrub: reduced ? true : .35, animation: master});
}

// ---- scrolling ----
const lenis = reduced || capture ? null : new Lenis({lerp: .09, wheelMultiplier: .85, smoothWheel: true});
if (lenis) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
const scrollToTime = t => { const y = t / TOTAL * (story.offsetHeight - innerHeight); lenis ? lenis.scrollTo(y, {duration: 1.6}) : scrollTo({top: y, behavior: 'smooth'}); };
rail.addEventListener('click', e => { const b = e.target.closest('button'); if (b) scrollToTime(chapters[+b.dataset.i].start + OV * .9); });
document.addEventListener('click', e => { if (e.target.closest('.again')) scrollToTime(0); });

// ---- the figure, posed from the master time on every tick ----
let figure = null, dirty = true, current = -1, lastLife = 0, lastT = -1;
const narrow = () => innerWidth / innerHeight < 1.05;
function activeAt(t) { let k = 0; for (const [i, c] of chapters.entries()) if (t >= c.start + (i ? OV / 2 : 0)) k = i; return k; }
function frame() {
  const t = master ? master.time() : 0, k = activeAt(t), c = chapters[k], lt = t - c.start;
  if (t !== lastT) { lastT = t; dirty = true; }          // the scrub keeps easing the timeline after the last scroll event
  if (k !== current) { current = k; onChapter(c, k); }
  // each visible chapter moves its own camera
  for (const ch of chapters) {
    const lt2 = t - ch.start;
    if (lt2 < -OV || lt2 > ch.len + OV || !ch.view) continue;
    const v = ch.view(Math.max(0, Math.min(ch.len, lt2)), narrow());
    const tr = `translate(800 450) scale(${v.zoom || 1}) translate(${-v.x} ${-v.y})`;
    for (const g of [ch.back, ch.front]) { const cam = g.querySelector('.cam'); if (cam.__tr !== tr) { cam.setAttribute('transform', tr); cam.__tr = tr; } }
    // layers at another depth slide by less (far away) or more (right against the lens) than the camera
    ch.depth ??= [...ch.back.querySelectorAll('[data-depth]'), ...ch.front.querySelectorAll('[data-depth]')].map(el => [el, +el.dataset.depth]);
    for (const [el, d] of ch.depth) { const k = 1 - d, tr2 = `translate(${((v.x - 800) * k).toFixed(1)} ${((v.y - 450) * k).toFixed(1)})`; if (el.__tr !== tr2) { el.setAttribute('transform', tr2); el.__tr = tr2; } }
  }
  const now = performance.now() / 1000, alive = c.alive && now - lastLife > 1 / 30;
  if (!figure || !(dirty || alive)) return;
  dirty = false; lastLife = now;
  const poses = c.fig ? [].concat(c.fig(lt, now) || []) : [];
  // (a chapter with keep: true carries on the previous chapter's shot, so he doesn't fade out and back in between them)
  const fadeIn = k && !c.keep ? Math.min(1, Math.max(0, (lt - OV / 2) / (OV / 2))) : 1;
  const fadeOut = k < chapters.length - 1 && !chapters[k + 1].keep ? Math.min(1, Math.max(0, (c.len - OV / 2 - lt) / (OV / 2))) : 1;
  canvas.style.opacity = Math.min(fadeIn, fadeOut).toFixed(3);
  const v = c.view ? c.view(lt, narrow()) : {x: 800, y: 450, zoom: 1};
  figure.set(poses, {x: v.x, y: v.y, zoom: v.zoom || 1}, c.ink);
  figure.render();
  window.__story.last = {id: c.id, lt: +lt.toFixed(3), n: poses.length, clip: poses[0]?.clip};
}
gsap.ticker.add(frame);

function onChapter(c, k) {
  $('#chapter').textContent = k ? c.label : '';
  document.documentElement.classList.toggle('on-ink', !!c.ink);
  rail.querySelectorAll('button').forEach((b, i) => b.classList.toggle('on', i === k));
  window.SOUND?.mood(c.mood);
}

// ---- the gate and the sound ----
const gate = $('#gate'), snd = $('#sound');
let soundOn = false;
function setSound(on) {
  soundOn = on; snd.setAttribute('aria-pressed', on); snd.querySelector('span').textContent = on ? 'Sound on' : 'Sound off';
  if (on) { window.SOUND?.start(); window.SOUND?.mood(chapters[Math.max(0, current)].mood); } else window.SOUND?.stop();
}
const dismiss = () => { if (!gate.classList.contains('gone')) gate.classList.add('gone'); };
$('#begin').addEventListener('click', () => { setSound(true); dismiss(); });
$('#quiet').addEventListener('click', dismiss);
snd.addEventListener('click', () => setSound(!soundOn));
addEventListener('scroll', () => { if (scrollY > 40) dismiss(); }, {passive: true});
addEventListener('keydown', e => { if (e.key === 'Escape') dismiss(); });

// ---- boot ----
document.fonts.ready.then(() => {
  build();
  let w = innerWidth;
  addEventListener('resize', () => {
    figure?.resize(innerWidth, innerHeight);
    if (Math.abs(innerWidth - w) > 40 || !figure) { w = innerWidth; const p = st.progress; build(); ScrollTrigger.refresh(); scrollTo(0, p * (story.offsetHeight - innerHeight)); }
    dirty = true;
  });
});
createFigure(canvas).then(f => { figure = f; figure.resize(innerWidth, innerHeight); dirty = true; document.documentElement.classList.add('fig-ready'); })
  .catch(e => console.error('figure', e));
window.__story = {chapters, get time() { return master?.time(); }, TOTAL, OV, seek: t => { master.time(t); dirty = true; }, ready: () => !!figure && !!master};
