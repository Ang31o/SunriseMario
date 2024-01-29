import Phaser from 'phaser';
import { BaseEntity } from '../base-entity';
import { Direction } from '../../core/enums/direction.enum';
import { Constants } from '../../constants';

export class MovementComponent extends Phaser.GameObjects.GameObject {
  public speed: number;
  public jumpForce: number;
  public direction: Direction;
  public isInAir: boolean;

  constructor(
    public scene: Phaser.Scene,
    public entity: BaseEntity,
    public config?: any
  ) {
    super(scene, 'movement-component');
    this.init();
  }

  // Setup movement properties
  init(): void {
    this.speed = this.config?.speed ?? Constants.DEFAULT_SPEED;
    this.jumpForce = this.config?.jumpForce ?? Constants.DEFAULT_JUMP_FORCE;
    this.direction = this.config?.direction;
  }

  // Move entity in desired direction and play run animation
  moveEntity(speed: number, isFlipped: boolean): void {
    this.entity.body.setVelocityX(speed);
    this.entity.baseSprite.setFlipX(isFlipped);
    this.entity.playRunAnimation();
  }

  // Jump entity and play jump animation
  jumpEntity(): void {
    if (this.entity.body.onFloor()) {
      this.entity.body.setVelocityY(this.jumpForce);
      this.entity.playJumpAnimation();
    }
  }

  // Stop entity and play idle animation
  idleEntity(): void {
    this.entity.body.setVelocityX(0);
    this.entity.playIdleAnimation();
  }

  // Monitor direction changes and move the entity in desired way
  update(...args: any[]): void {
    if (this.direction === Direction.LEFT) {
      this.moveEntity(-this.speed, true);
    } else if (this.direction === Direction.RIGHT) {
      this.moveEntity(this.speed, false);
    } else {
      this.idleEntity();
    }
    if (this.isInAir) {
      this.jumpEntity();
      this.isInAir = false;
    }
    super.update(args);
  }
}
