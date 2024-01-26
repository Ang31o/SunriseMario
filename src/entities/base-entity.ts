import Phaser from 'phaser';
import { MovementComponent } from './components/movement-component';

export class BaseEntity extends Phaser.GameObjects.Container {
  public body: Phaser.Physics.Arcade.Body;
  public baseSprite: Phaser.GameObjects.Sprite;
  public isDead: boolean;
  private components: Phaser.GameObjects.GameObject[] = [];
  private colliders: Phaser.Physics.Arcade.Collider[] = [];

  protected get movementComponent(): MovementComponent {
    return this.getComponent(MovementComponent) as MovementComponent;
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.scene.add.existing(this);
  }

  setupBody(bodyType?: number): void {
    this.scene.physics.world.enableBody(this, bodyType);
    if (bodyType === Phaser.Physics.Arcade.DYNAMIC_BODY)
      this.body.setCollideWorldBounds(true);
  }

  setBodySizePosition(): void {
    this.setSize(this.baseSprite?.displayWidth, this.baseSprite?.displayHeight);
    this.body.setSize(
      this.baseSprite?.displayWidth,
      this.baseSprite?.displayHeight
    );
    this.body.position.set(this.x, this.y);
  }

  addComponent(component: any): void {
    this.components.push(component);
  }

  getComponent<ComponentType>(component: any): ComponentType | undefined {
    return this.components.find((c) => c instanceof component) as ComponentType;
  }

  addCollider(
    collider: Phaser.Types.Physics.Arcade.ArcadeColliderType,
    onCollide?: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback
  ): void {
    this.colliders.push(
      this.scene.physics.add.collider(this, collider, onCollide)
    );
  }

  die(): void {
    // Clear colliders when entity dies (ex. entity won't collide with platform anymore)
    this.colliders.forEach((collider) => collider.destroy());
    // Clear components when entity dies (ex. entity can't move anymore)
    this.components = [];
  }

  playRunAnimation(): void {}

  playIdleAnimation(): void {}

  playJumpAnimation(): void {}

  update(time: number, delta: number): void {
    this.components?.forEach((component) => {
      component.update(time, delta);
    });
    super.update(time, delta);
  }

  destroy(fromScene?: boolean): void {
    this.body.destroy();
    this.components = null;
    super.destroy(fromScene);
  }
}
