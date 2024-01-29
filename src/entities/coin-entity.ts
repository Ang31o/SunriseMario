import eventService from '../events/event-service';
import { Events } from '../events/events';
import { BaseEntity } from './base-entity';

export class CoinEntity extends BaseEntity {
  private overlap: Phaser.Physics.Arcade.Collider;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private overlapEntity: BaseEntity
  ) {
    super(scene, x, y);
    this.setupBody(Phaser.Physics.Arcade.STATIC_BODY);
    this.init();
  }

  init(): void {
    this.addSprite();
    this.setBodySizePosition();
    this.makeCollectable();
  }

  addSprite(): void {
    this.baseSprite = this.scene.add.sprite(0, 0, 'main-atlas');
    this.baseSprite.play('coinRotate');
    this.add(this.baseSprite);
  }

  // Adding custom overlap when the player collides with the coin
  makeCollectable(): void {
    this.overlap = this.scene.physics.add.overlap(
      this,
      this.overlapEntity,
      this.onCollect,
      null,
      this
    );
  }

  onCollect(): void {
    if (this.overlapEntity.isDead) return;
    eventService.emit(Events.INCREMENT_SCORE);
    this.scene.tweens.add({
      targets: this,
      ease: 'Power1',
      scaleX: 0,
      scaleY: 0,
      duration: 200,
      onComplete: () => this.destroy(),
    });
    this.overlap.destroy();
  }
}
