# http://twainmodule.sourceforge.net/docs/sm.html

import twain
import json
import time

sm = twain.SourceManager(0)

import asyncio

import websockets
import websockets.legacy
import websockets.legacy.server

current_scanner_id = 0

def get_images():
  buffer = []
  ss = sm.OpenSource(sm.GetSourceList()[current_scanner_id])
  scan_start_time = time.time()
  while True:
    try:
      ss.RequestAcquire(0,0)
      rv = ss.XferImageNatively()
      if rv:
          (handle, count) = rv
      twain.DIBToBMFile(handle, 'tmp.bmp')
      with open('tmp.bmp', 'rb') as file:
        scan_start_time = time.time()
        data = file.read()
        buffer.append(data)
    except (twain.excTWCC_SEQERROR, twain.excDSTransferCancelled):
      ss.destroy()
      ss = sm.OpenSource(sm.GetSourceList()[current_scanner_id])
      if time.time() - scan_start_time < 5:
        continue
      else:
        break
    except Exception as ex:
      template = "An exception of type {0} occurred. Arguments:\n{1!r}"
      message = template.format(type(ex).__name__, ex.args)
      print(message)
  return buffer

def list_scanners(params):
  return json.dumps({"list": sm.GetSourceList(), "selected_scanner": current_scanner_id})

def scan(params):
  return get_images()

def set_scanner(params):
  global current_scanner_id
  current_scanner_id = int(params[0])
  return json.dumps({"noop": True})

messages = {
  "list": list_scanners,
  "scan": scan,
  "set_scanner": set_scanner
}

def handle(data):
  received_message_data = data.split()
  if received_message_data[0] in messages:
    resp = messages[received_message_data[0]](received_message_data[1:])
  else:
    resp = json.dumps({"error": f'Unknown message {data}'})

  return resp

async def handler(websocket, path):
  while True:
      data = await websocket.recv()

      resp = handle(data)
      if isinstance(resp, list):
        if len(resp) <= 0:
          print(resp)
          await websocket.send(json.dumps({"noop": True}))
        else:
          for r in resp:
            await websocket.send(r)
      else:
        await websocket.send(resp)


start_server = websockets.serve(handler, "localhost", 8000)

asyncio.get_event_loop().run_until_complete(start_server)

asyncio.get_event_loop().run_forever()
