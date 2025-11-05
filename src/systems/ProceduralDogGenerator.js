/**
 * ProceduralDogGenerator - Generate unique dog sprites using RenderTexture
 * Composites layers (body, ears, tail, markings, celebrity head) into single texture
 */

import Phaser from 'phaser';

class ProceduralDogGenerator {
  /**
   * Generate a unique dog sprite from genes
   * @param {Phaser.Scene} scene - Phaser scene to create RenderTexture in
   * @param {Object} genes - Dog genes
   * @param {number} size - Size of the sprite (default 100)
   * @returns {Phaser.GameObjects.RenderTexture} Generated dog sprite
   */
  static generateDogSprite(scene, genes, size = 100) {
    const rt = scene.add.renderTexture(0, 0, size, size);

    // Create graphics for drawing
    const graphics = scene.make.graphics({ add: false });

    // Draw body
    this.drawBody(graphics, genes, size);

    // Draw ears
    this.drawEars(graphics, genes, size);

    // Draw tail
    this.drawTail(graphics, genes, size);

    // Draw markings
    this.drawMarkings(graphics, genes, size);

    // Draw celebrity head indicator
    this.drawCelebrityHead(graphics, genes, size);

    // Render graphics to texture
    rt.draw(graphics);
    graphics.destroy();

    return rt;
  }

  /**
   * Draw dog body based on bodyType gene
   */
  static drawBody(graphics, genes, size) {
    const centerX = size / 2;
    const centerY = size / 2;

    // Parse coat color
    const coatColor = parseInt(genes.coatColor.replace('#', '0x'), 16);

    graphics.fillStyle(coatColor, 1);

    switch (genes.bodyType) {
      case 'athletic':
        // Muscular oval body
        graphics.fillEllipse(centerX, centerY, size * 0.5, size * 0.6);
        break;

      case 'slim':
        // Slender narrow body
        graphics.fillEllipse(centerX, centerY, size * 0.4, size * 0.65);
        break;

      case 'stocky':
        // Wide, sturdy body
        graphics.fillEllipse(centerX, centerY, size * 0.6, size * 0.55);
        break;

      case 'fluffy':
        // Large, round body
        graphics.fillCircle(centerX, centerY, size * 0.35);
        break;

      default:
        // Default round body
        graphics.fillCircle(centerX, centerY, size * 0.3);
    }
  }

  /**
   * Draw ears based on earType gene
   */
  static drawEars(graphics, genes, size) {
    const centerX = size / 2;
    const centerY = size / 2;

    const coatColor = parseInt(genes.coatColor.replace('#', '0x'), 16);
    graphics.fillStyle(coatColor, 1);

    switch (genes.earType) {
      case 'pointed':
        // Triangular pointed ears
        graphics.fillTriangle(
          centerX - size * 0.25, centerY - size * 0.3,
          centerX - size * 0.35, centerY - size * 0.5,
          centerX - size * 0.15, centerY - size * 0.35
        );
        graphics.fillTriangle(
          centerX + size * 0.25, centerY - size * 0.3,
          centerX + size * 0.15, centerY - size * 0.35,
          centerX + size * 0.35, centerY - size * 0.5
        );
        break;

      case 'floppy':
        // Droopy round ears
        graphics.fillEllipse(centerX - size * 0.28, centerY - size * 0.1, size * 0.15, size * 0.25);
        graphics.fillEllipse(centerX + size * 0.28, centerY - size * 0.1, size * 0.15, size * 0.25);
        break;

      case 'large':
        // Big round ears
        graphics.fillCircle(centerX - size * 0.3, centerY - size * 0.25, size * 0.15);
        graphics.fillCircle(centerX + size * 0.3, centerY - size * 0.25, size * 0.15);
        break;

      case 'small':
        // Tiny ears
        graphics.fillCircle(centerX - size * 0.25, centerY - size * 0.3, size * 0.08);
        graphics.fillCircle(centerX + size * 0.25, centerY - size * 0.3, size * 0.08);
        break;

      default:
        // Default medium ears
        graphics.fillCircle(centerX - size * 0.27, centerY - size * 0.27, size * 0.12);
        graphics.fillCircle(centerX + size * 0.27, centerY - size * 0.27, size * 0.12);
    }
  }

  /**
   * Draw tail based on tailType gene
   */
  static drawTail(graphics, genes, size) {
    const centerX = size / 2;
    const centerY = size / 2;

    const coatColor = parseInt(genes.coatColor.replace('#', '0x'), 16);
    graphics.fillStyle(coatColor, 1);

    switch (genes.tailType) {
      case 'straight':
        // Long straight tail
        graphics.fillRect(centerX - size * 0.35, centerY + size * 0.15, size * 0.1, size * 0.3);
        break;

      case 'curly':
        // Curled tail (circle)
        graphics.fillCircle(centerX - size * 0.35, centerY + size * 0.2, size * 0.12);
        break;

      case 'bushy':
        // Fluffy tail (larger rectangle)
        graphics.fillRect(centerX - size * 0.4, centerY + size * 0.1, size * 0.15, size * 0.35);
        break;

      case 'short':
        // Stubby tail
        graphics.fillRect(centerX - size * 0.35, centerY + size * 0.2, size * 0.08, size * 0.15);
        break;

      default:
        // Default medium tail
        graphics.fillRect(centerX - size * 0.35, centerY + size * 0.15, size * 0.1, size * 0.25);
    }
  }

