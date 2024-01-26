import Phaser from 'phaser';

export const PlayerAnims = (anims: Phaser.Animations.AnimationManager) => {
  if (!anims.exists('run')) {
    anims.create({
      key: 'run',
      frames: anims.generateFrameNames('main-atlas', {
        prefix: 'mario-atlas_',
        start: 1,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!anims.exists('idle')) {
    anims.create({
      key: 'idle',
      frames: [{ key: 'main-atlas', frame: 'mario-atlas_0' }],
      frameRate: 10,
    });
  }

  if (!anims.exists('jump')) {
    anims.create({
      key: 'jump',
      frames: [{ key: 'main-atlas', frame: 'mario-atlas_4' }],
      frameRate: 10,
    });
  }

  if (!anims.exists('die')) {
    anims.create({
      key: 'die',
      frames: [{ key: 'main-atlas', frame: 'mario-atlas_5' }],
      frameRate: 10,
    });
  }
};
