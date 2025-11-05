/**
 * PreloadScene - Asset loading
 * Loads all game assets with progress indicator
 */

import Phaser from 'phaser';

class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    // Create loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 30, 320, 50);

    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      font: '20px Arial',
      fill: '#ffffff'
    });
    loadingText.setOrigin(0.5);

    const percentText = this.add.text(width / 2, height / 2, '0%', {
      font: '18px Arial',
      fill: '#ffffff'
    });
    percentText.setOrigin(0.5);

    // Update progress bar
    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 20, 300 * value, 30);
      percentText.setText(Math.floor(value * 100) + '%');
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

    // Load assets
    // Note: Since we don't have real assets yet, we'll create placeholder textures in create()
    // In production, load actual sprite assets here:
    // this.load.image('body_athletic', 'assets/bodies/athletic.png');
    // this.load.image('head_wahlberg', 'assets/heads/wahlberg.png');
    // etc.
  }

  create() {
    // Create placeholder textures for now
    this.createPlaceholderTextures();

    // Display start message
    const startText = this.add.text(640, 360, 'Click to Start', {
      font: '32px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Pulse animation
    this.tweens.add({
      targets: startText,
      alpha: 0.5,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });

    // Click to start
    this.input.once('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }

  /**
   * Create placeholder colored textures for development
   */
  createPlaceholderTextures() {
    const graphics = this.add.graphics();

    // Body placeholders
    const bodies = ['athletic', 'stocky', 'slim', 'fluffy', 'tiny'];
    const bodyColors = [0x8B4513, 0xA0522D, 0xD2691E, 0xDEB887, 0xF4A460];

    bodies.forEach((type, index) => {
      graphics.clear();
      graphics.fillStyle(bodyColors[index], 1);
      graphics.fillCircle(64, 64, 50);
      graphics.generateTexture(`body_${type}`, 128, 128);
    });

    // Celebrity head placeholders
    const celebrities = [
      'wahlberg', 'sjp', 'chewbarka', 'pupcasso', 'obama',
      'fluff_daddy', 'hairy_styles', 'lick_jagger', 'droolius', 'winona'
    ];

    celebrities.forEach((celeb, index) => {
      graphics.clear();
      graphics.fillStyle(0xFFD700, 1);
      graphics.fillCircle(128, 128, 60);
      graphics.lineStyle(4, 0xFF8C00);
      graphics.strokeCircle(128, 128, 60);
      graphics.generateTexture(`head_${celeb}`, 256, 256);
    });

    // Ear placeholders
    const ears = ['floppy', 'pointed', 'small', 'large'];
    ears.forEach((type) => {
      graphics.clear();
      graphics.fillStyle(0x8B4513, 1);
      graphics.fillEllipse(32, 32, 40, 60);
      graphics.generateTexture(`ears_${type}`, 64, 64);
    });

    // Tail placeholders
    const tails = ['curly', 'straight', 'bushy', 'short'];
    tails.forEach((type) => {
      graphics.clear();
      graphics.fillStyle(0x8B4513, 1);
      graphics.fillRect(16, 16, 32, 48);
      graphics.generateTexture(`tail_${type}`, 64, 64);
    });

    // Pattern placeholders
    graphics.clear();
    graphics.fillStyle(0x000000, 0.5);
    for (let i = 0; i < 10; i++) {
      graphics.fillCircle(Math.random() * 128, Math.random() * 128, 10);
    }
    graphics.generateTexture('pattern_spotted', 128, 128);

    graphics.clear();
    graphics.fillStyle(0x000000, 0.5);
    for (let i = 0; i < 8; i++) {
      graphics.fillRect(0, i * 16, 128, 8);
    }
    graphics.generateTexture('pattern_striped', 128, 128);

    graphics.clear();
    graphics.fillStyle(0x000000, 0.5);
    graphics.fillRect(0, 0, 64, 64);
    graphics.fillRect(64, 64, 64, 64);
    graphics.generateTexture('pattern_patched', 128, 128);

    graphics.destroy();
  }
}

export default PreloadScene;
