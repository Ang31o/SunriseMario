import Phaser from 'phaser';
import { Constants } from '../../constants';
import { ScoreListItemData } from '../../core/interfaces/score-list-item.interface';

export default class ScoreListItem extends Phaser.GameObjects.Container {
  private playerName: Phaser.GameObjects.BitmapText;
  private playerScore: Phaser.GameObjects.BitmapText;

  constructor(
    public scene: Phaser.Scene,
    private scoreData: ScoreListItemData
  ) {
    super(scene);
    this.scene.add.existing(this);
    this.setName(this.scoreData.name);
    this.addName();
    this.addScore();
    this.updateSize();
  }

  addName(): void {
    this.playerName = this.scene.add
      .bitmapText(-110, 0, Constants.FONT, this.scoreData.name, 15)
      .setTintFill(0xffffff)
      .setMaxWidth(150)
      .setOrigin(0, 0.5);
    this.add(this.playerName);
  }

  addScore(): void {
    this.playerScore = this.scene.add
      .bitmapText(120, 0, Constants.FONT, this.scoreData.score.toString(), 15)
      .setTintFill(0x0e4d30)
      .setOrigin(1, 0.5);
    this.add(this.playerScore);
  }

  updateSize(): void {
    this.setSize(250, this.playerName.height);
    console.log(this.playerName.text, this.width);
  }

  // Adding getTopLeft method so RexUI's scrollable panel scrollToChild() method would scroll to the container
  getTopLeft(): Phaser.Math.Vector2 {
    const bounds = this.getBounds();
    return new Phaser.Math.Vector2(bounds.left, bounds.top);
  }

  // Adding getBottomLeft method so RexUI's scrollable panel scrollToChild() method would scroll to the container
  getBottomLeft(): Phaser.Math.Vector2 {
    const bounds = this.getBounds();
    return new Phaser.Math.Vector2(bounds.left, bounds.bottom);
  }
}
