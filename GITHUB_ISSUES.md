# GitHub Issues for Celebrity Dog Breeding Game

This document contains all GitHub issues needed to implement the game. Copy these into GitHub Issues to track development.

---

## Epic 1: Project Foundation

### Issue #1: Project Setup and Build Configuration
**Labels:** `setup`, `infrastructure`, `priority-high`

**Description:**
Initialize the project with proper structure, dependencies, and build tooling.

**Tasks:**
- [ ] Create `package.json` with Phaser 3.90.0 and rexUI plugin
- [ ] Set up Vite or Webpack for bundling
- [ ] Create `index.html` entry point
- [ ] Configure development server with hot reload
- [ ] Set up ESLint and Prettier
- [ ] Create `.gitignore` file
- [ ] Add npm scripts: `dev`, `build`, `test`, `lint`
- [ ] Create basic `src/` directory structure
- [ ] Verify Phaser boots successfully

**Acceptance Criteria:**
- Running `npm run dev` starts development server
- Phaser canvas renders on screen
- Hot reload works when editing files
- Build produces optimized production bundle

**Dependencies:** None

---

### Issue #2: Utility Library and Core Helpers
**Labels:** `utility`, `foundation`, `priority-high`

**Description:**
Create utility functions needed across the codebase.

**Files to create:**
- `src/utils/helpers.js`
- `src/utils/constants.js`

**Tasks:**
- [ ] Implement UUID generator (for dog IDs)
- [ ] Create color conversion utilities (hex ↔ RGB)
- [ ] Add random number utilities (weighted random, range)
- [ ] Create trait constants (body types, temperaments, etc.)
- [ ] Add validation helpers (gene validation)
- [ ] Write JSDoc comments for all functions
- [ ] Create unit tests for utilities

**Acceptance Criteria:**
- UUID generator creates unique IDs
- Color conversions work bidirectionally
- All utilities have 100% test coverage
- Constants match design document specifications

**Dependencies:** Issue #1

---

### Issue #3: Asset Pipeline and Placeholder Graphics
**Labels:** `assets`, `graphics`, `priority-medium`

**Description:**
Set up asset organization and create placeholder sprites for development.

**Tasks:**
- [ ] Create `assets/` directory structure (heads, bodies, features, patterns, sounds)
- [ ] Design or find placeholder sprites for 5 body types
- [ ] Create placeholder sprites for 4 ear types
- [ ] Create placeholder sprites for 4 tail types
- [ ] Create placeholder pattern overlays (spots, stripes, patches)
- [ ] Find or create 10 celebrity head placeholders (256x256)
- [ ] Set up texture atlas generation (if using)
- [ ] Document asset specifications in README

**Acceptance Criteria:**
- All required asset directories exist
- Minimum viable sprites for each body part
- All sprites are consistent size/format (PNG)
- Assets load successfully in Phaser

**Dependencies:** Issue #1

---

## Epic 2: Core Game Systems

### Issue #4: CelebrityDog Entity Class
**Labels:** `entity`, `data-model`, `priority-high`

**Description:**
Implement the core dog data structure with genes and metadata.

**File:** `src/entities/CelebrityDog.js`

**Tasks:**
- [ ] Create `CelebrityDog` class with constructor
- [ ] Implement genes structure (all 11 traits)
- [ ] Add `calculateValue()` method based on rarity
- [ ] Add `calculateRarity()` method (delegates to RaritySystem)
- [ ] Implement `serialize()` method for save system
- [ ] Create static `deserialize()` method
- [ ] Add getters for display properties (age, generation)
- [ ] Write JSDoc comments
- [ ] Create unit tests for serialization round-trip

**Acceptance Criteria:**
- Dogs can be created with valid genes
- Serialization/deserialization preserves all data
- Invalid genes throw validation errors
- Tests cover edge cases (null parents, generation 0, etc.)

**Dependencies:** Issue #2

---

### Issue #5: Genetic Breeding System
**Labels:** `system`, `core-mechanic`, `priority-high`

**Description:**
Implement the genetic algorithm for breeding two parent dogs.

