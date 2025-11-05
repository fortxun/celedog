/**
 * SaveSystem - Manages game state persistence
 * Uses LocalStorage with versioning and validation
 */

import GameState from '../utils/GameState.js';
import CelebrityDog from '../entities/CelebrityDog.js';

const SAVE_KEY = 'celedog_save';
const SAVE_VERSION = '1.0.0';

class SaveSystem {
  /**
   * Save current game state to LocalStorage
   * @param {GameState} gameState - Game state to save
   * @returns {{success: boolean, message: string}} Save result
   */
  static saveGame(gameState) {
    try {
      if (!gameState) {
        return {
          success: false,
          message: 'No game state to save'
        };
      }

      const saveData = this.serializeGameState(gameState);

      // Add metadata
      const saveObject = {
        version: SAVE_VERSION,
        timestamp: Date.now(),
        data: saveData
      };

      // Convert to JSON
      const jsonString = JSON.stringify(saveObject);

      // Check size (LocalStorage limit is ~5-10MB depending on browser)
      const sizeInBytes = new Blob([jsonString]).size;
      if (sizeInBytes > 5000000) { // 5MB limit
        return {
          success: false,
          message: 'Save data too large. Consider clearing old data.'
        };
      }

      // Save to LocalStorage
      localStorage.setItem(SAVE_KEY, jsonString);

      return {
        success: true,
        message: 'Game saved successfully',
        size: sizeInBytes
      };
    } catch (error) {
      console.error('Save failed:', error);
      return {
        success: false,
        message: `Save failed: ${error.message}`
      };
    }
  }

  /**
   * Load game state from LocalStorage
   * @returns {{success: boolean, gameState: GameState|null, message: string}} Load result
   */
  static loadGame() {
    try {
      const jsonString = localStorage.getItem(SAVE_KEY);

      if (!jsonString) {
        return {
          success: false,
          gameState: null,
          message: 'No save data found'
        };
      }

      // Parse JSON
      const saveObject = JSON.parse(jsonString);

      // Validate save version
      const validation = this.validateSave(saveObject);
      if (!validation.valid) {
        return {
          success: false,
          gameState: null,
          message: validation.message
        };
      }

      // Deserialize game state
      const gameState = this.deserializeGameState(saveObject.data);

      return {
        success: true,
        gameState,
        message: 'Game loaded successfully',
        timestamp: saveObject.timestamp
      };
    } catch (error) {
      console.error('Load failed:', error);
      return {
        success: false,
        gameState: null,
        message: `Load failed: ${error.message}`
      };
    }
  }

  /**
   * Check if save data exists
   * @returns {boolean} True if save exists
   */
  static hasSaveData() {
    return localStorage.getItem(SAVE_KEY) !== null;
  }

  /**
   * Delete save data
   * @returns {{success: boolean, message: string}} Delete result
   */
  static deleteSave() {
    try {
      localStorage.removeItem(SAVE_KEY);
      return {
        success: true,
        message: 'Save data deleted'
      };
    } catch (error) {
      return {
        success: false,
        message: `Delete failed: ${error.message}`
      };
    }
  }

  /**
   * Get save metadata without loading full state
   * @returns {Object|null} Save metadata or null
   */
  static getSaveMetadata() {
    try {
      const jsonString = localStorage.getItem(SAVE_KEY);
      if (!jsonString) return null;

      const saveObject = JSON.parse(jsonString);
      return {
        version: saveObject.version,
        timestamp: saveObject.timestamp,
        dogCount: saveObject.data?.dogs?.length || 0,
        gold: saveObject.data?.player?.gold || 0,
        generation: saveObject.data?.stats?.highestGeneration || 0
      };
    } catch (error) {
      console.error('Failed to get save metadata:', error);
      return null;
    }
  }

  /**
   * Serialize game state to plain object
   * @param {GameState} gameState - Game state to serialize
   * @returns {Object} Serialized data
   */
  static serializeGameState(gameState) {
    return {
      player: {
        gold: gameState.player.gold,
        kennelCapacity: gameState.player.kennelCapacity
      },
      dogs: gameState.dogs.map(dog => dog.serialize()),
      lineage: Array.from(gameState.lineage.pedigree.entries()),
      stats: { ...gameState.stats },
      settings: { ...gameState.settings }
    };
  }

