from playwright.sync_api import sync_playwright
import json,os
from pathlib import Path
public = Path(__file__).resolve().parents[4] / 'public'
base=os.environ.get('MIDI_TEST_URL','http://127.0.0.1:4173').rstrip('/')
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_EXECUTABLE'),args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':900,'height':700})
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.add_init_script('''const connect=AudioNode.prototype.connect;AudioNode.prototype.connect=function(...args){if(args[0] instanceof AudioDestinationNode){window.__monitor=this.context.createAnalyser();connect.call(this,window.__monitor);}return connect.apply(this,args);};''')
 requests=[];page.on('request',lambda r:requests.append(r.url))
 page.goto(base+'/midi-player/player.html?src=/images/example.mid&title=Test',wait_until='networkidle')
 page.wait_for_function("document.querySelector('.note-count').textContent.includes('8 notes')")
 assert not any('gm.sf3' in u for u in requests)
 page.locator('.play').click()
 try:page.wait_for_function("Number(document.querySelector('canvas').dataset.time)>0.3",timeout=30000)
 except:
  print('ERROR TEXT',page.locator('.error').inner_text());print('ERRORS',errors);raise
 rms=page.evaluate('''()=>{const a=new Float32Array(__monitor.fftSize);__monitor.getFloatTimeDomainData(a);return Math.sqrt(a.reduce((s,x)=>s+x*x,0)/a.length)}''')
 assert rms>1e-5,rms
 page.locator('.speed').select_option('0.5');page.wait_for_timeout(150)
 slow_start=float(page.locator('canvas').get_attribute('data-time'));page.wait_for_timeout(600)
 slow_delta=float(page.locator('canvas').get_attribute('data-time'))-slow_start
 assert .15<slow_delta<.45,slow_delta
 page.locator('.speed').select_option('1')
 page.locator('.play').click();t=float(page.locator('canvas').get_attribute('data-time'));page.wait_for_timeout(350)
 assert abs(float(page.locator('canvas').get_attribute('data-time'))-t)<.02
 page.locator('.seek').evaluate("e=>{e.value='2';e.dispatchEvent(new Event('input'))}")
 page.locator('.play').click();page.wait_for_function("Number(document.querySelector('canvas').dataset.time)>2.1")
 page.locator('.speed').select_option('1.5')
 page.locator('.zoom').fill('2')
 page.wait_for_function("document.querySelector('.player').dataset.state==='paused'",timeout=10000)
 page.locator('.play').click();page.wait_for_function("Number(document.querySelector('canvas').dataset.time)>0.2 && Number(document.querySelector('canvas').dataset.time)<2",timeout=8000)
 page.locator('.play').click()
 page.set_viewport_size({'width':360,'height':520});page.screenshot(path=os.environ.get('MIDI_SCREENSHOT','/tmp/klblog-midi-mobile.png'))
 assert page.evaluate('document.documentElement.scrollWidth')==360
 print(json.dumps({'rms':rms,'errors':errors,'state':page.locator('.player').get_attribute('data-state')}))
 assert not errors,errors
 # Exercise the tag inside a real theme page, including switching back to a released engine.
 demo_path = os.environ.get('MIDI_DEMO_PATH')
 if not demo_path:
  demo_file = next(public.glob('**/midi-test/index.html'), None)
  assert demo_file, 'Generate with --draft, or set MIDI_DEMO_PATH to a two-player article.'
  demo_path = '/' + demo_file.parent.relative_to(public).as_posix() + '/'
 page.goto(base+demo_path,wait_until='domcontentloaded')
 embeds=page.locator('iframe');assert embeds.count()==2
 embeds.nth(1).scroll_into_view_if_needed()
 frames=[embeds.nth(i).element_handle().content_frame() for i in range(2)]
 for f in frames:f.wait_for_function("document.querySelector('.note-count').textContent.includes('8 notes')",polling=100)
 frames[0].locator('.speed').select_option('0.5')
 frames[0].locator('.play').click()
 frames[0].wait_for_function("document.querySelector('.player').dataset.state==='playing'",polling=100)
 frames[1].locator('.play').click()
 frames[1].wait_for_function("document.querySelector('.player').dataset.state==='playing'",polling=100)
 frames[0].wait_for_function("document.querySelector('.player').dataset.state==='paused'",polling=100)
 assert float(frames[0].locator('canvas').get_attribute('data-time'))<4.5
 frames[0].locator('.seek').evaluate("e=>{e.value='1';e.dispatchEvent(new Event('input'))}")
 frames[0].locator('.play').click()
 frames[0].wait_for_function("document.querySelector('.player').dataset.state==='playing'",polling=100)
 frames[1].wait_for_function("document.querySelector('.player').dataset.state==='paused'",polling=100)
 assert all(not f.locator('.error').inner_text() for f in frames)
 page.goto(base+'/midi-player/player.html?src=/missing.mid',wait_until='networkidle')
 page.wait_for_function("document.querySelector('.error').textContent.includes('404')")
 assert page.locator('.play').inner_text()=='Retry'
 print('Embedded players, engine recreation, and missing-file handling passed.')
 browser.close()
