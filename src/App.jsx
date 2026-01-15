import { BarChart3 } from 'lucide-react'
import { useState } from 'react'
import FileOperations from './components/FileOperations'
import TabNavigation from './components/TabNavigation'
import { LessonsTabContent, RulesTabContent, TradesTabContent } from './components/TabContent'
import { useFileOperations } from './hooks/useFileOperations'
import { useLocalStorageData } from './hooks/useLocalStorageData'
import { useLessonManager, useRuleManager, useTradeManager } from './hooks/useItemManager'

function App() {
  const [activeTab, setActiveTab] = useState('trades')
  const [showForm, setShowForm] = useState(false)
  const [showLessonForm, setShowLessonForm] = useState(false)
  const [showRuleForm, setShowRuleForm] = useState(false)
  const [editingTrade, setEditingTrade] = useState(null)
  const [editingLesson, setEditingLesson] = useState(null)
  const [editingRule, setEditingRule] = useState(null)

  // Load and save data from/to localStorage
  const { trades, setTrades, lessons, setLessons, rules, setRules } = useLocalStorageData()

  // File operations
  const { handleExport, handleImport } = useFileOperations(
    trades, lessons, rules, setTrades, setLessons, setRules
  )

  // Item managers for CRUD operations
  const tradeManager = useTradeManager(
    trades, setTrades, showForm, setShowForm, editingTrade, setEditingTrade
  )
  const lessonManager = useLessonManager(
    lessons, setLessons, showLessonForm, setShowLessonForm, editingLesson, setEditingLesson
  )
  const ruleManager = useRuleManager(
    rules, setRules, showRuleForm, setShowRuleForm, editingRule, setEditingRule
  )

  // Handlers for closing forms when switching tabs
  const handleCloseForms = () => {
    setShowForm(false)
    setShowLessonForm(false)
    setShowRuleForm(false)
  }

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    handleCloseForms()
  }

  return (
    <div className="max-w-7xl mx-auto">
      <header className="text-center text-white mb-8 p-5">
        <div className="flex items-center justify-center gap-3 mb-2.5">
          <BarChart3 className="w-10 h-10" />
          <h1 className="text-4xl md:text-5xl drop-shadow-lg">Trade Journal</h1>
        </div>
      </header>

      <div className="bg-white rounded-xl p-6 md:p-8 shadow-2xl">
        <FileOperations onImport={handleImport} onExport={handleExport} />

        <TabNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onCloseForms={handleCloseForms}
        />

        {/* Content based on active tab */}
        {activeTab === 'trades' && (
          <TradesTabContent
            trades={trades}
            showForm={showForm}
            editingTrade={editingTrade}
            onAddClick={() => {
              setEditingTrade(null)
              setShowForm(true)
            }}
            onAdd={tradeManager.handleAdd}
            onCancel={tradeManager.handleCancel}
            onDelete={(id) => tradeManager.handleDelete(id, 'Bạn có chắc muốn xóa trade này?')}
            onEdit={tradeManager.handleEdit}
          />
        )}

        {activeTab === 'lessons' && (
          <LessonsTabContent
            lessons={lessons}
            showForm={showLessonForm}
            editingLesson={editingLesson}
            onAddClick={() => {
              setEditingLesson(null)
              setShowLessonForm(true)
            }}
            onAdd={lessonManager.handleAdd}
            onCancel={lessonManager.handleCancel}
            onDelete={(id) => lessonManager.handleDelete(id, 'Bạn có chắc muốn xóa case này?')}
            onEdit={lessonManager.handleEdit}
          />
        )}

        {activeTab === 'rules' && (
          <RulesTabContent
            rules={rules}
            showForm={showRuleForm}
            editingRule={editingRule}
            onAddClick={() => {
              setEditingRule(null)
              setShowRuleForm(true)
            }}
            onAdd={ruleManager.handleAdd}
            onCancel={ruleManager.handleCancel}
            onDelete={(id) => ruleManager.handleDelete(id, 'Bạn có chắc muốn xóa quy tắc này?')}
            onEdit={ruleManager.handleEdit}
          />
        )}
      </div>
    </div>
  )
}

export default App
