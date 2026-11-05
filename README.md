# Culture Orbital

A three.js scene of a Culture-style orbital: a ring 10,000 km in radius that you can fly over and walk on. Players share the ring through a relay on Cloudflare.

## Files

| File | Purpose |
|---|---|
| `public/index.html` | The whole scene. three.js 0.160 loads from jsDelivr, so the page needs internet access. |
| `worker.js` | The Cloudflare Worker. It relays player positions and chat over a WebSocket at `/ws`. |
| `wrangler.toml` | The Worker configuration: the static assets, the Durable Object and the domain `orbital.tdelange.com`. |
| `.github/workflows/release.yml` | release-please, and the deploy to Cloudflare. |

## Single player

1. Double-click `public/index.html`.
2. If the browser shows a blank page, run `npm run dev`. Then open http://localhost:8787.

The page runs alone when it cannot reach the relay.

## Multiplayer

The game runs at https://orbital.tdelange.com.

A title card opens over the running scene. When the page opens from a server, the card asks for the name that other players see. The relay accepts 2 to 20 letters, numbers, spaces, dots, dashes or underscores, and rejects rude names. The page keeps the last name for the next visit. `?name=Alice` in the link fills in the form.

The relay puts players in rooms of 8. A player joins the first room with space. When all rooms are full, the relay opens a new one, up to 20 rooms. After that, new players fly solo. The top-left box shows your room and how many other players are in it.

Press Enter to chat with your room. Press Enter again to send, or Esc to close the box. The relay masks rude words, and it accepts one message a second from each player.

## Local development

You need Node 18 or newer.

1. Run `npm install`.
2. Run `npm run dev`. Wrangler runs the Worker and the relay on your computer.
3. Open http://localhost:8787.
4. To play with other people on your network, run `npm run dev -- --ip 0.0.0.0` in step 2. Then give them `http://<your-ip>:8787`.

## Release and deploy

1. Write commit messages in the Conventional Commits format, for example `feat: add docking` or `fix: shield sound`.
2. Push to `main`. release-please opens or updates a release PR with the new version and changelog.
3. Merge the release PR. The `deploy` job then runs `wrangler deploy`.

The repository needs two secrets: `CLOUDFLARE_API_TOKEN` (a token with the "Edit Cloudflare Workers" template) and `CLOUDFLARE_ACCOUNT_ID`.

Page loads come from the static assets and are free. Only the WebSocket counts toward the Workers limits. On the free plan, the limit is about 37 player-hours a day. After that, players fly solo until 00:00 UTC.

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
| J | Go to another player |
| L | Turn the ship's headlight on or off |
| P | Stop or start the day cycle on your screen |
| M | Turn sound on or off. Sound starts after your first click. |
| Enter | Open the chat box |
| N | Show or hide the labels |

If the ship hits the ground or a GSV deck slowly, the shield takes the hit. If it hits at more than 120 m/s straight down, the ship explodes. After 3 seconds, the ship comes back 300 m above the crash site.

The top-right box shows the speed, the top speed at this height, and the altitude. The ⚙ button opens the settings:

- **Quality** is Auto, Low, Medium or High. Auto plays the first 10 seconds on Medium, then picks a preset from the frame rate. The page keeps the choice for the next visit.
- **LOD detail** sets how much terrain detail the page draws. A lower value is faster. Each preset sets it.

The page changes its render resolution to hold about 50 fps. Medium and High never go below 1×. Low goes down to 0.6×, which looks grainy but is faster. Low also turns off antialiasing from the next page load, draws fewer shrubs and buildings, and lowers the top speed near the ground.

You spawn next to the GSV in the best daylight. One day takes 30 minutes.

The ring has fixed landmarks: six peaks from 12 to 22 km tall (the tallest is 400 km east of the first GSV), two super cities with skylines of towers up to 1.5 km, and seven straits where the land strip gives way to sea and islands. A ◆ marker with the distance shows each peak and super city within 2,000 km.

A moon, 300 km in radius, hangs about 6,000 km past one wall, and its ◆ marker shows from anywhere. Fly there; above the ring the speed limit lifts. It has day and night with the shade, so it shows phases from the ring. You can land on it and walk (V), where the gravity is 1.62 m/s², so jumps go about six times higher.

## Notes for an agent

- Units are metres. The ring axis is Y, and the floor is the inside of a cylinder at radius `R = 1e7`.
- The camera stays at the origin. Its true position is `camPos`, in JS doubles. Every object is drawn at its position minus `camPos`. This keeps GPU numbers small.
- The terrain noise runs in the vertex shader. `terrainAt()` in JS gives the same heights, for the ship and the walker. If you change one, change the other.
- Super cities follow `megaPlan()`: 8 avenues and 2 ring roads (which follow the city outline), zones from core to outer, and park districts. The skyline instances, the chunked low-rise buildings and the road paint in the terrain shader (`vMega`) all use the same plan.
- Landmarks are in `MEGAS`, `PEAKS` and `STRAITS` at the top of the script. A fixed seed places all peaks except the first, and all straits, clear of the GSVs, the terrain patches that their decks copy (`k0` in `GSVS`) and the cities. The terrain shader and `terrainAt()` both read them. Tile culling and LOD add a peak's height to tiles near it.
- The GSV deck draws a patch of the ring terrain flat, with the `DECK` shader define. `deckH()` is its JS twin.
- The relay has no game logic. One Durable Object, `Relay`, holds every socket. It tags each socket with its room (`ROOM_MAX` 8, `MAX_ROOMS` 20). It checks names, builds each pose again from the known fields, masks chat with the `obscenity` package, and drops messages over the rate limit (30 a second, 1 chat a second, 1 KB maximum). Then it sends each message to the other sockets in the same room.
- The relay uses WebSocket hibernation. Memory can be erased between messages, so all state for each socket is in its attachment.
- Server messages: `hello {id, epoch, room, others}`, `full`, `name-ok {name}`, `name-bad {reason}`, `pose {id, name, s, w}`, `chat {id, name, text}` and `leave {id}`. Client messages: `name {name}`, `pose {s, w}` and `chat {text}`. The relay sends nothing from a client until that client has a name. `s` is the ship position and quaternion (7 numbers). `w` is the eye position of a walker, or `null`.
- The relay sends `epoch` 0. All clients calculate the day angle from the clock, so all players see the same time of day. The client wraps the angle to one turn, because the shader uniform is a 32-bit float.
- Do not set `run_worker_first` in `wrangler.toml`. With it, each page load counts as a billed request.
- The moon is `MOON` (centre, radius, gravity). `moonH()` gives its height for the meshes, ship collision and walking. A coarse whole-moon mesh is built once; a 20 km detail patch rebuilds under the camera within 60 km of the surface, and the coarse mesh sinks 3 km under it. On the moon, `player.moon` is the walker's unit direction from the centre.
- To test in headless Chrome, use `--use-angle=swiftshader --enable-unsafe-swiftshader`. Use `--timeout=15000` for screenshots. `--virtual-time-budget` renders about one frame, so the scene does not move.
