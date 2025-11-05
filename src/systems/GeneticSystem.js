/**
 * Genetic breeding system
 * Handles trait inheritance, blending, and mutation
 */

import { hexToRgb, rgbToHex, randomChoice, clamp } from '../utils/helpers.js';
import {
  BODY_TYPES,
  EAR_TYPES,
  TAIL_TYPES,
  MARKING_PATTERNS,
  TEMPERAMENTS,
  TALENTS,
  SPECIAL_TRAITS,
  COAT_COLORS
} from '../utils/constants.js';

class GeneticSystem {
  /**
   * Breed two parent dogs to create offspring genes
   * @param {Object} parent1Genes - First parent's genes
   * @param {Object} parent2Genes - Second parent's genes
   * @returns {Object} Offspring genes
   */
  static breed(parent1Genes, parent2Genes) {
    const offspring = {};

    // Process each trait
    for (const trait in parent1Genes) {
      const roll = Math.random();

      if (roll < 0.5) {
        // 50%: Inherit from random parent
        offspring[trait] = Math.random() < 0.5
          ? parent1Genes[trait]
          : parent2Genes[trait];
      } else if (roll < 0.9) {
        // 40%: Blend traits
        offspring[trait] = this.blendTrait(
          trait,
          parent1Genes[trait],
          parent2Genes[trait]
        );
      } else {
        // 10%: Mutation
        offspring[trait] = this.mutateTrait(trait);
      }
    }

    // Check for special trait synergies
    offspring.specialTrait = this.checkSynergies(offspring);

    return offspring;
  }

  /**
   * Blend two trait values
   * @param {string} traitName - Name of the trait
   * @param {*} value1 - First parent's value
   * @param {*} value2 - Second parent's value
   * @returns {*} Blended value
   */
  static blendTrait(traitName, value1, value2) {
    switch (traitName) {
      case 'coatColor':
      case 'markingColor':
        return this.blendColors(value1, value2);

      case 'celebrityInfluence':
        return clamp((value1 + value2) / 2, 0, 1);

      default:
        // For discrete traits, pick randomly
        return Math.random() < 0.5 ? value1 : value2;
    }
  }

  /**
   * Blend two hex colors with variation
   * @param {string} color1 - First hex color
   * @param {string} color2 - Second hex color
   * @returns {string} Blended hex color
   */
  static blendColors(color1, color2) {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);

    if (!c1 || !c2) {
      return color1; // Fallback to first color
    }

    const blend = (v1, v2) => {
      const avg = (v1 + v2) / 2;
      const variation = (Math.random() - 0.5) * 40; // ±20 variation
      return clamp(Math.round(avg + variation), 0, 255);
    };

    return rgbToHex(
      blend(c1.r, c2.r),
      blend(c1.g, c2.g),
      blend(c1.b, c2.b)
    );
  }

  /**
   * Mutate a trait to a random value
   * @param {string} traitName - Name of the trait
   * @returns {*} Mutated value
   */
  static mutateTrait(traitName) {
    switch (traitName) {
      case 'bodyType':
        return randomChoice(BODY_TYPES);

      case 'coatColor':
      case 'markingColor':
        return randomChoice(COAT_COLORS);

      case 'markingPattern':
        return randomChoice(MARKING_PATTERNS);

      case 'earType':
        return randomChoice(EAR_TYPES);

      case 'tailType':
        return randomChoice(TAIL_TYPES);

      case 'temperament':
        return randomChoice(TEMPERAMENTS);

      case 'talent':
        return randomChoice(TALENTS);

      case 'celebrityInfluence':
        return Math.random(); // 0-1 range

      case 'celebrityHeadId':
        // Keep celebrity head from one parent, don't mutate
        return traitName;

      case 'specialTrait':
        // Special traits come from synergies, not mutation
        return null;

      default:
        return null;
    }
  }

  /**
   * Check for special trait synergies
   * @param {Object} genes - Offspring genes
   * @returns {string|null} Special trait or null
   */
  static checkSynergies(genes) {
    // Red Carpet: Athletic + Sophisticated + High influence
    if (
      genes.bodyType === 'athletic' &&
      genes.temperament === 'sophisticated' &&
      genes.celebrityInfluence > 0.8
    ) {
      return 'redCarpet';
    }

    // Paparazzi Magnet: Goofy + Comedy talent
    if (
      genes.temperament === 'goofy' &&
      genes.talent === 'comedy'
    ) {
      return 'paparazziMagnet';
    }

    // Award Winner: High influence + Talent (any) + Special coat
    if (
      genes.celebrityInfluence > 0.85 &&
      genes.markingPattern !== 'solid'
    ) {
      return 'awardWinner';
    }

    // Random 5% chance for any special trait
    if (Math.random() < 0.05) {
      return randomChoice(SPECIAL_TRAITS);
    }

    return null;
  }

  /**
   * Generate random genes for a new dog
   * @returns {Object} Random genes
   */
  static generateRandomGenes() {
    return {
      bodyType: randomChoice(BODY_TYPES),
      coatColor: randomChoice(COAT_COLORS),
      markingPattern: randomChoice(MARKING_PATTERNS),
      markingColor: randomChoice(COAT_COLORS),
      earType: randomChoice(EAR_TYPES),
      tailType: randomChoice(TAIL_TYPES),
      celebrityHeadId: 'celeb_001', // Default celebrity
      celebrityInfluence: Math.random(),
      temperament: randomChoice(TEMPERAMENTS),
      talent: randomChoice(TALENTS),
      specialTrait: null
    };
  }
}

export default GeneticSystem;