  /**
   * Draw markings based on markingPattern gene
   */
  static drawMarkings(graphics, genes, size) {
    const centerX = size / 2;
    const centerY = size / 2;

    if (genes.markingPattern === 'solid') {
      return; // No markings
    }

    const markingColor = parseInt(genes.markingColor.replace('#', '0x'), 16);
    graphics.fillStyle(markingColor, 0.7);

    switch (genes.markingPattern) {
      case 'spotted':
        // Random spots
        graphics.fillCircle(centerX + size * 0.1, centerY - size * 0.1, size * 0.08);
        graphics.fillCircle(centerX - size * 0.15, centerY + size * 0.05, size * 0.06);
        graphics.fillCircle(centerX + size * 0.05, centerY + size * 0.15, size * 0.07);
        break;

      case 'striped':
        // Horizontal stripes
        graphics.fillRect(centerX - size * 0.25, centerY - size * 0.15, size * 0.5, size * 0.08);
        graphics.fillRect(centerX - size * 0.25, centerY + size * 0.05, size * 0.5, size * 0.08);
        break;

      case 'patched':
        // Large patch on side
        graphics.fillEllipse(centerX + size * 0.15, centerY, size * 0.2, size * 0.3);
        break;

      default:
        // No markings
        break;
    }
  }

  /**
   * Draw celebrity head indicator (crown/star for high influence)
   */
  static drawCelebrityHead(graphics, genes, size) {
    const centerX = size / 2;
    const centerY = size / 2;

    if (genes.celebrityInfluence > 0.7) {
      // Draw golden crown/star for high celebrity influence
      graphics.fillStyle(0xFFD700, 1);
      graphics.lineStyle(2, 0xFFFFFF, 1);

      // Simple star shape
      const starSize = size * 0.12;
      const starX = centerX;
      const starY = centerY - size * 0.4;

      // 5-pointed star
      const points = [];
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const radius = i % 2 === 0 ? starSize : starSize * 0.5;
        points.push(starX + Math.cos(angle) * radius);
        points.push(starY + Math.sin(angle) * radius);
      }

      graphics.fillPoints(points, true);
      graphics.strokePoints(points, true);
    }
  }

  /**
   * Generate and cache a dog sprite texture with a unique key
   * @param {Phaser.Scene} scene - Phaser scene
   * @param {string} dogId - Unique dog ID
   * @param {Object} genes - Dog genes
   * @param {number} size - Sprite size
   * @returns {string} Texture key
   */
  static generateAndCacheTexture(scene, dogId, genes, size = 100) {
    const textureKey = `dog_${dogId}`;

    // Check if already cached
    if (scene.textures.exists(textureKey)) {
      return textureKey;
    }

    // Generate sprite
    const rt = this.generateDogSprite(scene, genes, size);

    // Save as texture
    rt.saveTexture(textureKey);

    // Clean up RenderTexture (we've saved it to texture cache)
    rt.destroy();

    return textureKey;
  }

  /**
   * Create a Phaser Image from dog genes
   * @param {Phaser.Scene} scene - Phaser scene
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {string} dogId - Dog ID
   * @param {Object} genes - Dog genes
   * @param {number} size - Sprite size
   * @returns {Phaser.GameObjects.Image} Dog sprite image
   */
  static createDogImage(scene, x, y, dogId, genes, size = 100) {
    const textureKey = this.generateAndCacheTexture(scene, dogId, genes, size);
    return scene.add.image(x, y, textureKey);
  }

  /**
   * Clear cached texture for a dog
   * @param {Phaser.Scene} scene - Phaser scene
   * @param {string} dogId - Dog ID
   */
  static clearCachedTexture(scene, dogId) {
    const textureKey = `dog_${dogId}`;
    if (scene.textures.exists(textureKey)) {
      scene.textures.remove(textureKey);
    }
  }

  /**
   * Batch generate textures for multiple dogs (for preloading)
   * @param {Phaser.Scene} scene - Phaser scene
   * @param {Array<Object>} dogs - Array of dogs with id and genes
   * @param {number} size - Sprite size
   */
  static batchGenerate(scene, dogs, size = 100) {
    dogs.forEach(dog => {
      this.generateAndCacheTexture(scene, dog.id, dog.genes, size);
    });
  }
}

export default ProceduralDogGenerator;
