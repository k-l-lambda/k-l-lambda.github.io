const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
hexo.extend.tag.register('midi', function (args) {
  if (!args[0] || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(args[0]) && !/^https?:\/\//i.test(args[0]))
    throw new Error('Usage: {% midi /path/file.mid [title] %}; use a local path or HTTP(S) URL.');
  const urlFor = hexo.extend.helper.get('url_for').bind(hexo);
  const source = urlFor(args[0]);
  const title = args.slice(1).join(' ') || 'MIDI piano roll';
  const query = new URLSearchParams({src: source, title});
  const player = urlFor('/midi-player/player.html') + '?' + query;
  return `<div class="midi-embed"><iframe src="${escape(player)}" title="${escape(title)}" loading="lazy" allow="autoplay" style="display:block;width:100%;height:510px;border:0;border-radius:14px" referrerpolicy="strict-origin-when-cross-origin"></iframe><p><a href="${escape(source)}" download>Download MIDI</a></p></div>`;
});
