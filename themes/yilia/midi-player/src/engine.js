// One persistent audio engine per article, hosted outside individual player frames.
import {AudioWorkletNodeSynthesizer, Constants} from 'js-synthesizer';
import {ensureAssetCache, assetURL, loadSoundfont} from './asset-cache';
const listeners = new Set();
let state = {phase: 'idle', label: 'Preparing piano'};
let audio, synth, node, pending, owner, queue = Promise.resolve();
let revision = 0;
function publish(next) {state = next; for (const fn of listeners) fn(state);}
function serial(fn) {const result = queue.then(fn); queue = result.catch(() => {}); return result;}
const engine = {
  get owner() {return owner;},
  get context() {return audio;},
  get synth() {return synth;},
  subscribe(fn) {listeners.add(fn); fn(state); return () => listeners.delete(fn);},
  prepare() {
    if (pending) return pending;
    if (synth) return Promise.resolve();
    pending = (async () => {
      if (!window.AudioContext || !isSecureContext) throw new Error('Playback requires HTTPS or localhost and Web Audio.');
      publish({phase: 'loading', stage: 'soundfont', label: 'Loading SoundFont'});
      audio = new AudioContext({sampleRate: 24000});
      await audio.suspend();
      // Preload and decode while suspended; only a Play gesture resumes audio.
      await ensureAssetCache();
      const font = await loadSoundfont(progress => publish({phase: 'loading', stage: 'soundfont',
        label: progress.cached ? 'Loading cached SoundFont' : progress.waiting ? 'Waiting for SoundFont' : 'Downloading SoundFont', progress}));
      publish({phase: 'loading', stage: 'warmup', label: 'Warming up audio engine'});
      await audio.audioWorklet.addModule(assetURL('libfluidsynth.js'));
      await audio.audioWorklet.addModule(assetURL('js-synthesizer.worklet.js'));
      const instance = new AudioWorkletNodeSynthesizer();
      instance.init(audio.sampleRate, {initialGain: .8, polyphony: 512, chorusActive: false, reverbActive: false});
      node = instance.createAudioNode(audio); node.connect(audio.destination);
      await instance.loadSFont(font);
      synth = instance;
      publish({phase: 'ready', label: 'Piano ready'});
    })().catch(async error => {
      node?.disconnect(); await audio?.close(); audio = null; node = null; synth = null;
      publish({phase: 'error', label: error.message}); throw error;
    }).finally(() => {pending = null;});
    return pending;
  },
  play(client, bytes, tick, speed, restart) {
    // Invoked directly by the visible frame's click, preserving user activation.
    const resumed = audio.resume();
    const request = ++revision;
    return serial(async () => {
      await resumed;
      if (request !== revision) return false;
      await audio.resume();
      if (owner !== client || restart) {
        if (owner && owner !== client) owner.deactivate();
        owner = client;
        await synth.resetPlayer();
        for (let ch = 0; ch < 16; ch++) synth.midiAllSoundsOff(ch);
        await synth.addSMFDataToPlayer(bytes.slice(0));
        synth.setPlayerTempo(Constants.PlayerSetTempoType.Internal, speed);
        synth.seekPlayer(tick);
        await synth.playPlayer();
      } else synth.setPlayerTempo(Constants.PlayerSetTempoType.Internal, speed);
      return request === revision;
    });
  },
  pause(client) {
    if (owner !== client) return Promise.resolve();
    ++revision;
    return serial(() => owner === client && audio.state === 'running' ? audio.suspend() : undefined);
  },
  seek(client, tick) {
    if (owner !== client) return;
    for (let ch = 0; ch < 16; ch++) synth.midiAllSoundsOff(ch);
    synth.seekPlayer(tick);
  },
  speed(client, speed) {if (owner === client) synth.setPlayerTempo(Constants.PlayerSetTempoType.Internal, speed);},
  tick(client) {return owner === client ? synth.retrievePlayerCurrentTick() : Promise.resolve(null);},
  release(client) {
    if (owner !== client) return;
    ++revision;
    return serial(async () => {
      if (owner !== client) return;
      await audio.suspend(); await synth.resetPlayer(); owner = null;
    });
  }
};
window.midiEngine = engine;
document.addEventListener('visibilitychange', () => {if (document.hidden && owner) {owner.deactivate(); engine.pause(owner);}});
window.addEventListener('pagehide', event => {if (!event.persisted) audio?.close();});
