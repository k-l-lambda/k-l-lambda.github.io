// Verovio timestamps are milliseconds. Snapshot active note IDs at each boundary
// so backward seeks and repeat playback do not depend on previous UI state.
function scoreTiming(events) {
  const active = new Set();
  const frames = [...events].sort((a, b) => a.tstamp - b.tstamp).map(event => {
    for (const id of event.off || []) active.delete(id);
    for (const id of event.on || []) active.add(id);
    return {time: event.tstamp, notes: [...active]};
  });
  return milliseconds => {
    let low = 0, high = frames.length;
    while (low < high) {
      const mid = (low + high) >>> 1;
      if (frames[mid].time <= milliseconds) low = mid + 1;
      else high = mid;
    }
    return low ? frames[low - 1].notes : [];
  };
}
module.exports = {scoreTiming};
