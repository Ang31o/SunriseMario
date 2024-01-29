import Phaser from 'phaser';
import { Constants } from '../constants';

export default class ControlsContainer extends Phaser.GameObjects.Container {
  private base: Phaser.GameObjects.Graphics;
  private infoText: any;

  constructor(public scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.scene.add.existing(this);
    this.addBase();
    this.addInfo();
  }

  addBase(): void {
    this.base = this.scene.add.graphics({
      x: 35,
      y: 0,
      fillStyle: { color: 0x000000, alpha: 0.6 },
      lineStyle: { width: 4, color: 0x6087c7, alpha: 1 },
    });
    this.base.fillRect(0, 0, 330, 83);
    this.base.strokeRect(0, 0, 330, 83);
    this.add(this.base);
  }

  addInfo(): void {
    const info = `
    Controls:
    Use W and S to move
    Use SPACE to jump`;
    this.infoText = this.scene.add
      .bitmapText(0, 0, Constants.FONT, info, 15)
      .setLineSpacing(4)
      .setTintFill(0xffffff)
      .setOrigin(0);
    this.add(this.infoText);
  }
}
