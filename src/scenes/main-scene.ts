import Phaser from 'phaser';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { Constants } from '../constants';
import ButtonContainer from '../ui/button-container';
import eventService from '../events/event-service';
import { Events } from '../events/events';
import { GameState } from '../state/game-state';
import { GamePhase } from '../core/enums/game-phase.enum';
import ControlsContainer from '../ui/main/controls-container';
import ScoreList from '../ui/main/score-list';
import { fetchScoreList } from '../requests/http/fetch-score-list';
import { ScoreListItemData } from '../core/interfaces/score-list-item.interface';
import ScoreModal from '../ui/main/score-modal';

export default class MainScene extends Phaser.Scene {
  private title: Phaser.GameObjects.BitmapText;
  private map: Phaser.Tilemaps.Tilemap;
  private tileset: any;
  private playBtn: ButtonContainer;
  private confettiEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private controlsInfo: ControlsContainer;
  private scoreList: ScoreList;
  public rexUI: RexUIPlugin;
  private scoreListData: ScoreListItemData[];
  private saveBtn: ButtonContainer;
  private scoreModal: ScoreModal;

  constructor() {
    super('main-scene');
  }

  preload() {
    this.load.bitmapFont(
      'arcade',
      './assets/fonts/arcade.png',
      'assets/fonts/arcade.xml'
    );
    this.load.atlas(
      'main-atlas',
      './assets/images/mario-atlas.png',
      './assets/images/mario-atlas.json'
    );
    this.load.spritesheet('tiles', './assets/images/tiles.png', {
      frameWidth: 16,
      frameHeight: 16,
      spacing: 1,
      margin: 1,
    });
    this.load.tilemapTiledJSON('main', './assets/maps/main.json');
  }

  create() {
    GameState.init();
    this.setupScene();
  }

  async setupScene(): Promise<void> {
    this.drawIntroMap();
    this.addTitle();
    this.addControlsInfo();
    this.addPlayButton();
    this.addEventListeners();
    const scoreData = await fetchScoreList();
    this.scoreListData = scoreData.list;
    this.addScoreList();
    this.addSaveScoreButton();
  }

  drawIntroMap(): void {
    this.map = this.make.tilemap({ key: 'main' });
    this.tileset = this.map.addTilesetImage('map-tileset', 'tiles');
    this.map.createLayer('layer1', this.tileset, 0, 0);
  }

  addTitle(): void {
    this.title = this.add
      .bitmapText(
        Constants.GAME_WIDTH / 2,
        150,
        Constants.FONT,
        Constants.WELCOME_MSG,
        15
      )
      .setOrigin(0.5)
      .setTintFill(0x000000);
  }

  addControlsInfo(): void {
    this.controlsInfo = new ControlsContainer(this, 15, 150);
  }

  addScoreList(): void {
    if (!this.scoreListData) return;
    this.scoreList = new ScoreList(this, 683, 60, this.scoreListData);
  }

  addGameOverMessage(): void {
    this.title.setText(Constants.GAME_OVER_MSG);
  }

  addPlayButton(): void {
    this.playBtn = new ButtonContainer(
      this,
      Constants.GAME_WIDTH / 2,
      Constants.GAME_HEIGHT / 2 - 30,
      {
        background: {
          texture: 'tiles',
          frame: 263,
        },
        nineslice: {
          width: 60,
          height: 40,
          corner: 4,
        },
        label: Constants.PLAY_TITLE,
        onRelease: () => this.onPlayBtnRelease(),
      }
    );
  }

  addSaveScoreButton(): void {
    if (!this.scoreListData) return;
    this.saveBtn = new ButtonContainer(
      this,
      Constants.GAME_WIDTH / 2,
      Constants.GAME_HEIGHT / 2 + 30,
      {
        background: {
          texture: 'tiles',
          frame: 227,
        },
        nineslice: {
          width: 110,
          height: 40,
          corner: 4,
        },
        label: Constants.SAVE_SCORE,
        onRelease: () => this.onSaveScoreBtnRelease(),
      }
    ).setVisible(true);
  }

  onPlayBtnRelease(): void {
    this.confettiEmitter?.destroy();
    this.scene.sleep('main-scene');
    GameState.gamePhase === GamePhase.INIT
      ? this.startGame()
      : this.restartGame();
    GameState.updateGamePhase(GamePhase.GAME_START);
  }

  onSaveScoreBtnRelease(): void {
    this.scoreModal = new ScoreModal(this);
  }

  startGame(): void {
    this.scene.run('game-scene');
    this.scene.run('ui-scene');
  }

  restartGame(): void {
    this.scene.get('game-scene').scene.restart();
    this.scene.get('ui-scene').scene.restart();
  }

  gameOver(): void {
    this.wakeScene();
    this.title.setText(Constants.GAME_OVER_MSG);
    this.playBtn.updateLabel(Constants.TRY_AGAIN_TITLE);
    this.playBtn.updateSize(100);
    GameState.updateGamePhase(GamePhase.GAME_OVER);
  }

  gameMapComplete(): void {
    this.wakeScene();
    this.emitConfetti();
    GameState.mapComplete();
    GameState.updateGamePhase(GamePhase.MAP_COMPLETE);
    this.title.setText(Constants.CONGRATS_MSG);
    this.playBtn.updateLabel(
      GameState.map === 'map1'
        ? Constants.PLAY_AGAIN_TITLE
        : Constants.NEXT_MAP_TITLE
    );
    this.playBtn.updateSize(120);
  }

  wakeScene(): void {
    this.scene.sleep('game-scene');
    this.scene.sleep('ui-scene');
    this.scene.wake('main-scene');
    this.controlsInfo.setVisible(GameState.gamePhase === GamePhase.INIT);
    this.scoreList.setVisible(GameState.gamePhase === GamePhase.INIT);
    this.saveBtn.setVisible(GameState.gamePhase !== GamePhase.INIT);
  }

  emitConfetti(): void {
    this.confettiEmitter = this.add.particles(
      Constants.GAME_WIDTH / 2,
      200,
      'tiles',
      {
        frame: [432, 436, 440],
        speed: { min: -200, max: 200 },
        angle: { min: -160, max: -30 },
        scale: { start: 1, end: 0 },
        gravityY: 100,
        lifespan: 3000,
        emitting: false,
      }
    );
    this.confettiEmitter.explode(50);
    this.confettiEmitter.on(Phaser.GameObjects.Particles.Events.COMPLETE, () =>
      this.confettiEmitter.destroy()
    );
    this.children.sendToBack(this.confettiEmitter);
  }

  addEventListeners(): void {
    eventService.on(Events.GAME_OVER, this.gameOver, this);
    eventService.on(Events.GAME_MAP_COMPLETE, this.gameMapComplete, this);
    this.events.once(
      Phaser.Scenes.Events.SHUTDOWN,
      this.removeEventListeners,
      this
    );
  }

  removeEventListeners(): void {
    eventService.off(Events.GAME_OVER, this.gameOver, this);
    eventService.off(Events.GAME_MAP_COMPLETE, this.gameMapComplete, this);
  }
}
