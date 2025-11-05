/**
 * ShopScene - Buy and sell dogs
 */

import Phaser from 'phaser';
import CelebrityDog from '../entities/CelebrityDog.js';
import EconomySystem from '../systems/EconomySystem.js';
import starterDogs from '../data/starterDogs.js';
import { formatNumber } from '../utils/helpers.js';

class ShopScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ShopScene' });
    this.selectedTab = 'buy'; // 'buy' or 'sell'
  }

  create() {
    const { width, height } = this.cameras.main;

    // Title
    this.add.text(width / 2, 60, 'Dog Shop', {
      font: 'bold 42px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Tab buttons
    this.createTabButtons();

    // Content container
    this.contentContainer = this.add.container(0, 0);

    // Display initial content
    this.displayBuyTab();
  }

  /**
   * Create tab buttons
   */
  createTabButtons() {
    const { width } = this.cameras.main;

    // Buy tab
    this.buyTabButton = this.createTabButton(width / 2 - 120, 120, 'Buy Dogs', () => {
      this.switchTab('buy');
    });

    // Sell tab
    this.sellTabButton = this.createTabButton(width / 2 + 120, 120, 'Sell Dogs', () => {
      this.switchTab('sell');
    });

    this.updateTabHighlight();
  }

  /**
   * Create a tab button
   */
  createTabButton(x, y, text, callback) {
    const button = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, 200, 50, 0x555555);
    bg.setStrokeStyle(2, 0xffffff);

    const label = this.add.text(0, 0, text, {
      font: 'bold 20px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    button.add([bg, label]);
    button.bg = bg;
    button.label = label;

    button.setInteractive(
      new Phaser.Geom.Rectangle(-100, -25, 200, 50),
      Phaser.Geom.Rectangle.Contains
    );

    button.on('pointerover', () => {
      bg.setFillStyle(0x666666);
    });

    button.on('pointerout', () => {
      if (this.selectedTab !== text.toLowerCase().split(' ')[0]) {
        bg.setFillStyle(0x555555);
      }
    });

    button.on('pointerdown', callback);

    return button;
  }

  /**
   * Switch tabs
   */
  switchTab(tab) {
    this.selectedTab = tab;
    this.updateTabHighlight();

    // Clear content
    this.contentContainer.removeAll(true);

    if (tab === 'buy') {
      this.displayBuyTab();
    } else {
      this.displaySellTab();
    }
  }

  /**
   * Update tab highlight
   */
  updateTabHighlight() {
    if (this.selectedTab === 'buy') {
      this.buyTabButton.bg.setFillStyle(0x4CAF50);
      this.sellTabButton.bg.setFillStyle(0x555555);
    } else {
      this.buyTabButton.bg.setFillStyle(0x555555);
      this.sellTabButton.bg.setFillStyle(0xF44336);
    }
  }

  /**
   * Display buy tab content
   */
  displayBuyTab() {
    const startX = 150;
    const startY = 200;
    const spacing = 200;
    const perRow = 5;

    starterDogs.forEach((dogData, index) => {
      const row = Math.floor(index / perRow);
      const col = index % perRow;
      const x = startX + col * spacing;
      const y = startY + row * spacing;

      this.createDogShopCard(x, y, dogData, 'buy');
    });
  }

  /**
   * Display sell tab content
   */
  displaySellTab() {
    const gameState = this.registry.get('gameState');
    const dogs = gameState.getAllDogs();

    if (dogs.length === 0) {
      const { width, height } = this.cameras.main;
      const text = this.add.text(width / 2, height / 2, 'No dogs to sell!\n\nBuy some dogs first.', {
        font: '24px Arial',
        fill: '#ffffff',
        align: 'center'
      }).setOrigin(0.5);

      this.contentContainer.add(text);
      return;
    }

    const startX = 150;
    const startY = 200;
    const spacing = 200;
    const perRow = 5;

    dogs.forEach((dog, index) => {
      const row = Math.floor(index / perRow);
      const col = index % perRow;
      const x = startX + col * spacing;
      const y = startY + row * spacing;

      this.createDogShopCard(x, y, dog, 'sell');
    });
  }

  /**
   * Create a dog shop card
   */
  createDogShopCard(x, y, dogData, mode) {
    const card = this.add.container(x, y);

    // Background
    const bgColor = mode === 'buy' ? 0x4CAF50 : 0xF44336;
    const bg = this.add.rectangle(0, 0, 160, 200, bgColor, 0.3);
    bg.setStrokeStyle(3, bgColor);

    // Dog sprite placeholder
    const sprite = this.add.circle(0, -40, 50, 0x8B4513);

    // Name
    const name = dogData.name || dogData.getName?.() || 'Unknown';
    const nameText = this.add.text(0, 25, name, {
      font: '14px Arial',
      fill: '#ffffff',
      wordWrap: { width: 150 }
    }).setOrigin(0.5);

    // Rarity
    const rarityName = dogData.rarity ? `★ ${dogData.rarity}` : 'Common';
    const rarityText = this.add.text(0, 45, rarityName, {
      font: '12px Arial',
      fill: '#FFD700'
    }).setOrigin(0.5);

    // Price
    const price = mode === 'buy'
      ? EconomySystem.getPurchasePrice(dogData.rarity)
      : EconomySystem.getSellValue(dogData);

    const priceText = this.add.text(0, 70, `${formatNumber(price)} gold`, {
      font: 'bold 16px Arial',
      fill: '#FFD700'
    }).setOrigin(0.5);

    // Button
    const buttonY = 90;
    const buttonBg = this.add.rectangle(0, buttonY, 140, 35, mode === 'buy' ? 0x4CAF50 : 0xF44336);
    buttonBg.setStrokeStyle(2, 0xffffff);

    const buttonText = this.add.text(0, buttonY, mode === 'buy' ? 'Buy' : 'Sell', {
      font: 'bold 16px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    card.add([bg, sprite, nameText, rarityText, priceText, buttonBg, buttonText]);

    // Make button interactive
    const buttonContainer = this.add.container(x, y + buttonY);
    buttonContainer.setInteractive(
      new Phaser.Geom.Rectangle(-70, -17.5, 140, 35),
      Phaser.Geom.Rectangle.Contains
    );

    buttonContainer.on('pointerover', () => {
      buttonBg.setFillStyle(mode === 'buy' ? 0x66BB6A : 0xE57373);
      this.game.canvas.style.cursor = 'pointer';
    });

    buttonContainer.on('pointerout', () => {
      buttonBg.setFillStyle(mode === 'buy' ? 0x4CAF50 : 0xF44336);
      this.game.canvas.style.cursor = 'default';
    });

    buttonContainer.on('pointerdown', () => {
      if (mode === 'buy') {
        this.buyDog(dogData);
      } else {
        this.sellDog(dogData);
      }
    });

    this.contentContainer.add(card);
  }

  /**
   * Buy a dog
   */
  buyDog(dogData) {
    const gameState = this.registry.get('gameState');
    const price = EconomySystem.getPurchasePrice(dogData.rarity);

    // Check if can afford
    if (!EconomySystem.canAfford(gameState, price)) {
      this.showMessage(`Not enough gold! Need ${formatNumber(price)}.`, 0xFF5252);
      return;
    }

    // Check kennel capacity
    if (gameState.isKennelFull()) {
      this.showMessage('Kennel is full! Sell some dogs first.', 0xFF5252);
      return;
    }

    // Process purchase
    const transaction = EconomySystem.processPurchase(gameState, price);
    if (!transaction.success) {
      this.showMessage(transaction.message, 0xFF5252);
      return;
    }

    // Create dog
    const dog = CelebrityDog.createStarter(dogData);

    // Add to game state
    gameState.addDog(dog);

    // Update registry
    this.registry.set('gold', gameState.player.gold);

    // Update UI
    const uiScene = this.scene.get('UIScene');
    if (uiScene && uiScene.updateKennelUsage) {
      const usage = gameState.getKennelUsage();
      uiScene.updateKennelUsage(usage.current, usage.max);
    }

    this.showMessage(`Purchased ${dog.name}!`, 0x4CAF50);
  }

  /**
   * Sell a dog
   */
  sellDog(dog) {
    const gameState = this.registry.get('gameState');
    const sellValue = EconomySystem.getSellValue(dog);

    // Confirm sell
    this.showConfirmDialog(
      `Sell ${dog.name} for ${formatNumber(sellValue)} gold?`,
      () => {
        // Process sale
        const transaction = EconomySystem.processSale(gameState, sellValue);

        // Remove dog
        gameState.removeDog(dog.id);

        // Update registry
        this.registry.set('gold', gameState.player.gold);

        // Update stats
        gameState.stats.totalSold++;

        // Update UI
        const uiScene = this.scene.get('UIScene');
        if (uiScene && uiScene.updateKennelUsage) {
          const usage = gameState.getKennelUsage();
          uiScene.updateKennelUsage(usage.current, usage.max);
        }

        this.showMessage(`Sold ${dog.name} for ${formatNumber(sellValue)} gold!`, 0x4CAF50);

        // Refresh sell tab
        this.switchTab('sell');
      }
    );
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
    const panel = this.add.rectangle(width / 2, height / 2, 400, 200, 0x333333);
    panel.setStrokeStyle(4, 0xffffff);

    // Message
    const text = this.add.text(width / 2, height / 2 - 30, message, {
      font: '20px Arial',
      fill: '#ffffff',
      align: 'center',
      wordWrap: { width: 350 }
    }).setOrigin(0.5);

    // Confirm button
    const confirmBtn = this.createDialogButton(width / 2 - 70, height / 2 + 50, 'Yes', 0x4CAF50, () => {
      overlay.destroy();
      panel.destroy();
      text.destroy();
      confirmBtn.destroy();
      cancelBtn.destroy();
      onConfirm();
    });

    // Cancel button
    const cancelBtn = this.createDialogButton(width / 2 + 70, height / 2 + 50, 'No', 0xF44336, () => {
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

    const bg = this.add.rectangle(0, 0, 100, 40, color);
    bg.setStrokeStyle(2, 0xffffff);

    const label = this.add.text(0, 0, text, {
      font: 'bold 18px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    button.add([bg, label]);

    button.setInteractive(
      new Phaser.Geom.Rectangle(-50, -20, 100, 40),
      Phaser.Geom.Rectangle.Contains
    );

    button.on('pointerdown', callback);

    return button;
  }

  /**
   * Show temporary message
   */
  showMessage(message, color) {
    const uiScene = this.scene.get('UIScene');
    if (uiScene && uiScene.showNotification) {
      uiScene.showNotification(message, color);
    }
  }
}

export default ShopScene;
