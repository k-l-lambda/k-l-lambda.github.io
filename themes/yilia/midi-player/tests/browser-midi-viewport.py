from playwright.sync_api import sync_playwright
from urllib.parse import urlsplit
import os
base=os.environ.get('MIDI_TEST_URL','http://localhost:4173').rstrip('/')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_EXECUTABLE'),args=['--no-sandbox'])
 page=b.new_page(viewport={'width':360,'height':600});requests=[]
 page.on('request',lambda r:requests.append(r.url))
 page.route('**/viewport-test',lambda r:r.fulfill(content_type='text/html',body='<!doctype html><meta name="viewport" content="width=device-width"><div style="height:3000px">Scroll</div><iframe style="width:100%;height:510px;border:0" src="/midi-player/player.html?src=/images/example.mid"></iframe>'))
 page.goto(base+'/viewport-test');page.wait_for_timeout(1000)
 assert not any(urlsplit(u).path.endswith(('gm.sf3','example.mid')) for u in requests),requests
 frame=page.locator('iframe[src*="player.html"]');frame.scroll_into_view_if_needed()
 ui=frame.element_handle().content_frame();ui.locator('.loading[data-phase=ready]').wait_for(timeout=60000)
 assert ui.evaluate('document.documentElement.scrollWidth<=innerWidth')
 ui.locator('.player').screenshot(path='/tmp/shared-midi-mobile.png')
 print('Offscreen deferral, viewport prewarm, and mobile layout passed.',flush=True)
 b.close()
