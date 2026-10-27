# jaskaran-journey

My portfolio as a short story you scroll through. Each chapter is an illustrated scene; the words fade in as you go, and quiet music plays underneath if you turn the sound on.

Plain HTML, CSS and JS. No build step, no libraries.

```sh
python3 -m http.server
```

Then open http://localhost:8000.

## How it fits together

- `story.js` is the text: every scene in order, what you read in it, where the words sit and when they come in.
- `scenes/<id>.js` draws one scene. Each scene is painted on a 1600 × 900 board in layers, back to front.
- `engine.js` turns scrolling into a camera move through those layers and fades the words in and out.
- `figure.js` draws me. It's a skeleton measured in centimetres (I'm 5'10"), so the same code can stand, walk, sit, ride a bicycle and lie in the grass. A filter in `index.html` gives every body the soft, frayed edge from the film.
- `kit.js` holds the shared drawing pieces: the colours, light beams, dust, mist, reflections and birds.
- `sound.js` makes the music live in the browser, so there's no audio file to load. A few soft piano notes repeat on loops of different lengths, the way Brian Eno made *Music for Airports*, so they keep meeting in new combinations. Under them, a slow pad changes chord with each chapter.
- `pens/` holds screenshots of my CodePen work.

## Adding or changing a scene

A scene file calls `scene(id, {...})`:

- `layers()` returns the layers, back to front. Each is `{z, svg}` or `{z, html}`. `z` sets how far it moves when the camera moves: 0 stays put like the sky, 1 moves with the subject, and more than 1 is foreground that sweeps past. `cls: 'blur6'` puts a layer out of focus.
- `cam(p)` returns the camera for progress `p` (0 to 1 through the scene): `{x, y, zoom, ox, oy}` in board units.
- `init(stage)` runs once after the layers are on the page, for looking up elements `frame` will move.
- `frame(p, stage)` runs on every scroll frame, for things like his walk or the bicycle wheels. Keep it cheap: change a few attributes, not a CSS variable that hundreds of elements inherit.
- `focus` is the board x that phones should keep in view. It can be a function of `p` when the subject moves.
- `css` is extra CSS for the scene.

Then add the scene to `story.js` and a `<script>` tag to `index.html`.

## Style

The look follows Fold's "Tag Your Transactions" film: one blue and white, a fuzzy white figure, light from above, grain over everything. The font is Figtree, the closest free match to the film's GT Walsheim.
