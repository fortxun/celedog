/**
 * CollectionScene - Placeholder
 * TODO: Implement collection view
 */

import Phaser from 'phaser';

class CollectionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CollectionScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    this.add.text(width / 2, height / 2, 'Collection Scene\n\n(Coming Soon)', {
      font: '32px Arial',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
  }
}

export default CollectionScene;
