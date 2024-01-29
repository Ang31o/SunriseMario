import Phaser from 'phaser';
import { MovementComponent } from './movement-component';
import { BaseEntity } from '../base-entity';
import { Direction } from '../../core/enums/direction.enum';

export class ControlsComponent extends MovementComponent {
  private keyA: Phaser.Input.Keyboard.Key;
  private keyD: Phaser.Input.Keyboard.Key;
  private keySpace: Phaser.Input.Keyboard.Key;

  constructor(
    public scene: Phaser.Scene,
    public entity: BaseEntity,
    public config?: any
  ) {
    super(scene, entity, config);
    this.init();
  }

  // Movement controls setup
  init(): void {
    super.init();
    this.keyA = this.scene.input.keyboard.addKey('A');
    this.keyD = this.scene.input.keyboard.addKey('D');
    this.keySpace = this.scene.input.keyboard.addKey('Space');
  }

  // Update direction on key press
  update(...args: any[]): void {
    if (this.keyA.isDown) {
      this.direction = Direction.LEFT;
    } else if (this.keyD.isDown) {
      this.direction = Direction.RIGHT;
    } else {
      this.direction = null;
    }
    if (this.keySpace.isDown) {
      this.isInAir = true;
    }
    super.update(args);
  }
}
