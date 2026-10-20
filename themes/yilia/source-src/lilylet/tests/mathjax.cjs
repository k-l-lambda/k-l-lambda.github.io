const assert = require('node:assert/strict');
const md = require('markdown-it')().use(require('../../../markdown/mathjax.cjs'));
const tex = String.raw`\hat M_{bt}=\sum_r\sum_{(p,d)\in r}\sum_n
A^{(r)}_{pdn}D^{(r)}_{pd,b,t+4-s_rn}.`;
const html = md.render(`$$\n${tex}\n$$`);
assert(html.includes(tex));
assert(!html.includes('<em>'));
assert(md.render('$$\na < b & c\n$$').includes('a &lt; b &amp; c'));
assert(md.render('```tex\n$$\na_b\n$$\n```').includes('<pre><code'));
assert(md.render('*ordinary emphasis*').includes('<em>ordinary emphasis</em>'));
assert(md.render('$$\nunfinished').includes('unfinished'));
console.log('Display math preserves TeX; code fences and ordinary Markdown unaffected.');
