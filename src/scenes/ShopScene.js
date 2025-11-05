/**
 * ShopScene - Placeholder
 * TODO: Implement shop UI
 */

import Phaser from 'phaser';

class ShopScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ShopScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    this.add.text(width / 2, height / 2, 'Shop Scene\n\n(Coming Soon)', {
      font: '32px Arial',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
  }
}

export default ShopScene;
