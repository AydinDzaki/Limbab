import { Plus, ArrowDownCircle, ArrowUpCircle, ArrowLeftRight } from 'lucide-react';

interface QuickActionsProps {
  onAction: (type: 'income' | 'expense') => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <div>
      <h2 className="text-sm font-medium text-gray-600 mb-3">Quick Actions</h2>
      <div className="grid grid-cols-4 gap-3">
        <button 
          onClick={() => onAction('income')}
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all active:scale-95"
        >
          <div className="p-3 bg-green-100 rounded-xl">
            <ArrowDownCircle className="size-6 text-green-600" />
          </div>
          <span className="text-xs text-gray-700">Income</span>
        </button>

        <button 
          onClick={() => onAction('expense')}
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all active:scale-95"
        >
          <div className="p-3 bg-red-100 rounded-xl">
            <ArrowUpCircle className="size-6 text-red-600" />
          </div>
          <span className="text-xs text-gray-700">Expense</span>
        </button>

        <button className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all active:scale-95">
          <div className="p-3 bg-blue-100 rounded-xl">
            <ArrowLeftRight className="size-6 text-blue-600" />
          </div>
          <span className="text-xs text-gray-700">Transfer</span>
        </button>

        <button className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all active:scale-95">
          <div className="p-3 bg-purple-100 rounded-xl">
            <Plus className="size-6 text-purple-600" />
          </div>
          <span className="text-xs text-gray-700">More</span>
        </button>
      </div>
    </div>
  );
}
