/**
 * Economy System
 * Handles pricing, transactions, and economic calculations
 */

import { ECONOMY } from '../utils/constants.js';

class EconomySystem {
  /**
   * Calculate breeding cost based on parents
   * Formula: base * rarityMultiplier * (1 + avgGen * generationBonus)
   * @param {CelebrityDog} parent1 - First parent
   * @param {CelebrityDog} parent2 - Second parent
   * @returns {number} Breeding cost in gold
   */
  static calculateBreedingCost(parent1, parent2) {
    const avgRarity = (parent1.rarity + parent2.rarity) / 2;
    const avgGeneration = (parent1.generation + parent2.generation) / 2;

    // Get rarity multiplier (1-based index, so subtract 1)
    const rarityMultiplier = ECONOMY.RARITY_MULTIPLIERS[Math.floor(avgRarity) - 1] || 1;

    // Apply generation bonus
    const generationMultiplier = 1 + (avgGeneration * ECONOMY.GENERATION_BONUS);

    // Calculate final cost
    const cost = ECONOMY.BREEDING_BASE_COST * rarityMultiplier * generationMultiplier;

    return Math.floor(cost);
  }

  /**
   * Calculate purchase price for a dog
   * @param {number} rarity - Dog's rarity tier (1-5)
   * @returns {number} Purchase price in gold
   */
  static getPurchasePrice(rarity) {
    return ECONOMY.PURCHASE_PRICES[rarity] || ECONOMY.PURCHASE_PRICES[1];
  }

  /**
   * Calculate sell value for a dog (50% of purchase price)
   * @param {CelebrityDog} dog - Dog to sell
   * @returns {number} Sell value in gold
   */
  static getSellValue(dog) {
    const purchasePrice = this.getPurchasePrice(dog.rarity);
    return Math.floor(purchasePrice * ECONOMY.SELL_MULTIPLIER);
  }

  /**
   * Calculate kennel expansion cost
   * @param {number} currentExpansionLevel - Current expansion level (0-3)
   * @returns {number} Cost for next expansion
   */
  static getKennelExpansionCost(currentExpansionLevel) {
    if (currentExpansionLevel >= ECONOMY.KENNEL_EXPANSION_COSTS.length) {
      return null; // Max expansions reached
    }
    return ECONOMY.KENNEL_EXPANSION_COSTS[currentExpansionLevel];
  }

  /**
   * Process a purchase transaction
   * @param {Object} gameState - Game state object
   * @param {number} cost - Cost of purchase
   * @returns {{success: boolean, message: string}} Transaction result
   */
  static processPurchase(gameState, cost) {
    if (gameState.player.gold < cost) {
      return {
        success: false,
        message: `Insufficient funds. Need ${cost} gold, have ${gameState.player.gold}.`
      };
    }

    gameState.player.gold -= cost;
    return {
      success: true,
      message: `Purchase successful. ${cost} gold spent.`
    };
  }

  /**
   * Process a sale transaction
   * @param {Object} gameState - Game state object
   * @param {number} value - Sale value
   * @returns {{success: boolean, message: string}} Transaction result
   */
  static processSale(gameState, value) {
    gameState.player.gold += value;
    return {
      success: true,
      message: `Sale successful. ${value} gold earned.`
    };
  }

  /**
   * Check if player can afford a purchase
   * @param {Object} gameState - Game state object
   * @param {number} cost - Cost to check
   * @returns {boolean} True if player can afford
   */
  static canAfford(gameState, cost) {
    return gameState.player.gold >= cost;
  }

  /**
   * Award gold to player
   * @param {Object} gameState - Game state object
   * @param {number} amount - Amount to award
   * @param {string} reason - Reason for award (for logging)
   */
  static awardGold(gameState, amount, reason = 'reward') {
    gameState.player.gold += amount;
    return {
      success: true,
      message: `Earned ${amount} gold from ${reason}.`
    };
  }

  /**
   * Calculate expected gold income per minute
   * Used for economic balancing
   * @param {number} minutesPlayed - Minutes of active play
   * @returns {number} Expected gold per minute
   */
  static getExpectedGoldPerMinute() {
    // Target: 30-50 gold per minute of active play
    return 40; // Average target
  }

  /**
   * Calculate time to afford a breeding
   * @param {number} currentGold - Player's current gold
   * @param {number} breedingCost - Cost of breeding
   * @returns {number} Estimated minutes to afford
   */
  static getTimeToAfford(currentGold, breedingCost) {
    if (currentGold >= breedingCost) {
      return 0;
    }

    const goldNeeded = breedingCost - currentGold;
    const goldPerMinute = this.getExpectedGoldPerMinute();
    return Math.ceil(goldNeeded / goldPerMinute);
  }

  /**
   * Get economic summary for a dog
   * @param {CelebrityDog} dog - Dog to analyze
   * @returns {Object} Economic data
   */
  static getDogEconomics(dog) {
    return {
      purchasePrice: this.getPurchasePrice(dog.rarity),
      sellValue: this.getSellValue(dog),
      profit: this.getSellValue(dog) - this.getPurchasePrice(dog.rarity),
      profitMargin: ((this.getSellValue(dog) - this.getPurchasePrice(dog.rarity))
        / this.getPurchasePrice(dog.rarity) * 100).toFixed(1) + '%'
    };
  }
}

export default EconomySystem;
