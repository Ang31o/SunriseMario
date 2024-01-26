import Phaser from 'phaser';
import { BaseEntity } from './base-entity';
import { ControlsComponent } from './components/controls-component';
import { Events } from '../events/events';
import eventService from '../events/event-service';
import { Constants } from '../constants';

export default class PlayerEntity extends BaseEntity {
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
      new ControlsComponent(this.scene, this, { speed: 200, jumpForce: -350 })
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

  die(): void {
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

  addEventListeners(): void {
    eventService.on(Events.PLAYER_KILLED, this.die, this);
  }

  destroy(fromScene?: boolean): void {
    eventService.off(Events.PLAYER_KILLED, this.die, this);
    super.destroy(fromScene);
  }
}
