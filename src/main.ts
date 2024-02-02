import Phaser from 'phaser';
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import InputTextPlugin from 'phaser3-rex-plugins/plugins/inputtext-plugin.js';
import GameScene from './scenes/game-scene';
import UiScene from './scenes/ui-scene';
import { Constants } from './constants';
import MainScene from './scenes/main-scene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  pixelArt: true,
  backgroundColor: '#FFFFAC',
  width: Constants.GAME_WIDTH,
  height: Constants.GAME_HEIGHT,
  parent: 'app',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
      // debug: true,
    },
  },
  dom: {
    createContainer: true,
  },
  plugins: {
    global: [
      {
        key: 'rexInputTextPlugin',
        plugin: InputTextPlugin,
        start: true,
      },
    ],
    scene: [
      {
        key: 'rexUI',
        plugin: UIPlugin,
        mapping: 'rexUI',
      },
    ],
  },
  scene: [MainScene, GameScene, UiScene],
};

export default new Phaser.Game(config);
