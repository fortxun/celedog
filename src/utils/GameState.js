/**
 * Global game state manager
 * Manages player data, owned dogs, and game settings
 */

import { ECONOMY, KENNEL } from './constants.js';

class GameState {
  constructor() {
    this.reset();
  }

  /**
   * Reset game state to defaults
   */
  reset() {
    this.player = {
      gold: ECONOMY.STARTING_GOLD,
      kennelCapacity: KENNEL.DEFAULT_CAPACITY,
      expansionLevel: 0
    };

    this.dogs = new Map(); // dogId -> CelebrityDog
    this.lineage = new Map(); // dogId -> {parents: [], children: []}

    this.settings = {
      soundEnabled: true,
      musicEnabled: true,
      tutorialCompleted: false
    };

    this.stats = {
      totalBreeds: 0,
      totalSold: 0,
      highestGeneration: 0,
      rarityBreeds: {
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0
      }
    };
  }

  /**
   * Add gold to player
   * @param {number} amount - Amount to add
   */
  addGold(amount) {
    this.player.gold += amount;
  }

  /**
   * Deduct gold from player
   * @param {number} amount - Amount to deduct
   * @returns {boolean} True if successful
   */
  spendGold(amount) {
    if (this.player.gold >= amount) {
      this.player.gold -= amount;
      return true;
    }
    return false;
  }

  /**
   * Add a dog to the kennel
   * @param {CelebrityDog} dog - Dog to add
   * @returns {boolean} True if added successfully
   */
  addDog(dog) {
    if (this.dogs.size >= this.player.kennelCapacity) {
      return false;
    }

    this.dogs.set(dog.id, dog);

    // Initialize lineage entry
    this.lineage.set(dog.id, {
      parents: dog.parentIds || [],
      children: []
    });

    // Update parent lineage entries
    if (dog.parentIds && dog.parentIds.length > 0) {
      dog.parentIds.forEach(parentId => {
        const parentLineage = this.lineage.get(parentId);
        if (parentLineage) {
          parentLineage.children.push(dog.id);
        }
      });
    }

    // Update stats
    if (dog.generation > this.stats.highestGeneration) {
      this.stats.highestGeneration = dog.generation;
    }

    return true;
  }

  /**
   * Remove a dog from the kennel
   * @param {string} dogId - ID of dog to remove
   * @returns {boolean} True if removed successfully
   */
  removeDog(dogId) {
    return this.dogs.delete(dogId);
  }

  /**
   * Get a dog by ID
   * @param {string} dogId - ID of dog
   * @returns {CelebrityDog|undefined} Dog or undefined
   */
  getDog(dogId) {
    return this.dogs.get(dogId);
  }

  /**
   * Get all owned dogs as array
   * @returns {Array<CelebrityDog>} Array of dogs
   */
  getAllDogs() {
    return Array.from(this.dogs.values());
  }

  /**
   * Get lineage information for a dog
   * @param {string} dogId - ID of dog
   * @returns {Object|undefined} Lineage data
   */
  getLineage(dogId) {
    return this.lineage.get(dogId);
  }

  /**
   * Check if kennel is full
   * @returns {boolean} True if full
   */
  isKennelFull() {
    return this.dogs.size >= this.player.kennelCapacity;
  }

  /**
   * Get kennel usage
   * @returns {{current: number, max: number}} Current and max capacity
   */
  getKennelUsage() {
    return {
      current: this.dogs.size,
      max: this.player.kennelCapacity
    };
  }

  /**
   * Serialize game state for saving
   * @returns {Object} Serialized state
   */
  serialize() {
    return {
      player: { ...this.player },
      dogs: Array.from(this.dogs.entries()).map(([id, dog]) => [id, dog.serialize()]),
      lineage: Array.from(this.lineage.entries()),
      settings: { ...this.settings },
      stats: { ...this.stats }
    };
  }

  /**
   * Deserialize game state from saved data
   * @param {Object} data - Saved state data
   * @param {Function} dogDeserializer - Function to deserialize dog data
   */
  deserialize(data, dogDeserializer) {
    this.player = { ...data.player };

    this.dogs = new Map(
      data.dogs.map(([id, dogData]) => [id, dogDeserializer(dogData)])
    );

    this.lineage = new Map(data.lineage);
    this.settings = { ...data.settings };
    this.stats = { ...data.stats };
  }
}

// Singleton instance
const gameState = new GameState();

export default gameState;
