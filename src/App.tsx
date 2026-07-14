/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useAppStore } from './store';
import { SetupTab } from './components/SetupTab';
import { CollectionTab } from './components/CollectionTab';
import { SummaryTab } from './components/SummaryTab';
import { HistoryTab } from './components/HistoryTab';
import { DashboardTab } from './components/DashboardTab';
import { ScienceTab } from './components/ScienceTab';
import { Activity, ClipboardList, Settings, List, LayoutDashboard, BookOpen } from 'lucide-react';
import { cn } from './utils';

export default function App() {
  const { activeTab, setActiveTab, currentBatch } = useAppStore();

  const tabs = [
    { id: 'setup', label: 'Setup', icon: Settings, disabled: false },
    { id: 'collection', label: 'Coleta', icon: Activity, disabled: false },
    { id: 'summary', label: 'Resumo', icon: ClipboardList, disabled: false },
    { id: 'history', label: 'Histórico', icon: List, disabled: false },
    { id: 'dashboard', label: 'Painel', icon: LayoutDashboard, disabled: false },
    { id: 'science', label: 'Ciência', icon: BookOpen, disabled: false },
  ] as const;

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-950 text-slate-50 font-sans">
      {/* Navigation Bar */}
      <nav className="bg-slate-900 border-b border-slate-800 shrink-0 p-2 sm:px-4 z-10">
        <div className="max-w-7xl mx-auto flex">
          <div className="flex w-full sm:w-auto gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                disabled={tab.disabled}
                onClick={() => setActiveTab(tab.id as 'setup' | 'collection' | 'summary' | 'history' | 'dashboard' | 'science')}
                className={cn(
                  'flex items-center justify-center min-w-max flex-1 sm:flex-none py-2 px-4 gap-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap uppercase tracking-wider',
                  activeTab === tab.id
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/20'
                    : 'text-slate-400 hover:bg-slate-900',
                  tab.disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent'
                )}
              >
                <tab.icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 max-w-7xl w-full mx-auto bg-slate-950 flex flex-col">
          {activeTab === 'setup' && <SetupTab />}
          {activeTab === 'collection' && <CollectionTab />}
          {activeTab === 'summary' && <SummaryTab />}
          {activeTab === 'history' && <HistoryTab />}
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'science' && <ScienceTab />}
        </div>
      </main>
    </div>
  );
}

