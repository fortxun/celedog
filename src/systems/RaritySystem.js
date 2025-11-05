/**
 * Rarity calculation system
 * Determines dog rarity based on parent rarities and genes
 */

import { clamp } from '../utils/helpers.js';
import { RARITY, RARITY_NAMES, RARITY_COLORS } from '../utils/constants.js';

class RaritySystem {
  /**
   * Calculate rarity for offspring
   * @param {number} parent1Rarity - First parent's rarity (1-5)
   * @param {number} parent2Rarity - Second parent's rarity (1-5)
   * @param {Object} genes - Offspring genes
   * @returns {number} Rarity tier (1-5)
   */
  static calculateRarity(parent1Rarity, parent2Rarity, genes) {
    // Average parent rarities
    const avgRarity = (parent1Rarity + parent2Rarity) / 2;

    // Bonus modifiers
    let bonus = 0;

    // Special trait adds +1
    if (genes.specialTrait) {
      bonus += 1;
    }

    // High celebrity influence adds +0.5
    if (genes.celebrityInfluence > 0.8) {
      bonus += 0.5;
    }

    // Calculate base rarity value
    let rarityValue = avgRarity + bonus;

    // Apply probability roll
    const roll = Math.random();

    if (roll < 0.55) {
      // 55%: Floor (stay at or below average)
      rarityValue = Math.floor(rarityValue);
    } else if (roll < 0.90) {
      // 35%: +1 tier
      rarityValue = Math.ceil(rarityValue) + 1;
    } else {
      // 10%: +2 tiers (jackpot!)
      rarityValue = Math.ceil(rarityValue) + 2;
    }

    // Clamp to valid range (1-5)
    return clamp(Math.round(rarityValue), 1, 5);
  }

  /**
   * Get rarity name from tier number
   * @param {number} rarityValue - Rarity tier (1-5)
   * @returns {string} Rarity name
   */
  static getRarityName(rarityValue) {
    return RARITY_NAMES[rarityValue] || 'Unknown';
  }

  /**
   * Get rarity color for UI display
   * @param {number} rarityValue - Rarity tier (1-5)
   * @returns {number} Color hex value
   */
  static getRarityColor(rarityValue) {
    return RARITY_COLORS[rarityValue] || 0xCCCCCC;
  }

  /**
   * Get all rarity tiers info
   * @returns {Array<Object>} Array of rarity info objects
   */
  static getAllRarities() {
    return [
      {
        tier: RARITY.COMMON,
        name: RARITY_NAMES[1],
        color: RARITY_COLORS[1],
        probability: 0.60
      },
      {
        tier: RARITY.UNCOMMON,
        name: RARITY_NAMES[2],
        color: RARITY_COLORS[2],
        probability: 0.25
      },
      {
        tier: RARITY.RARE,
        name: RARITY_NAMES[3],
        color: RARITY_COLORS[3],
        probability: 0.12
      },
      {
        tier: RARITY.EPIC,
        name: RARITY_NAMES[4],
        color: RARITY_COLORS[4],
        probability: 0.025
      },
      {
        tier: RARITY.LEGENDARY,
        name: RARITY_NAMES[5],
        color: RARITY_COLORS[5],
        probability: 0.005
      }
    ];
  }

  /**
   * Calculate expected rarity distribution for testing
   * @param {number} parent1Rarity - First parent's rarity
   * @param {number} parent2Rarity - Second parent's rarity
   * @param {boolean} hasSpecialTrait - Whether offspring has special trait
   * @param {boolean} highInfluence - Whether offspring has high celebrity influence
   * @returns {Object} Expected probabilities for each tier
   */
  static getExpectedDistribution(parent1Rarity, parent2Rarity, hasSpecialTrait = false, highInfluence = false) {
    const avgRarity = (parent1Rarity + parent2Rarity) / 2;
    let bonus = 0;

    if (hasSpecialTrait) bonus += 1;
    if (highInfluence) bonus += 0.5;

    const baseRarity = avgRarity + bonus;

    const floor = Math.floor(baseRarity);
    const plusOne = Math.ceil(baseRarity) + 1;
    const plusTwo = Math.ceil(baseRarity) + 2;

    return {
      floor: {
        probability: 0.55,
        tier: clamp(floor, 1, 5)
      },
      plusOne: {
        probability: 0.35,
        tier: clamp(plusOne, 1, 5)
      },
      plusTwo: {
        probability: 0.10,
        tier: clamp(plusTwo, 1, 5)
      }
    };
  }
}

export default RaritySystem;
