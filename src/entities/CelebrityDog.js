/**
 * CelebrityDog entity class
 * Represents a dog with genes, rarity, and metadata
 */

import { generateUUID, validateGenes } from '../utils/helpers.js';
import { ECONOMY, RARITY_NAMES } from '../utils/constants.js';

class CelebrityDog {
  /**
   * Create a new CelebrityDog
   * @param {Object} genes - Dog's genetic traits
   * @param {number} generation - Generation number (0 for starters)
   * @param {Array<string>} parentIds - Array of parent dog IDs
   * @param {string} name - Dog's name
   */
  constructor(genes, generation = 0, parentIds = [], name = '') {
    if (!validateGenes(genes)) {
      throw new Error('Invalid genes structure');
    }

    this.id = generateUUID();
    this.genes = { ...genes };
    this.generation = generation;
    this.parentIds = [...parentIds];
    this.birthTime = Date.now();
    this.name = name;

    // Calculate derived properties
    this.rarity = this.calculateRarity();
    this.value = this.calculateValue();
  }

  /**
   * Calculate dog's rarity based on genes
   * Note: This is a placeholder. Actual calculation done by RaritySystem
   * @returns {number} Rarity tier (1-5)
   */
  calculateRarity() {
    // Default to common for now
    // Will be overridden by RaritySystem during breeding
    return 1;
  }

  /**
   * Calculate dog's monetary value
   * @returns {number} Value in gold
   */
  calculateValue() {
    return ECONOMY.PURCHASE_PRICES[this.rarity] || 500;
  }

  /**
   * Get dog's age in milliseconds
   * @returns {number} Age in milliseconds
   */
  getAge() {
    return Date.now() - this.birthTime;
  }

  /**
   * Get dog's age in human-readable format
   * @returns {string} Age string (e.g., "5m", "2h", "3d")
   */
  getAgeString() {
    const seconds = Math.floor(this.getAge() / 1000);

    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  }

  /**
   * Get rarity name
   * @returns {string} Rarity name (e.g., "Common", "Legendary")
   */
  getRarityName() {
    return RARITY_NAMES[this.rarity] || 'Unknown';
  }

  /**
   * Get sell value (50% of purchase value)
   * @returns {number} Sell value in gold
   */
  getSellValue() {
    return Math.floor(this.value * ECONOMY.SELL_MULTIPLIER);
  }

  /**
   * Check if dog has parents
   * @returns {boolean} True if dog has parents
   */
  hasParents() {
    return this.parentIds.length > 0;
  }

  /**
   * Check if dog has a special trait
   * @returns {boolean} True if dog has special trait
   */
  hasSpecialTrait() {
    return this.genes.specialTrait !== null && this.genes.specialTrait !== undefined;
  }

  /**
   * Serialize dog data for saving
   * @returns {Object} Serialized dog data
   */
  serialize() {
    return {
      id: this.id,
      genes: { ...this.genes },
      generation: this.generation,
      parentIds: [...this.parentIds],
      birthTime: this.birthTime,
      name: this.name,
      rarity: this.rarity,
      value: this.value
    };
  }

  /**
   * Deserialize dog data from saved state
   * @param {Object} data - Serialized dog data
   * @returns {CelebrityDog} Restored dog instance
   */
  static deserialize(data) {
    const dog = new CelebrityDog(
      data.genes,
      data.generation,
      data.parentIds,
      data.name
    );

    // Restore exact state
    dog.id = data.id;
    dog.birthTime = data.birthTime;
    dog.rarity = data.rarity;
    dog.value = data.value;

    return dog;
  }

  /**
   * Create a starter dog with predefined traits
   * @param {Object} config - Starter dog configuration
   * @returns {CelebrityDog} New starter dog
   */
  static createStarter(config) {
    const dog = new CelebrityDog(
      config.genes,
      0, // Generation 0
      [], // No parents
      config.name
    );

    // Set rarity for starter dogs
    if (config.rarity) {
      dog.rarity = config.rarity;
      dog.value = dog.calculateValue();
    }

    return dog;
  }

  /**
   * Get a summary of the dog for display
   * @returns {Object} Summary data
   */
  getSummary() {
    return {
      id: this.id,
      name: this.name,
      rarity: this.getRarityName(),
      generation: this.generation,
      age: this.getAgeString(),
      value: this.value,
      sellValue: this.getSellValue(),
      hasParents: this.hasParents(),
      hasSpecialTrait: this.hasSpecialTrait(),
      bodyType: this.genes.bodyType,
      temperament: this.genes.temperament,
      talent: this.genes.talent
    };
  }
}

export default CelebrityDog;
