import Phaser from 'phaser';
import eventService from '../events/event-service';
import { Events } from '../events/events';
import { Constants } from '../constants';

export default class UiScene extends Phaser.Scene {
  private scoreLabel: Phaser.GameObjects.BitmapText;
  private score: number;

  constructor() {
    super('ui-scene');
  }

  create() {
    this.addScore();
    this.addEventListeners();
  }

  addScore(): void {
    this.scoreLabel = this.add
      .bitmapText(20, 20, Constants.FONT, 'Score: 0', 15)
      .setTintFill(0x000000)
      .setOrigin(0);
    this.score = 0;
  }

  onIncrementScore(): void {
    this.score += 1;
    this.scoreLabel.setText('Score: ' + this.score);
  }

  addEventListeners(): void {
    eventService.on(Events.INCREMENT_SCORE, this.onIncrementScore, this);
    this.events.once(
      Phaser.Scenes.Events.SHUTDOWN,
      this.removeEventListeners,
      this
    );
  }

  removeEventListeners(): void {
    eventService.off(Events.INCREMENT_SCORE, this.onIncrementScore, this);
  }
}
