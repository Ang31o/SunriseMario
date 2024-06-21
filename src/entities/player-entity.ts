import Phaser from 'phaser';
import { BaseEntity } from './base-entity';
import { ControlsComponent } from './components/controls-component';
import { Events } from '../events/events';
import eventService from '../events/event-service';
import { Constants } from '../constants';

export default class PlayerEntity extends BaseEntity {
  public superMario: boolean;
  public isImmortal: boolean;
  constructor(public scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.setupBody(Phaser.Physics.Arcade.DYNAMIC_BODY);
    this.init();
  }

  init(): void {
    this.addSprite();
    this.setBodySizePosition();
    this.addComponents();
    this.addEventListeners();
  }

  addSprite(): void {
    this.baseSprite = this.scene.add.sprite(0, 0, 'main-atlas').setScale(2);
    this.add(this.baseSprite);
  }

  addComponents(): void {
    this.addComponent(
      new ControlsComponent(this.scene, this, {
        speed: 200,
        jumpForce: Constants.PLAYER_JUMP_FORCE,
      })
    );
  }

  playRunAnimation(): void {
    if (this.body.onFloor() && !this.isDead) this.baseSprite.play('run', true);
  }

  playIdleAnimation(): void {
    if (this.body.onFloor() && !this.isDead) this.baseSprite.play('idle', true);
  }

  playJumpAnimation(): void {
    if (!this.isDead) this.baseSprite.play('jump', true);
  }

  playDieAnimation(): void {
    this.baseSprite.play('die', true);
  }

  onCollectedMushroom(): void {
    this.blinkPlayerAnimation();
    this.resizePlayerAnimation(true);
  }

  removeSuperMario(): void {
    this.blinkPlayerAnimation();
    this.resizePlayerAnimation(false);
  }

  blinkPlayerAnimation(): void {
    this.isImmortal = true;
    this.scene.tweens.addCounter({
      from: 0,
      to: 100,
      duration: 70,
      repeat: 4,
      yoyo: true,
      onYoyo: () => {
        this.baseSprite.clearTint();
      },
      onRepeat: () => {
        this.baseSprite.setTintFill(0xffffff);
      },
      onComplete: () => {
        this.isImmortal = false;
      },
    });
  }

  resizePlayerAnimation(isSuperMario: boolean): void {
    this.scene.tweens.add({
      targets: this.baseSprite,
      scaleX: isSuperMario ? 2.4 : 2,
      scaleY: isSuperMario ? 2.4 : 2,
      duration: 500,
      onComplete: () => {
        this.setBodySizePosition();
        this.movementComponent.jumpForce = isSuperMario
          ? Constants.PLAYER_SUPER_JUMP_FORCE
          : Constants.PLAYER_JUMP_FORCE;
        this.superMario = isSuperMario;
      },
    });
  }

  die(): void {
    if (this.isImmortal) return;
    if (this.superMario) {
      this.removeSuperMario();
      return;
    }
    this.isDead = true;
    this.movementComponent.jumpEntity();
    this.playDieAnimation();
    this.body.setCollideWorldBounds(false);
    eventService.emit(Events.PLAYER_DIE);
    this.scene.time.delayedCall(Constants.GAME_OVER_TIMEOUT, () =>
      eventService.emit(Events.GAME_OVER)
    );
    super.die();
  }

  onPlayerKilledAbs(): void {
    this.isImmortal = false;
    this.superMario = false;
    this.die();
  }

  addEventListeners(): void {
    eventService.on(Events.PLAYER_KILLED, this.die, this);
    eventService.on(Events.PLAYER_KILLED_ABS, this.onPlayerKilledAbs, this);
    eventService.on(Events.COLLECTED_MUSHROOM, this.onCollectedMushroom, this);
  }

  destroy(fromScene?: boolean): void {
    eventService.off(Events.PLAYER_KILLED, this.die, this);
    super.destroy(fromScene);
  }
}
