# Culture Orbital

A three.js scene of a Culture-style orbital: a ring 10,000 km in radius that you can fly over and walk on. Up to several players can share one ring through a small relay server.

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole scene. three.js 0.160 loads from jsDelivr, so the page needs internet access. |
| `server.js` | Serves `index.html` and relays player positions over a WebSocket on port 8765. |
| `package.json`, `package-lock.json` | Node dependencies. The only dependency is `ws`. |

## Single player

1. Double-click `index.html`.
2. If the browser shows a blank page, serve the folder with `python3 -m http.server 8765`. Then open http://localhost:8765.

The page runs alone when it cannot reach `server.js`.

## Multiplayer on one network

You need Node 18 or newer.

1. In this folder, run `npm install`.
2. Run `npm start`. The server prints `http://localhost:8765`.
3. Open http://localhost:8765 in your browser.
4. Give the other players `http://<your-ip>:8765`. They must be on the same network.

Add `?name=Alice` to a link to set the name that other players see.

## Multiplayer over the internet

This uses a Cloudflare quick tunnel. You do not need an account or an open port.

1. Install the tunnel tool with `brew install cloudflared`.
2. Start the server with `npm start`.
3. In a second terminal, run `cloudflared tunnel --url http://localhost:8765`.
4. Find the `https://….trycloudflare.com` link in the output. Send this link to the other players.
5. If the link does not open, wait up to one minute. New tunnel names take time to resolve.

Each tunnel start gives a new link. Anyone with the link can join while the tunnel runs. To stop sharing, stop `cloudflared` and the server with Ctrl+C.

## Controls

Click the scene to capture the mouse. Press Esc to release it.

| Key | Ship mode | Walk mode |
|---|---|---|
| Mouse | Steer | Look |
| W / S | Throttle up / down | Walk forward / back |
| A / D | Roll | Walk left / right |
| Scroll | Throttle | Walk speed |
| Space | | Jump |

| Key | Both modes |
|---|---|
| V | Change between ship and walk |
| O | Overview of the whole ring |
| H | Go back to the spawn point |
| J | Go to another player |
| G | Go to the GSV |
| X | Show or hide the GSV (hidden at start) |
| P | Stop or start the day cycle on your screen |
| M | Turn sound on or off. Sound starts after your first click. |

The "LOD detail" slider sets how much terrain detail the page draws. A lower value is faster.

## Notes for an agent

- Units are metres. The ring axis is Y, and the floor is the inside of a cylinder at radius `R = 1e7`.
- The camera stays at the origin. Its true position is `camPos`, in JS doubles. Every object is drawn at its position minus `camPos`. This keeps GPU numbers small.
- The terrain noise runs in the vertex shader. `terrainAt()` in JS gives the same heights, for the ship and the walker. If you change one, change the other.
- The GSV deck draws a patch of the ring terrain flat, with the `DECK` shader define. `deckH()` is its JS twin.
- The relay has no game logic. It adds the sender `id` to each message and sends the message to all other clients.
- Messages: `hello {id, epoch, others}` from the server, `pose {name, s, w}` from clients, and `leave {id}`. `s` is the ship position and quaternion (7 numbers). `w` is the eye position of a walker, or `null`.
- All clients calculate the day angle from the server `epoch`, so all players see the same time of day.
- The port is fixed at 8765. `server.js` does not read `PORT`, because some shells set it.
- To test in headless Chrome, use `--use-angle=swiftshader --enable-unsafe-swiftshader`. Use `--timeout=15000` for screenshots. `--virtual-time-budget` renders about one frame, so the scene does not move.