**File:** `src/systems/GeneticSystem.js`

**Tasks:**
- [ ] Create `GeneticSystem` class
- [ ] Implement `breed(parent1Genes, parent2Genes)` method
- [ ] Add 50% inheritance logic (random parent selection)
- [ ] Add 40% blending logic with `blendTrait()` method
- [ ] Implement color blending with RGB interpolation + variation
- [ ] Add 10% mutation logic with `mutateTrait()` method
- [ ] Implement `checkSynergies()` for special traits
- [ ] Create mutation tables for each trait type
- [ ] Write unit tests (100+ test cases for probabilities)

**Acceptance Criteria:**
- Breeding two dogs produces valid offspring genes
- Statistical distribution matches design (50/40/10)
- Color blending produces realistic intermediate colors
- Special traits appear based on synergies
- Edge cases handled (same parents, extreme values)

**Dependencies:** Issue #2, Issue #4

---

### Issue #6: Rarity Calculation System
**Labels:** `system`, `game-balance`, `priority-high`

**Description:**
Implement rarity tier calculation for dogs.

**File:** `src/systems/RaritySystem.js`

**Tasks:**
- [ ] Create `RaritySystem` class
- [ ] Implement `calculateRarity(parent1Rarity, parent2Rarity, genes)` static method
- [ ] Add bonus calculations (special trait +1, high celebrity influence +0.5)
- [ ] Implement probability rolls (55% floor, 35% +1, 10% +2)
- [ ] Clamp rarity to 1-5 range
- [ ] Create `getRarityName(rarityValue)` helper (Common, Uncommon, etc.)
- [ ] Add `getRarityColor(rarityValue)` for UI display
- [ ] Write unit tests (verify probability distributions)

**Acceptance Criteria:**
- Rarity values always between 1-5
- Statistical distribution matches design (60/25/12/2.5/0.5)
- Special traits increase rarity appropriately
- Tests verify edge cases (both parents legendary, etc.)

**Dependencies:** Issue #4

---

### Issue #7: Unit Tests for Core Systems
**Labels:** `testing`, `quality`, `priority-medium`

**Description:**
Comprehensive test suite for data models and systems.

**Tasks:**
- [ ] Set up Jest or Vitest test runner
- [ ] Write tests for CelebrityDog entity
- [ ] Write tests for GeneticSystem breeding
- [ ] Write tests for RaritySystem calculations
- [ ] Write tests for utility helpers
- [ ] Add test coverage reporting (aim for 90%+)
- [ ] Create test data fixtures (sample dogs)
- [ ] Add CI/CD integration (GitHub Actions)

**Acceptance Criteria:**
- All core systems have 90%+ test coverage
- Tests run on every commit (CI/CD)
- No flaky tests (deterministic with seeded random)
- Test documentation explains key scenarios

**Dependencies:** Issue #4, Issue #5, Issue #6

---

## Epic 3: Procedural Generation

### Issue #8: Procedural Dog Generator
**Labels:** `graphics`, `procedural`, `priority-high`

**Description:**
Implement layered sprite composition using Phaser RenderTexture.

**File:** `src/generators/ProceduralDogGenerator.js`

**Tasks:**
- [ ] Create `ProceduralDogGenerator` class
- [ ] Implement `generateDogTexture(genes)` method
- [ ] Add texture key generation based on genes
- [ ] Check texture cache before generating
- [ ] Layer 1: Body with coatColor tint
- [ ] Layer 2: Marking pattern with markingColor tint (70% alpha)
- [ ] Layer 3: Features (ears, tail)
- [ ] Layer 4: Celebrity head scaled by influence
- [ ] Save composed texture with `rt.saveTexture()`
- [ ] Handle missing assets gracefully
- [ ] Add debug mode to visualize layers

**Acceptance Criteria:**
- Generated dogs display correct visual traits
- Tinting produces accurate colors
- Texture caching prevents redundant generation
- Performance: generate 50 dogs in <1 second
- Missing assets don't crash generator

**Dependencies:** Issue #3

---

