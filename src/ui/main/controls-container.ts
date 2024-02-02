import Phaser from 'phaser';
import { Constants } from '../../constants';
import RectGraphics from '../rect-graphics';

export default class ControlsContainer extends Phaser.GameObjects.Container {
  private base: RectGraphics;
  private infoText: any;

  constructor(public scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.scene.add.existing(this);
    this.addBase();
    this.addInfo();
  }

  addBase(): void {
    this.base = new RectGraphics(this.scene, {
      width: 330,
      height: 84,
      fillAlpha: 0.6,
      origin: [0, 0],
    }).setPosition(35, 0);
    this.add(this.base);
  }

  addInfo(): void {
    const info = `
    Controls:
    Use A and D to move
    Use SPACE to jump`;
    this.infoText = this.scene.add
      .bitmapText(0, 0, Constants.FONT, info, 15)
      .setLineSpacing(4)
      .setTintFill(0xffffff)
      .setOrigin(0);
    this.add(this.infoText);
  }
}
