# Cataclysm

A pixel art planet destruction game: each planet is made of thousands of pixels, and every pixel torn off becomes debris that follows gravity.

*Version française : [README.md](README.md)*

## Controls

- **Mouse or finger**: press in space, pull back like a slingshot and let go. The dotted line shows the path, bent by gravity. A simple click launches straight at the center.
- **1 to 4** or **Tab**: switch weapon (or click the weapon at the bottom of the screen).
- **Keyboard**: the **arrows** move the crosshair, **A** and **E** turn the shot's angle, hold **Space** to set the power and release to fire.
- **Gamepad**: left stick or d-pad for the crosshair, right stick or **LB / RB** for the angle, hold **A** for power (release: fire), **X** for the next weapon, **Start** to pause. Before a game, left / right pick the planet.
- **P** or **Esc**: pause. A pause you asked for stays; if you just switch tabs, the game resumes by itself when you come back.
- **FULLSCREEN**: the game fills the screen.

## How it works

- The planet has layers: **surface**, **rock**, **magma** and a very hard **core**. The inside shows where you dig.
- Every pixel torn off becomes **debris**: slow, it falls back and sticks as rubble; fast, it flies off into space for good.
- The **thinner** the planet gets, the weaker its pull: the last hits send debris further.
- Weapons come in **limited supply**:
  - **Asteroid**: a crater, bigger the faster it arrives;
  - **Comet**: it digs a tunnel and can go right through the planet;
  - **Bomb**: it lands on the surface then explodes after a moment, with a huge crater;
  - **Black hole**: placed anywhere, even inside the planet, it tears off and swallows everything near it for a few seconds, and bends shots.
- The game ends when everything is launched and the debris has settled. Past **92 %**, the planet bursts all at once.

## Sandbox

The **SANDBOX** button gives every weapon **at will** (∞) on **every planet**, even the ones not unlocked yet. Nothing counts there: no stars, no record. Just for the fun of smashing things.

## Slow motion

When the planet bursts (past 92 %), time slows down for a few seconds, with two black bars like in the movies, so you can watch the pieces fly.

## The planets

Seven planets: **Rubble**, **Frost** (ice), **Blaze** (lava veins), **Belt** (orbiting rocks stop shots), **Ferrum** (very hard metal), **Azure** (oceans and continents) and **Titan**. Each gives up to **three stars** depending on the percentage destroyed (the thresholds are shown before you start); one star unlocks the next.

## Statistics

The Records panel keeps the **best** percentage and the **stars** of each planet, the number of **planets destroyed** and the total stars.

## Data and sync

Your scores are saved by NeoDex, backed up and synced between your PCs if sync is on.

## Install

In NeoDex: **NeoStore → Discover → Cataclysm → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
