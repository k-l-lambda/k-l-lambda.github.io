# MIDI player components

- The canvas design and transport interactions are adapted from the author's
  `hf-speaking-midi/ui/player.{html,css,js}`. Unlike that Gradio player, this
  widget synthesizes the supplied MIDI in the browser instead of playing a WAV.
- `src/vendor/music-widgets/midifile.js` and `stream.js` are unchanged compiled parser
  modules from the author's `@k-l-lambda/music-widgets` package (package license:
  ISC), local revision `0926c217a9f6e62ab1f67b952cbba6cd10737b52`. They are vendored
  so a clean blog checkout does not depend on a sibling repository or a private
  package registry. Upstream: https://github.com/k-l-lambda/music-widgets .
- `js-synthesizer` 1.11.0 is installed from npm (BSD-3-Clause). The standalone player build
  publishes its AudioWorklet, FluidSynth 2.4.6 with libsndfile, and the package's
  license files. Source and build information:
  https://github.com/jet2jet/js-synthesizer and
  https://github.com/jet2jet/js-synthesizer/tree/v1.11.0/libfluidsynth .
- `../source/midi-player/gm.sf3` is MuseScore_General v0.2, copied unchanged from the existing
  LilyScript SoundFont used by the MIDI fitting experiments. SHA-256:
  `5b85b6c2c61d10b2b91cddd41efcce7b25cd31c8271d511c73afafbef20b6fa3`.
  Its original authors and terms are retained in
  [MuseScore_General_License.txt](../source/midi-player/MuseScore_General_License.txt), obtained
  from https://ftp.osuosl.org/pub/musescore/soundfont/MuseScore_General/MuseScore_General_License.md .

The widget uses gain 0.8, 512-voice polyphony, and disabled chorus/reverb, matching
our local piano-rendering settings. Browser playback is not a bit-identical
replacement for offline rendering: FluidSynth version, output resampling, and
device behavior can differ.
