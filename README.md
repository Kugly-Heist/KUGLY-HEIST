# KUGLY HEIST

**The Great Kugly Heist: Karambit Escape** is a 3D endless runner that runs in the browser. You play a chicken with a karambit, running through a CS2-inspired street and escaping the Volt. Dodge crates, barrels, walls and parked cars, collect coins and power-ups, and spend your money in the shop.

Built with plain JavaScript and [three.js](https://threejs.org/). There is no build step.

## Controls

| Action | Keyboard (default) | Touch |
| --- | --- | --- |
| Change lane | A / D or ← / → | Swipe ← → |
| Jump | W or ↑ | Swipe ↑ |
| Slide | S or ↓ | Swipe ↓ |
| Skateboard boost | Space | Double-tap |
| Pause | Esc or P | Pause button |

Keys can be rebound in the **Controls** menu. A gamepad also works (stick / D-pad to move, A jump, B slide, Y skateboard, Start pause).

## Features

- Three lanes, jump and slide obstacles, and a chasing enemy
- Power-ups: magnet, score ×2, shield, health
- Shop with upgrades (magnet and score duration, start with shield) and a skateboard boost
- Rebindable keys, gamepad and touch support
- Music and SFX volume sliders, intro video, progress saved in `localStorage`
- Daily run: the same obstacle layout for everyone each UTC day, with your best score of the day
- Walls are solid: crashing into one knocks you back and costs you distance to the enemy, so dodge to another lane (a shield smashes the wall)
- Local Top 5 leaderboard (best runs by score, saved in `localStorage`)
- Works offline after the first visit (service worker) and can be installed as an app

## Run locally

The 3D models (`models/`), music (`music/`) and intro video (`video/`) are loaded at runtime, so the game has to be served over HTTP (opening `index.html` directly from disk will not work). Serve the folder:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Releasing a new version

Every game file is cached by `sw.js`. After changing any file, bump `CACHE` at the top of `sw.js` (for example `kugly-heist-20261111a`), otherwise returning players keep the old files. If you add or remove files, update the `ASSETS` list there too. Players get the update on their next visit after the new service worker installs.

## Sounds

The game looks for CS2 sound clips in `sounds/` first. See [`sounds/README.txt`](sounds/README.txt) for the exact file names.

## Credits

- Agent model "CTM_SAS | CS2 Agent Model" by Alex ([sketchfab.com/alyax](https://sketchfab.com/alyax)), CC-BY-4.0
- three.js and GLTFLoader, © 2010–2021 Three.js Authors, MIT License
- CS2 / CS:GO sounds © Valve Corporation, music and sound clips, intro video, icons and other images belong to their original owners. They are third-party material and are not owned by this project.
