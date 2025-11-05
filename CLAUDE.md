# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Celebrity dog breeding game built with Phaser 3.90.0. Players breed dogs with celebrity-themed heads and traits, creating offspring through genetic combinations. The game features procedural character generation, a pun-based naming system, and an economic progression system.

## Architecture

### Technology Stack
- **Phaser 3.90.0+** - Core game framework
- **rexUI Plugin** - UI components for breeding interfaces
- **Canvas 2D API** - Procedural character generation
- **IndexedDB** - Save system for large datasets
- **LocalStorage** - Quick saves and session data

### Critical Design Constraint
Phaser rasterizes SVGs to static bitmaps immediately on load - dynamic SVG morphing is NOT possible. The solution uses layered sprite composition with RenderTexture, applying tints/scales/blending at runtime to create visual variety in offspring.

### Project Structure
```
celedog/
├── index.html
├── package.json
├── src/
│   ├── main.js
│   ├── config.js
│   ├── scenes/          # Phaser scenes
│   │   ├── BootScene.js
│   │   ├── PreloadScene.js
│   │   ├── MenuScene.js
│   │   ├── GameScene.js
│   │   ├── BreedingScene.js
│   │   ├── CollectionScene.js
│   │   ├── ShopScene.js
│   │   └── UIScene.js
│   ├── systems/         # Core game logic
│   │   ├── GeneticSystem.js
│   │   ├── BreedingSystem.js
│   │   ├── EconomySystem.js
│   │   ├── LineageManager.js
│   │   ├── SaveSystem.js
│   │   └── NameGenerator.js
│   ├── entities/
│   │   ├── CelebrityDog.js
│   │   └── DogSprite.js
│   ├── generators/
│   │   └── ProceduralDogGenerator.js
│   ├── ui/
│   │   └── UIComponents.js
│   └── utils/
│       ├── GameState.js
│       └── helpers.js
└── assets/
    ├── heads/           # Celebrity head sprites (256x256 PNG)
    ├── bodies/          # Body type sprites
    ├── features/        # Ears, tails, etc.
    ├── patterns/        # Coat patterns (spots, stripes)
    └── sounds/
```

## Core Systems

### Genetic System
Breeding combines two parent dogs to create offspring through:
- **50% inheritance** - Random selection from either parent
- **40% blending** - Weighted average of parent traits (colors blend via RGB interpolation)
- **10% mutation** - Random new trait
- **Special traits** - Unlocked through synergies (e.g., specific trait combinations)

Genes structure includes:
- Visual traits: bodyType, coatColor, markingPattern, earType, tailType
- Celebrity traits: celebrityHeadId, celebrityInfluence (0-1 scale)
- Personality: temperament, talent
- Special traits: redCarpet, paparazziMagnet, awardWinner

### Rarity System
Five tiers: Common (60%), Uncommon (25%), Rare (12%), Epic (2.5%), Legendary (0.5%)
Rarity influenced by parent rarities, specialTrait presence, and celebrityInfluence values.

### Economic System
**Breeding costs**: Base 100 gold × rarity multiplier × (1 + generation × 0.15)
**Income sources**: Mini-games (200-500), selling dogs (50% of value), daily login (500), achievements (1000-5000)
**Balance target**: Common breed in 5 minutes, rare breed in 20-30 minutes (30-50 gold/minute active play)

### Name Generation
Three methods (probability-weighted):
1. **Portmanteau (50%)** - "Bark Wahlberg" + "Sarah Jessica Barker" → "BarWahlker"
2. **Trait-based puns (30%)** - Database lookup by traits (e.g., athletic → "Pawlympian")
3. **Markov chain (20%)** - Statistical generation from existing names

### Procedural Generation
Uses layered composition via `RenderTexture`:
1. Draw body sprite with coatColor tint
2. Draw marking pattern with markingColor tint (70% alpha)
3. Draw features (ears, tail)
4. Draw celebrity head scaled by celebrityInfluence
5. Cache the generated texture with unique key

### Save System
Dual-save approach:
- Primary: LocalStorage (fast, synchronous)
- Backup: IndexedDB (persistent, async)
- Save data includes version number for migration
- Auto-save every 60 seconds + on window close

## Development Commands

### Setup
```bash
# Install dependencies
npm install
```

### Development
```bash
# Run development server
npm run dev          # or npm start

# Build for production
npm run build

# Run linting (if configured)
npm run lint

# Type checking (if using TypeScript)
npm run type-check

# Run all checks before commit
npm run lint && npm run type-check && npm run build
```

