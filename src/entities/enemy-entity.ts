import Phaser from 'phaser';
import { MovementComponent } from './components/movement-component';
import { BaseEntity } from './base-entity';
import { Direction } from '../core/enums/direction.enum';
import eventService from '../events/event-service';
import { Events } from '../events/events';

export default class EnemyEntity extends BaseEntity {
  private collider: Phaser.Physics.Arcade.Collider;

  constructor(
    public scene: Phaser.Scene,
    x: number,
    y: number,
    private collidingEntity: BaseEntity
  ) {
    super(scene, x, y);
    this.setupBody(Phaser.Physics.Arcade.DYNAMIC_BODY);
    this.init();
  }

  init(): void {
    this.addSprite();
    this.setBodySizePosition();
    this.addComponents();
    this.addColliderWithPlayer();
  }

  addSprite(): void {
    this.baseSprite = this.scene.add.sprite(0, 0, 'main-atlas');
    this.add(this.baseSprite);
  }

  playRunAnimation(): void {
    this.baseSprite.play('goombaRun', true);
  }

  addComponents(): void {
    this.addComponent(
      new MovementComponent(this.scene, this, {
        speed: 20,
        direction: Direction.LEFT,
      })
    );
  }

  // Adding custom collider when the enemy collides with the player
  addColliderWithPlayer(): void {
    this.collider = this.scene.physics.add.collider(
      this.collidingEntity,
      this,
      this.onPlayerCollision,
      null,
      this
    );
  }

  onPlayerCollision(): void {
    if (this.isDead || this.collidingEntity.isDead) return;
    if (this.collidingEntity.body.touching.down) {
      this.killedByPlayer();
    } else if (
      this.collidingEntity.body.touching.left ||
      this.collidingEntity.body.touching.right
    ) {
      this.killPlayer();
    }
  }

  killPlayer(): void {
    this.scene.physics.world.removeCollider(this.collider);
    eventService.emit(Events.PLAYER_KILLED);
  }

  killedByPlayer(): void {
    eventService.emit(Events.INCREMENT_SCORE);
    this.die();
  }

  die(): void {
    if (this.isDead) return;
    this.movementComponent.direction = null;
    this.collider.destroy();
    this.isDead = true;
    this.baseSprite
      .stop()
      .play('goombaDie')
      .on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        eventService.emit(Events.ENEMY_DIE, this);
        this.destroy();
        super.die();
      });
    this.collidingEntity.playJumpAnimation();
  }

  update(time: number, delta: number): void {
    if (this.body.blocked.right) {
      this.movementComponent.direction = Direction.LEFT;
    } else if (this.body.blocked.left) {
      this.movementComponent.direction = Direction.RIGHT;
    }
    super.update(time, delta);
  }
}
