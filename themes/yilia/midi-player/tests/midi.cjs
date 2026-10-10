const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const blogRoot = path.resolve(__dirname, '../../../..');
// Let hexo-include-markdown use cwd instead of npm's inherited PWD.
process.chdir(blogRoot);
delete process.env.PWD;
const Hexo = require('hexo');
const {timeline} = require('../src/timeline.cjs');
const {vlq, midi, example} = require('./midi-fixtures.cjs');
async function main() {
  const basic = timeline(example());
  assert.equal(basic.notes.length, 8);
  assert.equal(basic.duration, 4.5); // Includes end-of-track silence.
  assert.equal(basic.notes[0].duration, .5);
  const changing = midi([
    [[0, 0xff, 0x51, 3, 7, 0xa1, 0x20], [...vlq(480), 0xff, 0x51, 3, 15, 0x42, 0x40], [...vlq(480), 0xff, 0x2f, 0]],
    [[0, 0x90, 60, 80], [0, 0x91, 60, 70], [...vlq(960), 0x90, 60, 0], [0, 0x81, 60, 0], [0, 0xff, 0x2f, 0]]
  ]);
  const data = timeline(changing);
  assert.equal(data.duration, 1.5);
  assert.equal(data.notes.length, 2);
  assert.equal(data.notes[0].duration, 1.5);
  assert.equal(data.timeToTick(1), 720);
  assert.equal(data.tickToTime(720), 1);
  assert.throws(() => timeline(Buffer.from('not a MIDI')));
  const database = path.join(blogRoot, 'db.json');
  if (!fs.existsSync(database)) fs.writeFileSync(database, '');
  const hexo = new Hexo(blogRoot, {silent: true});
  await hexo.init();
  hexo.config.root = '/blog/';
  const html = await hexo.extend.tag.render('{% midi "/media/琴伤 & demo.mid" "A < B" %}');
  assert.match(html, /<iframe /);
  assert.match(html, /title="A &lt; B"/);
  const url = new URL(html.match(/src="([^"]+)"/)[1].replace(/&amp;/g, '&'), 'https://example.test');
  assert.equal(url.pathname, '/blog/midi-player/player.html');
  assert.equal(decodeURI(url.searchParams.get('src')), '/blog/media/琴伤 & demo.mid');
  await assert.rejects(() => hexo.extend.tag.render('{% midi javascript:alert(1) %}'));
  await assert.rejects(() => hexo.extend.tag.render('{% midi %}'));
  await hexo.exit();
  console.log('MIDI timeline and Hexo tag tests passed.');
}
main().catch(e => {console.error(e); process.exitCode = 1;});
