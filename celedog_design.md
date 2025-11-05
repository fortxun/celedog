# Celebrity Dog Breeding Game: Complete Implementation Plan

**Phaser 3.90.0 "Tsugumi" | Modern Web Stack | Production-Ready Architecture**

## Executive summary

This plan provides a complete, implementable roadmap for building a celebrity dog breeding game using Phaser 3, addressing the critical challenge that **SVG graphics convert to static bitmaps** in Phaser. The solution uses **Canvas-based procedural generation** combined with **layered sprite composition** to achieve the morphing effects needed for breeding mechanics. The architecture prioritizes performance, scalability, and ease of implementation with Claude Code.

---

## System architecture overview

### Technology stack recommendation

**Core Framework:**
- **Phaser 3.90.0+** - Latest stable version with enhanced filters and performance
- **rexUI Plugin** - Comprehensive UI components for breeding interfaces
- **Canvas 2D API** - Procedural character generation (replacing SVG morphing)
- **IndexedDB** - Save system for large datasets (generations of dogs)
- **LocalStorage** - Quick saves and session data

**Critical SVG Limitation:**
Phaser loads SVGs but **rasterizes them to bitmaps** immediately. You cannot dynamically morph, blend, or modify SVG paths at runtime. This eliminates true SVG morphing from consideration.

**Recommended Approach:**
1. Use SVG for asset creation (Illustrator, Inkscape) - designers work in vectors
2. Export components as separate SVGs (heads, bodies, features)
3. Load as individual textures in Phaser
4. Composite at runtime using RenderTexture or Canvas 2D
5. Apply procedural modifications (tints, scales, blending) for offspring

---

## Data models

### Dog data structure

```javascript
class CelebrityDog {
  constructor(genes, generation = 0, parentIds = []) {
    this.id = generateUUID();
    this.genes = genes;
    this.generation = generation;
    this.parentIds = parentIds;
    this.birthTime = Date.now();
    this.name = '';
    this.value = this.calculateValue();
    this.rarity = this.calculateRarity();
  }
  
  serialize() {
    return {
      id: this.id,
      genes: this.genes,
      generation: this.generation,
      parentIds: this.parentIds,
      birthTime: this.birthTime,
      name: this.name,
      value: this.value,
      rarity: this.rarity
    };
  }
}

// Genes structure
const genes = {
  // Visual traits
  bodyType: 'athletic' | 'stocky' | 'slim' | 'fluffy' | 'tiny',
  coatColor: '#RRGGBB',
  markingPattern: 'solid' | 'spotted' | 'striped' | 'patched',
  markingColor: '#RRGGBB',
  earType: 'floppy' | 'pointed' | 'small' | 'large',
  tailType: 'curly' | 'straight' | 'bushy' | 'short',
  
  // Celebrity traits
  celebrityHeadId: 'celeb_001',
  celebrityInfluence: 0.7, // 0-1
  
  // Personality traits
  temperament: 'playful' | 'lazy' | 'energetic' | 'sophisticated' | 'goofy',
  talent: 'singing' | 'acting' | 'sports' | 'comedy' | 'modeling',
  
  // Special traits
  specialTrait: null | 'redCarpet' | 'paparazziMagnet' | 'awardWinner'
};
```

### Trait inheritance algorithm

```javascript
class GeneticSystem {
  breed(parent1Genes, parent2Genes) {
    const offspring = {};
    
    for (let trait in parent1Genes) {
      const roll = Math.random();
      
      if (roll < 0.5) {
        // 50%: Inherit from random parent
        offspring[trait] = Math.random() < 0.5 ? parent1Genes[trait] : parent2Genes[trait];
      } else if (roll < 0.9) {
        // 40%: Blend traits
        offspring[trait] = this.blendTrait(trait, parent1Genes[trait], parent2Genes[trait]);
      } else {
        // 10%: Mutation
        offspring[trait] = this.mutateTrait(trait);
      }
    }
    
    offspring.specialTrait = this.checkSynergies(offspring);
    return offspring;
  }
  
  blendTrait(traitName, value1, value2) {
    switch (traitName) {
      case 'coatColor':
      case 'markingColor':
        return this.blendColors(value1, value2);
      case 'celebrityInfluence':
        return (value1 + value2) / 2;
      default:
        return Math.random() < 0.5 ? value1 : value2;
    }
  }
  
  blendColors(color1, color2) {
    const c1 = this.hexToRgb(color1);
    const c2 = this.hexToRgb(color2);
    
    const blend = (v1, v2) => {
      const avg = (v1 + v2) / 2;
      const variation = (Math.random() - 0.5) * 40;
      return Math.max(0, Math.min(255, Math.round(avg + variation)));
    };
    
    return this.rgbToHex(blend(c1.r, c2.r), blend(c1.g, c2.g), blend(c1.b, c2.b));
  }
}
```

