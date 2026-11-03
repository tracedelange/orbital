// Cloudflare Worker. Static assets (public/) serve the page for free; only /ws reaches this code.
// One Durable Object, Relay, holds every socket. Players are put in rooms of ROOM_MAX: each joins the
// first room with space, and a full room opens the next. Past MAX_ROOMS the relay says so and the client
// plays solo. The relay has no game logic: it checks names, rebuilds each pose from its known fields,
// censors chat, rate-limits, and passes messages on to the rest of the sender's room.
// It uses WebSocket hibernation, so memory can be wiped between messages: all per-socket state lives in
// the socket attachment, and each socket is tagged with its room.
import { DurableObject } from 'cloudflare:workers';
import { RegExpMatcher, TextCensor, englishDataset, englishRecommendedTransformers, asteriskCensorStrategy } from 'obscenity';

const ROOM_MAX = 8, MAX_ROOMS = 20;
const profanity = new RegExpMatcher({ ...englishDataset.build(), ...englishRecommendedTransformers });
const censor = new TextCensor().setStrategy(asteriskCensorStrategy());
const send = (ws, msg) => ws.send(JSON.stringify(msg));
const nums = (a, n) => Array.isArray(a) && a.length === n && a.every(Number.isFinite);

// 2-20 letters, digits, spaces, dots, dashes or underscores, and nothing the profanity filter catches.
function checkName(raw) {
  const name = String(raw ?? '').trim().replace(/\s+/g, ' ');
  if (name.length < 2 || name.length > 20) return [null, 'Use 2 to 20 characters.'];
  if (!/^[\w .-]+$/.test(name)) return [null, 'Use letters, numbers, spaces, dots, dashes or underscores.'];
  if (profanity.hasMatch(name)) return [null, 'Please pick another name.'];
  return [name];
}

export default {
  fetch(req, env) {
    if (new URL(req.url).pathname === '/ws' && req.headers.get('Upgrade') === 'websocket')
      return env.RELAY.get(env.RELAY.idFromName('relay')).fetch(req);
    return new Response('Not found', { status: 404 });
  },
};

export class Relay extends DurableObject {
  fetch() {
    const count = new Map();  // room number -> players
    for (const s of this.ctx.getWebSockets()) {
      const { room } = s.deserializeAttachment();
      count.set(room, (count.get(room) ?? 0) + 1);
    }
    const [client, ws] = Object.values(new WebSocketPair());
    let room = [...count.keys()].sort((a, b) => a - b).find(r => count.get(r) < ROOM_MAX);
    if (room === undefined) {
      if (count.size >= MAX_ROOMS) {
        ws.accept();
        send(ws, { type: 'full' });
        ws.close(1000);
        return new Response(null, { status: 101, webSocket: client });
      }
      room = 1;
      while (count.has(room)) room++;
    }
    const id = crypto.randomUUID().slice(0, 8);
    this.ctx.acceptWebSocket(ws, [`r${room}`]);
    ws.serializeAttachment({ id, room, name: null, tokens: 30, last: Date.now(), chatAt: 0 });
    send(ws, { type: 'hello', id, epoch: 0, room, others: count.get(room) ?? 0 });
    return new Response(null, { status: 101, webSocket: client });
  }

  toRoom(from, room, msg) {
    const data = JSON.stringify(msg);
    for (const c of this.ctx.getWebSockets(`r${room}`)) if (c !== from) c.send(data);
  }

  webSocketMessage(ws, data) {
    if (typeof data !== 'string' || data.length > 1024) return;
    // Token bucket: 30 messages a second sustained (poses go at 15), extra ones dropped.
    const me = ws.deserializeAttachment(), now = Date.now();
    me.tokens = Math.min(30, me.tokens + (now - me.last) * 0.03);
    me.last = now;
    if (me.tokens < 1) return ws.serializeAttachment(me);
    me.tokens--;
    let m;
    try { m = JSON.parse(data); } catch { return ws.serializeAttachment(me); }
    if (m.type === 'name') {
      const [name, reason] = checkName(m.name);
      if (name) me.name = name;
      send(ws, name ? { type: 'name-ok', name } : { type: 'name-bad', reason });
    } else if (!me.name) {
      // nothing goes out until the player has a name
    } else if (m.type === 'pose' && nums(m.s, 7) && (m.w === null || nums(m.w, 3))) {
      this.toRoom(ws, me.room, { type: 'pose', id: me.id, name: me.name, s: m.s, w: m.w });
    } else if (m.type === 'chat' && now - me.chatAt > 1000) {
      const text = String(m.text ?? '').trim().slice(0, 200);
      if (text) {
        me.chatAt = now;
        const msg = { type: 'chat', id: me.id, name: me.name, text: censor.applyTo(text, profanity.getAllMatches(text)) };
        send(ws, msg);  // back to the sender too, so they see the censored text
        this.toRoom(ws, me.room, msg);
      }
    }
    ws.serializeAttachment(me);
  }

  webSocketClose(ws) {
    const { id, room } = ws.deserializeAttachment();
    this.toRoom(ws, room, { type: 'leave', id });
  }
}
