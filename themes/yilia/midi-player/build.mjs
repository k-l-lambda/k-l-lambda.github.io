import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import crypto from 'node:crypto';
import {build} from 'esbuild';

const base = path.dirname(fileURLToPath(import.meta.url));
const source = path.join(base, 'src');
const output = path.resolve(base, '../source/midi-player');
const require = createRequire(import.meta.url);
const synth = path.dirname(require.resolve('js-synthesizer/package.json'));
const runtime = {
  'libfluidsynth.js': 'externals/libfluidsynth-2.4.6-with-libsndfile.js',
  'js-synthesizer.worklet.js': 'dist/js-synthesizer.worklet.min.js',
  'LICENSE.fluidsynth.txt': 'externals/LICENSE.fluidsynth.txt',
  'LICENSE.js-synthesizer.txt': 'LICENSE'
};
// The large SoundFont lives only in the published assets directory.
const hash = crypto.createHash('sha256');
for (const file of [path.join(output, 'gm.sf3'), ...Object.values(runtime).slice(0, 2).map(name => path.join(synth, name))]) {
  hash.update(await fs.readFile(file));
}
const version = hash.digest('hex').slice(0, 20);
const built = await build({entryPoints: [path.join(source, 'player.js')], bundle: true,
  write: false, minify: true, format: 'iife', platform: 'browser', target: ['es2020'],
  define: {__MIDI_ASSET_VERSION__: JSON.stringify(version)}});
const files = new Map([['player.js', Buffer.from(built.outputFiles[0].contents)]]);
files.set('asset-cache-sw.js', Buffer.from((await fs.readFile(path.join(source, 'asset-cache-sw.js'), 'utf8'))
  .replace('__MIDI_ASSET_VERSION__', version)));
for (const name of ['player.html', 'player.css']) files.set(name, await fs.readFile(path.join(source, name)));
for (const [name, file] of Object.entries(runtime)) files.set(name, await fs.readFile(path.join(synth, file)));
const check = process.argv.includes('--check');
const stale = [];
for (const [name, content] of files) {
  if (check) {
    const existing = await fs.readFile(path.join(output, name)).catch(error => {
      if (error.code === 'ENOENT') return null;
      throw error;
    });
    if (!existing || !existing.equals(content)) stale.push(name);
  } else {
    await fs.writeFile(path.join(output, name), content);
  }
}
if (stale.length) throw new Error(`Stale player assets: ${stale.join(', ')}. Run npm run build in ${base}.`);
console.log(`${check ? 'Verified' : 'Built'} ${files.size} player assets (audio cache ${version}).`);
