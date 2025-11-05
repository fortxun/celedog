/**
 * Main entry point for Celedog game
 */

import Phaser from 'phaser';
import { gameConfig } from './config.js';

// Initialize the game
const game = new Phaser.Game(gameConfig);

// Export game instance for debugging
window.game = game;
