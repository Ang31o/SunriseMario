# Sunrise Mario 🕹️

## Prerequisites

You'll need [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) installed.

It is highly recommended to use [Node Version Manager](https://github.com/nvm-sh/nvm) (nvm) to install Node.js and npm.

For Windows users there is [Node Version Manager for Windows](https://github.com/coreybutler/nvm-windows).

Install Node.js and `npm` with `nvm`:

```bash
nvm install node

nvm use node
```

Replace 'node' with 'latest' for `nvm-windows`.

## Getting Started

Start development server:

```
npm run start
```

To create a production build:

```
npm run build
```

Production files will be placed in the `dist` folder. Then upload those files to a web server. 🎉

[🎮Try the game!🎮](https://techandeez.com/sunrisemario/)

## Project Structure

```
    .
    ├── dist
    ├── node_modules
    ├── public
    ├── src
    │   ├── anims
    │   ├── core
    │   ├── entities
    │   ├── events
    │   ├── map
    │   ├── scenes
    │   ├── state
    │   ├── ui
    │   ├── constants.ts
    │   ├── main.ts
    ├── index.html
    ├── package.json
```

`main.ts` is the entry point referenced by `index.html`.

- **`anims`** folder stores spritesheet animations for `player`, `enemy` and `coins`.
- **`core`** folder has `enums` and `interfaces` with game definitions like player direction and button properties interface.
- **`entities`** folder has the `controls` and `movement` logic for player and other entities. Inside `components` folder we have all our game entities like `player`, `enemy`, `coin` and `flag` which all extend `base` entity logic.
- **`events`** folder stores the `event-service` which logs all events in the console, and the `events` enum.
- **`map`** folder stores the `game-map` logic which creates the map and instantiate all of it's entities.
- **`scenes`** folder stores three scenes used in the game.
  - `main-scene` which is the first scene player see, and also the scene that guides the player through the game (when player dies or advanced to the next level).
  - `game-scene` loads the map and initiate all animations.
  - `ui-scene` is the scene where UI elements are displayed.
- **`state`** folder stores the `game-state` class that is used to store general game data like current map.
- **`ui`** folder has the `button-container` class which defines visual of any button in the game with on-click methods.

## Static Assets

Any static assets like images, fonts or maps files are placed in the `public` folder. It'll then be served from the root. For example: http://localhost:8000/images/tiles.png

Example `public` structure:

```
    public
    ├── assets
    |   ├── images
    |   │   ├── ...
    |   ├── fonts
    |   │   ├── ...
    |   ├── maps
    |   |   ├── ...
```

# TypeScript ESLint

This game uses a basic `typescript-eslint` set up for code linting.

[See here for rules to turn on or off](https://eslint.org/docs/rules/).

## Dev Server Port

You can change the dev server's port number by modifying the `vite.config.ts` file. Look for the `server` section:

```js
{
	// ...
	server: { host: '0.0.0.0', port: 8000 },
}
```

Change 8000 to whatever you want.

The game is done using [phaser3-typescript-vite-template](https://github.com/ourcade/phaser3-typescript-vite-template).
The inspiration for this project came from [Remake Mario in PhaserJS](https://webtips.dev/webtips/phaser/remake-mario-in-phaserjs-part1)
