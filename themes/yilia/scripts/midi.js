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
    throw new Error('Usage: {% midi /path/file.mid [title] [width=auto] [height=auto] %}; use a local path or HTTP(S) URL.');
  const urlFor = hexo.extend.helper.get('url_for').bind(hexo);
  const source = urlFor(args[0]);
  const size = {width: 'auto', height: 'auto'}, titleParts = [];
  for (const arg of args.slice(1)) {
    const option = /^(width|height)=(.*)$/.exec(arg);
    if (option) size[option[1]] = dimension(option[2], option[1]);
    else titleParts.push(arg);
  }
  const title = titleParts.join(' ') || 'MIDI piano roll';
  const query = new URLSearchParams({src: source, title});
  if (size.height !== 'auto') query.set('fit', 'height');
  const player = urlFor('/midi-player/player.html') + '?' + query;
  return `<div class="midi-embed"><iframe src="${escape(player)}" title="${escape(title)}" loading="lazy" allow="autoplay" data-midi-height="${size.height === 'auto' ? 'auto' : 'fixed'}" style="display:block;width:${size.width === 'auto' ? '100%' : size.width};max-width:100%;height:${size.height === 'auto' ? '420px' : size.height};border:0;border-radius:14px" referrerpolicy="strict-origin-when-cross-origin"></iframe><p><a href="${escape(source)}" download>Download MIDI</a></p></div>`;
});
