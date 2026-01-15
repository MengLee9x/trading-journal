import { useEffect, useState } from 'react'
import { autoSaveToFile } from '../utils/fileStorage'
import { separateItemsByType, combineItems } from '../utils/dataUtils'

/**
 * Custom hook to manage localStorage data loading and saving
 * Handles trades, lessons, and rules
 */
export const useLocalStorageData = () => {
  const [trades, setTrades] = useState([])
  const [lessons, setLessons] = useState([])
  const [rules, setRules] = useState([])
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      let loadedLessons = []

      // First, try loading from main storage
      const savedTrades = localStorage.getItem('trades')
      if (savedTrades) {
        const parsedTrades = JSON.parse(savedTrades)
        if (Array.isArray(parsedTrades)) {
          const { trades: regularTrades, lessons: lessonItems, rules: ruleItems } = 
            separateItemsByType(parsedTrades)

          setTrades(regularTrades)
          setLessons(lessonItems)
          setRules(ruleItems)
          loadedLessons = lessonItems
          console.log('Loaded:', regularTrades.length, 'trades,', lessonItems.length, 'lessons,', ruleItems.length, 'rules')
        }
      }

      // Also try loading from old format (backward compatibility)
      if (loadedLessons.length === 0) {
        const savedLessons = localStorage.getItem('lessons')
        if (savedLessons) {
          try {
            const parsedLessons = JSON.parse(savedLessons)
            if (Array.isArray(parsedLessons) && parsedLessons.length > 0) {
              setLessons(parsedLessons)
              console.log('Loaded', parsedLessons.length, 'lessons from old format')
            }
          } catch (e) {
            console.error('Error loading lessons:', e)
          }
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
    }
  }, [])

  // Save data to localStorage and auto-save to file whenever data changes
  useEffect(() => {
    // Skip saving on initial mount to avoid overwriting with empty arrays
    if (isInitialLoad) {
      setIsInitialLoad(false)
      return
    }

    try {
      const allData = combineItems(trades, lessons, rules)
      localStorage.setItem('trades', JSON.stringify(allData))
      
      // Auto-save to file if file handle exists
      autoSaveToFile(allData).then(success => {
        if (success) {
          console.log('Auto-saved to file')
        }
      })
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      if (error.name === 'QuotaExceededError') {
        alert('Lưu trữ đã đầy. Vui lòng xóa một số trades cũ hoặc ảnh để giải phóng dung lượng.')
      }
    }
  }, [trades, lessons, rules, isInitialLoad])

  return {
    trades,
    setTrades,
    lessons,
    setLessons,
    rules,
    setRules
  }
}

