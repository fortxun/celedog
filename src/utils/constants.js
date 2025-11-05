/**
 * Game constants and trait definitions
 */

// Body types
export const BODY_TYPES = ['athletic', 'stocky', 'slim', 'fluffy', 'tiny'];

// Ear types
export const EAR_TYPES = ['floppy', 'pointed', 'small', 'large'];

// Tail types
export const TAIL_TYPES = ['curly', 'straight', 'bushy', 'short'];

// Marking patterns
export const MARKING_PATTERNS = ['solid', 'spotted', 'striped', 'patched'];

// Temperaments
export const TEMPERAMENTS = ['playful', 'lazy', 'energetic', 'sophisticated', 'goofy'];

// Talents
export const TALENTS = ['singing', 'acting', 'sports', 'comedy', 'modeling'];

// Special traits
export const SPECIAL_TRAITS = ['redCarpet', 'paparazziMagnet', 'awardWinner'];

// Rarity tiers
export const RARITY = {
  COMMON: 1,
  UNCOMMON: 2,
  RARE: 3,
  EPIC: 4,
  LEGENDARY: 5
};

export const RARITY_NAMES = {
  1: 'Common',
  2: 'Uncommon',
  3: 'Rare',
  4: 'Epic',
  5: 'Legendary'
};

export const RARITY_COLORS = {
  1: 0xCCCCCC, // Gray
  2: 0x00FF00, // Green
  3: 0x0066FF, // Blue
  4: 0x9933FF, // Purple
  5: 0xFFAA00  // Orange/Gold
};

// Economic constants
export const ECONOMY = {
  STARTING_GOLD: 1000,
  BREEDING_BASE_COST: 100,
  RARITY_MULTIPLIERS: [1, 2, 5, 10, 20],
  GENERATION_BONUS: 0.15,
  SELL_MULTIPLIER: 0.5,
  PURCHASE_PRICES: {
    1: 500,
    2: 2000,
    3: 10000,
    4: 40000,
    5: 150000
  },
  KENNEL_EXPANSION_COSTS: [1000, 2500, 5000, 10000]
};

// Kennel settings
export const KENNEL = {
  DEFAULT_CAPACITY: 10,
  MAX_CAPACITY: 50
};

// Color palettes for starter dogs
export const COAT_COLORS = [
  '#8B4513', // Brown
  '#FFFFFF', // White
  '#000000', // Black
  '#D2B48C', // Tan
  '#FFD700', // Golden
  '#C0C0C0', // Silver
  '#A0522D', // Sienna
  '#F5DEB3', // Wheat
  '#8B8B8B', // Gray
  '#FF8C00'  // Dark Orange
];

export default {
  BODY_TYPES,
  EAR_TYPES,
  TAIL_TYPES,
  MARKING_PATTERNS,
  TEMPERAMENTS,
  TALENTS,
  SPECIAL_TRAITS,
  RARITY,
  RARITY_NAMES,
  RARITY_COLORS,
  ECONOMY,
  KENNEL,
  COAT_COLORS
};