### Rarity system

**Tiers:** Common (60%), Uncommon (25%), Rare (12%), Epic (2.5%), Legendary (0.5%)

```javascript
class RaritySystem {
  static calculateRarity(parent1Rarity, parent2Rarity, genes) {
    const avgRarity = (parent1Rarity + parent2Rarity) / 2;
    let bonus = 0;
    if (genes.specialTrait) bonus += 1;
    if (genes.celebrityInfluence > 0.8) bonus += 0.5;
    
    const roll = Math.random();
    let rarityValue = avgRarity + bonus;
    
    if (roll < 0.55) rarityValue = Math.floor(rarityValue);
    else if (roll < 0.90) rarityValue = Math.min(5, Math.ceil(rarityValue) + 1);
    else rarityValue = Math.min(5, Math.ceil(rarityValue) + 2);
    
    return Math.max(1, Math.min(5, Math.round(rarityValue)));
  }
}
```

---

## Phaser scene structure

### Scene architecture

```javascript
const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  backgroundColor: '#87CEEB',
  scene: [BootScene, PreloadScene, MenuScene, GameScene, CollectionScene, 
          BreedingScene, ShopScene, PedigreeScene, UIScene],
  plugins: {
    scene: [{ key: 'rexUI', plugin: RexUIPlugin, mapping: 'rexUI' }]
  }
};
```

### Key scene implementations

**GameScene** - Main hub with kennel view and dog management
**BreedingScene** - Modal interface for selecting parents and breeding
**UIScene** - Persistent overlay with stats and navigation
**CollectionScene** - Grid view of all owned dogs
**ShopScene** - Buy starter dogs or sell offspring
**PedigreeScene** - Family tree visualization using D3.js-style layout

---

## Breeding algorithm pseudocode

```
FUNCTION breed(parent1, parent2):
  offspring = {}
  
  FOR EACH trait IN parent1.genes:
    roll = random(0, 1)
    
    IF roll < 0.5:
      offspring[trait] = random_choice([parent1.genes[trait], parent2.genes[trait]])
    ELSE IF roll < 0.9:
      offspring[trait] = blend(parent1.genes[trait], parent2.genes[trait])
    ELSE:
      offspring[trait] = random_mutation(trait)
  END FOR
  
  offspring.specialTrait = check_synergies(offspring)
  offspring.rarity = calculate_rarity(parent1.rarity, parent2.rarity, offspring)
  offspring.generation = max(parent1.generation, parent2.generation) + 1
  offspring.name = generate_pun_name(parent1.name, parent2.name)
  
  RETURN offspring
END FUNCTION
```

---

## Pun name generation approach

### Three-tier strategy

**Method 1: Portmanteau (50% probability)**
```javascript
createPortmanteau(name1, name2) {
  const words1 = name1.split(' ');
  const words2 = name2.split(' ');
  const mid1 = Math.floor(words1[0].length / 2);
  const mid2 = Math.floor(words2[words2.length - 1].length / 2);
  return words1[0].substring(0, mid1) + words2[words2.length - 1].substring(mid2);
}
// "Bark Wahlberg" + "Sarah Jessica Barker" = "BarWahlker" or "Sarberg"
```

**Method 2: Trait-based pun (30% probability)**
```javascript
const punDatabase = {
  athletic: ['Pawlympian', 'Fetchival', 'Sporty Spice-paw'],
  fluffy: ['Fluff Daddy', 'Hairy Styles', 'Fur-nando'],
  sophisticated: ['Bark-tisocrat', 'Paws-itively Posh', 'Haute Dog'],
  goofy: ['Derp Doginson', 'Silly Cyrus', 'Goofball Grande']
};
```

