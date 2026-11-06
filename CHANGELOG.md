# Changelog

## [1.2.0](https://github.com/tracedelange/orbital/compare/v1.1.2...v1.2.0) (2026-11-06)


### Features

* **flight:** free look (Space) no longer follows the ship when it rolls ([a7dc5b9](https://github.com/tracedelange/orbital/commit/a7dc5b94279d81c270fb014df5e1029d5f28466d))
* **flight:** keep the set speed under the height limit, raise the ground limit, ease steering at speed ([a6082bf](https://github.com/tracedelange/orbital/commit/a6082bffec985fb9e6da244dfb5fa7f73f8acee8))
* **hud:** drop the unnamed peak markers ([92c7be6](https://github.com/tracedelange/orbital/commit/92c7be61ddd26e93d986eb8e6bd6d1f2eb54947a))
* **moon:** observatory crater with a lava lake, rays and a richer moon surface ([cd477b1](https://github.com/tracedelange/orbital/commit/cd477b12af54f0840464a91eb858ab77e2a685b8))
* **ship:** crash into buildings, the sun and the lava ([3b4ccd4](https://github.com/tracedelange/orbital/commit/3b4ccd44eacef137fa6c085c313e406008619b36))
* **terrain:** forests, as dark canopy patches with conifers up close ([695ee11](https://github.com/tracedelange/orbital/commit/695ee11d5bf3c57fd38bcb545d81f4e01044e602))
* **traffic:** eight procedurally generated transport craft designs ([51ad925](https://github.com/tracedelange/orbital/commit/51ad9255b45375e4cc0b9d63d719f3a9ab70ec7c))


### Bug Fixes

* **chat:** take the mouse back after sending or closing chat ([d71a9ee](https://github.com/tracedelange/orbital/commit/d71a9ee1dcffadf3f7a29659901d4e8e96790306))
* **input:** scale scroll by wheel distance, so trackpads no longer jump ([a14700c](https://github.com/tracedelange/orbital/commit/a14700c9830c79508ab4d9d177ad0843ffb63883))
* **relay:** reconnect after a dropped socket, keeping your name and position ([7310411](https://github.com/tracedelange/orbital/commit/7310411f8c564872586647d9207fd86260578732))
* **ship:** build the fuselage outside out, so the wing no longer shows through it ([81e8081](https://github.com/tracedelange/orbital/commit/81e8081f6dc8888394b7fbc676a4ec1e3d0a64b3))
* **ship:** stop the ship tunnelling through the ring floor at high speed, from either side ([5835030](https://github.com/tracedelange/orbital/commit/5835030d79a4bd1cbeffbf921d8053ddbe52b1d9))

## [1.1.2](https://github.com/tracedelange/orbital/compare/v1.1.1...v1.1.2) (2026-11-05)


### Bug Fixes

* Esc during landing left no menu and no mouse; cap walk speed ([7c172e4](https://github.com/tracedelange/orbital/commit/7c172e4b0d133d10d93c3ffb4a3c540ecd8c7f4f))

## [1.1.1](https://github.com/tracedelange/orbital/compare/v1.1.0...v1.1.1) (2026-11-05)


### Bug Fixes

* shorter landing title and subtitle ([2244034](https://github.com/tracedelange/orbital/commit/2244034303c3d2ed0e82aca573aecde363f7a18d))

## [1.1.0](https://github.com/tracedelange/orbital/compare/v1.0.0...v1.1.0) (2026-11-05)


### Features

* an explorable moon ([1428971](https://github.com/tracedelange/orbital/commit/142897131cc6ab17b05e70df502aac0d58b5e914))
* Esc menu, player list, landing sequence and larger super cities ([974f4c1](https://github.com/tracedelange/orbital/commit/974f4c192e9d081a4af0e2d69ecb2a737b513c43))
* hologram system map on M, Esc toggles the menu ([22fc480](https://github.com/tracedelange/orbital/commit/22fc4802b3a9e7b6a57077f4bf17423ebcba10ae))
* landing card, quality presets and flight polish ([f9f1176](https://github.com/tracedelange/orbital/commit/f9f1176e9537ea3944d86512ad15f2103d21592f))
* landmark mountain, island straits and super cities ([c69eb2d](https://github.com/tracedelange/orbital/commit/c69eb2dadeeba4e2885b925fb6765f5fb558ff4b))
* more peaks and straits, landmark markers, brighter nights ([147403d](https://github.com/tracedelange/orbital/commit/147403d5924846d0df855939c6bf3e125cf5e002))
* ship colours, free look, crash notices, HUD levels and smoother bushes ([7f07b4a](https://github.com/tracedelange/orbital/commit/7f07b4a12567ba5a2b8642810eac03077f1e91ce))
* suited walkers, observatory plaques, night haze fix ([158e99d](https://github.com/tracedelange/orbital/commit/158e99de8ce3d1643c7afc5e77b3767892e40afa))
* super-city street plans and zoned skylines ([b1cd46f](https://github.com/tracedelange/orbital/commit/b1cd46f2a551ea9c290208e4f2bfb23f793aa19e))
* waypoints, solid hulls, moon observatory and altimeter tape ([2e3e5cd](https://github.com/tracedelange/orbital/commit/2e3e5cdf728ab8e7f2f027c604d58e289b7eafd6))


### Bug Fixes

* dashed lines along terrain tile edges ([fd8da55](https://github.com/tracedelange/orbital/commit/fd8da555ab31ea428d8d88959c0cc91485faf29e))
* ragged coasts so the land strip doesn't read as slabs from altitude ([76dbd74](https://github.com/tracedelange/orbital/commit/76dbd743e7ad6f693dc592fb63d41289bb275e49))

## 1.0.0 (2026-11-03)


### Features

* shared rooms, chat and a Cloudflare Worker relay ([1b3e949](https://github.com/tracedelange/culture-orbital/commit/1b3e9490d706ff203aa1b8ee07ec13411733df18))
