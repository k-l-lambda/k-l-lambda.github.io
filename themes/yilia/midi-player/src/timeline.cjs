const parse = require('./vendor/music-widgets/midifile').default;

// Merge tracks before integrating tempo. Seconds are independent of MIDI division.
function timeline(buffer) {
  const midi = parse(buffer);
  const division = midi.header.ticksPerBeat;
  if (midi.header.formatType > 1 || !division || division & 0x8000)
    throw new Error('Only synchronous MIDI format 0/1 with beat-based timing is supported.');
  const events = [];
  midi.tracks.forEach((track, trackIndex) => {
    let tick = 0;
    track.forEach((event, order) => {
      tick += event.deltaTime;
      events.push({...event, tick, trackIndex, order});
    });
  });
  events.sort((a, b) => a.tick - b.tick || a.trackIndex - b.trackIndex || a.order - b.order);
  const tempos = [{tick: 0, time: 0, tempo: 500000}];
  const active = new Map(), notes = [];
  let tick = 0, time = 0, tempo = 500000;
  for (const e of events) {
    time += (e.tick - tick) * tempo / (division * 1e6);
    tick = e.tick;
    if (e.subtype === 'setTempo') {
      if (!(e.microsecondsPerBeat > 0)) throw new Error('Invalid MIDI tempo.');
      tempo = e.microsecondsPerBeat;
      tempos.push({tick, time, tempo});
    }
    const key = `${e.channel}:${e.noteNumber}`;
    if (e.subtype === 'noteOn' && e.velocity > 0) {
      const queue = active.get(key) || [];
      queue.push({pitch: e.noteNumber, velocity: e.velocity, channel: e.channel, start: time});
      active.set(key, queue);
    } else if (e.subtype === 'noteOff' || (e.subtype === 'noteOn' && !e.velocity)) {
      const queue = active.get(key);
      if (queue && queue.length) {
        const note = queue.shift();
        notes.push({...note, duration: Math.max(0, time - note.start)});
        if (!queue.length) active.delete(key);
      }
    }
  }
  for (const queue of active.values())
    for (const note of queue) notes.push({...note, duration: Math.max(0, time - note.start)});
  notes.sort((a, b) => a.start - b.start || a.pitch - b.pitch);
  function locate(value, field) {
    let low = 0, high = tempos.length;
    while (low < high) {
      const mid = (low + high) >>> 1;
      if (tempos[mid][field] <= value) low = mid + 1;
      else high = mid;
    }
    return tempos[Math.max(0, low - 1)];
  }
  return {notes, duration: time, ticks: tick,
    tickToTime(t) { const p = locate(t, 'tick'); return p.time + (t - p.tick) * p.tempo / (division * 1e6); },
    timeToTick(s) { const p = locate(s, 'time'); return Math.round(p.tick + (s - p.time) * division * 1e6 / p.tempo); }
  };
}
module.exports = {timeline};
