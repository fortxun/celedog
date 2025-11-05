/**
 * Breeding System Orchestrator
 * Coordinates breeding operations between all systems
 */

import GeneticSystem from './GeneticSystem.js';
import RaritySystem from './RaritySystem.js';
import EconomySystem from './EconomySystem.js';
import NameGenerator from './NameGenerator.js';
import CelebrityDog from '../entities/CelebrityDog.js';

class BreedingSystem {
  /**
   * Breed two parent dogs to create offspring
   * @param {CelebrityDog} parent1 - First parent
   * @param {CelebrityDog} parent2 - Second parent
   * @param {Object} gameState - Game state object
   * @returns {{success: boolean, offspring: CelebrityDog|null, message: string, cost: number}} Breeding result
   */
  static breedDogs(parent1, parent2, gameState) {
    // Validate parents
    if (!parent1 || !parent2) {
      return {
        success: false,
        offspring: null,
        message: 'Invalid parents selected.',
        cost: 0
      };
    }

    // Check if same dog
    if (parent1.id === parent2.id) {
      return {
        success: false,
        offspring: null,
        message: 'Cannot breed a dog with itself!',
        cost: 0
      };
    }

    // Calculate breeding cost
    const cost = EconomySystem.calculateBreedingCost(parent1, parent2);

    // Check if player can afford
    if (!EconomySystem.canAfford(gameState, cost)) {
      return {
        success: false,
        offspring: null,
        message: `Insufficient funds. Need ${cost} gold, have ${gameState.player.gold}.`,
        cost
      };
    }

    // Check kennel capacity
    if (gameState.isKennelFull()) {
      return {
        success: false,
        offspring: null,
        message: 'Kennel is full! Sell some dogs to make space.',
        cost
      };
    }

    // Deduct breeding cost
    const transaction = EconomySystem.processPurchase(gameState, cost);
    if (!transaction.success) {
      return {
        success: false,
        offspring: null,
        message: transaction.message,
        cost
      };
    }

    // Generate offspring genes
    const offspringGenes = GeneticSystem.breed(parent1.genes, parent2.genes);

    // Calculate offspring generation
    const offspringGeneration = Math.max(parent1.generation, parent2.generation) + 1;

    // Generate name
    const offspringName = NameGenerator.generateName(
      parent1.name,
      parent2.name,
      offspringGenes
    );

    // Create offspring
    const offspring = new CelebrityDog(
      offspringGenes,
      offspringGeneration,
      [parent1.id, parent2.id],
      offspringName
    );

    // Calculate rarity
    offspring.rarity = RaritySystem.calculateRarity(
      parent1.rarity,
      parent2.rarity,
      offspringGenes
    );

    // Recalculate value based on rarity
    offspring.value = offspring.calculateValue();

    // Add to game state
    const added = gameState.addDog(offspring);

    if (!added) {
      // Refund if couldn't add (shouldn't happen, but just in case)
      gameState.player.gold += cost;
      return {
        success: false,
        offspring: null,
        message: 'Failed to add offspring to kennel.',
        cost
      };
    }

    // Update stats
    gameState.stats.totalBreeds++;
    gameState.stats.rarityBreeds[offspring.rarity]++;

    if (offspring.generation > gameState.stats.highestGeneration) {
      gameState.stats.highestGeneration = offspring.generation;
    }

    // Return success
    return {
      success: true,
      offspring,
      message: `${offspring.name} was born! ${cost} gold spent.`,
      cost
    };
  }

  /**
   * Validate if two dogs can breed
   * @param {CelebrityDog} parent1 - First parent
   * @param {CelebrityDog} parent2 - Second parent
   * @param {Object} gameState - Game state object
   * @returns {{canBreed: boolean, reason: string}} Validation result
   */
  static canBreed(parent1, parent2, gameState) {
    if (!parent1 || !parent2) {
      return { canBreed: false, reason: 'Invalid parents' };
    }

    if (parent1.id === parent2.id) {
      return { canBreed: false, reason: 'Cannot breed with self' };
    }

    const cost = EconomySystem.calculateBreedingCost(parent1, parent2);
    if (!EconomySystem.canAfford(gameState, cost)) {
      return { canBreed: false, reason: `Need ${cost} gold` };
    }

    if (gameState.isKennelFull()) {
      return { canBreed: false, reason: 'Kennel is full' };
    }

    return { canBreed: true, reason: 'Ready to breed' };
  }

  /**
   * Get breeding preview information
   * @param {CelebrityDog} parent1 - First parent
   * @param {CelebrityDog} parent2 - Second parent
   * @returns {Object} Preview data
   */
  static getBreedingPreview(parent1, parent2) {
    if (!parent1 || !parent2) {
      return null;
    }

    const cost = EconomySystem.calculateBreedingCost(parent1, parent2);
    const expectedGeneration = Math.max(parent1.generation, parent2.generation) + 1;

    // Calculate expected rarity distribution
    const distribution = RaritySystem.getExpectedDistribution(
      parent1.rarity,
      parent2.rarity,
      false, // Don't know if special trait yet
      false  // Don't know if high influence yet
    );

    return {
      cost,
      expectedGeneration,
      rarityDistribution: distribution,
      parentNames: [parent1.name, parent2.name],
      exampleName: NameGenerator.createPortmanteau(parent1.name, parent2.name)
    };
  }

  /**
   * Get breeding statistics for a dog
   * @param {string} dogId - Dog ID
   * @param {Object} gameState - Game state object
   * @returns {Object} Breeding stats
   */
  static getDogBreedingStats(dogId, gameState) {
    const lineage = gameState.getLineage(dogId);

    if (!lineage) {
      return {
        timesParent: 0,
        offspring: []
      };
    }

    return {
      timesParent: lineage.children.length,
      offspring: lineage.children.map(childId => gameState.getDog(childId)).filter(Boolean)
    };
  }
}

export default BreedingSystem;
