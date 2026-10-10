"""Real HTTP download counts: concurrency, refresh, invalidation, retry, and fallback.
Run after generating the blog with Hexo. Uses an isolated browser profile and a local test server.
"""
from collections import Counter
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from urllib.parse import urlsplit
import json, os, re, time
from playwright.sync_api import sync_playwright

public = Path(__file__).resolve().parents[4] / 'public'
original_version = re.search(r"const VERSION = '([^']+)'", (public/'midi-player/asset-cache-sw.js').read_text()).group(1)
state = dict(revision=original_version, fail=False)
counts = Counter()
class Handler(SimpleHTTPRequestHandler):
 def log_message(self, *args): pass
 def do_GET(self):
  path = urlsplit(self.path).path
  counts[path] += 1
  if path == '/cache-test.html':
   body = ('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1">'
    '<style>body{margin:12px;background:#eef2f6;display:flex;gap:12px}iframe{border:0;width:440px;height:520px}</style>'
    + ''.join(f'<iframe allow="autoplay" src="/midi-player/player.html?src=/images/example.mid&title=Player+{i}"></iframe>' for i in range(2))).encode()
  elif path in ['/midi-player/player.js', '/midi-player/asset-cache-sw.js']:
   body = (public/path.lstrip('/')).read_bytes().replace(original_version.encode(),state['revision'].encode())
  elif path.endswith(('gm.sf3','libfluidsynth.js','js-synthesizer.worklet.js')):
   if state['fail']:
    self.send_error(503); return
   body = (public/path.lstrip('/')).read_bytes()
  else:
   return super().do_GET()
  self.send_response(200)
  self.send_header('Content-Type', 'text/html' if path.endswith('.html') else 'application/javascript' if path.endswith('.js') else 'application/octet-stream')
  self.send_header('Cache-Control', 'no-store') # Prove Cache Storage, not HTTP caching.
  self.send_header('Content-Length',str(len(body))); self.end_headers()
  try:
   for offset in range(0,len(body),131072):
    self.wfile.write(body[offset:offset+131072]); self.wfile.flush()
    if path.endswith('gm.sf3'):time.sleep(.008)
  except (BrokenPipeError,ConnectionResetError): pass

server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(public)))
Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}'
font='/midi-player/gm.sf3'
def open_frames(page):
 page.goto(base+'/cache-test.html',wait_until='networkidle')
 frames=[e.content_frame() for e in page.locator('iframe').element_handles()]
 for f in frames:f.wait_for_function("!document.querySelector('.play').disabled",polling=100)
 return frames

def ready(frame):
 frame.wait_for_function("document.querySelector('.loading').hidden",polling=100,timeout=40000)
 assert not frame.locator('.error').inner_text()

try:
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_EXECUTABLE'),args=['--no-sandbox'])
  context=browser.new_context(viewport={'width':930,'height':620})
  page=context.new_page();frames=open_frames(page)
  assert counts[font]==0
  frames[0].locator('.play').click();frames[1].locator('.play').click()
  frames[0].wait_for_function("document.querySelector('.loading-progress').value>0 && document.querySelector('.loading-progress').value<1",polling=50)
  assert 'MB' in frames[0].locator('.loading-amount').inner_text()
  frames[0].locator('.player').screenshot(path='/tmp/klblog-midi-loading.png')
  assert frames[0].locator('.player').get_attribute('aria-busy')=='true'
  for f in frames:ready(f)
  assert counts[font]==1,dict(counts)
  frames=open_frames(page);frames[0].locator('.play').click();ready(frames[0])
  assert counts[font]==1,dict(counts)
  # Recreate the audio engine while the entire asset server is unavailable.
  state['fail']=True
  frames[1].locator('.play').click();ready(frames[1])
  assert counts[font]==1
  assert counts['/midi-player/libfluidsynth.js']==1,dict(counts)
  assert counts['/midi-player/js-synthesizer.worklet.js']==1,dict(counts)
  state['fail']=False
  # Emulate a changed asset build. The worker and bundle receive the new content hash.
  state['revision']='f'*20
  page.reload(wait_until='networkidle')
  frames=[e.content_frame() for e in page.locator('iframe').element_handles()]
  for f in frames:f.wait_for_function("!document.querySelector('.play').disabled",polling=100)
  frames[0].locator('.play').click();ready(frames[0])
  assert counts[font]==2,dict(counts)
  frames[0].wait_for_function("navigator.serviceWorker.controller !== null")
  keys=frames[0].evaluate('caches.keys()')
  assert any(k.endswith('f'*20) for k in keys),keys
  context.close()
  # With SW blocked, Cache Storage + Web Locks still deduplicate the download.
  fallback=browser.new_context(service_workers='block')
  page=fallback.new_page();frames=open_frames(page);before=counts[font]
  frames[0].locator('.play').click();frames[1].locator('.play').click()
  for f in frames:ready(f)
  assert counts[font]-before==1,dict(counts)
  fallback.close()
  # Failed responses aren't cached. The in-player retry can complete the download.
  retry=browser.new_context();page=retry.new_page();frames=open_frames(page)
  state['fail']=True;frames[0].locator('.play').click()
  frames[0].wait_for_function("document.querySelector('.loading').dataset.phase==='error'",polling=100)
  assert frames[0].locator('.loading-retry').is_visible()
  state['fail']=False;before=counts[font]
  frames[0].locator('.loading-retry').click();ready(frames[0])
  assert counts[font]-before==1
  retry.close()
  # Cache API failures must not prevent playback either.
  no_storage=browser.new_context(service_workers='block')
  no_storage.add_init_script("Object.defineProperty(window,'caches',{get(){throw new Error('storage blocked')}})")
  page=no_storage.new_page();frames=open_frames(page)
  frames[0].locator('.play').click();ready(frames[0])
  no_storage.close();browser.close()
  print(json.dumps(dict(result='passed',http_requests=dict(counts))))
finally:
 server.shutdown();server.server_close()
