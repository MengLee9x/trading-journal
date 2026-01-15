import { format } from 'date-fns'
import { Calendar, Edit, FileText, LayoutGrid, List, Trash2 } from 'lucide-react'
import { useState } from 'react'

function JournalCard({ journal, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">
            {format(new Date(journal.date), 'dd/MM/yyyy')}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(journal)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Sửa"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(journal.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Xóa"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {journal.title && (
        <h3 className="text-lg font-bold text-gray-800 mb-3">{journal.title}</h3>
      )}

      <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
        {journal.content}
      </div>
    </div>
  )
}

function JournalListItem({ journal, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center">
            <FileText className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {format(new Date(journal.date), 'dd/MM/yyyy')}
                </span>
              </div>
              {journal.title && (
                <h3 className="text-lg font-bold text-gray-800">{journal.title}</h3>
              )}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => onEdit(journal)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Sửa"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(journal.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Xóa"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {journal.content}
          </div>
        </div>
      </div>
    </div>
  )
}

function JournalList({ journals, onEdit, onDelete }) {
  const [viewMode, setViewMode] = useState('card')

  if (journals.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg">Chưa có nhật ký nào</p>
        <p className="text-sm mt-2">Hãy thêm nhật ký đầu tiên để ghi lại suy nghĩ của bạn</p>
      </div>
    )
  }

  return (
    <div>
      {/* View mode toggle */}
      <div className="mb-6 flex justify-end">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('card')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
              viewMode === 'card'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Card
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
              viewMode === 'list'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <List className="w-4 h-4" />
            List
          </button>
        </div>
      </div>

      {/* Journal entries */}
      <div
        className={
          viewMode === 'card'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }
      >
        {journals.map((journal) =>
          viewMode === 'card' ? (
            <JournalCard
              key={journal.id}
              journal={journal}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ) : (
            <JournalListItem
              key={journal.id}
              journal={journal}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )
        )}
      </div>
    </div>
  )
}

export default JournalList
