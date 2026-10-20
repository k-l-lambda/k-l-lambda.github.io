const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function dimension(value, name) {
  if (value === 'auto') return value;
  const match = /^(\d+(?:\.\d+)?)(px|rem|em|vw|vh|%)?$/.exec(value);
  if (!match || Number(match[1]) <= 0 || (name === 'height' && match[2] === '%'))
    throw new Error(`Invalid MIDI ${name}: use auto or a positive CSS length${name === 'width' ? ' or percentage' : ''}.`);
  return match[1] + (match[2] || 'px');
}
hexo.extend.tag.register('midi', function (args) {
  if (!args[0] || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(args[0]) && !/^https?:\/\//i.test(args[0]))
    throw new Error('Usage: {% midi /path/file.mid [title] [width=auto] [height=auto] [inline] %}; use a local path or HTTP(S) URL.');
  const urlFor = hexo.extend.helper.get('url_for').bind(hexo);
  const source = urlFor(args[0]);
  let inline = false;
  const size = {width: 'auto', height: 'auto'}, titleParts = [];
  for (const arg of args.slice(1)) {
    if (arg === 'inline') { inline = true; continue; }
    if (arg.startsWith('inline=')) {
      if (!/^inline=(true|false)$/.test(arg)) throw new Error('MIDI inline must be true or false.');
      inline = arg === 'inline=true';
      continue;
    }
    const option = /^(width|height)=(.*)$/.exec(arg);
    if (option) size[option[1]] = dimension(option[2], option[1]);
    else titleParts.push(arg);
  }
  const title = titleParts.join(' ') || 'MIDI piano roll';
  const query = new URLSearchParams({src: source, title});
  if (size.height !== 'auto') query.set('fit', 'height');
  const player = urlFor('/midi-player/player.html') + '?' + query;
  const layout = inline ? ` class="midi-embed midi-embed-inline"${size.width === 'auto' ? '' : ` style="--midi-inline-width:${size.width}"`}` : ' class="midi-embed"';
  return `<div${layout}><iframe src="${escape(player)}" title="${escape(title)}" loading="lazy" allow="autoplay" data-midi-height="${size.height === 'auto' ? 'auto' : 'fixed'}" style="display:block;width:${inline || size.width === 'auto' ? '100%' : size.width};max-width:100%;height:${size.height === 'auto' ? '420px' : size.height};border:0;border-radius:14px" referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`;
});
