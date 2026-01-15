import { useState } from 'react'

/**
 * Generic hook to manage CRUD operations for items (trades, lessons, rules)
 * @param {Array} items - Current items array
 * @param {Function} setItems - Setter function for items
 * @param {Function} setShowForm - Setter function to show/hide form
 * @param {Function} setEditingItem - Setter function for editing item
 */
export const useItemManager = (items, setItems, setShowForm, setEditingItem) => {
  const handleAdd = (newItem) => {
    let updatedItems
    const editingItem = arguments[4] // Get editingItem from closure or pass as param
    
    if (editingItem) {
      updatedItems = items.map(item =>
        item.id === editingItem.id
          ? { ...newItem, id: editingItem.id }
          : item
      )
      setEditingItem(null)
    } else {
      const itemWithId = {
        ...newItem,
        id: Date.now().toString()
      }
      updatedItems = [itemWithId, ...items]
    }

    setItems(updatedItems)
    setShowForm(false)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setShowForm(true)
  }

  const handleDelete = (id, confirmMessage) => {
    if (window.confirm(confirmMessage)) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingItem(null)
  }

  return {
    handleAdd,
    handleEdit,
    handleDelete,
    handleCancel
  }
}

/**
 * Specific hook for managing trades
 */
export const useTradeManager = (trades, setTrades, showForm, setShowForm, editingTrade, setEditingTrade) => {
  const handleAdd = (newTrade) => {
    let updatedTrades
    if (editingTrade) {
      updatedTrades = trades.map(trade =>
        trade.id === editingTrade.id
          ? { ...newTrade, id: editingTrade.id }
          : trade
      )
      setEditingTrade(null)
    } else {
      const tradeWithId = {
        ...newTrade,
        id: Date.now().toString()
      }
      updatedTrades = [tradeWithId, ...trades]
    }
    setTrades(updatedTrades)
    setShowForm(false)
  }

  const handleEdit = (trade) => {
    setEditingTrade(trade)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa trade này?')) {
      setTrades(trades.filter(trade => trade.id !== id))
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingTrade(null)
  }

  return { handleAdd, handleEdit, handleDelete, handleCancel }
}

/**
 * Specific hook for managing lessons
 */
export const useLessonManager = (lessons, setLessons, showLessonForm, setShowLessonForm, editingLesson, setEditingLesson) => {
  const handleAdd = (newLesson) => {
    let updatedLessons
    if (editingLesson) {
      updatedLessons = lessons.map(lesson =>
        lesson.id === editingLesson.id
          ? { ...newLesson, id: editingLesson.id }
          : lesson
      )
      setEditingLesson(null)
    } else {
      const lessonWithId = {
        ...newLesson,
        id: Date.now().toString()
      }
      updatedLessons = [lessonWithId, ...lessons]
    }
    setLessons(updatedLessons)
    setShowLessonForm(false)
  }

  const handleEdit = (lesson) => {
    setEditingLesson(lesson)
    setShowLessonForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa case này?')) {
      setLessons(lessons.filter(lesson => lesson.id !== id))
    }
  }

  const handleCancel = () => {
    setShowLessonForm(false)
    setEditingLesson(null)
  }

  return { handleAdd, handleEdit, handleDelete, handleCancel }
}

/**
 * Specific hook for managing rules
 */
export const useRuleManager = (rules, setRules, showRuleForm, setShowRuleForm, editingRule, setEditingRule) => {
  const handleAdd = (newRule) => {
    let updatedRules
    if (editingRule) {
      updatedRules = rules.map(rule =>
        rule.id === editingRule.id
          ? { ...newRule, id: editingRule.id }
          : rule
      )
      setEditingRule(null)
    } else {
      const ruleWithId = {
        ...newRule,
        id: Date.now().toString()
      }
      updatedRules = [ruleWithId, ...rules]
    }
    setRules(updatedRules)
    setShowRuleForm(false)
  }

  const handleEdit = (rule) => {
    setEditingRule(rule)
    setShowRuleForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa quy tắc này?')) {
      setRules(rules.filter(rule => rule.id !== id))
    }
  }

  const handleCancel = () => {
    setShowRuleForm(false)
    setEditingRule(null)
  }

  return { handleAdd, handleEdit, handleDelete, handleCancel }
}

