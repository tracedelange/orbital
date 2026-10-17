// Serves index.html and relays player poses over a WebSocket on the same port, so one tunnel covers both.
// The relay has no game logic: it tags each message with the sender's id and passes it to everyone else.
import http from 'node:http';
import fs from 'node:fs';
import { WebSocketServer } from 'ws';

const PORT = 8765;
const epoch = Date.now();  // clients derive the shared day angle from this
const page = new URL('./index.html', import.meta.url);

const server = http.createServer((req, res) => {
  if (!['/', '/index.html'].includes(new URL(req.url, 'http://x').pathname)) return res.writeHead(404).end();
  res.writeHead(200, { 'content-type': 'text/html' });
  fs.createReadStream(page).pipe(res);  // read per request, so edits show on reload
});

const wss = new WebSocketServer({ server });
let nextId = 1;
const broadcast = (from, msg) => {
  const out = JSON.stringify(msg);
  for (const c of wss.clients) if (c !== from && c.readyState === 1) c.send(out);
};

wss.on('connection', ws => {
  const id = nextId++;
  ws.send(JSON.stringify({ type: 'hello', id, epoch, others: wss.clients.size - 1 }));
  console.log(`player ${id} joined (${wss.clients.size} online)`);
  ws.on('message', data => broadcast(ws, { ...JSON.parse(data), id }));
  ws.on('close', () => {
    broadcast(ws, { type: 'leave', id });
    console.log(`player ${id} left (${wss.clients.size} online)`);
  });
});

server.listen(PORT, () => console.log(`http://localhost:${PORT}`));
