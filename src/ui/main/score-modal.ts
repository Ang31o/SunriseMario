import Phaser from 'phaser';
import InputText from 'phaser3-rex-plugins/plugins/inputtext.js';
import { Constants } from '../../constants';
import ButtonContainer from '../button-container';
import { saveScore } from '../../requests/http/save-score';
import { GameState } from '../../state/game-state';
import PopupMessage from '../popup-message';
import RectGraphics from '../rect-graphics';

export default class ScoreModal extends Phaser.GameObjects.Container {
  private base: RectGraphics;
  private inputText: InputText;
  private baseWidth = 330;
  private baseHeight = 200;
  private closeBtn: ButtonContainer;
  private saveBtn: ButtonContainer;

  constructor(public scene: Phaser.Scene) {
    super(scene, Constants.GAME_WIDTH / 2, Constants.GAME_HEIGHT / 2);
    this.scene.add.existing(this);
    this.addBase();
    this.addInputText();
    this.addSave();
    this.addClose();
  }

  addBase(): void {
    this.base = new RectGraphics(this.scene, {
      width: this.baseWidth,
      height: this.baseHeight,
      fillAlpha: 0.9,
      isInteractive: true,
    });
    this.add(this.base);
  }

  addInputText(): void {
    this.inputText = new InputText(this.scene, 0, -40, 100, 100, {
      type: 'text',
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'monospace',
      id: 'name-input',
      paddingTop: '0px',
      paddingLeft: '1px',
      paddingBottom: '0px',
      paddingRight: '0px',
      placeholder: 'Enter your name',
      backgroundColor: 'transparent',
    }).resize(200, 26);
    this.scene.add.existing(this.inputText);
    this.inputText.setFocus();
    this.add(this.inputText);
  }

  addClose(): void {
    this.closeBtn = new ButtonContainer(this.scene, 155, -89, {
      background: {
        texture: 'tiles',
        frame: 1563,
      },
      onRelease: () => this.close(),
    });
    this.add(this.closeBtn);
  }

  addSave(): void {
    this.saveBtn = new ButtonContainer(this.scene, 0, 30, {
      background: {
        texture: 'tiles',
        frame: 227,
      },
      nineslice: {
        width: 90,
        height: 40,
        corner: 4,
      },
      label: Constants.SAVE,
      onRelease: () => this.onSave(),
    });
    this.add(this.saveBtn);
  }

  close(): void {
    this.destroy(true);
  }

  async onSave(): Promise<void> {
    const resp = await saveScore(this.inputText.text, GameState.score);
    if (resp.success) {
      const message = new PopupMessage(this.scene, 'Score added!');
      this.close();
    } else {
      const message = new PopupMessage(this.scene, resp.message);
    }
  }
}
