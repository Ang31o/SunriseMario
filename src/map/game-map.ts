import { Constants } from '../constants';
import { BoxEntity } from '../entities/box-entity';
import CloudEntity from '../entities/cloud-entity';
import { CoinEntity } from '../entities/coin-entity';
import EnemyEntity from '../entities/enemy-entity';
import { FlagEntity } from '../entities/flag-entity';
import { MushroomEntity } from '../entities/mushroom-entity';
import PlayerEntity from '../entities/player-entity';
import { PoisonEntity } from '../entities/poison-entity';
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
  private mushroom: MushroomEntity;
  private animatedTiles: any;
  private poisons: PoisonEntity[];
  private clouds: CloudEntity[];

  constructor(private scene: GameScene, private mapKey: string) {
    this.init();
  }

  init(): void {
    this.createMap();
    this.getAnimatedTiles();
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

  getAnimatedTiles(): void {
    this.animatedTiles = [];
    for (const tileId in this.tileset.tileData) {
      this.map.layers.forEach((layer) => {
        layer.data.forEach((tileRow) => {
          tileRow.forEach((tile) => {
            if (tile.index - this.tileset.firstgid === parseInt(tileId)) {
              this.animatedTiles.push({
                tile,
                tileAnimationData: this.tileset.tileData[tileId].animation,
                firstgid: this.tileset.firstgid,
                elapsedTime: 0,
              });
            }
          });
        });
      });
    }
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
    // this.player = new PlayerEntity(this.scene, 1980, 100);
    this.player.addCollider(this.platform);

    this.player.addCollider(this.water, () =>
      eventService.emit(Events.PLAYER_KILLED_ABS)
    );
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
    this.addPoison();
    this.addClouds();
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
      const content = {
        type: boxObject.properties[0].name,
        amount: boxObject.properties[0].value,
      };
      const box = new BoxEntity(
        this.scene,
        boxObject.x,
        boxObject.y,
        content,
        this.player
      );
      this.boxes.push(box);
    });
  }

  addPoison(): void {
    this.poisons = [];
    const poisonObjects = this.map.getObjectLayer('poison')?.objects;
    poisonObjects?.forEach((poisonObject) => {
      const poison = new PoisonEntity(
        this.scene,
        poisonObject.x,
        poisonObject.y - 16,
        this.player
      );
      this.poisons.push(poison);
    });
  }

  addClouds(): void {
    this.clouds = [];
    const cloudObjects = this.map.getObjectLayer('clouds')?.objects;
    cloudObjects?.forEach((cloudObject) => {
      const borders = {
        left: cloudObject.properties[0].value,
        right: cloudObject.properties[1].value,
      };
      const cloud = new CloudEntity(
        this.scene,
        cloudObject.x,
        cloudObject.y,
        borders,
        this.player
      );
      this.clouds.push(cloud);
    });
  }

  onAddMushroom(position: { x: number; y: number }): void {
    this.mushroom = new MushroomEntity(
      this.scene,
      position.x + 8,
      position.y - 7,
      this.player
    );
    this.mushroom.addCollider(this.platform);
  }

  onCollectedMushroom(): void {
    delete this.mushroom;
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
    eventService.on(Events.ADD_MUSHROOM, this.onAddMushroom, this);
    eventService.on(Events.COLLECTED_MUSHROOM, this.onCollectedMushroom, this);
  }

  destroy(): void {
    eventService.off(Events.ENEMY_DIE, this.onEnemyDie, this);
    eventService.off(Events.PLAYER_DIE, this.onPlayerDie, this);
    eventService.off(Events.ADD_MUSHROOM, this.onAddMushroom, this);
    eventService.off(Events.COLLECTED_MUSHROOM, this.onCollectedMushroom, this);
  }

  animateTiles(delta: number): void {
    this.animatedTiles.forEach((tile) => {
      if (!tile.tileAnimationData) return;
      const animationDuration =
        tile.tileAnimationData[0].duration * tile.tileAnimationData.length;
      tile.elapsedTime += delta;
      tile.elapsedTime %= animationDuration;
      const animationFrameIndex = Math.floor(
        tile.elapsedTime / tile.tileAnimationData[0].duration
      );
      tile.tile.index =
        tile.tileAnimationData[animationFrameIndex].tileid + tile.firstgid;
    });
  }

  update(time: number, delta: number): void {
    this.animateTiles(delta);
    this.player?.update(time, delta);
    if (this.enemies.length > 0)
      this.enemies.forEach((enemy) => enemy?.update(time, delta));
    if (this.boxes.length > 0)
      this.boxes.forEach((box) => box?.update(time, delta));
    if (this.clouds.length > 0)
      this.clouds.forEach((cloud) => cloud?.update(time, delta));
    if (this.mushroom) this.mushroom.update(time, delta);
  }
}
