/**
 * Lineage Manager
 * Tracks family trees and ancestry relationships
 * Uses BFS for efficient ancestry queries
 */

class LineageManager {
  constructor() {
    this.pedigree = new Map(); // dogId -> { parents: [], children: [] }
  }

  /**
   * Add a dog to the lineage system
   * @param {CelebrityDog} dog - Dog to add
   */
  addDog(dog) {
    // Initialize lineage entry for this dog
    if (!this.pedigree.has(dog.id)) {
      this.pedigree.set(dog.id, {
        parents: dog.parentIds || [],
        children: []
      });
    }

    // Update parent lineage entries
    if (dog.parentIds && dog.parentIds.length > 0) {
      dog.parentIds.forEach(parentId => {
        if (!this.pedigree.has(parentId)) {
          // Parent not in system yet, create entry
          this.pedigree.set(parentId, {
            parents: [],
            children: [dog.id]
          });
        } else {
          // Parent exists, add this dog as child
          const parentEntry = this.pedigree.get(parentId);
          if (!parentEntry.children.includes(dog.id)) {
            parentEntry.children.push(dog.id);
          }
        }
      });
    }
  }

  /**
   * Get ancestry for a dog using BFS (limited depth)
   * @param {string} dogId - ID of dog
   * @param {number} maxDepth - Maximum generations to traverse (default 3)
   * @returns {Array<{id: string, depth: number, relationship: string}>} Ancestry data
   */
  getAncestry(dogId, maxDepth = 3) {
    const queue = [{ id: dogId, depth: 0 }];
    const visited = new Set();
    const ancestry = [];

    while (queue.length > 0) {
      const { id, depth } = queue.shift();

      // Skip if already visited
      if (visited.has(id)) continue;
      visited.add(id);

      // Get lineage entry
      const entry = this.pedigree.get(id);
      if (!entry) continue;

      // Add to ancestry
      ancestry.push({
        id,
        depth,
        relationship: this.getRelationship(depth),
        parents: entry.parents,
        children: entry.children
      });

      // Stop if max depth reached
      if (depth >= maxDepth) continue;

      // Add parents to queue
      entry.parents.forEach(parentId => {
        queue.push({ id: parentId, depth: depth + 1 });
      });
    }

    return ancestry;
  }

  /**
   * Get descendants for a dog
   * @param {string} dogId - ID of dog
   * @param {number} maxDepth - Maximum generations to traverse
   * @returns {Array<{id: string, depth: number}>} Descendant data
   */
  getDescendants(dogId, maxDepth = 3) {
    const queue = [{ id: dogId, depth: 0 }];
    const visited = new Set();
    const descendants = [];

    while (queue.length > 0) {
      const { id, depth } = queue.shift();

      if (visited.has(id)) continue;
      visited.add(id);

      const entry = this.pedigree.get(id);
      if (!entry) continue;

      descendants.push({
        id,
        depth,
        relationship: this.getDescendantRelationship(depth)
      });

      if (depth >= maxDepth) continue;

      // Add children to queue
      entry.children.forEach(childId => {
        queue.push({ id: childId, depth: depth + 1 });
      });
    }

    return descendants;
  }

  /**
   * Get all dogs at a specific generation
   * @param {number} generation - Generation number
   * @param {Map} dogsMap - Map of all dogs (id -> dog)
   * @returns {Array<CelebrityDog>} Dogs at that generation
   */
  getGeneration(generation, dogsMap) {
    const dogs = [];
    for (const dog of dogsMap.values()) {
      if (dog.generation === generation) {
        dogs.push(dog);
      }
    }
    return dogs;
  }

  /**
   * Get lineage info for a specific dog
   * @param {string} dogId - ID of dog
   * @returns {Object|null} Lineage data or null
   */
  getLineage(dogId) {
    return this.pedigree.get(dogId) || null;
  }

  /**
   * Check if two dogs are related
   * @param {string} dog1Id - First dog ID
   * @param {string} dog2Id - Second dog ID
   * @param {number} maxDepth - Maximum depth to check
   * @returns {boolean} True if related
   */
  areRelated(dog1Id, dog2Id, maxDepth = 5) {
    const ancestry1 = this.getAncestry(dog1Id, maxDepth);
    const ancestry2 = this.getAncestry(dog2Id, maxDepth);

    const ancestors1 = new Set(ancestry1.map(a => a.id));
    const ancestors2 = new Set(ancestry2.map(a => a.id));

    // Check for common ancestors
    for (const id of ancestors1) {
      if (ancestors2.has(id)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get relationship name based on depth
   * @param {number} depth - Depth in family tree
   * @returns {string} Relationship name
   */
  getRelationship(depth) {
    switch (depth) {
      case 0: return 'self';
      case 1: return 'parent';
      case 2: return 'grandparent';
      case 3: return 'great-grandparent';
      case 4: return 'great-great-grandparent';
      default: return `ancestor (${depth} generations)`;
    }
  }

  /**
   * Get descendant relationship name based on depth
   * @param {number} depth - Depth in family tree
   * @returns {string} Relationship name
   */
  getDescendantRelationship(depth) {
    switch (depth) {
      case 0: return 'self';
      case 1: return 'child';
      case 2: return 'grandchild';
      case 3: return 'great-grandchild';
      default: return `descendant (${depth} generations)`;
    }
  }

  /**
   * Get family tree statistics
   * @returns {Object} Statistics
   */
  getStatistics() {
    let totalDogs = this.pedigree.size;
    let totalRelationships = 0;
    let maxChildren = 0;

    for (const entry of this.pedigree.values()) {
      totalRelationships += entry.parents.length + entry.children.length;
      maxChildren = Math.max(maxChildren, entry.children.length);
    }

    return {
      totalDogs,
      totalRelationships,
      maxChildren,
      averageChildren: totalRelationships / totalDogs
    };
  }

  /**
   * Clear all lineage data
   */
  clear() {
    this.pedigree.clear();
  }

  /**
   * Serialize lineage data for saving
   * @returns {Array} Serialized lineage
   */
  serialize() {
    return Array.from(this.pedigree.entries());
  }

  /**
   * Deserialize lineage data from save
   * @param {Array} data - Serialized lineage data
   */
  deserialize(data) {
    this.pedigree = new Map(data);
  }
}

export default LineageManager;