### Testing
```bash
# Run unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Key Phaser APIs

### Asset Loading
```javascript
this.load.image('body_athletic', 'assets/bodies/athletic.png');
this.load.atlas('dogs', 'assets/dogs.png', 'assets/dogs.json');
```

### RenderTexture Composition
```javascript
const rt = this.add.renderTexture(0, 0, 128, 128);
const sprite = this.add.sprite(64, 64, 'body_athletic');
sprite.setTint(0xff0000);  // Red tint
rt.draw(sprite);
rt.saveTexture('unique_key');  // Cache for reuse
```

### Scene Management
```javascript
this.scene.launch('UIScene');    // Run in parallel
this.scene.pause('GameScene');
this.scene.resume('GameScene');
```

### Global State (Data Registry)
```javascript
this.registry.set('player-gold', 1000);
const gold = this.registry.get('player-gold');
this.registry.events.on('changedata-player-gold', (parent, value) => {
  // Update UI
});
```

### Object Pooling
```javascript
this.dogPool = this.add.group({
  classType: DogSprite,
  maxSize: 50,
  runChildUpdate: true
});
const dog = this.dogPool.get(x, y);  // Reuse instead of create
```

## Performance Considerations

1. **Object Pooling** - Reuse dog sprites instead of creating/destroying
2. **Culling** - Only render dogs in viewport (`cameras.main.worldView.contains()`)
3. **Texture Caching** - Cache procedurally generated textures (check `textures.exists()` before regenerating)
4. **Texture Atlases** - Combine sprites to minimize draw calls
5. **Limit Active Animations** - Don't animate offscreen entities
6. **Separate Data from Visuals** - Store dogs in Map, not as game objects
7. **Archive Old Generations** - Move generation 5+ to IndexedDB
8. **Throttle Auto-save** - Only save every 60 seconds, not every frame

## Starter Dogs

10 celebrity-themed starter dogs (each with unique color palette and traits):
- Bark Wahlberg (athletic, tough)
- Sarah Jessica Barker (slim, sophisticated)
- Chew-barka (fluffy, playful)
- Pupcasso (stocky, artistic)
- Bark Obama (athletic, charismatic)
- Fluff Daddy (fluffy, hip-hop)
- Hairy Styles (slim, fashionable)
- Lick Jagger (athletic, rock star)
- Droolius Caesar (stocky, commanding)
- Winona Ryder/Wind-ona Ruff-er (slim, quirky)

## Implementation Priorities

### MVP Scope
1. Phaser setup with scene structure
2. Asset loading and procedural generation
3. Breeding system with genetic inheritance
4. Economy (gold, buy/sell)
5. Name generation
6. Save/load system
7. Basic UI with rexUI
8. 5-10 starter dogs with rarity system

### Post-Launch Features
- Dog shows and mini-games
- Leaderboards and social sharing
- Achievements system
- Family tree visualization
- Advanced breeding projects

## JavaScript/Code Quality Best Practices

### Code Organization
1. **Separation of Concerns** - Keep business logic in `systems/`, not in Phaser scenes
2. **Single Responsibility** - Each class/module should have one clear purpose
3. **Use JSDoc Comments** - Document complex functions and class methods
4. **Consistent Naming** - Use camelCase for functions/variables, PascalCase for classes
5. **Export Organization** - Export reusable components from index files

### Error Handling
1. **Graceful Degradation** - Handle errors without crashing the game
2. **Validate Input** - Especially for user-generated content (dog names)
3. **Defensive Programming** - Check for null/undefined before accessing properties
4. **Try-Catch for Persistence** - Wrap LocalStorage/IndexedDB operations in try-catch

```javascript
// Good error handling example
class SaveSystem {
  save(gameState) {
    try {
      const serialized = JSON.stringify(gameState);
      localStorage.setItem('save', serialized);
      return true;
    } catch (error) {
      console.error('Save failed:', error);
      return this.fallbackToIndexedDB(gameState);
    }
  }
}
```

### Performance Best Practices
1. **Debounce User Input** - For search/filter functions (500ms standard)
2. **Lazy Load Heavy Assets** - Load procedural textures on-demand
3. **Avoid Memory Leaks** - Clean up event listeners in scene shutdown
4. **Use Maps for Lookups** - O(1) performance for dog/lineage lookups
5. **Batch Operations** - Group multiple state updates together

```javascript
// Clean up properly in Phaser scenes
shutdown() {
  this.events.off('dog-bred');  // Remove event listeners
  this.dogPool.clear(true, true);  // Destroy pooled objects
  this.registry.events.off('changedata');
}
```

### Testing Guidelines
1. **Unit Tests** - For utilities, genetic algorithms, economy calculations
2. **Test Edge Cases** - Color blending at boundaries, null parents, etc.
3. **Mock Phaser Objects** - Use test doubles for scene/registry dependencies
4. **Test Serialization** - Ensure save/load round-trips preserve data

### Security Considerations
1. **Sanitize User Input** - Validate dog names, filter profanity
2. **Never Trust LocalStorage** - Validate loaded save data structure/types
3. **No Sensitive Data** - Don't store authentication tokens in game state
4. **Version Save Files** - Handle save data migration safely

## Common Pitfalls

1. **Don't try to morph SVGs at runtime** - Phaser converts them to bitmaps
2. **Don't create dogs on every frame** - Use object pooling
3. **Don't query entire lineage tree** - Limit ancestry queries to 3-5 generations
4. **Don't save on every change** - Throttle to 60-second intervals
5. **Don't put business logic in scenes** - Keep it in systems/ for testability
6. **Don't use setInteractive() on non-interactive objects** - Performance hit
7. **Don't store game objects in save files** - Serialize to plain objects first
8. **Don't use console.log in production** - Use proper logging or remove debugging statements
9. **Don't leave unused imports** - Clean up imports, run linter before commits
10. **Don't mutate state directly** - Create new objects when updating game state

## Common Development Tasks

### Adding a New Dog Trait
1. Add trait to genes structure in `entities/CelebrityDog.js`
2. Update breeding logic in `systems/GeneticSystem.js`
3. Add visual representation in `generators/ProceduralDogGenerator.js`
4. Update rarity calculation if trait is special
5. Add unit tests for new trait inheritance

### Creating a New Scene
1. Create scene file in `scenes/`
2. Follow Phaser scene lifecycle (init, preload, create, update)
3. Register scene in game config
4. Use scene.launch() for overlays, scene.start() for transitions
5. Clean up resources in shutdown() method

### Adding a Mini-Game
1. Create new scene extending Phaser.Scene
2. Implement game logic in systems/
3. Hook up to economy system for rewards
4. Add entry point from GameScene
5. Test thoroughly for balance and fun factor

## Design Document

See `celedog_design.md` for complete implementation details including:
- Detailed breeding algorithm pseudocode
- Color blending formulas
- Economic balancing calculations
- Lineage tracking data structures
- Testing strategy
- 8-week implementation timeline
