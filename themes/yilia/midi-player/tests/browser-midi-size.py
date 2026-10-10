"""Responsive auto height and explicit player dimensions; run against generated assets."""
from playwright.sync_api import sync_playwright
import os
base=os.environ.get('MIDI_TEST_URL','http://localhost:4173').rstrip('/')
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_EXECUTABLE'),args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':900,'height':1000})
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.route('**/size-test',lambda route:route.fulfill(content_type='text/html',body='''<!doctype html><meta name="viewport" content="width=device-width"><style>body{margin:0}iframe{display:block;border:0;max-width:100%}</style>
 <iframe id="auto" data-midi-height="auto" style="width:100%;height:420px" src="/midi-player/player.html?src=/images/example.mid"></iframe>
 <iframe id="fixed" data-midi-height="fixed" style="width:80%;height:450px" src="/midi-player/player.html?src=/images/example.mid&fit=height"></iframe>'''))
 page.goto(base+'/size-test')
 auto=page.locator('#auto').element_handle().content_frame()
 fixed=page.locator('#fixed').element_handle().content_frame()
 auto.wait_for_function("document.querySelector('.note-count').textContent.includes('8 notes')")
 def auto_fits():
  page.wait_for_function("Math.abs(document.querySelector('#auto').clientHeight-document.querySelector('#auto').contentDocument.querySelector('.player').getBoundingClientRect().height)<2")
 auto_fits()
 assert auto.locator('.roll').evaluate('e=>e.clientHeight')==320
 assert abs(fixed.locator('.player').bounding_box()['height']-450)<1
 assert abs(page.locator('#fixed').bounding_box()['width']-720)<1
 page.set_viewport_size({'width':360,'height':1000})
 auto.wait_for_function("document.querySelector('.roll').clientHeight===180")
 auto_fits()
 assert auto.evaluate('document.documentElement.scrollHeight<=innerHeight')
 assert abs(fixed.locator('.player').bounding_box()['height']-450)<1
 assert abs(page.locator('#fixed').bounding_box()['width']-288)<1
 before=page.locator('#auto').bounding_box()['height']
 auto.locator('.title').evaluate("e=>e.textContent='A long title '.repeat(15)")
 page.wait_for_function('(before)=>document.querySelector("#auto").clientHeight>before',arg=before)
 auto_fits()
 for frame in [auto,fixed]:
  frame.wait_for_function('Math.abs(document.querySelector("canvas").height-document.querySelector("canvas").clientHeight*Math.min(devicePixelRatio,2))<2')
 assert not errors,errors
 page.screenshot(path='/tmp/midi-size-mobile.png',full_page=True)
 print('Auto sizing, width percentage, fixed height, wrapped title, and canvas resize passed.')
 browser.close()
