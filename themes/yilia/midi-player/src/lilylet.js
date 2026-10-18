import {timeline} from './timeline.cjs';
import {scoreTiming} from './score-timing.cjs';
import {sharedEngine} from './shared-engine';

const scriptURL = document.currentScript.src;
const engineURL = new URL('engine.html', scriptURL).href;
let runtime;
function loadRuntime() {
  return runtime ||= Promise.all([
    import('https://cdn.jsdelivr.net/npm/verovio@6.2.0/dist/verovio-module.mjs'),
    import('https://cdn.jsdelivr.net/npm/verovio@6.2.0/dist/verovio.mjs')
  ]).then(async ([wasm, api]) => ({module: await wasm.default(), Toolkit: api.VerovioToolkit}))
    .catch(error => {runtime = null; throw error;});
}
async function mount(root) {
  root.setAttribute('aria-busy', 'true');
  const status = document.createElement('span'); status.textContent = 'Loading score…';
  const bar = document.createElement('div'); bar.className = 'lilylet-controls'; bar.append(status);
  root.prepend(bar);
  let engine, unsubscribe, timer, playing = false, started = false, tick = 0, disposed = false;
  let play, progress, time, data, notesAt;
  const noteHeads = new Map();
  let highlighted = new Set();
  function highlight(milliseconds) {
    const next = new Set(playing && notesAt ? notesAt(milliseconds) : []);
    for (const id of highlighted) if (!next.has(id)) {
      for (const head of noteHeads.get(id) || []) head.classList.remove('lilylet-note-active');
    }
    for (const id of next) if (!highlighted.has(id)) {
      for (const head of noteHeads.get(id) || []) head.classList.add('lilylet-note-active');
    }
    highlighted = next;
  }
  const icon = path => `<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="${path}"/></svg>`;
  const formatTime = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  function refresh() {
    if (!play) return;
    play.innerHTML = icon(playing ? 'M4 2h3v12H4zM9 2h3v12H9z' : 'M3 2v12l10-6z');
    play.title = playing ? 'Pause' : 'Play'; play.setAttribute('aria-label', play.title);
    const seconds = Math.min(data.duration, data.tickToTime(tick));
    highlight(seconds * 1000);
    time.textContent = `${formatTime(seconds)} / ${formatTime(data.duration)}`;
    progress.value = seconds;
    progress.style.setProperty('--progress', `${data.duration ? seconds / data.duration * 100 : 0}%`);
    progress.setAttribute('aria-valuetext', `${formatTime(seconds)} of ${formatTime(data.duration)}`);
  }
  const client = {deactivate() {playing = false; started = false; clearTimeout(timer); refresh();}};
  try {
    const {module, Toolkit} = await loadRuntime();
    const toolkit = new Toolkit(module);
    let midi, svg;
    try {
      // Wide measures retain dense chords without squeezing their accidentals.
      // Scale 21 is 60% of the original 35; scale notation and lyrics together.
      toolkit.setOptions({pageWidth:4200, pageHeight:16000, scale:21, adjustPageHeight:true, header:'none', footer:'none'});
      if (!toolkit.loadData(root.dataset.mei.replaceAll(' wordpos="u"', ''))) throw new Error('Could not engrave score');
      svg = Array.from({length:toolkit.getPageCount()}, (_, i) => toolkit.renderToSVG(i + 1, {})).join('');
      midi = toolkit.renderToMIDI();
      if (root.hasAttribute('data-playable')) notesAt = scoreTiming(toolkit.renderToTimemap({}));
    } finally {toolkit.destroy();}
    const score = document.createElement('div'); score.className = 'lilylet-score'; score.innerHTML = svg;
    root.querySelector('code')?.remove(); root.append(score, bar);
    // IDs are scoped to this score; separate blocks can contain identical MEI IDs.
    for (const note of score.querySelectorAll('.note[id]')) {
      const heads = noteHeads.get(note.id) || [];
      heads.push(...note.querySelectorAll('.notehead'));
      noteHeads.set(note.id, heads);
    }
    root.removeAttribute('data-lilylet-pending'); root.setAttribute('data-lilylet', '');
    if (!root.hasAttribute('data-playable')) {bar.remove(); return;}
    const bytes = Uint8Array.from(atob(midi), c => c.charCodeAt(0)).buffer;
    data = timeline(new Uint8Array(bytes));
    play = document.createElement('button'); play.type = 'button'; play.className = 'lilylet-play'; play.disabled = true;
    const restart = document.createElement('button'); restart.type = 'button'; restart.className = 'lilylet-restart';
    restart.innerHTML = icon('M2 2h2v12H2zM14 2v12L5 8z'); restart.title = 'Restart'; restart.setAttribute('aria-label', 'Restart'); restart.disabled = true;
    time = document.createElement('span'); time.className = 'lilylet-time';
    progress = document.createElement('input'); progress.type = 'range'; progress.className = 'lilylet-progress';
    progress.min = 0; progress.max = data.duration; progress.step = '0.01'; progress.disabled = true; progress.setAttribute('aria-label', 'Playback position');
    bar.prepend(play, restart, time, progress);
    status.setAttribute('role', 'status'); status.className = 'lilylet-status';
    refresh();
    engine = await sharedEngine(engineURL);
    unsubscribe = engine.subscribe(state => {
      status.textContent = state.phase === 'ready' ? '' : state.label;
      status.title = state.label;
    });
    await engine.prepare();
    if (disposed) return;
    play.disabled = false; restart.disabled = false; progress.disabled = false;
    async function update() {
      if (!playing) return;
      try {
        const position = await engine.tick(client);
        if (!playing || position === null) return;
        tick = position; refresh();
        if (tick >= data.ticks) {await engine.pause(client); tick = 0; client.deactivate(); return;}
        timer = setTimeout(update, 16);
      } catch (error) {client.deactivate(); status.textContent = error.message;}
    }
    play.addEventListener('click', async () => {
      play.disabled = true;
      try {
        if (playing) {await engine.pause(client); playing = false; clearTimeout(timer);}
        else {if (tick >= data.ticks) tick = 0; playing = await engine.play(client, bytes, tick, 1, !started); started = playing; if (playing) update();}
        refresh();
      } catch (error) {status.textContent = error.message;}
      finally {play.disabled = false;}
    });
    async function seek(seconds) {
      tick = Math.max(0, Math.min(data.ticks, data.timeToTick(seconds))); refresh();
      try {await engine.seek(client, tick);} catch (error) {status.textContent = error.message;}
    }
    progress.addEventListener('input', () => seek(Number(progress.value)));
    restart.addEventListener('click', () => seek(0));
  } catch (error) {
    status.textContent = `Score unavailable: ${error.message}`;
    const retry = document.createElement('button'); retry.type = 'button'; retry.textContent = 'Retry';
    retry.onclick = () => {unsubscribe?.(); bar.remove(); root.querySelector('.lilylet-score')?.remove(); mount(root);};
    bar.append(retry);
  } finally {root.removeAttribute('aria-busy');}
  window.addEventListener('pagehide', event => {
    if (event.persisted) {client.deactivate(); engine?.pause(client); return;}
    disposed = true; client.deactivate(); unsubscribe?.(); engine?.release(client);
  });
}
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) {observer.unobserve(entry.target); mount(entry.target);}
}, {rootMargin:'200px'});
for (const root of document.querySelectorAll('[data-lilylet][data-mei]')) observer.observe(root);
