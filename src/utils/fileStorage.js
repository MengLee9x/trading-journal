// File storage utilities using File System Access API
// Falls back to download/upload if API is not supported

let fileHandle = null

// Check if File System Access API is supported
export const isFileSystemSupported = () => {
  return 'showSaveFilePicker' in window && 'showOpenFilePicker' in window
}

// Save trades to file on local PC
export const saveTradesToFile = async (trades) => {
  try {
    if (isFileSystemSupported()) {
      // Use File System Access API (Chrome/Edge)
      if (!fileHandle) {
        fileHandle = await window.showSaveFilePicker({
          suggestedName: `trade-journal-${new Date().toISOString().split('T')[0]}.json`,
          types: [{
            description: 'JSON files',
            accept: { 'application/json': ['.json'] }
          }]
        })
      }

      const writable = await fileHandle.createWritable()
      await writable.write(JSON.stringify(trades, null, 2))
      await writable.close()

      return { success: true, message: 'Đã lưu vào file trên máy tính' }
    } else {
      // Fallback: Download file
      const dataStr = JSON.stringify(trades, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `trade-journal-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      return { success: true, message: 'Đã tải file về máy tính' }
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      return { success: false, message: 'Đã hủy lưu file' }
    }
    console.error('Error saving file:', error)
    return { success: false, message: 'Lỗi khi lưu file: ' + error.message }
  }
}

// Load trades from file on local PC
export const loadTradesFromFile = async () => {
  try {
    if (isFileSystemSupported()) {
      // Use File System Access API
      const [handle] = await window.showOpenFilePicker({
        types: [{
          description: 'JSON files',
          accept: { 'application/json': ['.json'] }
        }]
      })

      fileHandle = handle
      const file = await handle.getFile()
      const text = await file.text()
      const trades = JSON.parse(text)

      return { success: true, data: trades, message: 'Đã tải file từ máy tính' }
    } else {
      // Fallback: Use file input
      return new Promise((resolve) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.json'
        input.onchange = async (e) => {
          const file = e.target.files[0]
          if (file) {
            try {
              const text = await file.text()
              const trades = JSON.parse(text)
              resolve({ success: true, data: trades, message: 'Đã tải file từ máy tính' })
            } catch (error) {
              resolve({ success: false, message: 'Lỗi khi đọc file: ' + error.message })
            }
          } else {
            resolve({ success: false, message: 'Không có file được chọn' })
          }
        }
        input.click()
      })
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      return { success: false, message: 'Đã hủy mở file' }
    }
    console.error('Error loading file:', error)
    return { success: false, message: 'Lỗi khi mở file: ' + error.message }
  }
}

// Auto-save to file (if fileHandle exists)
export const autoSaveToFile = async (trades) => {
  if (fileHandle && isFileSystemSupported()) {
    try {
      const writable = await fileHandle.createWritable()
      await writable.write(JSON.stringify(trades, null, 2))
      await writable.close()
      return true
    } catch (error) {
      console.error('Error auto-saving:', error)
      return false
    }
  }
  return false
}
