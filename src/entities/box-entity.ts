import eventService from '../events/event-service';
import { Events } from '../events/events';
import { BaseEntity } from './base-entity';
import { CoinEntity } from './coin-entity';

export class BoxEntity extends BaseEntity {
  private coinsCollected: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private amount: number,
    private overlapEntity: BaseEntity
  ) {
    super(scene, x, y);
    this.setupBody(Phaser.Physics.Arcade.STATIC_BODY);
    this.init();
  }

  init(): void {
    this.coinsCollected = 0;
    this.addSprite();
    this.setBodySizePosition();
    this.body.setCollidesWith(1);
    this.addColliderWithPlayer();
  }

  addSprite(): void {
    this.baseSprite = this.scene.add.sprite(0, 0, 'tiles', 36).setOrigin(0);
    this.baseSprite.play('boxSlide');
    this.add(this.baseSprite);
  }

  // Adding custom collider when the enemy collides with the player
  addColliderWithPlayer(): void {
    this.scene.physics.add.collider(
      this.overlapEntity,
      this,
      this.onPlayerCollision,
      null,
      this
    );
  }

  addCoinSprite(): void {
    const coinSprite = new CoinEntity(
      this.scene,
      this.x + 8,
      this.y - 7,
      this.overlapEntity
    );
    coinSprite.onCollect();
    this.coinsCollected++;
    if (this.coinsCollected === this.amount) {
      this.closeBox();
    }
  }

  onPlayerCollision(): void {
    if (!this.overlapEntity.body.touching.up) return;
    if (this.coinsCollected < this.amount) {
      this.scene.tweens.add({
        targets: this,
        y: this.y - 7,
        yoyo: true,
        duration: 150,
        onYoyo: () => this.addCoinSprite(),
      });
    }
  }

  closeBox(): void {
    this.baseSprite.stop();
    this.baseSprite.setFrame(221);
  }
}
