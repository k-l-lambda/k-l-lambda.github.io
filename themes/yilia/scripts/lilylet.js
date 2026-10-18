// Hexo normally consumes all fences before Markdown-it can run its plugins.
// Preserve only Lilylet fences through that stage; other code keeps highlighting.
const tokenizer = require('markdown-it')();
const saved = Symbol('lilylet-fences');
hexo.extend.filter.register('before_post_render', data => {
  if (!/lyl|lilylet/.test(data.content)) return;
  const lines = data.content.split('\n');
  const fences = tokenizer.parse(data.content, {}).filter(token => token.type === 'fence' && /^(?:lyl|lilylet)(?:\.play)?$/.test(token.info.trim()));
  data[saved] = [];
  for (const token of fences.reverse()) {
    const [start, end] = token.map;
    const source = lines.slice(start, end).join('\n');
    const marker = `<!--lilylet-fence-${data[saved].length}-->`;
    data[saved].push({marker, source});
    lines.splice(start, end - start, marker);
  }
  data.content = lines.join('\n');
}, 5);
hexo.extend.filter.register('before_post_render', data => {
  for (const {marker, source} of data[saved] || []) data.content = data.content.replace(marker, () => source);
  delete data[saved];
}, 15);

// Use the plugin's public async prerender API after Markdown-it has emitted its
// placeholders. This preserves build-time MEI without a custom plugin adapter.
const lilylet = require('../markdown/lilylet.cjs');
hexo.extend.filter.register('after_post_render', async data => {
  const blocks = data.content.match(/<div\b(?=[^>]*\bdata-lilylet-pending\b)[^>]*>[\s\S]*?<\/div>/g);
  if (!blocks) return data;
  const md = require('markdown-it')().use(lilylet);
  for (const block of blocks) {
    const opening = block.slice(0, block.indexOf('>') + 1);
    const source = opening.match(/\bdata-source="([^"]*)"/);
    if (!source) continue;
    const rendered = await md.lilylet.prerenderCode(source[1].replace(/&(?:#x[0-9a-f]+|#\d+|[a-z][a-z0-9]+);/gi, entity => md.utils.unescapeAll(entity)), /\sdata-playable(?:\s|>)/.test(opening));
    data.content = data.content.replace(block, () => rendered);
  }
  return data;
}, 15);
