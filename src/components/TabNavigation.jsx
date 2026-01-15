import { BookOpen } from 'lucide-react'

const tabs = [
  { id: 'trades', label: 'Trades', activeClass: 'border-indigo-600 text-indigo-600' },
  { id: 'lessons', label: 'Cases đáng lưu ý', activeClass: 'border-yellow-600 text-yellow-600' },
  { id: 'rules', label: 'Quy tắc', activeClass: 'border-blue-600 text-blue-600', icon: BookOpen }
]

function TabNavigation({ activeTab, onTabChange, onCloseForms }) {
  const handleTabClick = (tabId) => {
    onTabChange(tabId)
    onCloseForms()
  }

  return (
    <div className="mb-6 border-b-2 border-gray-200">
      <div className="flex gap-2">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`px-6 py-3 font-semibold transition-all duration-300 border-b-2 flex items-center gap-2 ${
                isActive
                  ? tab.activeClass
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
              }`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TabNavigation

