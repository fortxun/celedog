/**
 * DogSprite - Interactive dog sprite component
 * Combines ProceduralDogGenerator with hover effects and click handling
 */

import Phaser from 'phaser';
import ProceduralDogGenerator from '../systems/ProceduralDogGenerator.js';

class DogSprite extends Phaser.GameObjects.Container {
  /**
   * Create a dog sprite component
   * @param {Phaser.Scene} scene - Scene
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {CelebrityDog} dog - Dog entity
   * @param {Object} config - Configuration options
   */
  constructor(scene, x, y, dog, config = {}) {
    super(scene, x, y);

    this.dog = dog;
    this.config = {
      size: 100,
      showName: true,
      showRarity: true,
      interactive: true,
      hoverScale: 1.1,
      clickCallback: null,
      ...config
    };

    this.createSprite();
    this.createLabels();

    if (this.config.interactive) {
      this.makeInteractive();
    }

    scene.add.existing(this);
  }

  /**
   * Create the dog sprite visual
   */
  createSprite() {
    // Generate procedural sprite
    const textureKey = ProceduralDogGenerator.generateAndCacheTexture(
      this.scene,
      this.dog.id,
      this.dog.genes,
      this.config.size
    );

    this.sprite = this.scene.add.image(0, 0, textureKey);
    this.sprite.setOrigin(0.5);

    // Add glow effect for special traits
    if (this.dog.hasSpecialTrait()) {
      this.addGlowEffect();
    }

    this.add(this.sprite);
  }

  /**
   * Create text labels (name, rarity)
   */
  createLabels() {
    if (this.config.showName) {
      this.nameText = this.scene.add.text(0, this.config.size * 0.6, this.dog.name, {
        font: 'bold 14px Arial',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
        align: 'center',
        wordWrap: { width: this.config.size * 1.5 }
      }).setOrigin(0.5);

      this.add(this.nameText);
    }

    if (this.config.showRarity) {
      const rarityColors = {
        1: '#888888', // Common
        2: '#4CAF50', // Uncommon
        3: '#2196F3', // Rare
        4: '#9C27B0', // Epic
        5: '#FF9800'  // Legendary
      };

      this.rarityText = this.scene.add.text(0, this.config.size * 0.75, this.dog.getRarityName(), {
        font: '12px Arial',
        fill: rarityColors[this.dog.rarity] || '#888888',
        stroke: '#000000',
        strokeThickness: 2,
        align: 'center'
      }).setOrigin(0.5);

      this.add(this.rarityText);
    }
  }

  /**
   * Add glow effect for special dogs
   */
  addGlowEffect() {
    // Create pulsing glow circle
    this.glowCircle = this.scene.add.circle(0, 0, this.config.size * 0.6, 0xFFD700, 0.2);
    this.add(this.glowCircle);
    this.sendToBack(this.glowCircle);

    // Pulse animation
    this.scene.tweens.add({
      targets: this.glowCircle,
      scaleX: 1.2,
      scaleY: 1.2,
      alpha: 0.4,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });
  }

  /**
   * Make sprite interactive
   */
  makeInteractive() {
    const bounds = new Phaser.Geom.Rectangle(
      -this.config.size / 2,
      -this.config.size / 2,
      this.config.size,
      this.config.size
    );

    this.setInteractive(bounds, Phaser.Geom.Rectangle.Contains);

    this.on('pointerover', () => {
      this.onHoverStart();
    });

    this.on('pointerout', () => {
      this.onHoverEnd();
    });

    this.on('pointerdown', () => {
      this.onClick();
    });
  }

  /**
   * Handle hover start
   */
  onHoverStart() {
    this.scene.tweens.add({
      targets: this,
      scale: this.config.hoverScale,
      duration: 150,
      ease: 'Back.easeOut'
    });

    if (this.scene.game.canvas) {
      this.scene.game.canvas.style.cursor = 'pointer';
    }
  }

  /**
   * Handle hover end
   */
  onHoverEnd() {
    this.scene.tweens.add({
      targets: this,
      scale: 1,
      duration: 150,
      ease: 'Back.easeIn'
    });

    if (this.scene.game.canvas) {
      this.scene.game.canvas.style.cursor = 'default';
    }
  }

  /**
   * Handle click
   */
  onClick() {
    // Quick scale bounce
    this.scene.tweens.add({
      targets: this,
      scale: 0.95,
      duration: 100,
      yoyo: true,
      ease: 'Quad.easeInOut'
    });

    // Call callback if provided
    if (this.config.clickCallback) {
      this.config.clickCallback(this.dog);
    }
  }

  /**
   * Update dog data (for when dog is bred/modified)
   */
  updateDog(dog) {
    this.dog = dog;

    // Remove old sprite
    if (this.sprite) {
      this.sprite.destroy();
    }

    // Clear cached texture
    ProceduralDogGenerator.clearCachedTexture(this.scene, this.dog.id);

    // Recreate sprite
    this.createSprite();

    // Update labels
    if (this.nameText) {
      this.nameText.setText(this.dog.name);
    }

    if (this.rarityText) {
      this.rarityText.setText(this.dog.getRarityName());
    }
  }

  /**
   * Play birth animation (for newly bred dogs)
   */
  playBirthAnimation(callback) {
    this.setScale(0);
    this.setAlpha(0);

    this.scene.tweens.add({
      targets: this,
      scale: 1,
      alpha: 1,
      duration: 500,
      ease: 'Back.easeOut',
      onComplete: () => {
        if (callback) callback();
      }
    });
  }

  /**
   * Play removal animation (for when dog is sold)
   */
  playRemovalAnimation(callback) {
    this.scene.tweens.add({
      targets: this,
      scale: 0,
      alpha: 0,
      duration: 300,
      ease: 'Back.easeIn',
      onComplete: () => {
        this.destroy();
        if (callback) callback();
      }
    });
  }

  /**
   * Highlight sprite (for selection)
   */
  highlight(color = 0xFFD700) {
    if (this.highlightCircle) {
      this.highlightCircle.destroy();
    }

    this.highlightCircle = this.scene.add.circle(0, 0, this.config.size * 0.55, color, 0);
    this.highlightCircle.setStrokeStyle(4, color, 1);
    this.add(this.highlightCircle);
    this.sendToBack(this.highlightCircle);
  }

  /**
   * Remove highlight
   */
  removeHighlight() {
    if (this.highlightCircle) {
      this.highlightCircle.destroy();
      this.highlightCircle = null;
    }
  }

  /**
   * Clean up
   */
  destroy(fromScene) {
    // Clean up cached texture
    ProceduralDogGenerator.clearCachedTexture(this.scene, this.dog.id);

    super.destroy(fromScene);
  }
}

export default DogSprite;