  /**
   * Deserialize plain object to game state
   * @param {Object} data - Serialized data
   * @returns {GameState} Reconstructed game state
   */
  static deserializeGameState(data) {
    const gameState = GameState.getInstance();

    // Restore player data
    gameState.player.gold = data.player.gold;
    gameState.player.kennelCapacity = data.player.kennelCapacity;

    // Restore dogs
    gameState.dogs = data.dogs.map(dogData =>
      CelebrityDog.deserialize(dogData)
    );

    // Restore lineage
    gameState.lineage.pedigree = new Map(data.lineage);

    // Restore stats
    gameState.stats = { ...data.stats };

    // Restore settings
    gameState.settings = { ...data.settings };

    return gameState;
  }

  /**
   * Validate save data
   * @param {Object} saveObject - Save object to validate
   * @returns {{valid: boolean, message: string}} Validation result
   */
  static validateSave(saveObject) {
    // Check structure
    if (!saveObject || typeof saveObject !== 'object') {
      return {
        valid: false,
        message: 'Invalid save data structure'
      };
    }

    // Check version
    if (!saveObject.version) {
      return {
        valid: false,
        message: 'Save data missing version'
      };
    }

    // Check version compatibility
    if (!this.isVersionCompatible(saveObject.version)) {
      return {
        valid: false,
        message: `Incompatible save version: ${saveObject.version}`
      };
    }

    // Check required data
    if (!saveObject.data || !saveObject.data.player || !saveObject.data.dogs) {
      return {
        valid: false,
        message: 'Save data missing required fields'
      };
    }

    return {
      valid: true,
      message: 'Save data valid'
    };
  }

  /**
   * Check if save version is compatible with current game version
   * @param {string} saveVersion - Version string to check
   * @returns {boolean} True if compatible
   */
  static isVersionCompatible(saveVersion) {
    // For now, only accept exact version match
    // In future, implement migration logic for older versions
    return saveVersion === SAVE_VERSION;
  }

  /**
   * Export save data as downloadable JSON file
   * @returns {{success: boolean, message: string}} Export result
   */
  static exportSave() {
    try {
      const jsonString = localStorage.getItem(SAVE_KEY);
      if (!jsonString) {
        return {
          success: false,
          message: 'No save data to export'
        };
      }

      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `celedog_save_${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);

      return {
        success: true,
        message: 'Save exported successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: `Export failed: ${error.message}`
      };
    }
  }

  /**
   * Import save data from JSON file
   * @param {File} file - JSON file to import
   * @returns {Promise<{success: boolean, message: string}>} Import result
   */
  static async importSave(file) {
    try {
      const text = await file.text();
      const saveObject = JSON.parse(text);

      // Validate
      const validation = this.validateSave(saveObject);
      if (!validation.valid) {
        return {
          success: false,
          message: validation.message
        };
      }

      // Save to LocalStorage
      localStorage.setItem(SAVE_KEY, text);

      return {
        success: true,
        message: 'Save imported successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: `Import failed: ${error.message}`
      };
    }
  }

  /**
   * Create a backup save slot
   * @returns {{success: boolean, message: string}} Backup result
   */
  static createBackup() {
    try {
      const jsonString = localStorage.getItem(SAVE_KEY);
      if (!jsonString) {
        return {
          success: false,
          message: 'No save data to backup'
        };
      }

      const backupKey = `${SAVE_KEY}_backup_${Date.now()}`;
      localStorage.setItem(backupKey, jsonString);

      return {
        success: true,
        message: 'Backup created successfully',
        backupKey
      };
    } catch (error) {
      return {
        success: false,
        message: `Backup failed: ${error.message}`
      };
    }
  }

  /**
   * List all backup saves
   * @returns {Array<{key: string, timestamp: number, metadata: Object}>} List of backups
   */
  static listBackups() {
    const backups = [];
    const prefix = `${SAVE_KEY}_backup_`;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        const timestampStr = key.replace(prefix, '');
        const timestamp = parseInt(timestampStr, 10);

        try {
          const jsonString = localStorage.getItem(key);
          const saveObject = JSON.parse(jsonString);
          backups.push({
            key,
            timestamp,
            metadata: {
              dogCount: saveObject.data?.dogs?.length || 0,
              gold: saveObject.data?.player?.gold || 0
            }
          });
        } catch (error) {
          console.error(`Failed to parse backup ${key}:`, error);
        }
      }
    }

    return backups.sort((a, b) => b.timestamp - a.timestamp);
  }
}

export default SaveSystem;
