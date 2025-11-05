/**
 * BreedingScene - Select parents and breed dogs
 */

import Phaser from 'phaser';
import BreedingSystem from '../systems/BreedingSystem.js';
import { formatNumber } from '../utils/helpers.js';

class BreedingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BreedingScene' });
    this.selectedParent1 = null;
    this.selectedParent2 = null;
  }

  create() {
    const { width, height } = this.cameras.main;

    // Title
    this.add.text(width / 2, 60, 'Breeding Lab', {
      font: 'bold 42px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Instructions
    this.instructionText = this.add.text(width / 2, 120, 'Select two dogs to breed', {
      font: '20px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Parent selection area
    this.createParentSelectionArea();

    // Preview area
    this.createPreviewArea();

    // Breed button
    this.createBreedButton();

    // Display available dogs
    this.displayAvailableDogs();
  }

  /**
   * Create parent selection display
   */
  createParentSelectionArea() {
    const { width } = this.cameras.main;

    // Parent 1 slot
    this.parent1Container = this.add.container(width / 4, 250);
    this.createParentSlot(this.parent1Container, 'Parent 1');

    // Parent 2 slot
    this.parent2Container = this.add.container((width / 4) * 3, 250);
    this.createParentSlot(this.parent2Container, 'Parent 2');
  }

  /**
   * Create a parent slot
   */
  createParentSlot(container, label) {
    const bg = this.add.rectangle(0, 0, 200, 200, 0x444444, 0.5);
    bg.setStrokeStyle(3, 0xffffff);

    const labelText = this.add.text(0, -120, label, {
      font: 'bold 20px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    const emptyText = this.add.text(0, 0, 'Click to select', {
      font: '16px Arial',
      fill: '#888888'
    }).setOrigin(0.5);

    container.add([bg, labelText, emptyText]);
    container.emptyText = emptyText;

    // Make container interactive
    container.setInteractive(
      new Phaser.Geom.Rectangle(-100, -100, 200, 200),
      Phaser.Geom.Rectangle.Contains
    );

    const parentSlot = label === 'Parent 1' ? 1 : 2;
    container.on('pointerdown', () => {
      this.selectParent(parentSlot);
    });

    container.on('pointerover', () => {
      bg.setFillStyle(0x555555);
      this.game.canvas.style.cursor = 'pointer';
    });

    container.on('pointerout', () => {
      bg.setFillStyle(0x444444);
      this.game.canvas.style.cursor = 'default';
    });
  }

  /**
   * Create preview area
   */
  createPreviewArea() {
    const { width } = this.cameras.main;

    this.previewContainer = this.add.container(width / 2, 500);

    const bg = this.add.rectangle(0, 0, 500, 150, 0x333333, 0.5);
    bg.setStrokeStyle(3, 0xFFD700);

    const title = this.add.text(0, -50, 'Breeding Preview', {
      font: 'bold 20px Arial',
      fill: '#FFD700'
    }).setOrigin(0.5);

    this.previewText = this.add.text(0, 10, 'Select two dogs to see breeding preview', {
      font: '16px Arial',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    this.previewContainer.add([bg, title, this.previewText]);
  }

  /**
   * Create breed button
   */
  createBreedButton() {
    const { width, height } = this.cameras.main;

    this.breedButton = this.add.container(width / 2, height - 80);

    const bg = this.add.rectangle(0, 0, 200, 60, 0x4CAF50);
    bg.setStrokeStyle(3, 0xffffff);

    const label = this.add.text(0, 0, 'Breed!', {
      font: 'bold 24px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.breedButton.add([bg, label]);
    this.breedButton.bg = bg;
    this.breedButton.label = label;

    this.breedButton.setInteractive(
      new Phaser.Geom.Rectangle(-100, -30, 200, 60),
      Phaser.Geom.Rectangle.Contains
    );

    this.breedButton.on('pointerover', () => {
      if (this.canBreed()) {
        bg.setFillStyle(0x66BB6A);
        this.game.canvas.style.cursor = 'pointer';
      }
    });

    this.breedButton.on('pointerout', () => {
      bg.setFillStyle(this.canBreed() ? 0x4CAF50 : 0x888888);
      this.game.canvas.style.cursor = 'default';
    });

    this.breedButton.on('pointerdown', () => {
      this.attemptBreeding();
    });

    this.updateBreedButton();
  }

  /**
   * Display available dogs for selection
   */
  displayAvailableDogs() {
    const gameState = this.registry.get('gameState');
    const dogs = gameState.getAllDogs();

    if (dogs.length === 0) {
      const { width } = this.cameras.main;
      this.add.text(width / 2, 400, 'No dogs available!\n\nVisit the shop to buy dogs.', {
        font: '20px Arial',
        fill: '#ffffff',
        align: 'center'
      }).setOrigin(0.5);
      return;
    }

    if (dogs.length < 2) {
      const { width } = this.cameras.main;
      this.add.text(width / 2, 400, 'Need at least 2 dogs to breed!\n\nVisit the shop to buy more.', {
        font: '20px Arial',
        fill: '#ffffff',
        align: 'center'
      }).setOrigin(0.5);
    }

    // Note: For simplicity, we'll use the parent selection slots
    // In a full implementation, you'd show a scrollable list of all dogs
    this.instructionText.setText('Click a parent slot above, then select a dog from your kennel');
  }

  /**
   * Select a parent (called from GameScene or via dialog)
   * This is a simplified version - in full implementation,
   * you'd open a dog selection modal
   */
  selectParent(parentSlot) {
    const gameState = this.registry.get('gameState');
    const dogs = gameState.getAllDogs();

    if (dogs.length === 0) return;

    // For now, just cycle through available dogs
    // In full implementation, show selection UI
    const currentIndex = dogs.findIndex(d =>
      d.id === (parentSlot === 1 ? this.selectedParent1?.id : this.selectedParent2?.id)
    );

    const nextIndex = (currentIndex + 1) % dogs.length;
    const selectedDog = dogs[nextIndex];

    if (parentSlot === 1) {
      this.selectedParent1 = selectedDog;
      this.updateParentDisplay(this.parent1Container, selectedDog);
    } else {
      this.selectedParent2 = selectedDog;
      this.updateParentDisplay(this.parent2Container, selectedDog);
    }

    this.updatePreview();
    this.updateBreedButton();
  }

  /**
   * Update parent display
   */
  updateParentDisplay(container, dog) {
    // Remove empty text
    if (container.emptyText) {
      container.emptyText.destroy();
      container.emptyText = null;
    }

    // Remove previous dog display
    container.list.forEach(obj => {
      if (obj.dogData) {
        obj.destroy();
      }
    });

    // Add dog display
    const sprite = this.add.circle(0, -20, 40, 0x8B4513);
    sprite.dogData = true;

    const nameText = this.add.text(0, 40, dog.name, {
      font: '16px Arial',
      fill: '#ffffff',
      wordWrap: { width: 180 }
    }).setOrigin(0.5);
    nameText.dogData = true;

    const rarityText = this.add.text(0, 60, dog.getRarityName(), {
      font: '14px Arial',
      fill: '#FFD700'
    }).setOrigin(0.5);
    rarityText.dogData = true;

    const genText = this.add.text(0, 75, `Gen ${dog.generation}`, {
      font: '12px Arial',
      fill: '#CCCCCC'
    }).setOrigin(0.5);
    genText.dogData = true;

    container.add([sprite, nameText, rarityText, genText]);
  }

  /**
   * Update breeding preview
   */
  updatePreview() {
    if (!this.selectedParent1 || !this.selectedParent2) {
      this.previewText.setText('Select two dogs to see breeding preview');
      return;
    }

    const preview = BreedingSystem.getBreedingPreview(
      this.selectedParent1,
      this.selectedParent2
    );

    const text = `Cost: ${formatNumber(preview.cost)} gold
Expected Generation: ${preview.expectedGeneration}
Example Name: ${preview.exampleName}

Rarity Chances:
  ${(preview.rarityDistribution.floor.probability * 100).toFixed(0)}% - Tier ${preview.rarityDistribution.floor.tier}
  ${(preview.rarityDistribution.plusOne.probability * 100).toFixed(0)}% - Tier ${preview.rarityDistribution.plusOne.tier}
  ${(preview.rarityDistribution.plusTwo.probability * 100).toFixed(0)}% - Tier ${preview.rarityDistribution.plusTwo.tier}`;

    this.previewText.setText(text);
  }

  /**
   * Update breed button state
   */
  updateBreedButton() {
    const canBreed = this.canBreed();

    this.breedButton.bg.setFillStyle(canBreed ? 0x4CAF50 : 0x888888);
    this.breedButton.label.setColor(canBreed ? '#ffffff' : '#666666');

    if (!canBreed) {
      const gameState = this.registry.get('gameState');
      if (this.selectedParent1 && this.selectedParent2) {
        const validation = BreedingSystem.canBreed(
          this.selectedParent1,
          this.selectedParent2,
          gameState
        );
        this.breedButton.label.setText(validation.reason);
      } else {
        this.breedButton.label.setText('Select Parents');
      }
    } else {
      this.breedButton.label.setText('Breed!');
    }
  }

  /**
   * Check if can breed
   */
  canBreed() {
    if (!this.selectedParent1 || !this.selectedParent2) {
      return false;
    }

    const gameState = this.registry.get('gameState');
    const validation = BreedingSystem.canBreed(
      this.selectedParent1,
      this.selectedParent2,
      gameState
    );

    return validation.canBreed;
  }

  /**
   * Attempt breeding
   */
  attemptBreeding() {
    if (!this.canBreed()) {
      return;
    }

    const gameState = this.registry.get('gameState');

    const result = BreedingSystem.breedDogs(
      this.selectedParent1,
      this.selectedParent2,
      gameState
    );

    if (result.success) {
      // Update registry
      this.registry.set('gold', gameState.player.gold);

      // Update UI
      const uiScene = this.scene.get('UIScene');
      if (uiScene && uiScene.updateKennelUsage) {
        const usage = gameState.getKennelUsage();
        uiScene.updateKennelUsage(usage.current, usage.max);
      }

      // Show success message
      this.showBreedingResult(result.offspring);

      // Reset selection
      this.selectedParent1 = null;
      this.selectedParent2 = null;
      this.scene.restart();
    } else {
      // Show error
      this.showMessage(result.message, 0xFF5252);
    }
  }

  /**
   * Show breeding result
   */
  showBreedingResult(offspring) {
    const { width, height } = this.cameras.main;

    // Modal background
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.8);
    overlay.setOrigin(0);
    overlay.setInteractive();

    // Panel
    const panel = this.add.rectangle(width / 2, height / 2, 500, 400, 0x222222);
    panel.setStrokeStyle(4, 0xFFD700);

    // Title
    const title = this.add.text(width / 2, height / 2 - 150, '🎉 New Dog Born! 🎉', {
      font: 'bold 32px Arial',
      fill: '#FFD700'
    }).setOrigin(0.5);

    // Sprite
    const sprite = this.add.circle(width / 2, height / 2 - 60, 60, 0x8B4513);

    // Info
    const info = `Name: ${offspring.name}
Rarity: ${offspring.getRarityName()}
Generation: ${offspring.generation}
Body: ${offspring.genes.bodyType}
Temperament: ${offspring.genes.temperament}
${offspring.hasSpecialTrait() ? `Special Trait: ${offspring.genes.specialTrait}` : ''}`;

    const infoText = this.add.text(width / 2, height / 2 + 50, info, {
      font: '18px Arial',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    // Close button
    const closeBtn = this.add.text(width / 2, height / 2 + 150, 'Awesome!', {
      font: 'bold 24px Arial',
      fill: '#ffffff',
      backgroundColor: '#4CAF50',
      padding: { x: 30, y: 15 }
    }).setOrigin(0.5).setInteractive();

    closeBtn.on('pointerdown', () => {
      overlay.destroy();
      panel.destroy();
      title.destroy();
      sprite.destroy();
      infoText.destroy();
      closeBtn.destroy();
    });

    // Animate sprite
    this.tweens.add({
      targets: sprite,
      scale: { from: 0, to: 1 },
      duration: 500,
      ease: 'Back.easeOut'
    });
  }

  /**
   * Show message
   */
  showMessage(message, color) {
    const uiScene = this.scene.get('UIScene');
    if (uiScene && uiScene.showNotification) {
      uiScene.showNotification(message, color);
    }
  }
}

export default BreedingScene;
