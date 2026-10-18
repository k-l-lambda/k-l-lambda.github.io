import {build} from 'esbuild';
import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
const require = createRequire(import.meta.url);
const target = new URL('../../markdown/lilylet.cjs', import.meta.url);
const result = await build({
  entryPoints: [require.resolve('@k-l-lambda/lilylet-markdown')],
  bundle: true, platform: 'node', format: 'cjs', target: 'node18',
  minify: true, write: false,
  // This theme generates MEI only; Verovio runs in the browser via CDN.
  external: ['verovio', 'verovio/*']
});
const content = result.outputFiles[0].contents;
if (process.argv.includes('--check')) {
  if (!Buffer.from(content).equals(await fs.readFile(target))) throw new Error('Rebuild the Lilylet plugin.');
} else {
  await fs.mkdir(new URL('../../markdown/', import.meta.url), {recursive:true});
  await fs.writeFile(target, content);
}
console.log('Lilylet CommonJS bundle verified.');
