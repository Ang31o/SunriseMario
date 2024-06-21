import { Direction } from '../core/enums/direction.enum';
import eventService from '../events/event-service';
import { Events } from '../events/events';
import { BaseEntity } from './base-entity';
import { MovementComponent } from './components/movement-component';

export class MushroomEntity extends BaseEntity {
  private overlap: Phaser.Physics.Arcade.Collider;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private overlapEntity: BaseEntity
  ) {
    super(scene, x, y);
    this.setupBody(Phaser.Physics.Arcade.DYNAMIC_BODY);
    this.init();
  }

  init(): void {
    this.addSprite();
    this.setBodySizePosition();
    this.addComponents();
    this.makeCollectable();
    this.movementComponent.jumpEntity(true);
  }

  addSprite(): void {
    this.baseSprite = this.scene.add.sprite(0, 0, 'tiles', 778);
    this.add(this.baseSprite);
  }

  addComponents(): void {
    this.addComponent(
      new MovementComponent(this.scene, this, {
        speed: 25,
        direction: Direction.RIGHT,
      })
    );
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
    if (this.overlapEntity.isDead) return;
    eventService.emit(Events.COLLECTED_MUSHROOM);
    this.scene.tweens.add({
      targets: this,
      ease: 'Power1',
      scaleX: 0,
      scaleY: 0,
      duration: 350,
      onComplete: () => this.destroy(),
    });
    this.overlap.destroy();
  }

  update(time: number, delta: number): void {
    if (this.body?.blocked.right) {
      this.movementComponent.direction = Direction.LEFT;
    } else if (this.body?.blocked.left) {
      this.movementComponent.direction = Direction.RIGHT;
    }
    super.update(time, delta);
  }
}
