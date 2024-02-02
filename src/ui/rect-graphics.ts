import { RectGraphicsOptions } from '../core/interfaces/rect-graphics.interface';

export default class RectGraphics extends Phaser.GameObjects.Graphics {
  private rectOriginX: number;
  private rectOriginY: number;
  private options: RectGraphicsOptions;
  private defaultOptions: RectGraphicsOptions = {
    width: 20,
    height: 20,
    fillAlpha: 0.9,
    origin: [0.5, 0.5],
  };

  constructor(scene: Phaser.Scene, rectGraphicsOptions: RectGraphicsOptions) {
    super(scene, {
      fillStyle: { color: 0x000000, alpha: rectGraphicsOptions.fillAlpha },
      lineStyle: { width: 4, color: 0x6087c7, alpha: 1 },
    });
    this.options = {
      ...this.defaultOptions,
      ...rectGraphicsOptions,
    };
    this.scene.add.existing(this);
    this.setupOrigin();
    this.fillTheRect();
    this.strokeTheRect();
    this.makeInteractive();
  }

  setupOrigin(): void {
    if (this.options.origin) {
      this.rectOriginX = this.options.width * this.options.origin[0] * -1;
      this.rectOriginY = this.options.height * this.options.origin[1] * -1;
    }
  }

  fillTheRect(): void {
    this.fillRect(
      this.rectOriginX,
      this.rectOriginY,
      this.options.width,
      this.options.height
    );
  }

  strokeTheRect(): void {
    this.strokeRect(
      this.rectOriginX,
      this.rectOriginY,
      this.options.width,
      this.options.height
    );
  }

  makeInteractive(): void {
    if (this.options.isInteractive)
      this.setInteractive(
        new Phaser.Geom.Rectangle(
          this.rectOriginX,
          this.rectOriginY,
          this.options.width,
          this.options.height
        ),
        Phaser.Geom.Rectangle.Contains
      );
  }
}
