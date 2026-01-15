import { format } from 'date-fns'
import { Calendar, FileText } from 'lucide-react'
import { useEffect, useState } from 'react'

function JournalForm({ onSubmit, onCancel, initialData }) {
  const [date, setDate] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date || '')
      setTitle(initialData.title || '')
      setContent(initialData.content || '')
    } else {
      // Set default date to today
      const today = format(new Date(), 'yyyy-MM-dd')
      setDate(today)
    }
  }, [initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!content.trim()) {
      alert('Vui lòng nhập nội dung nhật ký')
      return
    }

    onSubmit({
      date: date || format(new Date(), 'yyyy-MM-dd'),
      title: title.trim() || '',
      content: content.trim(),
      type: 'journal'
    })
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-bold text-gray-800">
          {initialData ? 'Sửa Nhật ký' : 'Thêm Nhật ký Mới'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Ngày viết
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>

        {/* Title (Optional) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tiêu đề (tùy chọn)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: Lỗi không tuân thủ kế hoạch..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nội dung suy nghĩ <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Viết về những suy nghĩ của bạn khi làm không đúng kế hoạch, những gì bạn học được, và cách bạn sẽ cải thiện..."
            rows={10}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
          >
            {initialData ? 'Cập nhật' : 'Lưu Nhật ký'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-colors duration-300"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  )
}

export default JournalForm
