import { Constants } from '../constants';
import eventService from '../events/event-service';
import { Events } from '../events/events';
import { BaseEntity } from './base-entity';

export class FlagEntity extends BaseEntity {
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
    this.scene.physics.world.enableBody(
      this,
      Phaser.Physics.Arcade.STATIC_BODY
    );
    this.addSprite();
    this.setBodySizePosition();
    this.makeCollectable();
  }

  addSprite(): void {
    this.baseSprite = this.scene.add.sprite(0, 0, 'tiles', 962).setOrigin(0, 1);
    this.baseSprite.play('flagWave');
    this.add(this.baseSprite);
  }

  // Adding custom overlap when the player collides with the flag
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
    eventService.emit(Events.INCREMENT_SCORE);
    const particles = this.scene.add.particles(this.x, this.y, 'main-atlas', {
      frame: ['mario-atlas_13'],
      scale: { start: 1, end: 0 },
      speed: { min: 50, max: 100 },
      angle: { min: 0, max: -180 },
      rotate: { min: 0, max: 360 },
      alpha: 0.5,
    });

    this.scene.tweens.add({
      targets: this,
      y: 400,
      duration: 800,
      onComplete: () => {
        particles.stop();
        this.scene.time.delayedCall(Constants.GAME_OVER_TIMEOUT, () =>
          eventService.emit(Events.GAME_MAP_COMPLETE)
        );
      },
    });

    this.overlap.destroy();
  }
}
