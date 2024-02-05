import { Constants } from '../constants';
import { GamePhase } from '../core/enums/game-phase.enum';

export class GameState {
  private static _mapCounter: number;
  private static _gamePhase: GamePhase;
  private static _score: number;

  static get map(): string {
    return `map${this._mapCounter}`;
  }

  static get gamePhase(): GamePhase {
    return this._gamePhase;
  }

  static get score(): number {
    return this._score;
  }

  static resetStateData(): void {
    this._mapCounter = 1;
    this._score = 0;
  }

  static init(): void {
    this.updateGamePhase(GamePhase.INIT);
    this.resetStateData();
  }

  static mapComplete(): void {
    this._mapCounter =
      this._mapCounter < Constants.MAPS_COUNT ? this._mapCounter + 1 : 1;
  }

  static updateGamePhase(newGamePhase: GamePhase): void {
    this._gamePhase = newGamePhase;
  }

  static incrementScore(): void {
    this._score++;
  }

  static gameEnd(): void {
    this.updateGamePhase(GamePhase.GAME_END);
    this.resetStateData();
  }
}