### Issue #9: DogSprite Visual Component
**Labels:** `graphics`, `component`, `priority-medium`

**Description:**
Create Phaser sprite class for displaying dogs in scenes.

**File:** `src/entities/DogSprite.js`

**Tasks:**
- [ ] Create `DogSprite` class extending `Phaser.GameObjects.Sprite`
- [ ] Add constructor accepting dog entity
- [ ] Implement `updateVisual()` method using ProceduralDogGenerator
- [ ] Add hover effects (scale up slightly)
- [ ] Add click interaction handling
- [ ] Implement rarity glow effect (colored outline)
- [ ] Add animation support (idle bounce)
- [ ] Create `destroy()` override for cleanup
- [ ] Add tooltip display (name, rarity)

**Acceptance Criteria:**
- Dogs render correctly in scenes
- Interactive feedback on hover/click
- Rarity visually distinguishable (glow effect)
- No memory leaks on destroy
- Smooth animations at 60 FPS

**Dependencies:** Issue #8

---

### Issue #10: Texture Caching System
**Labels:** `performance`, `optimization`, `priority-medium`

**Description:**
Optimize texture generation with intelligent caching.

**Tasks:**
- [ ] Create cache key generation algorithm (hash genes)
- [ ] Implement LRU cache with max size (100 textures)
- [ ] Add cache hit/miss metrics for debugging
- [ ] Implement cache prewarming for common combinations
- [ ] Add cache clearing for memory management
- [ ] Create cache persistence (save common textures to IndexedDB)
- [ ] Add debug UI showing cache stats

**Acceptance Criteria:**
- Cache reduces redundant texture generation by 80%+
- Memory usage stays under 100MB with 200+ dogs
- Cache hit rate >70% during normal gameplay
- LRU eviction works correctly

**Dependencies:** Issue #8

---

## Epic 4: Scene Architecture

### Issue #11: Boot and Preload Scenes
**Labels:** `scene`, `foundation`, `priority-high`

**Description:**
Create initial scenes for game initialization and asset loading.

**Files:** `src/scenes/BootScene.js`, `src/scenes/PreloadScene.js`

**Tasks:**
- [ ] Create `BootScene` for initial setup
- [ ] Initialize game registry with default values
- [ ] Create `PreloadScene` for asset loading
- [ ] Implement loading bar visual feedback
- [ ] Load all sprite assets
- [ ] Load rexUI plugin
- [ ] Add error handling for missing assets
- [ ] Transition to MenuScene on complete
- [ ] Add preload progress events

**Acceptance Criteria:**
- Loading bar shows accurate progress
- All assets load successfully
- Errors display helpful messages
- Smooth transition to menu

**Dependencies:** Issue #3

---

### Issue #12: Menu Scene
**Labels:** `scene`, `ui`, `priority-medium`

**Description:**
Main menu with start game, continue, and options.

**File:** `src/scenes/MenuScene.js`

**Tasks:**
- [ ] Create `MenuScene` class
- [ ] Add game title/logo
- [ ] Create "New Game" button
- [ ] Create "Continue" button (disabled if no save)
- [ ] Add credits/info section
- [ ] Implement button animations (hover, click)
- [ ] Handle scene transitions to GameScene
- [ ] Add background music (optional)
- [ ] Create attractive visual design

**Acceptance Criteria:**
- Buttons are clearly visible and interactive
- Continue button only enabled with valid save
- Smooth transition to GameScene
- Professional visual presentation

**Dependencies:** Issue #11

---

### Issue #13: Game Scene (Main Hub)
**Labels:** `scene`, `core`, `priority-high`

**Description:**
Main kennel view showing owned dogs and navigation.

**File:** `src/scenes/GameScene.js`

**Tasks:**
- [ ] Create `GameScene` class
- [ ] Display player's owned dogs in kennel grid
- [ ] Add navigation buttons (Breed, Shop, Collection)
- [ ] Implement dog selection (click to view details)
- [ ] Show kennel capacity (e.g., "5/10 dogs")
- [ ] Add "Sell Dog" functionality
- [ ] Create dog detail modal (stats, ancestry)
- [ ] Implement scroll/pagination for many dogs
- [ ] Launch UIScene in parallel

