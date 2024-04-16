import { Constants } from '../constants';
import { BoxEntity } from '../entities/box-entity';
import { CoinEntity } from '../entities/coin-entity';
import EnemyEntity from '../entities/enemy-entity';
import { FlagEntity } from '../entities/flag-entity';
import PlayerEntity from '../entities/player-entity';
import eventService from '../events/event-service';
import { Events } from '../events/events';
import GameScene from '../scenes/game-scene';

export class GameMap {
  public map!: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;
  private platform: Phaser.Tilemaps.TilemapLayer;
  private player: PlayerEntity;
  private enemies: EnemyEntity[];
  private water: Phaser.Tilemaps.TilemapLayer;
  private boxes: BoxEntity[];

  constructor(private scene: GameScene, private mapKey: string) {
    this.init();
  }

  init(): void {
    this.createMap();
    this.addPlatform();
    this.addWater();
    this.addPlayer();
    this.addMapComponents();
    this.addEventListeners();
  }

  createMap(): void {
    this.map = this.scene.make.tilemap({ key: this.mapKey });
    this.tileset = this.map.addTilesetImage('map-tileset', 'tiles');
    this.map.createLayer('background', this.tileset, 0, 0);
  }

  addPlatform(): void {
    this.platform = this.map.createLayer('platform', this.tileset, 0, 0);
    this.platform.setCollisionByExclusion([-1, 450], true); // 450 being the left side tile index of the flag
  }

  addWater(): void {
    this.water = this.map.createLayer('water', this.tileset, 0, 0);
    this.water.setCollisionByExclusion([-1], true);
  }

  addPlayer() {
    this.player = new PlayerEntity(this.scene, 25, 100);
    this.player.addCollider(this.platform);
    this.player.addCollider(this.water, () => this.player.die());
    this.scene.cameraFollowTarget(
      this.player,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
  }

  addMapComponents(): void {
    this.addCoins();
    this.addEnemies();
    this.addBox();
    this.addFlag();
  }

  addCoins(): void {
    const coinObjects = this.map.getObjectLayer(
      Constants.MAP_LAYER_COINS
    )?.objects;
    coinObjects?.forEach(
      (coinObject) =>
        new CoinEntity(this.scene, coinObject.x, coinObject.y, this.player)
    );
  }

  addEnemies(): void {
    this.enemies = [];
    const enemyObjects = this.map.getObjectLayer(
      Constants.MAP_LAYER_GOOMBAS
    )?.objects;
    enemyObjects?.forEach((enemyObject) => {
      const enemy = new EnemyEntity(
        this.scene,
        enemyObject.x,
        enemyObject.y,
        this.player
      );
      enemy.addCollider(this.platform);
      enemy.addCollider(this.water, () => enemy.die());
      this.enemies.push(enemy);
    });
  }

  addBox(): void {
    this.boxes = [];
    const boxObjects = this.map.getObjectLayer('box')?.objects;
    boxObjects?.forEach((boxObject) => {
      const amount =
        boxObject.properties?.find((p) => p.name === 'amount')?.value || 1;
      const box = new BoxEntity(
        this.scene,
        boxObject.x,
        boxObject.y,
        amount,
        this.player
      );
      this.boxes.push(box);
    });
  }

  addFlag(): void {
    const flagObject = this.map.getObjectLayer(Constants.MAP_LAYER_FLAG)
      ?.objects[0];
    const flag = new FlagEntity(
      this.scene,
      flagObject.x,
      flagObject.y,
      this.player
    );
  }

  onEnemyDie(enemyEntity: EnemyEntity) {
    Phaser.Utils.Array.Remove(this.enemies, enemyEntity);
  }

  onPlayerDie(): void {
    this.scene.cameraStopFollow();
  }

  addEventListeners(): void {
    eventService.on(Events.ENEMY_DIE, this.onEnemyDie, this);
    eventService.on(Events.PLAYER_DIE, this.onPlayerDie, this);
  }

  destroy(): void {
    eventService.off(Events.ENEMY_DIE, this.onEnemyDie, this);
    eventService.off(Events.PLAYER_DIE, this.onPlayerDie, this);
  }

  update(time: number, delta: number): void {
    this.player?.update(time, delta);
    this.enemies.forEach((enemy) => enemy?.update(time, delta));
  }
}
