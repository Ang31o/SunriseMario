import Phaser from 'phaser';
import GameScene from './scenes/game/game-scene';
import UiScene from './scenes/ui/ui-scene';
import { Constants } from './constants';
import MainScene from './scenes/game/main-scene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  pixelArt: true,
  backgroundColor: '#FFFFAC',
  width: Constants.GAME_WIDTH,
  height: Constants.GAME_HEIGHT,
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
  scene: [MainScene, GameScene, UiScene],
};

export default new Phaser.Game(config);
