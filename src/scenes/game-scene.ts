import Phaser from 'phaser';
import PlayerEntity from '../entities/player-entity';
import { GameMap } from '../map/game-map';
import { PlayerAnims } from '../anims/player-anims';
import { ItemsAnims } from '../anims/items-anims';
import { EnemyAnims } from '../anims/enemy-anims';
import { GameState } from '../state/game-state';

export default class GameScene extends Phaser.Scene {
  private gameMap: GameMap;

  constructor() {
    super('game-scene');
  }

  preload() {
    this.load.tilemapTiledJSON(
      GameState.map,
      `./assets/maps/${GameState.map}.json`
    );
    this.load.on(Phaser.Loader.Events.COMPLETE, () => this.loadAnimations());
  }

  loadAnimations(): void {
    PlayerAnims(this.anims);
    ItemsAnims(this.anims);
    EnemyAnims(this.anims);
  }

  create() {
    this.createMap();
    this.addEventListeners();
  }

  createMap(): void {
    this.gameMap = new GameMap(this, GameState.map);
    this.physics.world.setBounds(
      0,
      0,
      this.gameMap.map.widthInPixels,
      this.gameMap.map.heightInPixels
    );
  }

  cameraFollowTarget(
    target: PlayerEntity,
    width: number,
    height: number
  ): void {
    this.cameras.main
      .setBounds(0, 0, width, height)
      .startFollow(target, true, 0.2, 0.2);
  }

  cameraStopFollow(): void {
    this.cameras.main.stopFollow();
  }

  addEventListeners(): void {
    // Keyboard input will only work for game-scene,
    // this way Saving Score functionality can use keyboard buttons (A, D and SPACE) tied to the game from controls-component
    this.input.keyboard.disableGlobalCapture();
    this.events.once(
      Phaser.Scenes.Events.SHUTDOWN,
      this.removeEventListeners,
      this
    );
  }

  removeEventListeners(): void {
    this.gameMap.destroy();
    this.gameMap = null;
  }

  update(time: number, delta: number): void {
    super.update(time, delta);
    this.gameMap?.update(time, delta);
  }
}
