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
  assert.match(html, /data-midi-height="auto"/);
  assert.match(html, /width:100%/);
  assert.equal(url.searchParams.get('fit'), null);
  const sized = await hexo.extend.tag.render('{% midi /test.mid "Custom title" width=80% height=450 %}');
  assert.match(sized, /width:80%;max-width:100%;height:450px/);
  assert.match(sized, /data-midi-height="fixed"/);
  assert.match(sized, /fit=height/);
  assert.match(sized, /title="Custom title"/);
  const mixed = await hexo.extend.tag.render('{% midi /test.mid width=640px height=auto %}');
  assert.match(mixed, /width:640px/);
  assert.match(mixed, /data-midi-height="auto"/);
  for (const option of ['width=0', 'height=-1', 'width=calc(100%)', 'width=100%;color:red', 'height=50%']) {
    await assert.rejects(() => hexo.extend.tag.render(`{% midi /test.mid ${option} %}`));
  }
  const inline = await hexo.extend.tag.render('{% midi /test.mid "Side by side" inline=true width=40% %}');
  assert.match(inline, /class="midi-embed midi-embed-inline"/);
  assert.match(inline, /--midi-inline-width:40%/);
  assert.match(inline, /width:100%/);
  assert.match(inline, /title="Side by side"/);
  const shorthand = await hexo.extend.tag.render('{% midi /test.mid "Side by side" inline width=40% %}');
  assert.equal(shorthand, inline);
  const block = await hexo.extend.tag.render('{% midi /test.mid inline=false %}');
  assert.doesNotMatch(block, /midi-embed-inline|inline=false/);
  await assert.rejects(() => hexo.extend.tag.render('{% midi /test.mid inline=yes %}'));
  await assert.rejects(() => hexo.extend.tag.render('{% midi javascript:alert(1) %}'));
  await assert.rejects(() => hexo.extend.tag.render('{% midi %}'));
  await hexo.exit();
  console.log('MIDI timeline and Hexo tag tests passed.');
}
main().catch(e => {console.error(e); process.exitCode = 1;});
