import { format } from 'date-fns'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

function TradeForm({ onSubmit, onCancel, initialData }) {
  const [orderType, setOrderType] = useState('buy')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [currencyPair, setCurrencyPair] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState([])
  const [notes, setNotes] = useState('')
  const [draggedIndex, setDraggedIndex] = useState(null)

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setOrderType(initialData.orderType || 'buy')
      setDate(initialData.date || format(new Date(), 'yyyy-MM-dd'))
      setCurrencyPair(initialData.currencyPair || '')
      setDescription(initialData.description || '')
      setNotes(initialData.notes || '')
      // Convert existing images to the format expected by the form
      const existingImages = initialData.images || (initialData.image ? [initialData.image] : [])
      setImages(existingImages.map((img, index) => {
        // Support both old format (string) and new format (object)
        if (typeof img === 'string') {
          return {
            name: `Image ${index + 1}`,
            data: img,
            caption: ''
          }
        }
        return {
          name: img.name || `Image ${index + 1}`,
          data: img.data || img,
          caption: img.caption || ''
        }
      }))
    }
  }, [initialData])

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)

    if (files.length === 0) return

    // Validate all files
    const validFiles = []
    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`File "${file.name}" không phải là ảnh. Vui lòng chọn file ảnh.`)
        continue
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File "${file.name}" quá lớn. Kích thước tối đa là 5MB.`)
        continue
      }

      validFiles.push(file)
    }

    // Read all valid files
    const readers = validFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          resolve({
            name: file.name,
            data: reader.result // base64
          })
        }
        reader.readAsDataURL(file)
      })
    })

    Promise.all(readers).then(newImages => {
      setImages([...images, ...newImages.map(img => ({ ...img, caption: '' }))])
    })
  }

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleUpdateCaption = (index, caption) => {
    const updatedImages = [...images]
    updatedImages[index] = { ...updatedImages[index], caption }
    setImages(updatedImages)
  }

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      return
    }

    const newImages = [...images]
    const draggedItem = newImages[draggedIndex]
    newImages.splice(draggedIndex, 1)
    newImages.splice(dropIndex, 0, draggedItem)
    setImages(newImages)
    setDraggedIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!date) {
      alert('Vui lòng chọn ngày')
      return
    }

    onSubmit({
      orderType,
      date,
      currencyPair: currencyPair.trim(),
      description: description.trim(),
      images: images.map(img => ({
        data: img.data,
        caption: img.caption || ''
      })),
      notes: notes.trim()
    })

    // Reset form
    setOrderType('buy')
    setDate(format(new Date(), 'yyyy-MM-dd'))
    setCurrencyPair('')
    setDescription('')
    setImages([])
    setNotes('')
  }

  return (
    <form className="bg-gray-50 p-6 rounded-lg mb-8" onSubmit={handleSubmit}>
      <h2 className="mb-5 text-gray-800 text-2xl font-semibold">
        {initialData ? 'Chỉnh sửa Trade' : 'Thêm Trade Mới'}
      </h2>

      <div className="mb-5">
        <label className="block mb-2 font-semibold text-gray-700">Loại lệnh *</label>
        <div className="flex gap-5 flex-wrap md:flex-row flex-col">
          <label className="flex items-center justify-center gap-2 cursor-pointer p-3 border-2 border-gray-300 rounded-lg transition-all duration-300 flex-1 min-w-[150px] hover:border-indigo-500 hover:bg-indigo-50">
            <input
              type="radio"
              value="buy"
              checked={orderType === 'buy'}
              onChange={(e) => setOrderType(e.target.value)}
              className="cursor-pointer w-[18px] h-[18px]"
            />
            <span className={`text-green-600 ${orderType === 'buy' ? 'font-bold' : 'font-semibold'}`}>Mua (Buy)</span>
          </label>
          <label className="flex items-center justify-center gap-2 cursor-pointer p-3 border-2 border-gray-300 rounded-lg transition-all duration-300 flex-1 min-w-[150px] hover:border-indigo-500 hover:bg-indigo-50">
            <input
              type="radio"
              value="sell"
              checked={orderType === 'sell'}
              onChange={(e) => setOrderType(e.target.value)}
              className="cursor-pointer w-[18px] h-[18px]"
            />
            <span className={`text-red-600 ${orderType === 'sell' ? 'font-bold' : 'font-semibold'}`}>Bán (Sell)</span>
          </label>
        </div>
      </div>

      <div className="mb-5">
        <label htmlFor="date" className="block mb-2 font-semibold text-gray-700">Ngày thực hiện *</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full p-2.5 border-2 border-gray-300 rounded-lg text-base font-sans transition-colors duration-300 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="mb-5">
        <label htmlFor="currencyPair" className="block mb-2 font-semibold text-gray-700">Cặp tiền</label>
        <input
          type="text"
          id="currencyPair"
          value={currencyPair}
          onChange={(e) => setCurrencyPair(e.target.value)}
          placeholder="Ví dụ: EUR/USD, GBP/USD, BTC/USD..."
          className="w-full p-2.5 border-2 border-gray-300 rounded-lg text-base font-sans transition-colors duration-300 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="mb-5">
        <label htmlFor="description" className="block mb-2 font-semibold text-gray-700">Mô tả cách đánh</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ví dụ: Đánh momentum theo lệnh buy, Đánh mô hình 2 đỉnh phá xuống thất bại..."
          className="w-full p-2.5 border-2 border-gray-300 rounded-lg text-base font-sans transition-colors duration-300 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="mb-5">
        <label htmlFor="images" className="block mb-2 font-semibold text-gray-700">Ảnh market di chuyển (có thể chọn nhiều ảnh)</label>
        <input
          type="file"
          id="images"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="w-full p-2.5 border-2 border-gray-300 rounded-lg text-base font-sans transition-colors duration-300 focus:outline-none focus:border-indigo-500"
        />
        {images.length > 0 && (
          <div className="mt-4">
            <p className="mb-3 text-sm text-gray-600">Đã chọn {images.length} ảnh (kéo thả để sắp xếp lại):</p>
            <div className="space-y-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`relative group border-2 rounded-lg p-3 transition-all ${
                    draggedIndex === index
                      ? 'border-indigo-500 bg-indigo-50 opacity-50'
                      : 'border-gray-200 bg-white hover:border-indigo-300'
                  } cursor-move`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 relative">
                      <img
                        src={image.data}
                        alt={`Preview ${index + 1}`}
                        className="w-32 h-32 object-cover rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                        title="Xóa ảnh"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Chú thích cho ảnh {index + 1}:
                      </label>
                      <input
                        type="text"
                        value={image.caption || ''}
                        onChange={(e) => handleUpdateCaption(index, e.target.value)}
                        placeholder="Nhập chú thích cho ảnh này..."
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                      />
                      <p className="mt-1 text-xs text-gray-500 truncate" title={image.name}>
                        {image.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mb-5">
        <label htmlFor="notes" className="block mb-2 font-semibold text-gray-700">Lý do vào lệnh / Ghi chú</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ghi lại lý do tại sao bạn vào lệnh này, phân tích market, cảm nhận..."
          rows="5"
          className="w-full p-2.5 border-2 border-gray-300 rounded-lg text-base font-sans transition-colors duration-300 resize-y min-h-[100px] focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="flex gap-2.5 justify-end mt-6">
        <button
          type="button"
          className="px-6 py-3 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-all duration-300 font-semibold cursor-pointer"
          onClick={onCancel}
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all duration-300 font-semibold cursor-pointer"
        >
          Lưu Trade
        </button>
      </div>
    </form>
  )
}

export default TradeForm
