import eventService from '../events/event-service';
import { Events } from '../events/events';
import { BaseEntity } from './base-entity';

export class PoisonEntity extends BaseEntity {
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
    this.baseSprite = this.scene.add.sprite(0, 0, 'main-atlas').setOrigin(0);
    this.baseSprite.play('poisonWave');
    this.add(this.baseSprite);
  }

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
    this.overlap.active = false;
    this.scene.time.delayedCall(1000, () => (this.overlap.active = true));
    eventService.emit(Events.COLLECTED_POISON);
  }
}
