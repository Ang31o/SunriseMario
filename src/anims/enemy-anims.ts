import Phaser from 'phaser';

export const EnemyAnims = (anims: Phaser.Animations.AnimationManager) => {
  if (!anims.exists('goombaRun')) {
    anims.create({
      key: 'goombaRun',
      frames: anims.generateFrameNames('main-atlas', {
        prefix: 'mario-atlas_',
        start: 11,
        end: 12,
      }),
      frameRate: 15,
      repeat: -1,
    });
  }
  if (!anims.exists('goombaDie')) {
    anims.create({
      key: 'goombaDie',
      frames: [{ key: 'main-atlas', frame: 'mario-atlas_10' }],
      frameRate: 10,
      hideOnComplete: true,
    });
  }
};
