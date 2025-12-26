import { format, parseISO } from 'date-fns'
import { AlertTriangle, Calendar, ChevronDown, ChevronRight, DollarSign, Edit, Filter, Image as ImageIcon, LayoutGrid, List, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'

function TradeList({ trades, lessons, onDelete, onEdit, onDeleteLesson, onEditLesson }) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedImageCaption, setSelectedImageCaption] = useState(null)
  const [viewMode, setViewMode] = useState('list') // 'card' or 'list'
  const [filterType, setFilterType] = useState('all') // 'all', 'buy', 'sell'
  const [showLessonsOnly, setShowLessonsOnly] = useState(false)

  // Filter trades based on selected filter
  const filteredTrades = useMemo(() => {
    let filtered = trades

    // Filter by order type
    if (filterType !== 'all') {
      filtered = filtered.filter(trade => trade.orderType === filterType)
    }

    return filtered
  }, [trades, filterType])

  if (trades.length === 0 && lessons.length === 0) {
    return (
      <div className="text-center py-16 px-5 text-gray-500">
        <p className="text-xl mb-2.5">Chưa có trade nào được lưu</p>
        <p className="text-base opacity-70">Bấm "Thêm Trade Mới" để bắt đầu ghi lại các lệnh của bạn</p>
      </div>
    )
  }

  return (
    <>
      <div className="mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
          <h2 className="text-gray-800 text-2xl font-semibold">
            Danh sách Trades ({filteredTrades.length}/{trades.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {/* Filter by type */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <Filter className="w-4 h-4 text-gray-600" />
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors ${
                  filterType === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilterType('buy')}
                className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors ${
                  filterType === 'buy'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Mua
              </button>
              <button
                onClick={() => setFilterType('sell')}
                className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors ${
                  filterType === 'sell'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Bán
              </button>
            </div>
            {/* Show lessons only toggle */}
            <button
              onClick={() => setShowLessonsOnly(!showLessonsOnly)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                showLessonsOnly
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              Cases đáng lưu ý
            </button>
            {/* View mode */}
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
        </div>

        {/* Cases đáng lưu ý Section */}
        {!showLessonsOnly && lessons.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <h3 className="text-xl font-semibold text-gray-800">Cases đáng lưu ý để tránh mắc phải</h3>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                {lessons.length}
              </span>
            </div>
            {viewMode === 'card' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {lessons.map(lesson => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    onDelete={onDeleteLesson}
                    onEdit={onEditLesson}
                    onImageClick={(imageData, caption) => {
                      setSelectedImage(imageData)
                      setSelectedImageCaption(caption || null)
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                {lessons.map(lesson => (
                  <LessonListItem
                    key={lesson.id}
                    lesson={lesson}
                    onDelete={onDeleteLesson}
                    onEdit={onEditLesson}
                    onImageClick={(imageData, caption) => {
                      setSelectedImage(imageData)
                      setSelectedImageCaption(caption || null)
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Regular Trades Section */}
        {!showLessonsOnly && filteredTrades.length > 0 && (
          <div>
            {lessons.length > 0 && (
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Trades thông thường</h3>
            )}
            {viewMode === 'card' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTrades.map(trade => (
                  <TradeCard
                    key={trade.id}
                    trade={trade}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onImageClick={(imageData, caption) => {
                      setSelectedImage(imageData)
                      setSelectedImageCaption(caption || null)
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTrades.map(trade => (
                  <TradeListItem
                    key={trade.id}
                    trade={trade}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onImageClick={(imageData, caption) => {
                      setSelectedImage(imageData)
                      setSelectedImageCaption(caption || null)
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Show lessons only */}
        {showLessonsOnly && (
          <div>
            {viewMode === 'card' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {lessons.map(lesson => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    onDelete={onDeleteLesson}
                    onEdit={onEditLesson}
                    onImageClick={(imageData, caption) => {
                      setSelectedImage(imageData)
                      setSelectedImageCaption(caption || null)
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {lessons.map(lesson => (
                  <LessonListItem
                    key={lesson.id}
                    lesson={lesson}
                    onDelete={onDeleteLesson}
                    onEdit={onEditLesson}
                    onImageClick={(imageData, caption) => {
                      setSelectedImage(imageData)
                      setSelectedImageCaption(caption || null)
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {filteredTrades.length === 0 && lessons.length === 0 && (
          <div className="text-center py-16 px-5 text-gray-500">
            <p className="text-xl mb-2.5">Không có dữ liệu phù hợp với bộ lọc</p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setSelectedImage(null)
            setSelectedImageCaption(null)
          }}
        >
          <div className="relative max-w-7xl max-h-full">
            <img
              src={selectedImage}
              alt={selectedImageCaption || "Full size"}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            {selectedImageCaption && (
              <div className="mt-4 bg-black bg-opacity-60 text-white p-4 rounded-lg text-center">
                <p className="text-lg">{selectedImageCaption}</p>
              </div>
            )}
            <button
              onClick={() => {
                setSelectedImage(null)
                setSelectedImageCaption(null)
              }}
              className="absolute top-4 right-4 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function TradeCard({ trade, onDelete, onEdit, onImageClick }) {
  const formattedDate = format(parseISO(trade.date), 'dd/MM/yyyy')
  const images = trade.images || (trade.image ? [trade.image] : []) // Support both old and new format

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-5 transition-all duration-300 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-indigo-500">
      <div className="flex justify-between items-center gap-1 mb-4 pb-4 border-b-2 border-gray-100 md:flex-row flex-col md:items-center items-start">
        <div className="flex-1">
          {trade.orderType === 'buy' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-sm bg-green-100 text-green-800">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
              MUA
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-sm bg-red-100 text-red-800">
              <span className="w-2 h-2 bg-red-600 rounded-full"></span>
              BÁN
            </span>
          )}
        </div>
        <div className="text-gray-500 text-sm font-medium flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {formattedDate}
        </div>
      </div>

      {trade.currencyPair && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-sm bg-blue-100 text-blue-800">
            <DollarSign className="w-4 h-4" />
            {trade.currencyPair}
          </span>
        </div>
      )}

      {trade.description && (
        <div className="mb-4 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
          <strong className="block mb-1 text-gray-800 text-sm">Cách đánh:</strong>
          <p className="text-gray-700 text-sm">{trade.description}</p>
        </div>
      )}

      {images.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-sm text-gray-600 font-medium flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4" />
            Ảnh market ({images.length}):
          </p>
          <div className="grid grid-cols-2 gap-2">
            {images.map((image, index) => {
              // Support both old format (string) and new format (object)
              const imageData = typeof image === 'string' ? image : (image.data || image)
              const caption = typeof image === 'object' ? image.caption : null

              return (
                <div key={index} className="relative group">
                  <img
                    src={imageData}
                    alt={caption || `Market chart ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => {
                      const caption = typeof image === 'object' ? image.caption : null
                      onImageClick(imageData, caption)
                    }}
                  />
                  {caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-2 rounded-b-lg">
                      {caption}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {trade.notes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border-l-4 border-indigo-500">
          <strong className="block mb-2 text-gray-800">Lý do vào lệnh:</strong>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap break-words">{trade.notes}</p>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
        <button
          className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 font-semibold cursor-pointer flex items-center gap-1.5"
          onClick={() => onEdit(trade)}
        >
          <Edit className="w-4 h-4" />
          Sửa
        </button>
        <button
          className="px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-300 font-semibold cursor-pointer flex items-center gap-1.5"
          onClick={() => onDelete(trade.id)}
        >
          <Trash2 className="w-4 h-4" />
          Xóa
        </button>
      </div>
    </div>
  )
}

function TradeListItem({ trade, onDelete, onEdit, onImageClick }) {
  const formattedDate = format(parseISO(trade.date), 'dd/MM/yyyy')
  const images = trade.images || (trade.image ? [trade.image] : [])
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-indigo-500">
      {/* Header Row */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div>
              {trade.orderType === 'buy' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-sm bg-green-100 text-green-800">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  MUA
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-sm bg-red-100 text-red-800">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  BÁN
                </span>
              )}
            </div>
            <div className="text-gray-600 font-medium flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formattedDate}
            </div>
            {trade.currencyPair && (
              <div className="text-gray-600 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" />
                <span className="font-semibold">{trade.currencyPair}</span>
              </div>
            )}
            {trade.description && (
              <div className="text-gray-600 text-sm max-w-xs truncate" title={trade.description}>
                {trade.description}
              </div>
            )}
            {images.length > 0 && (
              <div className="text-gray-500 text-sm flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" />
                {images.length} ảnh
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-1.5 text-sm rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors font-semibold flex items-center gap-1.5"
            >
              {isExpanded ? (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Thu gọn
                </>
              ) : (
                <>
                  <ChevronRight className="w-4 h-4" />
                  Xem chi tiết
                </>
              )}
            </button>
            <button
              className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold flex items-center gap-1.5"
              onClick={() => onEdit(trade)}
            >
              <Edit className="w-4 h-4" />
              Sửa
            </button>
            <button
              className="px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-semibold flex items-center gap-1.5"
              onClick={() => onDelete(trade.id)}
            >
              <Trash2 className="w-4 h-4" />
              Xóa
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 bg-gray-50">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Images Section - Takes 2 columns */}
            {images.length > 0 && (
              <div className="lg:col-span-2">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Ảnh market ({images.length}):</h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((image, index) => {
                    const imageData = typeof image === 'string' ? image : (image.data || image)
                    const caption = typeof image === 'object' ? image.caption : null

                    return (
                      <div key={index} className="flex-shrink-0 relative group">
                        <img
                          src={imageData}
                          alt={caption || `Market chart ${index + 1}`}
                          className="w-48 h-48 object-cover rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => onImageClick(imageData, caption)}
                        />
                        {caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-2 rounded-b-lg">
                            {caption}
                          </div>
                        )}
                        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Description Section */}
            {trade.description && (
              <div className={images.length > 0 ? 'lg:col-span-1' : 'lg:col-span-3'}>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Cách đánh:</h3>
                <div className="p-3 bg-white rounded-lg border-l-4 border-purple-500">
                  <p className="text-gray-600 leading-relaxed break-words text-sm">
                    {trade.description}
                  </p>
                </div>
              </div>
            )}

            {/* Notes Section */}
            {trade.notes && (
              <div className={images.length > 0 ? (trade.description ? 'lg:col-span-2' : 'lg:col-span-1') : 'lg:col-span-3'}>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Lý do vào lệnh:</h3>
                <div className="p-3 bg-white rounded-lg border-l-4 border-indigo-500">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap break-words text-sm">
                    {trade.notes}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function LessonCard({ lesson, onDelete, onEdit, onImageClick }) {
  const images = lesson.images || []

  return (
    <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-5 transition-all duration-300 shadow-sm hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-3 flex items-center gap-2 text-yellow-700 font-semibold text-sm">
        <AlertTriangle className="w-4 h-4" />
        <span>Case đáng lưu ý</span>
      </div>

      <h3 className="text-lg font-bold text-gray-800 mb-3">{lesson.title}</h3>

      {lesson.description && (
        <div className="mb-4 p-3 bg-white rounded-lg border-l-4 border-yellow-500">
          <p className="text-gray-700 text-sm">{lesson.description}</p>
        </div>
      )}

      {images.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-sm text-gray-600 font-medium flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4" />
            Ảnh minh họa ({images.length}):
          </p>
          <div className="grid grid-cols-2 gap-2">
            {images.map((image, index) => {
              const imageData = typeof image === 'string' ? image : (image.data || image)
              const caption = typeof image === 'object' ? image.caption : null

              return (
                <div key={index} className="relative group">
                  <img
                    src={imageData}
                    alt={caption || `Image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => onImageClick(imageData, caption)}
                  />
                  {caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-2 rounded-b-lg">
                      {caption}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {lesson.notes && (
        <div className="mb-4 p-3 bg-white rounded-lg border-l-4 border-yellow-500">
          <strong className="block mb-2 text-gray-800 text-sm">Bài học rút ra:</strong>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap break-words text-sm">{lesson.notes}</p>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
        <button
          className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 font-semibold cursor-pointer flex items-center gap-1.5"
          onClick={() => onEdit(lesson)}
        >
          <Edit className="w-4 h-4" />
          Sửa
        </button>
        <button
          className="px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-300 font-semibold cursor-pointer flex items-center gap-1.5"
          onClick={() => onDelete(lesson.id)}
        >
          <Trash2 className="w-4 h-4" />
          Xóa
        </button>
      </div>
    </div>
  )
}

function LessonListItem({ lesson, onDelete, onEdit, onImageClick }) {
  const images = lesson.images || []
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2 text-yellow-700 font-semibold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Case đáng lưu ý</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800">{lesson.title}</h3>
            {lesson.description && (
              <div className="text-gray-600 text-sm max-w-xs truncate" title={lesson.description}>
                {lesson.description}
              </div>
            )}
            {images.length > 0 && (
              <div className="text-gray-500 text-sm flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" />
                {images.length} ảnh
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-1.5 text-sm rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors font-semibold flex items-center gap-1.5"
            >
              {isExpanded ? (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Thu gọn
                </>
              ) : (
                <>
                  <ChevronRight className="w-4 h-4" />
                  Xem chi tiết
                </>
              )}
            </button>
            <button
              className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold flex items-center gap-1.5"
              onClick={() => onEdit(lesson)}
            >
              <Edit className="w-4 h-4" />
              Sửa
            </button>
            <button
              className="px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-semibold flex items-center gap-1.5"
              onClick={() => onDelete(lesson.id)}
            >
              <Trash2 className="w-4 h-4" />
              Xóa
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {images.length > 0 && (
              <div className="lg:col-span-2">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Ảnh minh họa ({images.length}):</h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((image, index) => {
                    const imageData = typeof image === 'string' ? image : (image.data || image)
                    const caption = typeof image === 'object' ? image.caption : null

                    return (
                      <div key={index} className="flex-shrink-0 relative group">
                        <img
                          src={imageData}
                          alt={caption || `Image ${index + 1}`}
                          className="w-48 h-48 object-cover rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => onImageClick(imageData, caption)}
                        />
                        {caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-2 rounded-b-lg">
                            {caption}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {lesson.notes && (
              <div className={images.length > 0 ? 'lg:col-span-1' : 'lg:col-span-3'}>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Bài học rút ra:</h3>
                <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-yellow-500">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap break-words text-sm">
                    {lesson.notes}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default TradeList
