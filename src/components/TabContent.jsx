import { AlertTriangle, Plus } from 'lucide-react'
import LessonForm from './LessonForm'
import RuleForm from './RuleForm'
import RuleList from './RuleList'
import TradeForm from './TradeForm'
import TradeList from './TradeList'

/**
 * Component to render content for Trades tab
 */
export const TradesTabContent = ({
  trades,
  showForm,
  editingTrade,
  onAddClick,
  onAdd,
  onCancel,
  onDelete,
  onEdit
}) => {
  return (
    <>
      {!showForm ? (
        <div className="mb-8">
          <button
            className="w-full p-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            onClick={onAddClick}
          >
            <Plus className="w-5 h-5" />
            Thêm Trade Mới
          </button>
        </div>
      ) : (
        <TradeForm
          onSubmit={onAdd}
          onCancel={onCancel}
          initialData={editingTrade}
        />
      )}
      <TradeList
        trades={trades}
        lessons={[]}
        onDelete={onDelete}
        onDeleteLesson={() => { }}
        onEdit={onEdit}
        onEditLesson={() => { }}
      />
    </>
  )
}

/**
 * Component to render content for Lessons tab
 */
export const LessonsTabContent = ({
  lessons,
  showForm,
  editingLesson,
  onAddClick,
  onAdd,
  onCancel,
  onDelete,
  onEdit
}) => {
  return (
    <>
      {!showForm ? (
        <div className="mb-8">
          <button
            className="w-full p-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            onClick={onAddClick}
          >
            <AlertTriangle className="w-5 h-5" />
            Thêm Case đáng lưu ý
          </button>
        </div>
      ) : (
        <LessonForm
          onSubmit={onAdd}
          onCancel={onCancel}
          initialData={editingLesson}
        />
      )}
      <TradeList
        trades={[]}
        lessons={lessons}
        onDelete={() => { }}
        onDeleteLesson={onDelete}
        onEdit={() => { }}
        onEditLesson={onEdit}
      />
    </>
  )
}

/**
 * Component to render content for Rules tab
 */
export const RulesTabContent = ({
  rules,
  showForm,
  editingRule,
  onAddClick,
  onAdd,
  onCancel,
  onDelete,
  onEdit
}) => {
  return (
    <>
      {!showForm ? (
        <div className="mb-8">
          <button
            className="w-full p-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            onClick={onAddClick}
          >
            <Plus className="w-5 h-5" />
            Thêm Quy tắc Mới
          </button>
        </div>
      ) : (
        <RuleForm
          onSubmit={onAdd}
          onCancel={onCancel}
          initialData={editingRule}
        />
      )}
      <RuleList
        rules={rules}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    </>
  )
}


