/**
 * GameScene - Main kennel view
 * Displays owned dogs and provides management options
 */

import Phaser from 'phaser';

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
    const card = this.add.container(x, y);

    // Background
    const bg = this.add.rectangle(0, 0, 120, 140, 0x333333);
    bg.setStrokeStyle(2, 0xffffff);

    // Placeholder sprite (colored circle)
    const sprite = this.add.circle(0, -20, 40, 0x8B4513);

    // Name
    const name = this.add.text(0, 40, dog.name || 'Unnamed', {
      font: '12px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Rarity
    const rarity = this.add.text(0, 55, dog.getRarityName(), {
      font: '10px Arial',
      fill: '#FFD700'
    }).setOrigin(0.5);

    card.add([bg, sprite, name, rarity]);

    // Make interactive
    card.setInteractive(
      new Phaser.Geom.Rectangle(-60, -70, 120, 140),
      Phaser.Geom.Rectangle.Contains
    );

    card.on('pointerover', () => {
      bg.setFillStyle(0x444444);
    });

    card.on('pointerout', () => {
      bg.setFillStyle(0x333333);
    });

    card.on('pointerdown', () => {
      this.showDogDetails(dog);
    });

    return card;
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
