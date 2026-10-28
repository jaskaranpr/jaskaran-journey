# jaskaran-journey

My portfolio as a short story you scroll through. One white line runs through the whole thing: it's the ground I walk on, and it draws each place as I get there, from the village in Punjab where I grew up to the charts I build now. I'm drawn as a soft white figure, moving with real motion-captured animation.

Plain HTML, CSS and JS with no build step.

```sh
python3 -m http.server
```

Then open http://localhost:8000.

## How it fits together

- `story.js` is the text: every chapter in order, what you read in it and when, its colour and its music.
- `chapters/<id>.js` draws one chapter as line art on a 1600 × 900 board and says where I am and what I'm doing at every moment of it. `chapters/_lines.js` holds the shared drawing pieces, and the film's eye that Jassi and the end card use.
- `js/main.js` is the engine. The whole story is one GSAP timeline measured in screens, and the scroll position scrubs it, smoothed by Lenis. Scroll back and everything plays in reverse, exactly.
- `js/figure3d.js` draws me: a rigged mannequin from three.js playing motion-captured clips, filled out a little so it reads as clothed, with a mop of curls. A shader gives it the film's soft, frayed white edge. On pale chapters I'm drawn in ink.
- `models/` holds the two rigs and their clips, trimmed to what the story uses and compressed (about 700 KB together).
- `sound.js` makes the music live in the browser: soft piano notes on loops of different lengths, over a pad chord that changes with each chapter.

## A chapter

```js
chapter('id', {
  backArt: () => '...svg...',     // drawn behind me (inside a camera group, board units)
  frontArt: () => '...svg...',    // drawn in front of me
  build(tl, $) { ... },           // tweens on the chapter's own timeline, 0..len screens
  fig: (t, life) => pose,         // where I am and what I'm doing at time t (life: seconds, for idle breathing)
  view: (t, narrow) => ({x, y, zoom}),
  alive: true,                    // keep animating while the reader is stopped
  css: '...',
});
```

A pose is `{lib, clip, ct, x, y, s, yaw, kid, far, props, hold}`, all in board units. `L.draw(tl, paths, at, dur)` draws lines on, `L.stride()` keeps a walk's feet planted, `L.par()` pins things to a far layer, and `L.fit()` keeps me in frame on phones. Groups with `data-depth` slide at their own speed when the camera moves.

## Credits

- Animation and mannequin: [Universal Animation Library](https://quaternius.com/packs/universalanimationlibrary.html) 1 and 2 by Quaternius, CC0.
- [three.js](https://threejs.org) (MIT), [GSAP](https://gsap.com) with ScrollTrigger and SplitText (free under GSAP's standard license), [Lenis](https://lenis.darkroom.engineering) (MIT).
- Fonts: [Figtree](https://fonts.google.com/specimen/Figtree) and Noto Sans Gurmukhi (SIL Open Font License).

## Style

The look follows Fold's "Tag Your Transactions" film: one blue and white, a soft white figure, light from above, grain over everything. Figtree stands in for the film's GT Walsheim. The single continuous line is borrowed from the grammar of one-line storytelling, as on [gianlucaboccia.me](https://www.gianlucaboccia.me/).
