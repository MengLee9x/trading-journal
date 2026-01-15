import { Download, Upload } from 'lucide-react'

function FileOperations({ onImport, onExport }) {
  return (
    <div className="mb-4 flex gap-2 justify-end">
      <button
        onClick={onImport}
        className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 font-semibold flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Import từ File
      </button>
      <button
        onClick={onExport}
        className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors duration-300 font-semibold flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        Export ra File
      </button>
    </div>
  )
}

export default FileOperations

