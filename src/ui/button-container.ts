import Phaser from 'phaser';
import { ButtonProps } from '../core/interfaces/button-props.interface';

export default class ButtonContainer extends Phaser.GameObjects.Container {
  public background: Phaser.GameObjects.Image | Phaser.GameObjects.NineSlice;
  public label: Phaser.GameObjects.Text;
  public icon: Phaser.GameObjects.Image;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private props: ButtonProps
  ) {
    super(scene, x, y);
    this.scene.add.existing(this);
    this.addBackground();
    this.addLabel();
    this.makeInteractive();
    this.addEventListeners();
  }

  addBackground(): void {
    this.background = this.props.nineslice
      ? this.scene.add.nineslice(
          0,
          0,
          this.props.background.texture,
          this.props.background.frame,
          this.props.nineslice.width,
          this.props.nineslice.height,
          this.props.nineslice.corner,
          this.props.nineslice.corner,
          this.props.nineslice.corner,
          this.props.nineslice.corner
        )
      : this.scene.add.image(
          0,
          0,
          this.props.background.texture,
          this.props.background.frame
        );

    this.add(this.background);
    this.setSize(this.background.width, this.background.height);
  }

  addLabel(): void {
    if (this.props.label) {
      this.label = this.scene.add.text(0, 0, this.props.label).setOrigin(0.5);
      this.add(this.label);
    }
  }

  addIcon(): void {
    if (this.props.icon) {
      this.icon = this.scene.add.image(
        this.props.icon.x | 0,
        this.props.icon.y | 0,
        this.props.icon.texture,
        this.props.icon.frame
      );
      this.add(this.icon);
    }
  }

  updateLabel(labelText: string): void {
    this.label.setText(labelText);
  }

  updateSize(width?: number, height?: number): void {
    this.background.width = width ?? this.background.width;
    this.background.height = height ?? this.background.height;
    this.setSize(this.background.width, this.background.height);
    this.input.hitArea.setSize(width, height);
  }

  makeInteractive(): void {
    console.log('make interactive', this.width, this.height);
    this.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, this.width, this.height),
      Phaser.Geom.Rectangle.Contains
    );
    this.input.cursor = 'pointer';
  }

  onPointerUp(): void {
    this.scene.input.manager.setDefaultCursor('default');
    if (this.props.onRelease) {
      this.props.onReleaseScope
        ? this.props.onRelease.call(this.props.onReleaseScope)
        : this.props.onRelease();
    }
  }

  addEventListeners(): void {
    this.on(Phaser.Input.Events.POINTER_UP, this.onPointerUp, this);
  }

  destroy(fromScene: boolean): void {
    this.props.onRelease &&
      this.off(Phaser.Input.Events.POINTER_UP, this.onPointerUp, this);
    super.destroy(fromScene);
  }
}
