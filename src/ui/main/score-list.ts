import Phaser from 'phaser';
import {
  ScrollablePanel,
  Sizer,
} from 'phaser3-rex-plugins/templates/ui/ui-components';
import { Constants } from '../../constants';
import { ScoreListItemData } from '../../core/interfaces/score-list-item.interface';
import MainScene from '../../scenes/main-scene';
import ScoreListItem from './score-list-item';

export default class ScoreList extends Phaser.GameObjects.Container {
  private scrollablePanel: ScrollablePanel;
  private sizer: Sizer;
  private title: Phaser.GameObjects.BitmapText;

  constructor(
    public scene: MainScene,
    x: number,
    y: number,
    private scoreList: ScoreListItemData[]
  ) {
    super(scene, x, y);
    this.scene.add.existing(this);
    this.addTitle();
    this.addSlider();
  }

  addTitle(): void {
    this.title = this.scene.add
      .bitmapText(135, -20, Constants.FONT, Constants.HIGH_SCORE_LIST, 15)
      .setTintFill(0x000000)
      .setOrigin(0.5);
    this.add(this.title);
  }

  addSlider(): void {
    this.scrollablePanel?.destroy();
    this.scrollablePanel = this.scene.rexUI.add
      .scrollablePanel({
        x: this.x,
        y: this.y,
        height: 290,
        scrollMode: 0,
        background: this.scene.rexUI.add.roundRectangle(
          0,
          0,
          0,
          0,
          5,
          0x395f9f,
          0.7
        ),
        panel: {
          child: this.createGrid(),
        },
        slider: {
          track: this.scene.add.image(0, 0, 'tiles', 3430),
          thumb: this.scene.add.image(0, 0, 'tiles', 78),
          hideUnscrollableSlider: true,
        },
        space: { panel: 2 },
        scroller: true,
        mouseWheelScroller: {
          focus: true,
          speed: 0.1,
        },
      })
      .setOrigin(0)
      .layout();
  }

  createGrid() {
    this.sizer = this.scene.rexUI.add.sizer({
      orientation: 'y',
      space: {
        item: 10,
        top: 5,
        bottom: 5,
      },
    });
    this.scoreList?.forEach((scoreListItem: ScoreListItemData) => {
      this.addSizerItem(scoreListItem);
    });
    this.sizer.layout();

    return this.sizer;
  }

  addSizerItem(scoreListItem: ScoreListItemData) {
    const sizerItem = new ScoreListItem(this.scene, scoreListItem);
    this.sizer.add(sizerItem);
  }

  setVisible(value: boolean): this {
    super.setVisible(value);
    this.scrollablePanel.setVisible(value);
    return this;
  }
}
