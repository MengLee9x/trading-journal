import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

function RuleForm({ onSubmit, onCancel, initialData }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('entry') // entry, exit, risk, general
    const [priority, setPriority] = useState('medium') // high, medium, low
    const [isActive, setIsActive] = useState(true)

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '')
            setDescription(initialData.description || '')
            setCategory(initialData.category || 'entry')
            setPriority(initialData.priority || 'medium')
            setIsActive(initialData.isActive !== undefined ? initialData.isActive : true)
        }
    }, [initialData])

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!title.trim()) {
            alert('Vui lòng nhập tiêu đề cho quy tắc này')
            return
        }

        onSubmit({
            type: 'rule',
            title: title.trim(),
            description: description.trim(),
            category,
            priority,
            isActive
        })

        // Reset form
        setTitle('')
        setDescription('')
        setCategory('entry')
        setPriority('medium')
        setIsActive(true)
    }

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

    return (
        <form className="bg-blue-50 p-6 rounded-lg mb-8 border-2 border-blue-200" onSubmit={handleSubmit}>
            <h2 className="mb-5 text-gray-800 text-2xl font-semibold">
                {initialData ? 'Chỉnh sửa Quy tắc' : 'Thêm Quy tắc Mới'}
            </h2>
            <p className="mb-5 text-sm text-gray-600">
                Ghi lại các quy tắc bạn cần tuân thủ khi vào lệnh để luôn nhớ và làm đúng
            </p>

            <div className="mb-5">
                <label htmlFor="title" className="block mb-2 font-semibold text-gray-700">Tiêu đề quy tắc *</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ví dụ: Chỉ vào lệnh khi có tín hiệu rõ ràng, Luôn đặt stop loss..."
                    required
                    className="w-full p-2.5 border-2 border-gray-300 rounded-lg text-base font-sans transition-colors duration-300 focus:outline-none focus:border-blue-500"
                />
            </div>

            <div className="mb-5">
                <label htmlFor="description" className="block mb-2 font-semibold text-gray-700">Mô tả chi tiết</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mô tả chi tiết quy tắc này, điều kiện áp dụng, cách thực hiện..."
                    rows="4"
                    className="w-full p-2.5 border-2 border-gray-300 rounded-lg text-base font-sans transition-colors duration-300 resize-y min-h-[100px] focus:outline-none focus:border-blue-500"
                />
            </div>

            <div className="mb-5">
                <label className="block mb-2 font-semibold text-gray-700">Loại quy tắc</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(categoryLabels).map(([value, label]) => (
                        <label
                            key={value}
                            className={`flex items-center justify-center gap-2 cursor-pointer p-3 border-2 rounded-lg transition-all duration-300 ${category === value
                                ? 'border-blue-500 bg-blue-100'
                                : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                                }`}
                        >
                            <input
                                type="radio"
                                value={value}
                                checked={category === value}
                                onChange={(e) => setCategory(e.target.value)}
                                className="cursor-pointer w-[18px] h-[18px]"
                            />
                            <span className={`text-sm ${category === value ? 'font-bold text-blue-700' : 'font-semibold text-gray-700'}`}>
                                {label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="mb-5">
                <label className="block mb-2 font-semibold text-gray-700">Mức độ ưu tiên</label>
                <div className="flex gap-3 flex-wrap">
                    {Object.entries(priorityLabels).map(([value, label]) => (
                        <label
                            key={value}
                            className={`flex items-center justify-center gap-2 cursor-pointer p-3 border-2 rounded-lg transition-all duration-300 flex-1 min-w-[120px] ${priority === value
                                ? value === 'high'
                                    ? 'border-red-500 bg-red-100'
                                    : value === 'medium'
                                        ? 'border-yellow-500 bg-yellow-100'
                                        : 'border-gray-500 bg-gray-100'
                                : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                                }`}
                        >
                            <input
                                type="radio"
                                value={value}
                                checked={priority === value}
                                onChange={(e) => setPriority(e.target.value)}
                                className="cursor-pointer w-[18px] h-[18px]"
                            />
                            <span className={`text-sm font-semibold ${priority === value
                                ? value === 'high'
                                    ? 'text-red-700 font-bold'
                                    : value === 'medium'
                                        ? 'text-yellow-700 font-bold'
                                        : 'text-gray-700 font-bold'
                                : 'text-gray-700'
                                }`}>
                                {label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="mb-5">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="cursor-pointer w-5 h-5"
                    />
                    <span className="font-semibold text-gray-700">Quy tắc đang hoạt động</span>
                </label>
                <p className="mt-1 text-sm text-gray-500 ml-8">
                    Bỏ chọn nếu quy tắc này tạm thời không áp dụng
                </p>
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
                    className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 font-semibold cursor-pointer"
                >
                    Lưu Quy tắc
                </button>
            </div>
        </form>
    )
}

export default RuleForm

