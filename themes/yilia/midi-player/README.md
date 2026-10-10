# Yilia MIDI player

Embed a local file with `{% midi /images/example.mid "Title" %}`. The optional
title and paths containing spaces should be quoted. The theme registers the tag
and publishes the precompiled files from `../source/midi-player/`. Normal Hexo
builds do not install this package or run its build toolchain.

## Shared audio and loading

Each player draws its own piano roll and keeps its own position, speed, and zoom.
When it enters the viewport, it loads its MIDI and requests the article's shared
piano engine. An IntersectionObserver delays this work for offscreen embeds,
including frames which the browser's lazy loading may have fetched early.

A hidden, same-origin sibling iframe owns one AudioContext, one FluidSynth
AudioWorklet, and one decoded SoundFont. All visible players join the same
initialization promise and receive its progress. Switching players replaces the
native MIDI sequence while retaining the initialized synthesizer and SoundFont.
Only one player plays at a time; inactive players cannot seek or change the speed
of the active player. Removing an embed does not destroy the shared engine.

Download, WebAssembly initialization, and SoundFont decoding happen before Play.
The AudioContext stays suspended until a user clicks Play, so preload does not
produce sound or require autoplay permission. The control bar uses an animated download-arrow icon for SoundFont loading and
pulsing equalizer bars for engine warmup. Status text and download percentage
appear in the icon's hover title and accessible label; readiness and errors use
a checkmark and warning icon. Reduced-motion settings disable the animations. The Play
button becomes Retry after a loading error; a successful shared-engine retry
also restores the other players.

The engine is shared within one article/document, not across separate tabs or
full page navigations. Persistent Cache Storage still shares the downloaded
SoundFont and runtime files across visits. The hidden engine lives under the
player's asset URL so the existing scoped service worker can cache its requests.
Cross-origin embedding falls back to an engine inside the individual embed.
HTTPS or localhost and a browser supporting AudioWorklet are required.

## Build and test

Install the blog's normal dependencies at its root first. In this directory:

```sh
npm ci
npm run build
npm run build:check
npm test
```

Commit source changes and precompiled assets together. `build:check` compares a
fresh in-memory build with the published assets without changing files. The
SoundFont is stored only in `../source/midi-player/gm.sf3`. Rebuild after changing
it or the audio runtime to update both sides of the cache version.

The example is the blog's `source/_drafts/midi-test.md`. Generate with
`npm run build -- --draft` at the blog root, then serve the output or use
`npm run serve:draft`. The optional Python Playwright tests run from here:

```sh
MIDI_TEST_URL=http://localhost:4000 python tests/browser-midi.py
python tests/browser-midi-cache.py
MIDI_TEST_URL=http://localhost:4000 python tests/browser-midi-viewport.py
```

Install Python Playwright and Chromium separately; `CHROMIUM_EXECUTABLE` selects
an existing browser. The playback test discovers the generated draft URL under
the blog's `public/`, or accepts `MIDI_DEMO_PATH`. It verifies audible output,
transport controls, sharing the same engine, and removal of an owning player.
The cache test starts a local server with HTTP caching disabled and checks
preloading without a click, concurrent players, cache reuse, version changes,
retry, and unavailable browser storage. The viewport test checks offscreen
deferral and the compact mobile layout. See [NOTICE.md](NOTICE.md) for licenses
and source attribution.
