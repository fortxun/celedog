/**
 * CollectionScene - View all owned dogs in a grid layout
 * Includes filtering and sorting options
 */

import Phaser from 'phaser';
import { formatNumber } from '../utils/helpers.js';
import DogSprite from '../components/DogSprite.js';

class CollectionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CollectionScene' });
    this.currentFilter = 'all'; // 'all', 'common', 'uncommon', 'rare', 'epic', 'legendary'
    this.currentSort = 'newest'; // 'newest', 'oldest', 'rarity', 'name', 'value'
  }

  create() {
    const { width, height } = this.cameras.main;

    // Title
    this.add.text(width / 2, 60, 'My Collection', {
      font: 'bold 42px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Filter and sort controls
    this.createControls();

    // Scrollable container for dogs
    this.createScrollableGrid();

    // Display dogs
    this.refreshDisplay();
  }

  /**
   * Create filter and sort controls
   */
  createControls() {
    const { width } = this.cameras.main;

    // Filter label
    this.add.text(100, 120, 'Filter:', {
      font: '18px Arial',
      fill: '#ffffff'
    });

    // Filter buttons
    const filters = [
      { label: 'All', value: 'all' },
      { label: 'Common', value: 1 },
      { label: 'Uncommon', value: 2 },
      { label: 'Rare', value: 3 },
      { label: 'Epic', value: 4 },
      { label: 'Legendary', value: 5 }
    ];

    filters.forEach((filter, index) => {
      const x = 170 + index * 90;
      const y = 120;

      const button = this.createFilterButton(x, y, filter.label, () => {
        this.currentFilter = filter.value;
        this.refreshDisplay();
      });

      if (filter.value === this.currentFilter) {
        button.bg.setFillStyle(0x4CAF50);
      }
    });

    // Sort label
    this.add.text(100, 170, 'Sort:', {
      font: '18px Arial',
      fill: '#ffffff'
    });

    // Sort buttons
    const sorts = [
      { label: 'Newest', value: 'newest' },
      { label: 'Oldest', value: 'oldest' },
      { label: 'Rarity', value: 'rarity' },
      { label: 'Name', value: 'name' },
      { label: 'Value', value: 'value' }
    ];

    sorts.forEach((sort, index) => {
      const x = 170 + index * 90;
      const y = 170;

      const button = this.createFilterButton(x, y, sort.label, () => {
        this.currentSort = sort.value;
        this.refreshDisplay();
      });

      if (sort.value === this.currentSort) {
        button.bg.setFillStyle(0x4CAF50);
      }
    });
  }

  /**
   * Create filter/sort button
   */
  createFilterButton(x, y, text, callback) {
    const button = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, 80, 30, 0x555555);
    bg.setStrokeStyle(2, 0xffffff);

    const label = this.add.text(0, 0, text, {
      font: '14px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    button.add([bg, label]);
    button.bg = bg;
    button.label = label;

    button.setInteractive(
      new Phaser.Geom.Rectangle(-40, -15, 80, 30),
      Phaser.Geom.Rectangle.Contains
    );

    button.on('pointerover', () => {
      bg.setFillStyle(0x666666);
      this.game.canvas.style.cursor = 'pointer';
    });

    button.on('pointerout', () => {
      bg.setFillStyle(0x555555);
      this.game.canvas.style.cursor = 'default';
    });

    button.on('pointerdown', callback);

    return button;
  }

  /**
   * Create scrollable grid container
   */
  createScrollableGrid() {
    const { width, height } = this.cameras.main;

    // Container for dog cards
    this.gridContainer = this.add.container(0, 220);

    // Set up camera bounds for scrolling
    this.cameras.main.setBounds(0, 0, width, Math.max(height, 2000));

    // Mouse wheel scrolling
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      const scrollSpeed = 30;
      const newY = this.cameras.main.scrollY + deltaY * scrollSpeed;
      const maxScroll = Math.max(0, this.cameras.main.getBounds().height - this.cameras.main.height);

      this.cameras.main.scrollY = Phaser.Math.Clamp(newY, 0, maxScroll);
    });
  }

  /**
   * Refresh the display based on current filter and sort
   */
  refreshDisplay() {
    // Clear existing cards
    this.gridContainer.removeAll(true);

    const gameState = this.registry.get('gameState');
    let dogs = gameState.getAllDogs();

    // Apply filter
    if (this.currentFilter !== 'all') {
      dogs = dogs.filter(dog => dog.rarity === this.currentFilter);
    }

    // Apply sort
    dogs = this.sortDogs(dogs, this.currentSort);

    // Check if empty
    if (dogs.length === 0) {
      const { width } = this.cameras.main;
      const emptyText = this.add.text(width / 2, 400, 'No dogs found!', {
        font: '24px Arial',
        fill: '#888888'
      }).setOrigin(0.5);
      this.gridContainer.add(emptyText);
      return;
    }

    // Display dogs in grid
    const cardsPerRow = 4;
    const cardWidth = 200;
    const cardHeight = 280;
    const spacing = 20;
    const startX = 100;
    const startY = 0;

    dogs.forEach((dog, index) => {
      const row = Math.floor(index / cardsPerRow);
      const col = index % cardsPerRow;
      const x = startX + col * (cardWidth + spacing);
      const y = startY + row * (cardHeight + spacing);

      const card = this.createDogCard(x, y, dog);
      this.gridContainer.add(card);
    });

    // Update camera bounds based on content
    const totalRows = Math.ceil(dogs.length / cardsPerRow);
    const contentHeight = 220 + totalRows * (cardHeight + spacing) + 100;
    this.cameras.main.setBounds(0, 0, this.cameras.main.width, Math.max(this.cameras.main.height, contentHeight));
  }

  /**
   * Sort dogs array
   */
  sortDogs(dogs, sortType) {
    const sorted = [...dogs];

    switch (sortType) {
      case 'newest':
        sorted.sort((a, b) => b.birthTime - a.birthTime);
        break;
      case 'oldest':
        sorted.sort((a, b) => a.birthTime - b.birthTime);
        break;
      case 'rarity':
        sorted.sort((a, b) => b.rarity - a.rarity);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'value':
        sorted.sort((a, b) => b.value - a.value);
        break;
    }

    return sorted;
  }

  /**
   * Create a dog card
   */
  createDogCard(x, y, dog) {
    const card = this.add.container(x, y);

    // Background
    const rarityColors = {
      1: 0x888888, // Common - gray
      2: 0x4CAF50, // Uncommon - green
      3: 0x2196F3, // Rare - blue
      4: 0x9C27B0, // Epic - purple
      5: 0xFF9800  // Legendary - orange
    };
    const bgColor = rarityColors[dog.rarity] || 0x888888;

    const bg = this.add.rectangle(0, 0, 190, 270, bgColor, 0.2);
    bg.setStrokeStyle(3, bgColor);

    // Dog sprite using procedural generation
    const dogSprite = new DogSprite(this, 0, -60, dog, {
      size: 70,
      showName: false,
      showRarity: false,
      interactive: false
    });

    // Name
    const nameText = this.add.text(0, -10, dog.name, {
      font: 'bold 16px Arial',
      fill: '#ffffff',
      wordWrap: { width: 170 },
      align: 'center'
    }).setOrigin(0.5);

    // Rarity
    const rarityText = this.add.text(0, 20, dog.getRarityName(), {
      font: '14px Arial',
      fill: '#FFD700'
    }).setOrigin(0.5);

    // Generation
    const genText = this.add.text(0, 40, `Generation ${dog.generation}`, {
      font: '12px Arial',
      fill: '#CCCCCC'
    }).setOrigin(0.5);

    // Value
    const valueText = this.add.text(0, 60, `💰 ${formatNumber(dog.value)}`, {
      font: '14px Arial',
      fill: '#FFD700'
    }).setOrigin(0.5);

    // Traits summary
    const traitsText = this.add.text(0, 85, this.getTraitsSummary(dog), {
      font: '11px Arial',
      fill: '#AAAAAA',
      wordWrap: { width: 170 },
      align: 'center'
    }).setOrigin(0.5);

    // Special trait indicator
    if (dog.hasSpecialTrait()) {
      const specialBadge = this.add.text(0, 115, `⭐ ${dog.genes.specialTrait}`, {
        font: 'bold 12px Arial',
        fill: '#FFD700',
        backgroundColor: '#000000',
        padding: { x: 8, y: 4 }
      }).setOrigin(0.5);
      card.add(specialBadge);
    }

    card.add([bg, dogSprite, nameText, rarityText, genText, valueText, traitsText]);

    // Make card interactive
    card.setInteractive(
      new Phaser.Geom.Rectangle(-95, -135, 190, 270),
      Phaser.Geom.Rectangle.Contains
    );

    card.on('pointerover', () => {
      bg.setFillStyle(bgColor, 0.4);
      this.game.canvas.style.cursor = 'pointer';
    });

    card.on('pointerout', () => {
      bg.setFillStyle(bgColor, 0.2);
      this.game.canvas.style.cursor = 'default';
    });

    card.on('pointerdown', () => {
      this.showDogDetails(dog);
    });

    return card;
  }

  /**
   * Get traits summary text
   */
  getTraitsSummary(dog) {
    return `${dog.genes.bodyType} • ${dog.genes.temperament}`;
  }

  /**
   * Show detailed dog information modal
   */
  showDogDetails(dog) {
    const { width, height } = this.cameras.main;

    // Modal background
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.8);
    overlay.setOrigin(0);
    overlay.setInteractive();
    overlay.setScrollFactor(0);

    // Panel
    const panel = this.add.rectangle(width / 2, height / 2, 600, 500, 0x222222);
    panel.setStrokeStyle(4, 0xFFD700);
    panel.setScrollFactor(0);

    // Title
    const title = this.add.text(width / 2, height / 2 - 220, dog.name, {
      font: 'bold 28px Arial',
      fill: '#FFD700'
    }).setOrigin(0.5);
    title.setScrollFactor(0);

    // Sprite using DogSprite
    const dogSprite = new DogSprite(this, width / 2, height / 2 - 140, dog, {
      size: 100,
      showName: false,
      showRarity: false,
      interactive: false
    });
    dogSprite.setScrollFactor(0);

    // Detailed info
    const info = `Rarity: ${dog.getRarityName()}
Generation: ${dog.generation}
Value: ${formatNumber(dog.value)} gold

Genes:
• Body: ${dog.genes.bodyType}
• Temperament: ${dog.genes.temperament}
• Talent: ${dog.genes.talent}
• Ear Type: ${dog.genes.earType}
• Tail Type: ${dog.genes.tailType}
• Marking: ${dog.genes.markingPattern}
• Celebrity Influence: ${(dog.genes.celebrityInfluence * 100).toFixed(0)}%
${dog.hasSpecialTrait() ? `\n⭐ Special Trait: ${dog.genes.specialTrait}` : ''}

${dog.parentIds.length > 0 ? `Parents: ${dog.parentIds.length}` : 'Starter Dog'}
Born: ${new Date(dog.birthTime).toLocaleDateString()}`;

    const infoText = this.add.text(width / 2, height / 2, info, {
      font: '16px Arial',
      fill: '#ffffff',
      align: 'center',
      lineSpacing: 4
    }).setOrigin(0.5);
    infoText.setScrollFactor(0);

    // Close button
    const closeBtn = this.add.text(width / 2, height / 2 + 210, 'Close', {
      font: 'bold 20px Arial',
      fill: '#ffffff',
      backgroundColor: '#4CAF50',
      padding: { x: 30, y: 12 }
    }).setOrigin(0.5).setInteractive();
    closeBtn.setScrollFactor(0);

    closeBtn.on('pointerdown', () => {
      overlay.destroy();
      panel.destroy();
      title.destroy();
      dogSprite.destroy();
      infoText.destroy();
      closeBtn.destroy();
    });

    closeBtn.on('pointerover', () => {
      this.game.canvas.style.cursor = 'pointer';
    });

    closeBtn.on('pointerout', () => {
      this.game.canvas.style.cursor = 'default';
    });
  }
}

export default CollectionScene;
