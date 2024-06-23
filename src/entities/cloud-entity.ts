import Phaser from 'phaser';
import { MovementComponent } from './components/movement-component';
import { BaseEntity } from './base-entity';
import { Direction } from '../core/enums/direction.enum';
import PlayerEntity from './player-entity';

export default class CloudEntity extends BaseEntity {
  constructor(
    public scene: Phaser.Scene,
    x: number,
    y: number,
    private borders: { left: number; right: number },
    private collidingEntity: PlayerEntity
  ) {
    super(scene, x, y);
    this.setupBody(Phaser.Physics.Arcade.DYNAMIC_BODY);
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    this.init();
  }

  init(): void {
    this.addSprite();
    this.setBodySizePosition();
    this.addComponents();
    this.addColliderWithPlayer();
  }

  addSprite(): void {
    this.baseSprite = this.scene.add.sprite(0, 0, 'tiles', 481);
    const bs = this.scene.add.sprite(-16, 0, 'tiles', 480);
    const bs2 = this.scene.add.sprite(16, 0, 'tiles', 482);
    this.add([this.baseSprite, bs, bs2]);
  }

  setBodySizePosition(): void {
    this.setSize(48, 16);
    this.body.setSize(48, 16);
    this.body.position.set(this.x, this.y);
  }

  addComponents(): void {
    this.addComponent(
      new MovementComponent(this.scene, this, {
        speed: 30,
        direction: Direction.LEFT,
      })
    );
  }

  // Adding custom collider when the enemy collides with the player
  addColliderWithPlayer(): void {
    this.scene.physics.add.collider(this.collidingEntity, this);
  }

  update(time: number, delta: number): void {
    if (this.body.x >= this.borders.right) {
      this.movementComponent.direction = Direction.LEFT;
    } else if (this.body.x <= this.borders.left) {
      this.movementComponent.direction = Direction.RIGHT;
    }
    super.update(time, delta);
  }
}
