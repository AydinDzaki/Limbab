import { useState } from "react";
import { TransactionEntry } from "./TransactionEntry";
import { TransactionHistory } from "./TransactionHistory";
import { Button } from "./ui/button";
import { List, Plus } from "lucide-react";

interface TransaksiProps {
  onNavigate: (page: string) => void;
}

export function Transaksi({ onNavigate }: TransaksiProps) {
  const [view, setView] = useState<'entry' | 'history'>('entry');

  return (
    <div className="flex-1 flex flex-col bg-transparent">
      {/* Top segmented control */}
      <div className="p-4">
        <div className="mx-auto max-w-md bg-card/50 p-1 rounded-full flex items-center gap-1">
          <button
            aria-pressed={view === 'entry'}
            onClick={() => setView('entry')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition ${
              view === 'entry' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Catat</span>
          </button>

          <button
            aria-pressed={view === 'history'}
            onClick={() => setView('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition ${
              view === 'history' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            <List className="h-4 w-4" />
            <span>Riwayat</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {view === 'entry' ? (
          <TransactionEntry onNavigate={onNavigate} />
        ) : (
          <TransactionHistory onNavigate={onNavigate} />
        )}
      </div>
    </div>
  );
}