**Method 3: Markov chain generation (20% probability)**
```javascript
buildMarkovChain(existingNames, order=2) {
  // Analyze existing celebrity dog names
  // Generate statistically similar but unique names
  // Example: "Brad Pittbull", "Chew-barka", "Jimmy Chew"
}
```

---

## Economic system design

### Pricing structure

```javascript
const prices = {
  breeding: {
    base: 100,
    rarityMultiplier: [1, 2, 5, 10, 20], // By tier
    generationBonus: 0.15 // +15% per generation
  },
  purchase: {
    common: 500, uncommon: 2000, rare: 10000, 
    epic: 40000, legendary: 150000
  },
  kennelExpansion: [1000, 2500, 5000, 10000] // +10 slots each
};

calculateBreedingCost(p1, p2) {
  avgRarity = (p1.rarity + p2.rarity) / 2;
  avgGen = (p1.generation + p2.generation) / 2;
  return base * rarityMultiplier[avgRarity-1] * (1 + avgGen * generationBonus);
}
```

### Economic balancing

**Income sources:**
- Mini-games/shows: 200-500 gold per win
- Selling dogs: 50% of purchase value
- Daily login: 500 gold
- Achievements: 1000-5000 gold

**Design principles:**
- Common breeding affordable in 5 minutes gameplay
- Rare breeding requires 20-30 minutes or strategic saving
- Players earn 30-50 gold per minute of active play
- Avoid grinding fatigue - progression should feel rewarding

---

## Procedural character generation

### Asset organization

```
assets/
├── heads/
│   ├── wahlberg.png (exported from SVG at 256x256)
│   ├── sjp.png
│   ├── obama.png
│   └── ... (10 starter celebrities)
├── bodies/
│   ├── athletic.png
│   ├── stocky.png
│   ├── slim.png
│   ├── fluffy.png
│   └── tiny.png
├── features/
│   ├── ears_floppy.png
│   ├── ears_pointed.png
│   ├── tail_curly.png
│   └── tail_straight.png
└── patterns/
    ├── spots.png
    ├── stripes.png
    └── patches.png
```

### Layered composition system

```javascript
class ProceduralDogGenerator {
  generateDogTexture(genes) {
    const key = `dog_${genes.celebrityHeadId}_${genes.bodyType}_${genes.coatColor}`;
    
    if (this.scene.textures.exists(key)) return key;
    
    const rt = this.scene.add.renderTexture(0, 0, 128, 128);
    
    // Layer 1: Body with color tint
    const body = this.scene.add.sprite(64, 64, `body_${genes.bodyType}`);
    body.setTint(parseInt(genes.coatColor.replace('#', '0x')));
    rt.draw(body);
    body.destroy();
    
    // Layer 2: Markings
    if (genes.markingPattern !== 'solid') {
      const marking = this.scene.add.sprite(64, 64, `pattern_${genes.markingPattern}`);
      marking.setTint(parseInt(genes.markingColor.replace('#', '0x')));
      marking.setAlpha(0.7);
      rt.draw(marking);
      marking.destroy();
    }
    
    // Layer 3: Features
    const ears = this.scene.add.sprite(64, 30, `ears_${genes.earType}`);
    rt.draw(ears);
    ears.destroy();
    
    const tail = this.scene.add.sprite(90, 80, `tail_${genes.tailType}`);
    rt.draw(tail);
    tail.destroy();
    
    // Layer 4: Celebrity head
    const head = this.scene.add.sprite(64, 40, genes.celebrityHeadId);
    head.setScale(0.4 * genes.celebrityInfluence);
    rt.draw(head);
    head.destroy();
    
    rt.saveTexture(key);
    rt.destroy();
    return key;
  }
}
```

---

## Feature prioritization for v1.0

### MVP (Minimum Viable Product)

**Week 1-2: Foundation**
- ✓ Phaser setup with scene structure
- ✓ Asset loading system
- ✓ Basic procedural generation
- ✓ Data models

**Week 3-4: Core mechanics**
- ✓ Breeding system with inheritance
- ✓ Economy (gold, buy/sell)
- ✓ Name generation
- ✓ Save/load system

**Week 5-6: Polish**
- ✓ 5-10 starter dogs
- ✓ Rarity system
- ✓ UI polish
- ✓ Tutorial

### Post-launch roadmap

**v1.1:** Dog shows, leaderboards, social sharing
**v1.2:** Achievements, unlockables, kennel upgrades
**v1.3:** Advanced breeding projects, family tree viewer
**v1.4:** Monetization (optional premium content)