**Acceptance Criteria:**
- All owned dogs visible in grid
- Dog selection shows detail view
- Navigation buttons work correctly
- Smooth performance with 50+ dogs
- UIScene displays gold and stats

**Dependencies:** Issue #9, Issue #14

---

### Issue #14: UI Scene (Persistent Overlay)
**Labels:** `scene`, `ui`, `priority-high`

**Description:**
Always-visible overlay showing gold, navigation, and game state.

**File:** `src/scenes/UIScene.js`

**Tasks:**
- [ ] Create `UIScene` class launched in parallel
- [ ] Display current gold amount (top-right)
- [ ] Add navigation bar (Home, Breed, Shop, Collection)
- [ ] Implement settings button (pause menu)
- [ ] Show notification toasts (dog bred, achievement)
- [ ] Add gold animation when amount changes
- [ ] Create pause menu (resume, save, quit)
- [ ] Listen to registry events for updates

**Acceptance Criteria:**
- Gold display updates in real-time
- Navigation works from any scene
- Toasts appear for important events
- UI doesn't block game interaction
- Responsive to registry changes

**Dependencies:** Issue #11

---

## Epic 5: Economy & Breeding

### Issue #15: Economy System
**Labels:** `system`, `game-balance`, `priority-high`

**Description:**
Manage gold, pricing, and transactions.

**File:** `src/systems/EconomySystem.js`

**Tasks:**
- [ ] Create `EconomySystem` class
- [ ] Implement `calculateBreedingCost(parent1, parent2)` method
- [ ] Add rarity multipliers [1, 2, 5, 10, 20]
- [ ] Implement generation bonus (15% per generation)
- [ ] Create `calculateSellValue(dog)` (50% of purchase value)
- [ ] Add `canAfford(player, cost)` check
- [ ] Implement `processPurchase(player, cost)` transaction
- [ ] Add gold earning methods (mini-games, sales)
- [ ] Create pricing constants
- [ ] Write unit tests for all calculations

**Acceptance Criteria:**
- Breeding costs scale appropriately with rarity/generation
- Economy balances to design targets (5 min/common, 20 min/rare)
- Transactions handle edge cases (insufficient funds)
- All formulas match design document

**Dependencies:** Issue #4, Issue #6

---

### Issue #16: Breeding System Orchestrator
**Labels:** `system`, `core-mechanic`, `priority-high`

**Description:**
High-level system coordinating breeding operations.

**File:** `src/systems/BreedingSystem.js`

**Tasks:**
- [ ] Create `BreedingSystem` class
- [ ] Implement `breedDogs(parent1, parent2, player)` method
- [ ] Check breeding cost and deduct gold
- [ ] Call GeneticSystem to generate offspring genes
- [ ] Create new CelebrityDog instance
- [ ] Generate name using NameGenerator
- [ ] Add offspring to player's kennel
- [ ] Check kennel capacity
- [ ] Emit 'dog-bred' event
- [ ] Add animation/celebration sequence
- [ ] Handle errors (insufficient funds, full kennel)

**Acceptance Criteria:**
- Breeding deducts correct gold amount
- Offspring has valid genes from parents
- Kennel capacity enforced
- Events emitted for UI updates
- Error messages display to player

**Dependencies:** Issue #5, Issue #15

---

### Issue #17: Breeding Scene UI
**Labels:** `scene`, `ui`, `priority-high`

**Description:**
Modal interface for selecting parents and confirming breeding.

**File:** `src/scenes/BreedingScene.js`

