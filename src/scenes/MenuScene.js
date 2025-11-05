/**
 * MenuScene - Main menu
 * New game, Continue, Credits
 */

import Phaser from 'phaser';
import SaveSystem from '../systems/SaveSystem.js';

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
    // Check if there's an existing save
    if (SaveSystem.hasSaveData()) {
      this.showConfirmDialog(
        'Starting a new game will overwrite your current save. Continue?',
        () => {
          // Reset game state
          const gameState = this.registry.get('gameState');
          gameState.reset();

          // Clear save data
          SaveSystem.deleteSave();

          // Start game scene
          this.scene.start('GameScene');
          this.scene.launch('UIScene');
        }
      );
    } else {
      // Reset game state
      const gameState = this.registry.get('gameState');
      gameState.reset();

      // Start game scene
      this.scene.start('GameScene');
      this.scene.launch('UIScene');
    }
  }

  /**
   * Continue from saved game
   */
  continueGame() {
    const loadResult = SaveSystem.loadGame();

    if (loadResult.success) {
      // Set loaded state as active
      this.registry.set('gameState', loadResult.gameState);
      this.registry.set('gold', loadResult.gameState.player.gold);

      // Show success message
      this.showMessage('Game loaded successfully!', 0x4CAF50);

      // Delay start to show message
      this.time.delayedCall(500, () => {
        this.scene.start('GameScene');
        this.scene.launch('UIScene');
      });
    } else {
      this.showMessage(loadResult.message, 0xFF5252);
    }
  }

  /**
   * Check if saved game exists
   * @returns {boolean} True if save exists
   */
  checkForSave() {
    return SaveSystem.hasSaveData();
  }

  /**
   * Show confirmation dialog
   */
  showConfirmDialog(message, onConfirm) {
    const { width, height } = this.cameras.main;

    // Modal background
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
    overlay.setOrigin(0);
    overlay.setInteractive();

    // Dialog panel
    const panel = this.add.rectangle(width / 2, height / 2, 500, 200, 0x333333);
    panel.setStrokeStyle(4, 0xffffff);

    // Message
    const text = this.add.text(width / 2, height / 2 - 30, message, {
      font: '20px Arial',
      fill: '#ffffff',
      align: 'center',
      wordWrap: { width: 450 }
    }).setOrigin(0.5);

    // Confirm button
    const confirmBtn = this.createDialogButton(width / 2 - 80, height / 2 + 50, 'Yes', 0x4CAF50, () => {
      overlay.destroy();
      panel.destroy();
      text.destroy();
      confirmBtn.destroy();
      cancelBtn.destroy();
      onConfirm();
    });

    // Cancel button
    const cancelBtn = this.createDialogButton(width / 2 + 80, height / 2 + 50, 'No', 0xF44336, () => {
      overlay.destroy();
      panel.destroy();
      text.destroy();
      confirmBtn.destroy();
      cancelBtn.destroy();
    });
  }

  /**
   * Create dialog button
   */
  createDialogButton(x, y, text, color, callback) {
    const button = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, 120, 40, color);
    bg.setStrokeStyle(2, 0xffffff);

    const label = this.add.text(0, 0, text, {
      font: 'bold 18px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    button.add([bg, label]);

    button.setInteractive(
      new Phaser.Geom.Rectangle(-60, -20, 120, 40),
      Phaser.Geom.Rectangle.Contains
    );

    button.on('pointerover', () => {
      bg.setFillStyle(Phaser.Display.Color.GetColor(
        ...Phaser.Display.Color.ColorToRGBA(color)
      ) + 0x333333);
      this.game.canvas.style.cursor = 'pointer';
    });

    button.on('pointerout', () => {
      bg.setFillStyle(color);
      this.game.canvas.style.cursor = 'default';
    });

    button.on('pointerdown', callback);

    return button;
  }

  /**
   * Show temporary message
   */
  showMessage(message, color) {
    const { width } = this.cameras.main;

    const msgText = this.add.text(width / 2, 500, message, {
      font: 'bold 18px Arial',
      fill: '#ffffff',
      backgroundColor: Phaser.Display.Color.GetColor(
        ...Phaser.Display.Color.ColorToRGBA(color)
      ),
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

    // Fade out and destroy
    this.tweens.add({
      targets: msgText,
      alpha: 0,
      duration: 2000,
      delay: 1000,
      onComplete: () => {
        msgText.destroy();
      }
    });
  }
}

export default MenuScene;