---

## Code structure for Claude Code

```
celeb-dog-breeder/
├── index.html
├── package.json
├── src/
│   ├── main.js
│   ├── config.js
│   ├── scenes/
│   │   ├── BootScene.js
│   │   ├── PreloadScene.js
│   │   ├── MenuScene.js
│   │   ├── GameScene.js
│   │   ├── BreedingScene.js
│   │   ├── CollectionScene.js
│   │   ├── ShopScene.js
│   │   └── UIScene.js
│   ├── systems/
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
    ├── heads/
    ├── bodies/
    ├── features/
    └── sounds/
```

---

## Specific Phaser APIs to use

### Core APIs

**Loading assets:**
```javascript
this.load.image('body_athletic', 'assets/bodies/athletic.png');
this.load.atlas('dogs', 'assets/dogs.png', 'assets/dogs.json');
```

**RenderTexture for compositing:**
```javascript
const rt = this.add.renderTexture(x, y, width, height);
rt.draw(sprite);
rt.saveTexture('composite_key');
```

**Object pooling:**
```javascript
this.dogPool = this.add.group({
  classType: DogSprite,
  maxSize: 50,
  runChildUpdate: true
});
```

**Scene management:**
```javascript
this.scene.launch('UIScene'); // Run in parallel
this.scene.pause('GameScene');
this.scene.resume('GameScene');
```

**Tweens for animations:**
```javascript
this.tweens.add({
  targets: sprite,
  scale: { from: 0, to: 1 },
  duration: 500,
  ease: 'Back.easeOut'
});
```

**Event system:**
```javascript
this.events.emit('dog-bred', offspring);
this.events.on('dog-bred', (dog) => this.handleNewDog(dog));
```

**Data registry (global state):**
```javascript
this.registry.set('player-gold', 1000);
this.registry.get('player-gold');
this.registry.events.on('changedata-player-gold', (parent, value) => {});
```

---

## Technical challenges and solutions

### Challenge 1: SVG morphing limitation

**Problem:** Phaser converts SVGs to static bitmaps; cannot dynamically morph paths.

**Solution:** 
- Use layered sprite composition with RenderTexture
- Apply color tints for variation (Phaser `setTint()`)
- Cache generated textures to avoid performance hits
- Pre-generate common combinations

### Challenge 2: Performance with many dogs

**Problem:** Displaying 50+ dogs simultaneously can cause lag.

**Solution:**
- Object pooling for dog sprites (reuse instead of create/destroy)
- Culling: only render dogs in viewport
- Use texture atlases to minimize draw calls
- Separate data storage from visual representation
- Limit active animations

```javascript
// Culling example
update() {
  this.dogs.children.entries.forEach(dog => {
    const inView = this.cameras.main.worldView.contains(dog.x, dog.y);
    dog.setVisible(inView);
    if (inView) dog.update();
  });
}
```

### Challenge 3: Lineage tracking complexity

**Problem:** Family trees can grow exponentially; querying ancestry is expensive.

**Solution:**
- Use Map data structures for O(1) lookups
- Archive old generations to IndexedDB
- Limit ancestry queries to 3-5 generations
- Lazy-load family tree visualization

```javascript
class LineageManager {
  getAncestry(dogId, maxDepth = 3) {
    const queue = [{ id: dogId, depth: 0 }];
    const ancestry = [];
    
    while (queue.length > 0) {
      const { id, depth } = queue.shift();
      if (depth >= maxDepth) continue;
      
      const entry = this.pedigree.get(id);
      ancestry.push(entry);
      entry.parents.forEach(p => queue.push({ id: p, depth: depth + 1 }));
    }
    return ancestry;
  }
}
```

### Challenge 4: Name generation quality

**Problem:** Simple concatenation produces boring names; advanced generation is complex.

**Solution:**
- Three-tier approach: portmanteau, trait-based puns, Markov chains
- Curated database of 50+ celebrity pun templates
- Fallback to simple combination if advanced methods fail
- Allow manual naming as player reward

### Challenge 5: Economic balance

**Problem:** Too easy = boring; too grindy = frustrating.

**Solution:**
- Playtest target: 5 minutes to common breed, 20 minutes to rare breed
- Dynamic difficulty adjustment based on player level
- Multiple income sources (shows, selling, dailies)
- "Bad luck protection" - guaranteed rare after 10 attempts

