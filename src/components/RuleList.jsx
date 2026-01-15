import { CheckCircle2, Edit, Filter, List, Trash2, XCircle } from 'lucide-react'
import { useMemo, useState } from 'react'

function RuleList({ rules, onDelete, onEdit }) {
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [showActiveOnly, setShowActiveOnly] = useState(false)

  // Filter rules based on selected filters
  const filteredRules = useMemo(() => {
    let filtered = rules

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(rule => rule.category === filterCategory)
    }

    // Filter by priority
    if (filterPriority !== 'all') {
      filtered = filtered.filter(rule => rule.priority === filterPriority)
    }

    // Filter by active status
    if (showActiveOnly) {
      filtered = filtered.filter(rule => rule.isActive !== false)
    }

    return filtered
  }, [rules, filterCategory, filterPriority, showActiveOnly])

  const categoryLabels = {
    entry: 'Vào lệnh',
    exit: 'Thoát lệnh',
    risk: 'Quản lý rủi ro',
    general: 'Chung'
  }

  const priorityLabels = {
    high: 'Cao',
    medium: 'Trung bình',
    low: 'Thấp'
  }

  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    low: 'bg-gray-100 text-gray-800 border-gray-300'
  }

  const categoryColors = {
    entry: 'bg-green-100 text-green-800 border-green-300',
    exit: 'bg-orange-100 text-orange-800 border-orange-300',
    risk: 'bg-purple-100 text-purple-800 border-purple-300',
    general: 'bg-blue-100 text-blue-800 border-blue-300'
  }

  if (rules.length === 0) {
    return (
      <div className="text-center py-16 px-5 text-gray-500">
        <p className="text-xl mb-2.5">Chưa có quy tắc nào được lưu</p>
        <p className="text-base opacity-70">Bấm "Thêm Quy tắc Mới" để bắt đầu tạo các quy tắc của bạn</p>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
        <h2 className="text-gray-800 text-2xl font-semibold">
          Danh sách Quy tắc ({filteredRules.length}/{rules.length})
        </h2>
        <div className="flex flex-wrap gap-2">
          {/* Filter by category */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <Filter className="w-4 h-4 text-gray-600" />
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors ${filterCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
                }`}
            >
              Tất cả
            </button>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilterCategory(value)}
                className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors ${filterCategory === value
                    ? categoryColors[value]
                    : 'text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Filter by priority */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setFilterPriority('all')}
              className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors ${filterPriority === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
                }`}
            >
              Tất cả
            </button>
            {Object.entries(priorityLabels).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilterPriority(value)}
                className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors ${filterPriority === value
                    ? priorityColors[value]
                    : 'text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Show active only toggle */}
          <button
            onClick={() => setShowActiveOnly(!showActiveOnly)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${showActiveOnly
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            {showActiveOnly ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Chỉ hiện hoạt động
              </>
            ) : (
              <>
                <List className="w-4 h-4" />
                Tất cả
              </>
            )}
          </button>
        </div>
      </div>

      {filteredRules.length === 0 ? (
        <div className="text-center py-16 px-5 text-gray-500">
          <p className="text-xl mb-2.5">Không có quy tắc phù hợp với bộ lọc</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRules.map(rule => (
            <RuleCard
              key={rule.id}
              rule={rule}
              onDelete={onDelete}
              onEdit={onEdit}
              categoryLabels={categoryLabels}
              priorityLabels={priorityLabels}
              categoryColors={categoryColors}
              priorityColors={priorityColors}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function RuleCard({ rule, onDelete, onEdit, categoryLabels, priorityLabels, categoryColors, priorityColors }) {
  return (
    <div className={`bg-white border-2 rounded-xl p-5 transition-all duration-300 shadow-sm hover:-translate-y-1 hover:shadow-lg ${rule.isActive === false ? 'opacity-60 border-gray-300' : 'border-blue-200 hover:border-blue-500'
      }`}>
      <div className="flex justify-between items-start gap-4 mb-4 pb-4 border-b-2 border-gray-100">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h3 className="text-lg font-bold text-gray-800">{rule.title}</h3>
            <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${categoryColors[rule.category] || categoryColors.general}`}>
              {categoryLabels[rule.category] || 'Chung'}
            </span>
            <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${priorityColors[rule.priority] || priorityColors.medium}`}>
              {priorityLabels[rule.priority] || 'Trung bình'}
            </span>
            {rule.isActive === false ? (
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-gray-200 text-gray-600 border border-gray-300 flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                Tạm ngưng
              </span>
            ) : (
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-green-100 text-green-700 border border-green-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Đang hoạt động
              </span>
            )}
          </div>
        </div>
      </div>

      {rule.description && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap break-words">{rule.description}</p>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
        <button
          className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 font-semibold cursor-pointer flex items-center gap-1.5"
          onClick={() => onEdit(rule)}
        >
          <Edit className="w-4 h-4" />
          Sửa
        </button>
        <button
          className="px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-300 font-semibold cursor-pointer flex items-center gap-1.5"
          onClick={() => onDelete(rule.id)}
        >
          <Trash2 className="w-4 h-4" />
          Xóa
        </button>
      </div>
    </div>
  )
}

export default RuleList


