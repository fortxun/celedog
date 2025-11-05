/**
 * BootScene - Initial game setup
 * Initializes game registry and transitions to PreloadScene
 */

import Phaser from 'phaser';
import gameState from '../utils/GameState.js';
import { ECONOMY } from '../utils/constants.js';

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    // Initialize game registry with default values
    this.registry.set('gameState', gameState);
    this.registry.set('gold', ECONOMY.STARTING_GOLD);
    this.registry.set('kennelCapacity', 10);
    this.registry.set('kennelUsed', 0);

    // Display loading text
    this.add.text(640, 360, 'Initializing...', {
      font: '24px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Transition to PreloadScene after a brief moment
    this.time.delayedCall(500, () => {
      this.scene.start('PreloadScene');
    });
  }
}

export default BootScene;
