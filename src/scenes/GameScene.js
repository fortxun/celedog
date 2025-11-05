/**
 * GameScene - Main kennel view
 * Displays owned dogs and provides management options
 */

import Phaser from 'phaser';
import DogSprite from '../components/DogSprite.js';

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Title
    this.add.text(width / 2, 100, 'Your Kennel', {
      font: 'bold 36px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Placeholder message
    this.add.text(width / 2, height / 2, 'Your dogs will appear here\n\nVisit the Shop to get started!', {
      font: '24px Arial',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    // Get game state
    const gameState = this.registry.get('gameState');
    const dogs = gameState.getAllDogs();

    if (dogs.length > 0) {
      this.displayDogs(dogs);
    }
  }

  /**
   * Display dogs in grid
   */
  displayDogs(dogs) {
    const startX = 200;
    const startY = 200;
    const spacing = 150;
    const perRow = 6;

    dogs.forEach((dog, index) => {
      const row = Math.floor(index / perRow);
      const col = index % perRow;
      const x = startX + col * spacing;
      const y = startY + row * spacing;

      this.createDogDisplay(x, y, dog);
    });
  }

  /**
   * Create a dog display card
   */
  createDogDisplay(x, y, dog) {
    // Use new DogSprite component
    const dogSprite = new DogSprite(this, x, y, dog, {
      size: 80,
      showName: true,
      showRarity: true,
      interactive: true,
      clickCallback: (dog) => this.showDogDetails(dog)
    });

    return dogSprite;
  }

  /**
   * Show dog details modal
   */
  showDogDetails(dog) {
    const { width, height } = this.cameras.main;

    // Modal background
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
    overlay.setOrigin(0);
    overlay.setInteractive();

    // Modal panel
    const panel = this.add.rectangle(width / 2, height / 2, 400, 500, 0x222222);
    panel.setStrokeStyle(4, 0xffffff);

    // Dog info
    const summary = dog.getSummary();
    const infoText = `
Name: ${summary.name}
Rarity: ${summary.rarity}
Generation: ${summary.generation}
Age: ${summary.age}
Value: ${summary.value} gold
Body: ${summary.bodyType}
Temperament: ${summary.temperament}
Talent: ${summary.talent}
    `.trim();

    const info = this.add.text(width / 2, height / 2 - 50, infoText, {
      font: '16px Arial',
      fill: '#ffffff',
      align: 'left'
    }).setOrigin(0.5);

    // Close button
    const closeBtn = this.add.text(width / 2, height / 2 + 200, 'Close', {
      font: 'bold 20px Arial',
      fill: '#ffffff',
      backgroundColor: '#f44336',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    closeBtn.on('pointerdown', () => {
      overlay.destroy();
      panel.destroy();
      info.destroy();
      closeBtn.destroy();
    });
  }
}

export default GameScene;
