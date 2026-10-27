# jaskaran-journey

My portfolio as a short film you scroll through. It goes from a village in Punjab to trading charts at Lemonn and the Zing Trade extension.

Plain HTML, CSS and JS with no build step. To run it locally:

```sh
python3 -m http.server
```

Then open http://localhost:8000.

- `index.html` has the scenes, the narration and the scroll engine. Each scene sets a `--p` value from 0 to 1, and the CSS animates from it.
- `chart.js` draws the candlestick chart scene on a canvas.
- `pens/` holds screenshots of my CodePen work.

The visual style is inspired by Fold's "Tag Your Transactions" film.
