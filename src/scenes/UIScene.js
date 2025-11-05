/**
 * UIScene - Persistent UI overlay
 * Displays gold, navigation, and notifications
 */

import Phaser from 'phaser';
import { formatNumber } from '../utils/helpers.js';

class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene' });
  }

  create() {
    const { width } = this.cameras.main;

    // Gold display (top-right)
    this.goldText = this.add.text(width - 20, 20, '', {
      font: 'bold 24px Arial',
      fill: '#FFD700',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(1, 0);

    // Update gold display
    this.updateGoldDisplay();

    // Listen for gold changes
    this.registry.events.on('changedata-gold', this.onGoldChanged, this);

    // Kennel capacity display
    this.kennelText = this.add.text(width - 20, 60, '', {
      font: '18px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(1, 0);

    this.updateKennelDisplay();

    // Navigation bar (top-left)
    this.createNavigationBar();

    // Notification container (bottom-center)
    this.notifications = [];
    this.notificationY = 650;
  }

  /**
   * Create navigation bar
   */
  createNavigationBar() {
    const buttons = [
      { text: 'Kennel', scene: 'GameScene' },
      { text: 'Breed', scene: 'BreedingScene' },
      { text: 'Shop', scene: 'ShopScene' },
      { text: 'Collection', scene: 'CollectionScene' }
    ];

    buttons.forEach((btn, index) => {
      const x = 20 + index * 110;
      const y = 20;

      const button = this.createNavButton(x, y, btn.text, () => {
        this.switchScene(btn.scene);
      });
    });
  }

  /**
   * Create navigation button
   */
  createNavButton(x, y, text, callback) {
    const button = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, 100, 40, 0x2196F3);
    bg.setStrokeStyle(2, 0xffffff);

    const label = this.add.text(0, 0, text, {
      font: '16px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    button.add([bg, label]);

    button.setInteractive(
      new Phaser.Geom.Rectangle(-50, -20, 100, 40),
      Phaser.Geom.Rectangle.Contains
    );

    button.on('pointerover', () => {
      bg.setFillStyle(0x42A5F5);
      this.game.canvas.style.cursor = 'pointer';
    });

    button.on('pointerout', () => {
      bg.setFillStyle(0x2196F3);
      this.game.canvas.style.cursor = 'default';
    });

    button.on('pointerdown', () => {
      bg.setFillStyle(0x1976D2);
    });

    button.on('pointerup', () => {
      bg.setFillStyle(0x42A5F5);
      callback();
    });

    return button;
  }

  /**
   * Switch to a different scene
   */
  switchScene(sceneKey) {
    // Stop current main scene
    const currentScene = this.scene.manager.getScenes(false).find(
      s => s.scene.key !== 'UIScene' && s.scene.isActive()
    );

    if (currentScene && currentScene.scene.key !== sceneKey) {
      this.scene.stop(currentScene.scene.key);
      this.scene.start(sceneKey);
    }
  }

  /**
   * Update gold display
   */
  updateGoldDisplay() {
    const gold = this.registry.get('gold') || 0;
    this.goldText.setText(`💰 ${formatNumber(gold)}`);
  }

  /**
   * Update kennel display
   */
  updateKennelDisplay() {
    const used = this.registry.get('kennelUsed') || 0;
    const capacity = this.registry.get('kennelCapacity') || 10;
    this.kennelText.setText(`🏠 ${used}/${capacity}`);
  }

  /**
   * Handle gold change event
   */
  onGoldChanged(parent, value, previousValue) {
    this.updateGoldDisplay();

    // Animate gold change
    if (value > previousValue) {
      const diff = value - previousValue;
      this.showNotification(`+${formatNumber(diff)} gold`, 0x4CAF50);
    }
  }

  /**
   * Show a notification toast
   * @param {string} message - Notification message
   * @param {number} color - Background color
   */
  showNotification(message, color = 0x2196F3) {
    const { width } = this.cameras.main;

    const notification = this.add.container(width / 2, this.notificationY);

    const bg = this.add.rectangle(0, 0, 300, 50, color, 0.9);
    bg.setStrokeStyle(2, 0xffffff);

    const text = this.add.text(0, 0, message, {
      font: '18px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    notification.add([bg, text]);
    notification.setAlpha(0);

    // Fade in
    this.tweens.add({
      targets: notification,
      alpha: 1,
      duration: 300,
      onComplete: () => {
        // Hold for 2 seconds, then fade out
        this.time.delayedCall(2000, () => {
          this.tweens.add({
            targets: notification,
            alpha: 0,
            duration: 300,
            onComplete: () => {
              notification.destroy();
            }
          });
        });
      }
    });
  }

  /**
   * Update kennel usage from external
   */
  updateKennelUsage(used, capacity) {
    this.registry.set('kennelUsed', used);
    this.registry.set('kennelCapacity', capacity);
    this.updateKennelDisplay();
  }

  shutdown() {
    this.registry.events.off('changedata-gold', this.onGoldChanged, this);
  }
}

export default UIScene;
