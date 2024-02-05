import Phaser from 'phaser';
import { Constants } from '../constants';

export default class PopupMessage extends Phaser.GameObjects.Container {
  private base: Phaser.GameObjects.Graphics;
  private message: Phaser.GameObjects.BitmapText;

  constructor(public scene: Phaser.Scene, private text: string) {
    super(scene, Constants.GAME_WIDTH / 2, -30);
    this.scene.add.existing(this);
    this.addBase();
    this.addMessage();
    this.addTween();
  }

  addBase(): void {
    this.base = this.scene.add.graphics({
      x: 0,
      y: 0,
      fillStyle: { color: 0x000000, alpha: 0.6 },
      lineStyle: { width: 4, color: 0x6087c7, alpha: 1 },
    });
    this.base.fillRect(-165, -21, 330, 42);
    this.base.strokeRect(-165, -21, 330, 42);
    this.add(this.base);
  }

  addMessage(): void {
    this.message = this.scene.add
      .bitmapText(0, 0, Constants.FONT, this.text, 15)
      .setLineSpacing(4)
      .setTintFill(0xffffff)
      .setOrigin(0.5);
    this.add(this.message);
  }

  addTween(): void {
    this.scene.tweens.add({
      targets: this,
      y: 30,
      duration: 500,
      hold: 3500,
      ease: 'Back.easeOut',
      yoyo: true,
      onComplete: () => this.destroy(true),
    });
    // Make sure the popup-message is destroyed even if the tween wasn't completed if user clicked the 'PLAY AGAIN' button
    this.scene.events.once(
      Phaser.Scenes.Events.SLEEP,
      () => this.destroy(true),
      this
    );
  }
}
