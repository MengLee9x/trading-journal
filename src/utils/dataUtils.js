// Utility functions for data processing

/**
 * Separate items by type from a combined array
 * @param {Array} items - Array of items with type property
 * @returns {Object} Object with trades, lessons, and rules arrays
 */
export const separateItemsByType = (items) => {
  if (!Array.isArray(items)) {
    return { trades: [], lessons: [], rules: [] }
  }

  const trades = items.filter(item => {
    const itemType = item.type
    return itemType !== 'lesson' && itemType !== 'rule'
  })
  
  const lessons = items.filter(item => item.type === 'lesson')
  const rules = items.filter(item => item.type === 'rule')

  return { trades, lessons, rules }
}

/**
 * Combine trades, lessons, and rules into a single array
 * @param {Array} trades 
 * @param {Array} lessons 
 * @param {Array} rules 
 * @returns {Array} Combined array
 */
export const combineItems = (trades, lessons, rules) => {
  return [...trades, ...lessons, ...rules]
}

/**
 * Import data from file and separate by type
 * @param {Array} importedData - Data from file
 * @returns {Object} Object with trades, lessons, and rules arrays
 */
export const processImportedData = (importedData) => {
  if (!Array.isArray(importedData)) {
    return { trades: [], lessons: [], rules: [] }
  }

  return separateItemsByType(importedData)
}

/**
 * Merge new items with existing items, avoiding duplicates by id
 * @param {Array} existingItems 
 * @param {Array} newItems 
 * @returns {Array} Merged array without duplicates
 */
export const mergeItems = (existingItems, newItems) => {
  const existingIds = new Set(existingItems.map(item => item.id))
  const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id))
  return [...existingItems, ...uniqueNewItems]
}

