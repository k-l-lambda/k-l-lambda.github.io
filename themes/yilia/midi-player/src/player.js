// Piano-roll interaction adapted from hf-speaking-midi/ui/player.js.
// MIDI playback runs inside FluidSynth's AudioWorklet, not a main-thread note scheduler.
import {AudioWorkletNodeSynthesizer, Constants} from 'js-synthesizer';
import {timeline} from './timeline.cjs';
import {ensureAssetCache, assetURL, loadSoundfont} from './asset-cache';
const {PlayerSetTempoType} = Constants;

const root = document.querySelector('.player');
const $ = s => root.querySelector(s);
const canvas = $('.roll'), ctx = canvas.getContext('2d');
const background = document.createElement('canvas'), bg = background.getContext('2d');
const play = $('.play'), seek = $('.seek');
const params = new URLSearchParams(location.search);
$('.title').textContent = params.get('title') || 'MIDI piano roll';
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
const format = n => `${Math.floor(n / 60)}:${Math.floor(n % 60).toString().padStart(2, '0')}`;
let data, bytes, synth, audio, node, loading, timer, started = false, playing = false;
let position = 0, offset = 0, zoom = 1, width = 600, height = 270, low = 36, high = 84;
let longest = 0, dirty = true, generation = 0, dead = false;
let busy = false;
function showLoading(title, detail, progress) {
  busy = true;
  root.setAttribute('aria-busy', 'true');
  root.dataset.state = 'loading';
  $('.loading').hidden = false; $('.loading').dataset.phase = 'loading';
  $('.loading-title').textContent = title; $('.loading-detail').textContent = detail;
  $('.loading-retry').hidden = true;
  const bar = $('.loading-progress'); bar.hidden = false;
  if (progress?.total > 0) bar.value = clamp(progress.loaded / progress.total, 0, 1);
  else bar.removeAttribute('value');
  const mb = n => (n / 1e6).toFixed(1) + ' MB';
  $('.loading-amount').textContent = progress && !progress.cached && !progress.waiting
    ? progress.total > 0 ? `${Math.round(clamp(progress.loaded / progress.total, 0, 1) * 100)}% · ${mb(progress.loaded)} / ${mb(progress.total)}` : mb(progress.loaded)
    : '';
  play.disabled = true; play.textContent = 'Loading…'; play.setAttribute('aria-label', title);
}
function hideLoading() {
  busy = false; root.setAttribute('aria-busy', 'false');
  $('.loading').hidden = true; play.disabled = false; controls(); draw();
}
const left = 46, top = 23, bottom = 10;
const span = () => Math.max((data?.duration || 8) / zoom, .1);
const channel = typeof BroadcastChannel === 'function' ? new BroadcastChannel('klblog-midi-player') : null;
if (channel) channel.onmessage = () => {
  // Articles can contain many players: release the inactive worklet and SoundFont.
  if (!audio || busy) return;
  playing = false; generation++; clearTimeout(timer);
  node?.disconnect(); audio.close(); audio = null; synth = null; node = null; started = false;
  controls(); draw();
};
function fail(error) {
  busy = false; root.setAttribute('aria-busy', 'false'); root.dataset.state = 'error';
  $('.error').textContent = error instanceof Error ? error.message : String(error);
  $('.loading').hidden = false; $('.loading').dataset.phase = 'error';
  $('.loading-title').textContent = 'Couldn’t load the music';
  $('.loading-detail').textContent = 'Check your connection or the file, then try again.';
  $('.loading-progress').hidden = true; $('.loading-amount').textContent = '';
  $('.loading-retry').hidden = false; play.disabled = false; play.textContent = 'Retry';
  play.setAttribute('aria-label', 'Retry loading MIDI');
}
function lowerBound(time) {
  let l = 0, r = data.notes.length;
  while (l < r) {const m = (l + r) >>> 1; if (data.notes[m].start < time) l = m + 1; else r = m;}
  return l;
}
function visibleAt(time, end) {
  const result = [];
  if (data) for (let i = lowerBound(time - longest); i < data.notes.length; i++) {
    const n = data.notes[i];
    if (n.start > end) break;
    if (n.start + n.duration >= time) result.push(n);
  }
  return result;
}
function draw() {
  const scale = (width - left) / span(), row = (height - top - bottom) / (high - low + 1);
  const rect = (c, n) => c.fillRect(left + (n.start - offset) * scale,
    top + (high - n.pitch) * row + Math.min(1, row * .1), Math.max(1, n.duration * scale), Math.max(1, row - 1));
  if (dirty) {
    bg.fillStyle = '#101b2d'; bg.fillRect(0, 0, width, height);
    for (let pitch = low; pitch <= high; pitch++) {
      const y = top + (high - pitch) * row, black = [1, 3, 6, 8, 10].includes(pitch % 12);
      bg.fillStyle = black ? '#0c1626' : '#142136'; bg.fillRect(left, y, width - left, row);
      bg.fillStyle = black ? '#23334a' : '#e1e8f2'; bg.fillRect(0, y, left - 2, Math.max(.5, row - 1));
      if (pitch % 12 === 0) {
        bg.fillStyle = '#4f627a'; bg.font = '10px system-ui'; bg.fillText(`C${Math.floor(pitch / 12) - 1}`, 7, y + Math.max(8, row * .8));
      }
    }
    const step = Math.max(.5, 2 ** Math.ceil(Math.log2(span() / 10)));
    for (let t = Math.ceil(offset / step) * step; t <= offset + span(); t += step) {
      const x = left + (t - offset) * scale;
      bg.strokeStyle = '#26364d'; bg.beginPath(); bg.moveTo(x, top); bg.lineTo(x, height - bottom); bg.stroke();
      bg.fillStyle = '#9bb0ce'; bg.font = '10px system-ui'; bg.fillText(`${t.toFixed(step < 1 ? 1 : 0)}s`, x + 3, 14);
    }
    bg.save(); bg.beginPath(); bg.rect(left, top, width - left, height - top); bg.clip();
    for (const n of visibleAt(offset, offset + span())) {
      bg.fillStyle = `hsl(${200 - n.velocity * .35} 70% ${42 + n.velocity * .15}%)`; rect(bg, n);
    }
    bg.restore(); dirty = false;
  }
  ctx.clearRect(0, 0, width, height); ctx.drawImage(background, 0, 0, width, height);
  const active = playing ? visibleAt(position, position).filter(n => n.start + n.duration > position) : [];
  for (const n of active) {
    ctx.fillStyle = '#6ce2b6'; ctx.fillRect(0, top + (high - n.pitch) * row, left - 2, Math.max(.5, row - 1));
  }
  ctx.save(); ctx.beginPath(); ctx.rect(left, top, width - left, height - top); ctx.clip();
  ctx.fillStyle = '#d2ffe6'; for (const n of active) rect(ctx, n);
  const cursor = left + (position - offset) * scale;
  ctx.strokeStyle = '#f8bc68'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cursor, top); ctx.lineTo(cursor, height); ctx.stroke(); ctx.restore();
  $('.clock').textContent = `${format(position)} / ${format(data?.duration || 0)}`;
  seek.value = String(position);
  canvas.dataset.time = String(position); canvas.dataset.active = String(active.length);
  root.dataset.state = busy ? 'loading' : playing ? 'playing' : 'paused';
}
function follow() {
  if (position < offset + span() * .15 || position > offset + span() * .7) {
    const next = clamp(position - span() * .4, 0, Math.max(0, data.duration - span()));
    if (next !== offset) {offset = next; dirty = true;}
  }
}
function resize() {
  width = Math.max(180, canvas.clientWidth);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  for (const c of [canvas, background]) {c.width = width * dpr; c.height = height * dpr; c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);}
  dirty = true; draw();
}
function controls() {
  play.textContent = playing ? 'Ⅱ Pause' : '▶ Play';
  play.setAttribute('aria-label', playing ? 'Pause MIDI' : 'Play MIDI');
}
async function poll(token) {
  if (!playing || dead || token !== generation) return;
  try {
    const tick = await synth.retrievePlayerCurrentTick();
    if (!playing || token !== generation) return;
    position = clamp(data.tickToTime(tick), 0, data.duration); follow(); draw();
    if (tick >= data.ticks) {started = false; await pause(); return;}
    timer = setTimeout(() => poll(token), 40);
  } catch (e) {if (token === generation) {fail(e); await pause();}}
}
async function pause() {
  playing = false; generation++; clearTimeout(timer);
  if (audio?.state === 'running') await audio.suspend();
  controls(); draw();
}
function seekTo(time) {
  if (!data) return;
  position = clamp(time, 0, data.duration);
  generation++; clearTimeout(timer);
  if (synth) {
    // Clear ringing voices before the native MIDI player chases channel state.
    for (let ch = 0; ch < 16; ch++) synth.midiAllSoundsOff(ch);
    synth.seekPlayer(data.timeToTick(position));
  }
  follow(); draw();
  if (playing) timer = setTimeout(() => poll(generation), 50);
}
async function fetchBytes(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load ${url.pathname || url}: HTTP ${response.status}`);
  return response.arrayBuffer();
}
async function loadMidi() {
  showLoading('Opening your MIDI', 'Getting the notes ready…');
  const raw = params.get('src');
  if (!raw) throw new Error('No MIDI file specified.');
  const url = new URL(raw, location.origin);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Unsupported MIDI URL.');
  bytes = await fetchBytes(url);
  data = timeline(new Uint8Array(bytes));
  if (!data.notes.length || data.duration <= 0) throw new Error('This file contains no playable notes.');
  low = 127; high = 0;
  for (const n of data.notes) {low = Math.min(low, n.pitch); high = Math.max(high, n.pitch); longest = Math.max(longest, n.duration);}
  low = Math.max(0, low - 2); high = Math.min(127, high + 2);
  seek.max = String(data.duration); seek.disabled = false; $('.restart').disabled = false;
  $('.note-count').textContent = `${data.notes.length.toLocaleString()} notes`;
  dirty = true; hideLoading();
}
async function prepare() {
  if (synth) return;
  if (loading) return loading;
  if (!window.AudioContext || !window.isSecureContext) throw new Error('MIDI playback requires HTTPS or localhost and Web Audio support.');
  // Open/resume in the click handler, before the first network await (mobile autoplay).
  audio = new AudioContext({sampleRate: 24000});
  const resumed = audio.resume();
  showLoading('Getting the piano ready', 'Checking for a saved piano…');
  loading = (async () => {
    await resumed;
    await ensureAssetCache();
    const soundfont = await loadSoundfont(progress => {
      if (progress.waiting) showLoading('Getting the piano ready', 'Sharing the piano with your other players…');
      else if (progress.cached) showLoading('Using your saved piano', 'No download needed. Almost ready…');
      else showLoading('Downloading the piano', 'Just once — other tracks will use this piano too.', progress);
    });
    showLoading('Preparing playback', 'The piano is ready. Warming up the sound…');
    await audio.audioWorklet.addModule(assetURL('libfluidsynth.js'));
    await audio.audioWorklet.addModule(assetURL('js-synthesizer.worklet.js'));
    const instance = new AudioWorkletNodeSynthesizer();
    instance.init(audio.sampleRate, {initialGain: .8, polyphony: 512, chorusActive: false, reverbActive: false});
    node = instance.createAudioNode(audio); node.connect(audio.destination);
    await instance.loadSFont(soundfont);
    synth = instance;
  })();
  try {await loading;} catch (e) {await audio.close(); audio = null; synth = null; throw e;}
  finally {loading = null;}
}
play.addEventListener('click', async () => {
  if (playing) {await pause(); return;}
  play.disabled = true; $('.error').textContent = '';
  try {
    if (!data) await loadMidi();
    await prepare();
    showLoading('Preparing playback', 'Starting your music…');
    await audio.resume();
    if (position >= data.duration) position = 0;
    if (!started) {
      await synth.resetPlayer();
      await synth.addSMFDataToPlayer(bytes.slice(0));
      synth.setPlayerTempo(PlayerSetTempoType.Internal, Number($('.speed').value));
      synth.seekPlayer(data.timeToTick(position));
      await synth.playPlayer(); started = true;
    }
    playing = true; hideLoading(); channel?.postMessage('play');
    // Allow the worklet to apply a seek before reading its current tick.
    const token = ++generation;
    timer = setTimeout(() => poll(token), 60);
  } catch (e) {fail(e);}
  finally {play.disabled = false;}
});
$('.loading-retry').addEventListener('click', () => play.click());
$('.restart').addEventListener('click', () => seekTo(0));
seek.addEventListener('input', () => seekTo(Number(seek.value)));
$('.speed').addEventListener('change', e => synth?.setPlayerTempo(PlayerSetTempoType.Internal, Number(e.target.value)));
$('.zoom').addEventListener('input', e => {zoom = Number(e.target.value); offset = clamp(position - span() * .4, 0, Math.max(0, (data?.duration || 0) - span())); dirty = true; draw();});
canvas.addEventListener('click', e => {const x = e.clientX - canvas.getBoundingClientRect().left; if (x >= left) seekTo(offset + (x - left) / (width - left) * span());});
canvas.addEventListener('keydown', e => {if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {e.preventDefault(); seekTo(position + (e.key === 'ArrowRight' ? 1 : -1));}});
const observer = new ResizeObserver(resize); observer.observe(canvas);
window.addEventListener('pagehide', event => {
  if (event.persisted) {pause(); return;}
  dead = true; clearTimeout(timer); observer.disconnect(); channel?.close(); audio?.close();
});
document.addEventListener('visibilitychange', () => {if (document.hidden && playing) pause();});
resize();
loadMidi().catch(fail);
