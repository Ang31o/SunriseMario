import { Constants } from '../constants';

export class GameState {
  private static _mapCounter: number;

  static get map(): string {
    return `map${this._mapCounter}`;
  }

  static init(): void {
    this._mapCounter = 1;
  }

  static mapComplete(): void {
    this._mapCounter =
      this._mapCounter < Constants.MAPS_COUNT ? this._mapCounter + 1 : 1;
  }
}
