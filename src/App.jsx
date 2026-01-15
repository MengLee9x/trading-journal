import { AlertTriangle, BarChart3, Download, FileText, Plus, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'
import JournalForm from './components/JournalForm'
import JournalList from './components/JournalList'
import LessonForm from './components/LessonForm'
import TradeForm from './components/TradeForm'
import TradeList from './components/TradeList'
import { autoSaveToFile, loadTradesFromFile, saveTradesToFile } from './utils/fileStorage'

function App() {
  const [activeTab, setActiveTab] = useState('trades') // 'trades', 'lessons', 'journal'
  const [trades, setTrades] = useState([])
  const [lessons, setLessons] = useState([])
  const [journals, setJournals] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [showLessonForm, setShowLessonForm] = useState(false)
  const [showJournalForm, setShowJournalForm] = useState(false)
  const [editingTrade, setEditingTrade] = useState(null)
  const [editingLesson, setEditingLesson] = useState(null)
  const [editingJournal, setEditingJournal] = useState(null)

  // Load trades, lessons, and journals from localStorage on mount
  useEffect(() => {
    try {
      const savedTrades = localStorage.getItem('trades')
      if (savedTrades) {
        const parsedTrades = JSON.parse(savedTrades)
        if (Array.isArray(parsedTrades)) {
          // Separate trades, lessons, and journals
          const regularTrades = parsedTrades.filter(t => t.type !== 'lesson' && t.type !== 'journal')
          const lessonItems = parsedTrades.filter(t => t.type === 'lesson')
          setTrades(regularTrades)
          setLessons(lessonItems)
          console.log('Loaded:', regularTrades.length, 'trades,', lessonItems.length, 'lessons')
        }
      }

      // Also try loading from old format (backward compatibility)
      const savedLessons = localStorage.getItem('lessons')
      if (savedLessons) {
        try {
          const parsedLessons = JSON.parse(savedLessons)
          if (Array.isArray(parsedLessons)) {
            setLessons(parsedLessons)
          }
        } catch (e) {
          console.error('Error loading lessons:', e)
        }
      }

      // Load journals
      const savedJournals = localStorage.getItem('journals')
      if (savedJournals) {
        try {
          const parsedJournals = JSON.parse(savedJournals)
          if (Array.isArray(parsedJournals)) {
            setJournals(parsedJournals)
            console.log('Loaded:', parsedJournals.length, 'journals')
          }
        } catch (e) {
          console.error('Error loading journals:', e)
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
    }
  }, [])

  // Save trades, lessons, and journals to localStorage and auto-save to file whenever they change
  useEffect(() => {
    try {
      // Combine trades and lessons for saving (keep separate for backward compatibility)
      const allData = [...trades, ...lessons]
      localStorage.setItem('trades', JSON.stringify(allData))
      // Save journals separately
      localStorage.setItem('journals', JSON.stringify(journals))
      // Auto-save to file if file handle exists (combine all data)
      const allDataForFile = [...trades, ...lessons, ...journals]
      autoSaveToFile(allDataForFile).then(success => {
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
  }, [trades, lessons, journals])

  const handleAddTrade = (newTrade) => {
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

  const handleAddLesson = (newLesson) => {
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

  const handleEditTrade = (trade) => {
    setEditingTrade(trade)
    setShowForm(true)
  }

  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson)
    setShowLessonForm(true)
  }

  const handleDeleteTrade = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa trade này?')) {
      setTrades(trades.filter(trade => trade.id !== id))
    }
  }

  const handleDeleteLesson = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa case này?')) {
      setLessons(lessons.filter(lesson => lesson.id !== id))
    }
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingTrade(null)
  }

  const handleCancelLessonForm = () => {
    setShowLessonForm(false)
    setEditingLesson(null)
  }

  const handleAddJournal = (newJournal) => {
    let updatedJournals
    if (editingJournal) {
      updatedJournals = journals.map(journal =>
        journal.id === editingJournal.id
          ? { ...newJournal, id: editingJournal.id }
          : journal
      )
      setEditingJournal(null)
    } else {
      const journalWithId = {
        ...newJournal,
        id: Date.now().toString()
      }
      updatedJournals = [journalWithId, ...journals]
    }

    setJournals(updatedJournals)
    setShowJournalForm(false)
  }

  const handleEditJournal = (journal) => {
    setEditingJournal(journal)
    setShowJournalForm(true)
  }

  const handleDeleteJournal = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa nhật ký này?')) {
      setJournals(journals.filter(journal => journal.id !== id))
    }
  }

  const handleCancelJournalForm = () => {
    setShowJournalForm(false)
    setEditingJournal(null)
  }

  const handleExportToFile = async () => {
    const allData = [...trades, ...lessons, ...journals]
    const result = await saveTradesToFile(allData)
    if (result.success) {
      alert(result.message)
    } else {
      alert(result.message)
    }
  }

  const handleImportFromFile = async () => {
    const result = await loadTradesFromFile()
    if (result.success && result.data) {
      const totalItems = trades.length + lessons.length + journals.length
      if (totalItems > 0) {
        const action = window.confirm(
          `Bạn có ${totalItems} items hiện tại.\n\n` +
          `OK = Merge (gộp dữ liệu mới vào dữ liệu cũ)\n` +
          `Cancel = Replace (thay thế hoàn toàn)`
        )

        if (action) {
          const existingIds = new Set([...trades, ...lessons, ...journals].map(t => t.id))
          const newItems = result.data.filter(t => !existingIds.has(t.id))
          const importedTrades = newItems.filter(t => t.type !== 'lesson' && t.type !== 'journal')
          const importedLessons = newItems.filter(t => t.type === 'lesson')
          const importedJournals = newItems.filter(t => t.type === 'journal')
          setTrades([...trades, ...importedTrades])
          setLessons([...lessons, ...importedLessons])
          setJournals([...journals, ...importedJournals])
          alert(`Đã merge ${newItems.length} items mới.`)
        } else {
          const importedTrades = result.data.filter(t => t.type !== 'lesson' && t.type !== 'journal')
          const importedLessons = result.data.filter(t => t.type === 'lesson')
          const importedJournals = result.data.filter(t => t.type === 'journal')
          setTrades(importedTrades)
          setLessons(importedLessons)
          setJournals(importedJournals)
          alert(`Đã thay thế ${totalItems} items cũ bằng ${result.data.length} items mới.`)
        }
      } else {
        const importedTrades = result.data.filter(t => t.type !== 'lesson' && t.type !== 'journal')
        const importedLessons = result.data.filter(t => t.type === 'lesson')
        const importedJournals = result.data.filter(t => t.type === 'journal')
        setTrades(importedTrades)
        setLessons(importedLessons)
        setJournals(importedJournals)
        alert(`Đã import ${result.data.length} items từ file.`)
      }
    } else {
      alert(result.message)
    }
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
        {/* File operations buttons */}
        <div className="mb-4 flex gap-2 justify-end">
          <button
            onClick={handleImportFromFile}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 font-semibold flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Import từ File
          </button>
          <button
            onClick={handleExportToFile}
            className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors duration-300 font-semibold flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Export ra File
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveTab('trades')
                setShowForm(false)
                setShowLessonForm(false)
                setShowJournalForm(false)
              }}
              className={`px-6 py-3 font-semibold transition-colors duration-300 border-b-2 flex items-center gap-2 ${
                activeTab === 'trades'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Lệnh Giao Dịch
            </button>
            <button
              onClick={() => {
                setActiveTab('lessons')
                setShowForm(false)
                setShowLessonForm(false)
                setShowJournalForm(false)
              }}
              className={`px-6 py-3 font-semibold transition-colors duration-300 border-b-2 flex items-center gap-2 ${
                activeTab === 'lessons'
                  ? 'border-yellow-600 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
              Cases đáng lưu ý
            </button>
            <button
              onClick={() => {
                setActiveTab('journal')
                setShowForm(false)
                setShowLessonForm(false)
                setShowJournalForm(false)
              }}
              className={`px-6 py-3 font-semibold transition-colors duration-300 border-b-2 flex items-center gap-2 ${
                activeTab === 'journal'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="w-5 h-5" />
              Nhật ký
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'trades' && (
          <>
            {!showForm ? (
              <div className="mb-8">
                <button
                  className="w-full p-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  onClick={() => {
                    setEditingTrade(null)
                    setShowForm(true)
                  }}
                >
                  <Plus className="w-5 h-5" />
                  Thêm Trade Mới
                </button>
              </div>
            ) : (
              <TradeForm
                onSubmit={handleAddTrade}
                onCancel={handleCancelForm}
                initialData={editingTrade}
              />
            )}
            <TradeList
              trades={trades}
              lessons={[]}
              onDelete={handleDeleteTrade}
              onDeleteLesson={() => {}}
              onEdit={handleEditTrade}
              onEditLesson={() => {}}
            />
          </>
        )}

        {activeTab === 'lessons' && (
          <>
            {!showLessonForm ? (
              <div className="mb-8">
                <button
                  className="w-full p-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  onClick={() => {
                    setEditingLesson(null)
                    setShowLessonForm(true)
                  }}
                >
                  <AlertTriangle className="w-5 h-5" />
                  Thêm Case đáng lưu ý
                </button>
              </div>
            ) : (
              <LessonForm
                onSubmit={handleAddLesson}
                onCancel={handleCancelLessonForm}
                initialData={editingLesson}
              />
            )}
            <TradeList
              trades={[]}
              lessons={lessons}
              onDelete={() => {}}
              onDeleteLesson={handleDeleteLesson}
              onEdit={() => {}}
              onEditLesson={handleEditLesson}
            />
          </>
        )}

        {activeTab === 'journal' && (
          <>
            {!showJournalForm ? (
              <div className="mb-8">
                <button
                  className="w-full p-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  onClick={() => {
                    setEditingJournal(null)
                    setShowJournalForm(true)
                  }}
                >
                  <Plus className="w-5 h-5" />
                  Thêm Nhật ký Mới
                </button>
              </div>
            ) : (
              <JournalForm
                onSubmit={handleAddJournal}
                onCancel={handleCancelJournalForm}
                initialData={editingJournal}
              />
            )}
            <JournalList
              journals={journals}
              onEdit={handleEditJournal}
              onDelete={handleDeleteJournal}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default App
