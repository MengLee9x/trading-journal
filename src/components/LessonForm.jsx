import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

function LessonForm({ onSubmit, onCancel, initialData }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState([])
  const [notes, setNotes] = useState('')
  const [draggedIndex, setDraggedIndex] = useState(null)

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '')
      setDescription(initialData.description || '')
      setNotes(initialData.notes || '')
      const existingImages = initialData.images || []
      setImages(existingImages.map((img, index) => {
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

    const validFiles = []
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        alert(`File "${file.name}" không phải là ảnh. Vui lòng chọn file ảnh.`)
        continue
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`File "${file.name}" quá lớn. Kích thước tối đa là 5MB.`)
        continue
      }

      validFiles.push(file)
    }

    const readers = validFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          resolve({
            name: file.name,
            data: reader.result
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

    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề cho case này')
      return
    }

    onSubmit({
      type: 'lesson',
      title: title.trim(),
      description: description.trim(),
      images: images.map(img => ({
        data: img.data,
        caption: img.caption || ''
      })),
      notes: notes.trim()
    })

    // Reset form
    setTitle('')
    setDescription('')
    setImages([])
    setNotes('')
  }

  return (
    <form className="bg-yellow-50 p-6 rounded-lg mb-8 border-2 border-yellow-200" onSubmit={handleSubmit}>
      <h2 className="mb-5 text-gray-800 text-2xl font-semibold">
        {initialData ? 'Chỉnh sửa Case đáng lưu ý' : 'Thêm Case đáng lưu ý'}
      </h2>
      <p className="mb-5 text-sm text-gray-600">
        Ghi lại các tình huống cần cân nhắc để tránh vào lệnh ẩu
      </p>

      <div className="mb-5">
        <label htmlFor="title" className="block mb-2 font-semibold text-gray-700">Tiêu đề *</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ví dụ: Tránh vào lệnh khi market đang sideway, Tránh FOMO khi giá tăng mạnh..."
          required
          className="w-full p-2.5 border-2 border-gray-300 rounded-lg text-base font-sans transition-colors duration-300 focus:outline-none focus:border-yellow-500"
        />
      </div>

      <div className="mb-5">
        <label htmlFor="description" className="block mb-2 font-semibold text-gray-700">Mô tả tình huống</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả chi tiết tình huống này..."
          className="w-full p-2.5 border-2 border-gray-300 rounded-lg text-base font-sans transition-colors duration-300 focus:outline-none focus:border-yellow-500"
        />
      </div>

      <div className="mb-5">
        <label htmlFor="images" className="block mb-2 font-semibold text-gray-700">Ảnh minh họa (có thể chọn nhiều ảnh)</label>
        <input
          type="file"
          id="images"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="w-full p-2.5 border-2 border-gray-300 rounded-lg text-base font-sans transition-colors duration-300 focus:outline-none focus:border-yellow-500"
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
                      ? 'border-yellow-500 bg-yellow-100 opacity-50'
                      : 'border-gray-200 bg-white hover:border-yellow-300'
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
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-yellow-500"
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
        <label htmlFor="notes" className="block mb-2 font-semibold text-gray-700">Ghi chú / Bài học rút ra</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ghi lại bài học rút ra từ case này, tại sao cần tránh, cách nhận biết..."
          rows="5"
          className="w-full p-2.5 border-2 border-gray-300 rounded-lg text-base font-sans transition-colors duration-300 resize-y min-h-[100px] focus:outline-none focus:border-yellow-500"
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
          className="px-6 py-3 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 transition-all duration-300 font-semibold cursor-pointer"
        >
          Lưu Case
        </button>
      </div>
    </form>
  )
}

export default LessonForm