### Challenge 6: Save file corruption

**Problem:** LocalStorage can fail; IndexedDB is complex.

**Solution:**
- Dual save system (LocalStorage + IndexedDB backup)
- Version number in save files for migration
- Validate save data before loading
- Auto-save every 60 seconds + on window close

```javascript
class SaveSystem {
  save() {
    const data = { version: '1.0.0', timestamp: Date.now(), ...gameState };
    localStorage.setItem('save', JSON.stringify(data));
    this.saveToIndexedDB(data); // Async backup
  }
  
  load() {
    try {
      const data = JSON.parse(localStorage.getItem('save'));
      if (this.validateSave(data)) return this.applySave(data);
    } catch (e) {
      return this.loadFromIndexedDB(); // Fallback
    }
  }
}
```

---

## Performance optimization checklist

✓ Use texture atlases for all sprites
✓ Object pooling for frequently created/destroyed objects
✓ Culling offscreen entities
✓ Limit update loop operations (check status once per second, not every frame)
✓ Cache procedurally generated textures
✓ Use `setInteractive()` only on interactive objects
✓ Separate heavy data from game objects (use Map for storage)
✓ Archive old generation data to IndexedDB
✓ Lazy-load family tree visualization
✓ Throttle auto-save to every 60 seconds

---

## Testing strategy

### Unit tests
- Genetic algorithm produces valid genes
- Rarity calculation within expected bounds
- Name generation doesn't produce empty strings
- Economy calculations are consistent

### Integration tests
- Breeding produces valid offspring
- Save/load preserves all data
- UI updates reflect state changes
- Lineage tracking maintains referential integrity

### Playtesting focus
- Breeding feels rewarding (dopamine hits)
- Economy is balanced (not too easy/hard)
- Names are funny/clever
- UI is intuitive
- Performance is smooth (60 FPS with 50 dogs)

---

## Starter celebrity dog roster

1. **Bark Wahlberg** - Athletic body, tough guy persona
2. **Sarah Jessica Barker** - Slim body, sophisticated
3. **Chew-barka** - Fluffy body, playful
4. **Pupcasso** - Stocky body, artistic vibe
5. **Bark Obama** - Athletic body, charismatic
6. **Fluff Daddy** - Fluffy body, hip-hop style
7. **Hairy Styles** - Slim body, fashionable
8. **Lick Jagger** - Athletic body, rock star
9. **Droolius Caesar** - Stocky body, commanding
10. **Winona Ryder (Wind-ona Ruff-er)** - Slim body, quirky

Each has unique color palette and personality traits to maximize breeding variety.

---

## Implementation timeline

**Week 1:** Phaser setup, asset pipeline, basic procedural generation
**Week 2:** Data models, genetic system, breeding algorithm
**Week 3:** Scene structure, UI with rexUI, navigation
**Week 4:** Economy system, shop, collection view
**Week 5:** Name generation, lineage tracking, family tree
**Week 6:** Save/load, polish, tutorial, playtesting
**Week 7:** Bug fixes, optimization, final polish
**Week 8:** Launch preparation, marketing assets

---

## Success metrics

- **Engagement:** Average session length 15+ minutes
- **Retention:** 40% D1, 20% D7 retention
- **Virality:** 10% of players share dogs on social media
- **Progression:** Players reach generation 5+ within first week
- **Monetization (if applicable):** 2-5% conversion to paying users

---

## Conclusion

This implementation plan provides a complete, production-ready architecture for building a celebrity dog breeding game in Phaser 3. The key innovation is **solving the SVG limitation** through layered sprite composition and Canvas-based generation, while maintaining the visual flexibility needed for breeding mechanics.

The economic system is balanced for casual gameplay (5-minute sessions), the genetic algorithm provides meaningful strategic choices, and the pun-based naming system delivers the comedic hook that makes the concept memorable.

All systems are designed with Claude Code implementation in mind: modular structure, clear separation of concerns, and well-documented code examples. The phased development approach ensures a playable prototype within 2 weeks and a polished MVP within 6-8 weeks.

**Start with the foundation (Week 1-2), iterate on core mechanics (Week 3-4), then polish ruthlessly (Week 5-6). Ship the MVP and iterate based on player feedback.**