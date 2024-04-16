import Phaser from 'phaser';

export const ItemsAnims = (anims: Phaser.Animations.AnimationManager) => {
  if (!anims.exists('coinRotate')) {
    anims.create({
      key: 'coinRotate',
      frames: anims.generateFrameNames('main-atlas', {
        prefix: 'mario-atlas_',
        start: 6,
        end: 9,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }
  if (!anims.exists('boxSlide')) {
    anims.create({
      key: 'boxSlide',
      frames: anims.generateFrameNumbers('tiles', {
        start: 36,
        end: 39,
      }),
      frameRate: 5,
      repeat: -1,
    });
  }
};
