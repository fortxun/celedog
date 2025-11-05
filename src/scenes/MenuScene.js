/**
 * MenuScene - Main menu
 * New game, Continue, Credits
 */

import Phaser from 'phaser';

class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Title
    const title = this.add.text(width / 2, 150, 'CELEDOG', {
      font: 'bold 72px Arial',
      fill: '#FFD700',
      stroke: '#8B4513',
      strokeThickness: 6
    }).setOrigin(0.5);

    const subtitle = this.add.text(width / 2, 220, 'Celebrity Dog Breeding Game', {
      font: '24px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Pulse animation for title
    this.tweens.add({
      targets: title,
      scale: 1.05,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });

    // New Game button
    const newGameButton = this.createButton(width / 2, 350, 'New Game', () => {
      this.startNewGame();
    });

    // Continue button (disabled if no save)
    const hasSave = this.checkForSave();
    const continueButton = this.createButton(width / 2, 430, 'Continue', () => {
      this.continueGame();
    }, !hasSave);

    // Credits
    this.add.text(width / 2, height - 50, 'Built with Phaser 3 | v0.1.0', {
      font: '14px Arial',
      fill: '#888888'
    }).setOrigin(0.5);
  }

  /**
   * Create a styled button
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {string} text - Button text
   * @param {Function} callback - Click callback
   * @param {boolean} disabled - Whether button is disabled
   * @returns {Phaser.GameObjects.Container} Button container
   */
  createButton(x, y, text, callback, disabled = false) {
    const button = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, 240, 60, disabled ? 0x666666 : 0x4CAF50);
    bg.setStrokeStyle(3, 0xffffff);

    const label = this.add.text(0, 0, text, {
      font: 'bold 24px Arial',
      fill: disabled ? '#888888' : '#ffffff'
    }).setOrigin(0.5);

    button.add([bg, label]);

    if (!disabled) {
      button.setInteractive(
        new Phaser.Geom.Rectangle(-120, -30, 240, 60),
        Phaser.Geom.Rectangle.Contains
      );

      button.on('pointerover', () => {
        bg.setFillStyle(0x66BB6A);
        this.game.canvas.style.cursor = 'pointer';
      });

      button.on('pointerout', () => {
        bg.setFillStyle(0x4CAF50);
        this.game.canvas.style.cursor = 'default';
      });

      button.on('pointerdown', () => {
        bg.setFillStyle(0x388E3C);
      });

      button.on('pointerup', () => {
        bg.setFillStyle(0x66BB6A);
        callback();
      });
    }

    return button;
  }

  /**
   * Start a new game
   */
  startNewGame() {
    // Reset game state
    const gameState = this.registry.get('gameState');
    gameState.reset();

    // Start game scene
    this.scene.start('GameScene');
    this.scene.launch('UIScene');
  }

  /**
   * Continue from saved game
   */
  continueGame() {
    // Load game from save
    // TODO: Implement SaveSystem loading
    this.scene.start('GameScene');
    this.scene.launch('UIScene');
  }

  /**
   * Check if saved game exists
   * @returns {boolean} True if save exists
   */
  checkForSave() {
    try {
      const save = localStorage.getItem('celedog_save');
      return save !== null;
    } catch (e) {
      return false;
    }
  }
}

export default MenuScene;
