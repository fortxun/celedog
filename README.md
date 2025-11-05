# Celedog - Celebrity Dog Breeding Game

A browser-based breeding game built with Phaser 3.90.0 where you breed celebrity-themed dogs to create unique offspring with genetic traits.

## 🎮 Game Concept

Breed dogs with celebrity heads and unique traits. Mix and match to discover rare combinations, unlock special traits through synergies, and build your collection of punny-named pups!

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## 📁 Project Structure

```
celedog/
├── src/
│   ├── main.js              # Entry point
│   ├── config.js            # Phaser configuration
│   ├── scenes/              # Game scenes
│   │   ├── BootScene.js
│   │   ├── PreloadScene.js
│   │   ├── MenuScene.js
│   │   ├── GameScene.js
│   │   ├── UIScene.js
│   │   ├── BreedingScene.js
│   │   ├── ShopScene.js
│   │   └── CollectionScene.js
│   ├── systems/             # Game logic
│   │   ├── GeneticSystem.js # Breeding algorithm
│   │   └── RaritySystem.js  # Rarity calculation
│   ├── entities/
│   │   └── CelebrityDog.js  # Dog entity class
│   ├── utils/
│   │   ├── constants.js     # Game constants
│   │   ├── helpers.js       # Utility functions
│   │   └── GameState.js     # Global state manager
│   └── generators/
│       └── ProceduralDogGenerator.js (TODO)
├── assets/                  # Game assets
├── index.html               # HTML entry point
└── package.json

```

## ✨ Features Implemented (Phase 1)

- ✅ **Core Systems**
  - CelebrityDog entity with genetic traits
  - GeneticSystem with 50% inheritance, 40% blending, 10% mutation
  - RaritySystem with 5-tier rarity calculation
  - GameState management

- ✅ **UI & Scenes**
  - BootScene - Game initialization
  - PreloadScene - Asset loading with progress bar
  - MenuScene - Main menu with New Game/Continue
  - GameScene - Kennel view displaying owned dogs
  - UIScene - Persistent overlay with gold and navigation

- ✅ **Infrastructure**
  - Vite build system
  - Project structure
  - Placeholder sprite generation
  - ESLint configuration

## 🎯 Next Steps (Phase 2)

- [ ] **ProceduralDogGenerator** - RenderTexture composition for dog visuals
- [ ] **EconomySystem** - Gold, pricing, transactions
- [ ] **BreedingSystem** - High-level breeding orchestration
- [ ] **ShopScene** - Buy/sell dogs
- [ ] **LineageManager** - Family tree tracking
- [ ] **NameGenerator** - Pun name generation (portmanteau, trait-based, Markov)

## 🧬 Breeding Algorithm

Dogs inherit traits through:
- **50% Direct Inheritance** - Random selection from either parent
- **40% Blending** - Weighted average (colors blend via RGB)
- **10% Mutation** - Random new traits

Special traits unlock through synergies:
- **Red Carpet**: Athletic + Sophisticated + High influence (>0.8)
- **Paparazzi Magnet**: Goofy + Comedy talent
- **Award Winner**: High influence (>0.85) + Special coat pattern

## 🎲 Rarity System

Five tiers: **Common** (60%), **Uncommon** (25%), **Rare** (12%), **Epic** (2.5%), **Legendary** (0.5%)

Rarity calculated from:
- Average of parent rarities
- +1 bonus for special traits
- +0.5 bonus for high celebrity influence
- Probability roll: 55% floor, 35% +1 tier, 10% +2 tiers

## 💰 Economy (TODO)

- Starting gold: 1,000
- Breeding base cost: 100 × rarity multiplier × (1 + generation × 0.15)
- Sell value: 50% of purchase price
- Balance target: Common breed in 5 minutes, rare breed in 20-30 minutes

## 🛠️ Development

See `CLAUDE.md` for detailed development guidelines.

See `IMPLEMENTATION_PLAN.md` for the complete roadmap.

See `GITHUB_ISSUES.md` for task breakdown.

## 📝 Current Status

**Phase 1 Complete** ✅
- Core systems implemented
- Basic UI functional
- Game boots and navigates between scenes

**Phase 2 In Progress** 🚧
- Need to implement procedural generation
- Need to complete economy and breeding systems
- Need to add actual gameplay loop

## 🎨 Assets

Currently using placeholder sprites generated at runtime. Real assets needed:
- Celebrity head sprites (256x256)
- Body type sprites (128x128)
- Feature sprites (ears, tails - 64x64)
- Pattern overlays (128x128)

See `assets/README.md` for specifications.

## 📄 License

MIT

## 👤 Author

Built with Claude Code (claude.ai/code)
