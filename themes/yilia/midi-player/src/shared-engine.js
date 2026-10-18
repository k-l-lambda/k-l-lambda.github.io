// Keep the engine in a dedicated sibling frame so removing a player cannot kill it.
export function sharedEngine(engineURL = new URL('engine.html', location.href).href) {
  let host = window;
  try {if (parent.location.origin === location.origin) host = parent;} catch (_) { /* Standalone cross-origin embed. */ }
  const key = '__klblogMidiEngine';
  if (!host[key]) {
    host[key] = new Promise((resolve, reject) => {
      const frame = host.document.createElement('iframe');
      frame.hidden = true; frame.title = 'Shared MIDI audio engine';
      frame.dataset.midiEngine = ''; frame.allow = 'autoplay';
      frame.src = engineURL;
      const timeout = host.setTimeout(() => failed(), 20000);
      function failed() {host.clearTimeout(timeout); frame.remove(); delete host[key]; reject(new Error('Could not load the piano engine. Please retry.'));}
      frame.onload = () => {
        host.clearTimeout(timeout);
        if (frame.contentWindow.midiEngine) resolve(frame.contentWindow.midiEngine);
        else failed();
      };
      frame.onerror = failed;
      host.document.body.append(frame);
    });
  }
  return host[key];
}
