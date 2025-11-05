/**
 * BreedingScene - Placeholder
 * TODO: Implement breeding UI
 */

import Phaser from 'phaser';

class BreedingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BreedingScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    this.add.text(width / 2, height / 2, 'Breeding Scene\n\n(Coming Soon)', {
      font: '32px Arial',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
  }
}

export default BreedingScene;
