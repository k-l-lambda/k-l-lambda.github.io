# Lilylet Markdown

`_config.yml` registers the precompiled `themes/yilia/markdown/lilylet.cjs`.
Use a `lyl.play` (or `lilylet.play`) fenced block for a playable score, or
`lyl` for notation only.

The theme owns `@k-l-lambda/lilylet-markdown` 0.1.62 and its build dependencies
in `../source-src/lilylet/`. The Hexo root needs no additional dependencies.
From the blog root, rebuild and verify the committed CommonJS bundle with:

```sh
npm ci --prefix themes/yilia/source-src/lilylet
npm run build --prefix themes/yilia/source-src/lilylet
npm run build:check --prefix themes/yilia/source-src/lilylet
```

This bundles the official CommonJS entry, including the parser and MEI encoder.
It does not use a handwritten compatibility adapter. The theme uses only the
MEI prerender path; the package's optional Node Verovio loader is not bundled
or used. Verovio engraving is provided by the browser runtime below.

The `after_post_render` hook in `../scripts/lilylet.js` uses the package's
public async prerender API to embed MEI in the generated post HTML. This
keeps the browser runtime independent of the Lilylet parser.

The theme loads Verovio 6.2.0 from jsDelivr only when a score approaches the
viewport. Each score is engraved and converted to MIDI in the browser.
Playback uses the same shared FluidSynth engine, SoundFont cache and warmup
as the piano-roll players. The score's tempo controls playback; individual
velocities absent from the notation cannot be reconstructed.

Browser source lives in `../midi-player/src/lilylet.js`. Rebuild its committed
asset with `npm run build --prefix themes/yilia/midi-player` from the blog
root. Ordinary Hexo builds consume the precompiled asset.

`../scripts/lilylet.js` preserves these fences through Hexo’s earlier syntax-
highlighting stage, allowing Markdown-it to see them without changing how
ordinary code fences are highlighted.

Notation size is controlled by Verovio `scale` in the browser runtime: 21,
60% of the original 35. This scales music glyphs, staves and lyrics together;
CSS font-size does not resize the engraved SVG. The plugin also exposes
`verovioOptions.scale` for server-side engraving, but those options are not
forwarded in its MEI-only placeholders, so this client-rendered theme sets
the option when creating its toolkit.

Playable blocks use a compact control bar below the score, following the
[Lilylet Markdown demo](https://k-l-lambda.github.io/lilylet-live-editor/markdown):
play/pause, elapsed/total time and a seek slider, plus a restart button.
The slider supports keyboard navigation as well as pointer input.
