# jaskaran-journey

My portfolio as a short film. Press play and it runs with a voice and music, scrolling itself. Or scroll through it at your own pace, with subtitles.

Plain HTML, CSS and JS. The page has no build step.

```sh
python3 -m http.server
```

Then open http://localhost:8000.

- `story.js` is the script: every scene, its lines, how it cuts in and the mood of its music.
- `tools/build-film.mjs` turns the script into `audio/film.mp3` (narration plus an original score) and `timeline.js` (when every line is spoken). It needs macOS for `say`, and ffmpeg. Run `node tools/build-film.mjs` after editing `story.js`.
- `index.html` has the scenes and the player. In play mode the soundtrack is the clock and the page scrolls to match it. Scrolling by hand pauses it.
- `chart.js` draws the candlestick chart scene.
- `pens/` holds screenshots of my CodePen work.

To try another voice, run `VOICE=Rishi node tools/build-film.mjs`. To narrate it myself, I can record each line as `narration/<scene>-<line>.m4a` (for example `narration/village-0.m4a`) and run the build again. The timing follows the recordings.

The look follows Fold's "Tag Your Transactions" film: one blue and white, a fuzzy white character, light from above. The font is Figtree, the closest free match to the film's GT Walsheim.
