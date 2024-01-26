import Phaser from 'phaser';
import PlayerEntity from '../../entities/player-entity';
import { GameMap } from '../../map/game-map';
import { PlayerAnims } from '../../anims/player-anims';
import { ItemsAnims } from '../../anims/items-anims';
import { EnemyAnims } from '../../anims/enemy-anims';
import { GameState } from '../../state/game-state';

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

  update(time: number, delta: number): void {
    super.update(time, delta);
    this.gameMap?.update(time, delta);
  }
}
