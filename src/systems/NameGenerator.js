/**
 * Name Generator
 * Generates punny celebrity dog names using three methods:
 * 1. Portmanteau (50%) - Blend parent names
 * 2. Trait-based puns (30%) - Database lookup by traits
 * 3. Markov chain (20%) - Statistical generation
 */

import { randomChoice, weightedRandom } from '../utils/helpers.js';

class NameGenerator {
  /**
   * Generate a name for offspring
   * @param {string} parent1Name - First parent's name
   * @param {string} parent2Name - Second parent's name
   * @param {Object} genes - Offspring genes
   * @returns {string} Generated name
   */
  static generateName(parent1Name, parent2Name, genes) {
    // Weighted random selection of method
    const method = weightedRandom([
      { value: 'portmanteau', weight: 0.5 },
      { value: 'trait', weight: 0.3 },
      { value: 'markov', weight: 0.2 }
    ]);

    let name;

    switch (method) {
      case 'portmanteau':
        name = this.createPortmanteau(parent1Name, parent2Name);
        break;
      case 'trait':
        name = this.createTraitBasedPun(genes);
        break;
      case 'markov':
        name = this.createMarkovName();
        break;
      default:
        name = this.createPortmanteau(parent1Name, parent2Name);
    }

    // Fallback if generation failed
    if (!name || name.trim().length === 0) {
      name = this.createSimpleCombination(parent1Name, parent2Name);
    }

    return name;
  }

  /**
   * Create portmanteau from two names
   * @param {string} name1 - First name
   * @param {string} name2 - Second name
   * @returns {string} Portmanteau name
   */
  static createPortmanteau(name1, name2) {
    if (!name1 || !name2) {
      return 'Unnamed Pup';
    }

    const words1 = name1.split(' ');
    const words2 = name2.split(' ');

    // Get first word from name1 and last word from name2
    const word1 = words1[0];
    const word2 = words2[words2.length - 1];

    // Find midpoint of each word
    const mid1 = Math.floor(word1.length / 2);
    const mid2 = Math.floor(word2.length / 2);

    // Create portmanteau
    const portmanteau = word1.substring(0, mid1) + word2.substring(mid2);

    return portmanteau;
  }

  /**
   * Create trait-based pun name
   * @param {Object} genes - Dog genes
   * @returns {string} Pun name
   */
  static createTraitBasedPun(genes) {
    const punDatabase = {
      // Body type puns
      athletic: ['Pawlympian', 'Fetchival Champion', 'Sporty Spice-paw', 'Ruff Athlete'],
      fluffy: ['Fluff Daddy', 'Hairy Styles', 'Fur-nando', 'Puffy P. Diddy'],
      stocky: ['Tank the Bark', 'Bulk Bogan', 'Chonky McPaws'],
      slim: ['Skinny Minnie Mouse', 'Slim Shaggy', 'Lean Bean'],
      tiny: ['Lil Bow Wow', 'Tiny Barker', 'Pocket Pup'],

      // Temperament puns
      sophisticated: ['Bark-tisocrat', 'Paws-itively Posh', 'Haute Dog', 'Sir Barksalot'],
      goofy: ['Derp Doginson', 'Silly Cyrus', 'Goofball Grande', 'Derpina Turner'],
      playful: ['Bouncy Beyoncé', 'Jumpy Jonas', 'Frisky Fido'],
      lazy: ['Snoozy Susan', 'Lazy Bones Malone', 'Sleepy McSnore'],
      energetic: ['Zoomie Zendaya', 'Hyper Hound', 'Zippy Stardust'],

      // Talent puns
      singing: ['Pup-erazzi Star', 'Bark Streisand', 'Growl-ie Minogue'],
      acting: ['Drama Dogma', 'Oscar Wagger', 'Meryl Streep-er'],
      sports: ['Paws Jordan', 'Fetch Armstrong', 'Serena Woofliams'],
      comedy: ['Jim Furry', 'Kevin Bark', 'Tina Fido'],
      modeling: ['Bark Moss', 'Gisele Barkchen', 'Tyra Barks']
    };

    // Build list of potential names
    const candidates = [];

    if (punDatabase[genes.bodyType]) {
      candidates.push(...punDatabase[genes.bodyType]);
    }
    if (punDatabase[genes.temperament]) {
      candidates.push(...punDatabase[genes.temperament]);
    }
    if (punDatabase[genes.talent]) {
      candidates.push(...punDatabase[genes.talent]);
    }

    // Return random candidate or fallback
    return candidates.length > 0 ? randomChoice(candidates) : null;
  }

  /**
   * Create name using Markov chain
   * @returns {string} Generated name
   */
  static createMarkovName() {
    // Simplified Markov chain based on celebrity dog pun patterns
    const syllables = {
      start: ['Bark', 'Woof', 'Paw', 'Fur', 'Ruff', 'Howl', 'Fetch', 'Sniff', 'Wag'],
      middle: ['y', 'ie', 'ster', 'meister', 'ington', 'worth', 'field'],
      end: ['son', 'ton', 'ley', 'bert', 'ford', 'wood', 'stone']
    };

    const celebNames = [
      'Wahlberg', 'Obama', 'Jagger', 'Styles', 'Grande', 'Swift',
      'Bieber', 'Cruise', 'Pitt', 'Jolie', 'Streep', 'DiCaprio'
    ];

    // 70% chance to use celebrity name pattern
    if (Math.random() < 0.7) {
      const celeb = randomChoice(celebNames);
      const prefix = randomChoice(syllables.start);
      return `${prefix} ${celeb}`;
    }

    // 30% chance to build from syllables
    const start = randomChoice(syllables.start);
    const middle = randomChoice(syllables.middle);
    const end = randomChoice(syllables.end);

    return start + middle + end;
  }

  /**
   * Create simple combination as fallback
   * @param {string} name1 - First name
   * @param {string} name2 - Second name
   * @returns {string} Combined name
   */
  static createSimpleCombination(name1, name2) {
    if (!name1 || !name2) {
      return 'Mystery Pup';
    }

    const words1 = name1.split(' ');
    const words2 = name2.split(' ');

    // Take first word from name1 and last word from name2
    return `${words1[0]} ${words2[words2.length - 1]}`;
  }

  /**
   * Get a random starter name for new dogs
   * @returns {string} Starter name
   */
  static getRandomStarterName() {
    const starterNames = [
      'Bark Wahlberg',
      'Sarah Jessica Barker',
      'Chew-barka',
      'Pupcasso',
      'Bark Obama',
      'Fluff Daddy',
      'Hairy Styles',
      'Lick Jagger',
      'Droolius Caesar',
      'Winona Ruffer',
      'Brad Pittbull',
      'Jennifer Paw-niston',
      'George Sniff-ney',
      'Bark Ruffalo',
      'Natalie Pawrtman',
      'Chris Prrratt',
      'Scarlett Yo-hound-son',
      'Ryan Pawsling',
      'Emma Bone',
      'Tom Paws'
    ];

    return randomChoice(starterNames);
  }

  /**
   * Validate generated name
   * @param {string} name - Name to validate
   * @returns {boolean} True if valid
   */
  static isValidName(name) {
    if (!name || typeof name !== 'string') return false;
    if (name.trim().length === 0) return false;
    if (name.length > 50) return false; // Too long
    return true;
  }
}

export default NameGenerator;