**Tasks:**
- [ ] Create `BreedingScene` as modal overlay
- [ ] Display parent selection slots (2 dogs)
- [ ] Filter available dogs (same generation, not bred recently)
- [ ] Show preview of potential offspring (stats, rarity chance)
- [ ] Display breeding cost prominently
- [ ] Add "Breed" button (disabled if can't afford)
- [ ] Show celebration animation on success
- [ ] Display new offspring with stats
- [ ] Add "Breed Another" or "Return to Kennel" options
- [ ] Handle errors with helpful messages

**Acceptance Criteria:**
- Parent selection is intuitive
- Cost and preview update dynamically
- Breeding success shows celebration
- Clear feedback for all states
- Can breed multiple times in sequence

**Dependencies:** Issue #16, Issue #9

---

### Issue #18: Shop Scene
**Labels:** `scene`, `economy`, `priority-medium`

**Description:**
Buy starter dogs and sell owned dogs.

**File:** `src/scenes/ShopScene.js`

**Tasks:**
- [ ] Create `ShopScene` class
- [ ] Display available starter dogs for purchase
- [ ] Show dog preview (visual, traits, rarity)
- [ ] Display purchase price
- [ ] Add "Buy" button (disabled if can't afford)
- [ ] Implement purchase transaction
- [ ] Add "Sell" tab showing owned dogs
- [ ] Show sell value (50% of purchase)
- [ ] Confirm before selling (prevent accidents)
- [ ] Update gold display on transactions

**Acceptance Criteria:**
- All 10 starter dogs available for purchase
- Clear pricing information
- Purchase adds dog to kennel
- Selling removes dog and grants gold
- Confirmation prevents accidental sales

**Dependencies:** Issue #15, Issue #9

---

## Epic 6: Collection & Lineage

### Issue #19: Collection Scene
**Labels:** `scene`, `ui`, `priority-medium`

**Description:**
Grid view of all owned dogs with filtering and sorting.

**File:** `src/scenes/CollectionScene.js`

**Tasks:**
- [ ] Create `CollectionScene` class
- [ ] Display all owned dogs in scrollable grid
- [ ] Add filter options (rarity, generation, body type)
- [ ] Add sort options (rarity, age, name, value)
- [ ] Implement search by name
- [ ] Show dog count ("45 dogs owned")
- [ ] Add pagination or infinite scroll
- [ ] Click dog to view detailed stats
- [ ] Add "Breed" shortcut from detail view
- [ ] Optimize rendering (virtual scrolling)

**Acceptance Criteria:**
- All dogs visible in organized grid
- Filtering and sorting work correctly
- Search finds dogs by name
- Smooth scrolling with 100+ dogs
- Detail view shows complete information

**Dependencies:** Issue #9, Issue #13

---

### Issue #20: Lineage Manager
**Labels:** `system`, `data`, `priority-medium`

**Description:**
Track family trees and ancestry relationships.

**File:** `src/systems/LineageManager.js`

**Tasks:**
- [ ] Create `LineageManager` class
- [ ] Use Map data structure for O(1) lookups
- [ ] Implement `addDog(dog)` method
- [ ] Implement `getAncestry(dogId, maxDepth=3)` BFS traversal
- [ ] Add `getDescendants(dogId)` method
- [ ] Implement `getGeneration(generation)` query
- [ ] Add referential integrity checks
- [ ] Optimize for large datasets (1000+ dogs)
- [ ] Add archive method for old generations
- [ ] Write unit tests for tree operations

**Acceptance Criteria:**
- Ancestry queries return correct family tree
- Performance: query 5 generations in <10ms
- Handles circular references gracefully
- Archive moves old data to IndexedDB
- Tests cover complex lineages

**Dependencies:** Issue #4

---

### Issue #21: Pedigree Scene (Family Tree)
**Labels:** `scene`, `visualization`, `priority-low`

**Description:**
Visual family tree showing dog ancestry.

**File:** `src/scenes/PedigreeScene.js`

**Tasks:**
- [ ] Create `PedigreeScene` class
- [ ] Implement tree layout algorithm (layered/hierarchical)
- [ ] Render dog nodes with sprites
- [ ] Draw connecting lines between parents/children
- [ ] Add zoom and pan controls
- [ ] Highlight selected dog's lineage
- [ ] Show limited depth (3-5 generations)
- [ ] Add tooltip on hover (dog name, generation)
- [ ] Optimize rendering (lazy load nodes)
- [ ] Add "Export as Image" feature

**Acceptance Criteria:**
- Tree displays correctly for complex lineages
- Smooth zoom and pan
- Clear visual hierarchy
- Performance: render 50 nodes at 60 FPS
- Export produces shareable image

**Dependencies:** Issue #20, Issue #9

---

## Epic 7: Name Generation

### Issue #22: Name Generator (All Three Methods)
**Labels:** `system`, `content`, `priority-medium`

**Description:**
Generate funny pun names for offspring dogs.

**File:** `src/systems/NameGenerator.js`

**Tasks:**
- [ ] Create `NameGenerator` class
- [ ] Implement `generateName(parent1Name, parent2Name, genes)` method
- [ ] Add weighted random selection (50% portmanteau, 30% trait, 20% Markov)
- [ ] **Method 1:** Implement portmanteau algorithm
- [ ] **Method 2:** Create trait-based pun database (50+ names)
- [ ] **Method 2:** Implement trait lookup and random selection
- [ ] **Method 3:** Build Markov chain from starter dog names
- [ ] **Method 3:** Implement name generation from chain
- [ ] Add fallback for empty/invalid names
- [ ] Create profanity filter (optional)
- [ ] Write unit tests (generate 1000 names, check validity)

**Acceptance Criteria:**
- Names are funny and creative
- No empty or null names generated
- Distribution matches design (50/30/20)
- Markov names resemble dog pun style
- Fallback handles edge cases
- Profanity filter works (if implemented)

**Dependencies:** Issue #4

---

## Epic 8: Save System

### Issue #23: Save/Load System with Dual Storage
**Labels:** `system`, `persistence`, `priority-high`

**Description:**
Save game state to LocalStorage with IndexedDB backup.

**File:** `src/systems/SaveSystem.js`

**Tasks:**
- [ ] Create `SaveSystem` class
- [ ] Implement `save(gameState)` method
- [ ] Serialize all dogs, player data, gold
- [ ] Add version number to save data
- [ ] Save to LocalStorage (primary)
- [ ] Save to IndexedDB (backup, async)
- [ ] Implement `load()` method
- [ ] Validate save data structure
- [ ] Handle version migration (if needed)
- [ ] Fallback to IndexedDB if LocalStorage fails
- [ ] Add auto-save every 60 seconds
- [ ] Save on window close/beforeunload
- [ ] Create save data reset/delete function
- [ ] Write integration tests

**Acceptance Criteria:**
- Saving preserves all game state
- Loading restores exact game state
- Auto-save works reliably
- Version migration handles old saves
- Corrupted saves fallback to backup
- Tests verify save/load round-trip

**Dependencies:** Issue #4, Issue #20

---

## Epic 9: Polish & Content

### Issue #24: Starter Dogs Content Creation
**Labels:** `content`, `design`, `priority-medium`

**Description:**
Create 10 unique starter celebrity dogs with distinct traits.

**Tasks:**
- [ ] Define complete genes for each starter dog:
  - Bark Wahlberg (athletic, tough, brown coat)
  - Sarah Jessica Barker (slim, sophisticated, white coat)
  - Chew-barka (fluffy, playful, tan coat)
  - Pupcasso (stocky, artistic, multi-colored)
  - Bark Obama (athletic, charismatic, black coat)
  - Fluff Daddy (fluffy, hip-hop, white coat)
  - Hairy Styles (slim, fashionable, brown coat)
  - Lick Jagger (athletic, rock star, tan coat)
  - Droolius Caesar (stocky, commanding, golden coat)
  - Winona Ruffer (slim, quirky, black/white coat)
- [ ] Create or find celebrity head sprites (256x256)
- [ ] Assign unique personality traits and talents
- [ ] Set balanced starting rarities (mix of common/uncommon)
- [ ] Write flavor text descriptions
- [ ] Test breeding combinations for variety

**Acceptance Criteria:**
- All 10 dogs have complete, unique gene sets
- Visual variety in body types and colors
- Breeding combinations produce diverse offspring
- Names are recognizable and funny
- Balanced starting options (not all athletic)

**Dependencies:** Issue #4, Issue #8

---

### Issue #25: rexUI Plugin Integration
**Labels:** `ui`, `library`, `priority-medium`

**Description:**
Integrate rexUI plugin for advanced UI components.

**Tasks:**
- [ ] Install rexUI plugin via npm
- [ ] Add plugin to Phaser config
- [ ] Create reusable UI components:
  - Modal dialog
  - Button with hover states
  - Scrollable panel
  - Grid layout
  - Label/text with formatting
- [ ] Style components to match game theme
- [ ] Create UIComponents utility class
- [ ] Document component usage patterns
- [ ] Replace basic UI with rexUI components

**Acceptance Criteria:**
- rexUI loads and functions correctly
- Components are reusable across scenes
- Consistent visual style
- Documentation explains common patterns
- UI feels polished and responsive

**Dependencies:** Issue #11

---

### Issue #26: Animations and Transitions
**Labels:** `polish`, `animation`, `priority-low`

**Description:**
Add juice and polish with animations.

**Tasks:**
- [ ] Dog birth animation (scale from 0 to 1, bounce)
- [ ] Breeding celebration (confetti, particles)
- [ ] Gold earned animation (numbers float up)
- [ ] Dog selection highlight (glow pulse)
- [ ] Scene transitions (fade, slide)
- [ ] Button hover/click effects
- [ ] Loading animations (spinner, progress bar)
- [ ] Achievement unlock animation
- [ ] Rarity reveal effect (dramatic pause)
- [ ] Optimize animations for 60 FPS

**Acceptance Criteria:**
- All key events have visual feedback
- Animations feel smooth and satisfying
- Performance stays at 60 FPS
- Can skip/speed up animations
- Consistent animation style

**Dependencies:** Issue #9, Issue #16

---

### Issue #27: Tutorial System
**Labels:** `onboarding`, `ux`, `priority-medium`

**Description:**
First-time user tutorial explaining game mechanics.

**Tasks:**
- [ ] Create tutorial overlay system
- [ ] Step 1: Welcome and concept explanation
- [ ] Step 2: Guide through first purchase
- [ ] Step 3: Explain breeding mechanics
- [ ] Step 4: Show how to sell dogs
- [ ] Step 5: Introduce rarity system
- [ ] Add "Skip Tutorial" option
- [ ] Highlight UI elements with arrows/callouts
- [ ] Store tutorial completion in save data
- [ ] Add "Replay Tutorial" option in settings
- [ ] Write clear, concise tutorial text

**Acceptance Criteria:**
- New players understand core mechanics
- Tutorial doesn't feel overwhelming
- Can skip if desired
- Replay option works
- Clear visual guidance

**Dependencies:** Issue #13, Issue #17, Issue #18

---

## Epic 10: Testing & Optimization

### Issue #28: Performance Optimization
**Labels:** `performance`, `optimization`, `priority-high`

**Description:**
Ensure smooth 60 FPS with 50+ dogs displayed.

**Tasks:**
- [ ] Implement object pooling for DogSprite
- [ ] Add viewport culling (only render visible dogs)
- [ ] Optimize texture generation (cache aggressively)
- [ ] Profile with Chrome DevTools (identify bottlenecks)
- [ ] Batch sprite updates (update once per second, not every frame)
- [ ] Use texture atlases to reduce draw calls
- [ ] Lazy-load PedigreeScene visualization
- [ ] Limit particle effects (max 50 particles)
- [ ] Optimize LineageManager queries
- [ ] Add performance monitoring overlay (FPS counter)

**Acceptance Criteria:**
- 60 FPS with 50 dogs in GameScene
- Memory usage under 100MB
- Smooth scrolling in CollectionScene
- No dropped frames during animations
- Texture generation <16ms per dog

**Dependencies:** Issue #9, Issue #10

---

### Issue #29: Integration Tests
**Labels:** `testing`, `quality`, `priority-medium`

**Description:**
End-to-end tests for critical user flows.

**Tasks:**
- [ ] Set up integration testing framework (Cypress or Playwright)
- [ ] Test: Start new game → buy dog → breed → sell offspring
- [ ] Test: Save game → reload → verify state preserved
- [ ] Test: Breed 10 generations → verify lineage
- [ ] Test: Fill kennel → verify capacity limit
- [ ] Test: Purchase dog with insufficient funds → verify error
- [ ] Test: Navigate all scenes → verify no crashes
- [ ] Test: Auto-save triggers after 60 seconds
- [ ] Add screenshots on test failure
- [ ] Run tests in CI/CD pipeline

**Acceptance Criteria:**
- All critical flows tested
- Tests pass consistently (no flakiness)
- Coverage includes error cases
- CI/CD runs tests on every PR
- Test results documented

**Dependencies:** Issue #16, Issue #23

---

### Issue #30: Playtesting and Balance Tuning
**Labels:** `balance`, `gameplay`, `priority-high`

**Description:**
Playtest and adjust economy/gameplay balance.

**Tasks:**
- [ ] Recruit 5-10 playtesters
- [ ] Track time to first common breed (target: 5 min)
- [ ] Track time to first rare breed (target: 20-30 min)
- [ ] Gather feedback on fun factor
- [ ] Adjust breeding costs if too easy/hard
- [ ] Tweak rarity probabilities if needed
- [ ] Test name generation quality (are they funny?)
- [ ] Verify progression feels rewarding
- [ ] Adjust mini-game rewards (if implemented)
- [ ] Document balance decisions

**Acceptance Criteria:**
- Economy meets design targets
- Playtesters report positive experience
- Progression feels balanced (not too grindy)
- Names are consistently amusing
- No exploits or broken strategies

**Dependencies:** Issue #15, Issue #16, Issue #22

---

## Issue Labels Legend

- `setup` - Project initialization and configuration
- `infrastructure` - Build tools, CI/CD, dev environment
- `foundation` - Core systems required by everything else
- `utility` - Helper functions and tools
- `assets` - Graphics, audio, content
- `entity` - Game objects and data structures
- `system` - Business logic and game systems
- `scene` - Phaser scenes
- `ui` - User interface components
- `graphics` - Visual rendering and effects
- `procedural` - Procedural generation systems
- `core-mechanic` - Essential gameplay features
- `economy` - Gold, pricing, transactions
- `data` - Data management and storage
- `persistence` - Save/load systems
- `content` - Game content (dogs, names, etc.)
- `animation` - Animations and visual effects
- `polish` - Nice-to-have improvements
- `onboarding` - Tutorial and first-time UX
- `testing` - Unit/integration tests
- `quality` - Code quality, linting, standards
- `performance` - Optimization and profiling
- `balance` - Game balance and tuning
- `gameplay` - Core gameplay experience
- `visualization` - Data visualization (pedigree tree)
- `library` - Third-party library integration

**Priority levels:**
- `priority-high` - Blocking/critical for MVP
- `priority-medium` - Important but not blocking
- `priority-low` - Nice-to-have, post-MVP

---

## Implementation Order (Recommended)

1. **Phase 1 - Foundation (Week 1)**
   - Issues #1, #2, #3, #11, #12

2. **Phase 2 - Core Systems (Week 2)**
   - Issues #4, #5, #6, #7, #8, #9

3. **Phase 3 - Game Loop (Week 3)**
   - Issues #13, #14, #15, #16, #17

4. **Phase 4 - Economy & Collection (Week 4)**
   - Issues #18, #19, #20, #10

5. **Phase 5 - Persistence & Polish (Week 5)**
   - Issues #22, #23, #24, #25

6. **Phase 6 - Final Polish (Week 6)**
   - Issues #26, #27, #28, #29, #30

7. **Post-MVP (Week 7+)**
   - Issue #21 (Pedigree visualization)

---

## Notes

- Each issue should be assigned to a developer and tracked in GitHub Projects
- Use feature branches: `feature/issue-XX-description`
- Require PR reviews before merging to main
- Run tests and linter in CI/CD before merge
- Update CLAUDE.md if architectural patterns change
- Document any deviations from design document

**Ready to start? Begin with Issue #1!**
