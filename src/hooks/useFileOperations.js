import { loadTradesFromFile, saveTradesToFile } from '../utils/fileStorage'
import { separateItemsByType, mergeItems } from '../utils/dataUtils'

/**
 * Custom hook to manage file import/export operations
 */
export const useFileOperations = (trades, lessons, rules, setTrades, setLessons, setRules) => {
  const handleExport = async () => {
    const allData = [...trades, ...lessons, ...rules]
    const result = await saveTradesToFile(allData)
    if (result.success) {
      alert(result.message)
    } else {
      alert(result.message)
    }
  }

  const handleImport = async () => {
    const result = await loadTradesFromFile()
    if (!result.success || !result.data) {
      alert(result.message)
      return
    }

    const totalItems = trades.length + lessons.length + rules.length

    if (totalItems > 0) {
      const shouldMerge = window.confirm(
        `Bạn có ${totalItems} items hiện tại.\n\n` +
        `OK = Merge (gộp dữ liệu mới vào dữ liệu cũ)\n` +
        `Cancel = Replace (thay thế hoàn toàn)`
      )

      if (shouldMerge) {
        // Merge mode
        const { trades: importedTrades, lessons: importedLessons, rules: importedRules } =
          separateItemsByType(result.data)

        const mergedTrades = mergeItems(trades, importedTrades)
        const mergedLessons = mergeItems(lessons, importedLessons)
        const mergedRules = mergeItems(rules, importedRules)

        setTrades(mergedTrades)
        setLessons(mergedLessons)
        setRules(mergedRules)

        const newItemsCount = (mergedTrades.length - trades.length) +
          (mergedLessons.length - lessons.length) +
          (mergedRules.length - rules.length)
        alert(`Đã merge ${newItemsCount} items mới.`)
      } else {
        // Replace mode
        const { trades: importedTrades, lessons: importedLessons, rules: importedRules } =
          separateItemsByType(result.data)

        setTrades(importedTrades)
        setLessons(importedLessons)
        setRules(importedRules)

        alert(`Đã thay thế ${totalItems} items cũ bằng ${result.data.length} items mới.`)
      }
    } else {
      // No existing data, just import
      const { trades: importedTrades, lessons: importedLessons, rules: importedRules } =
        separateItemsByType(result.data)

      setTrades(importedTrades)
      setLessons(importedLessons)
      setRules(importedRules)

      alert(`Đã import ${result.data.length} items từ file.`)
    }
  }

  return {
    handleExport,
    handleImport
  }
}

