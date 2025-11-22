
import React from 'react';
import { X, Volume2, RefreshCw, Github, Info } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
        
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
           <h2 className="text-lg font-bold text-white">Settings</h2>
           <button onClick={onClose}><X className="w-5 h-5 text-slate-400" /></button>
        </div>

        <div className="p-4 space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-xl">
                <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-indigo-400" />
                    <span className="text-white font-bold text-sm">Sound Effects</span>
                </div>
                <div className="flex items-center gap-2">
                     <span className="text-emerald-400 text-xs font-bold">ON</span>
                </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-xl opacity-50">
                <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-red-400" />
                    <span className="text-white font-bold text-sm">Reset Game</span>
                </div>
            </div>
            
            <div className="mt-4 p-4 text-center">
                <p className="text-xs text-slate-500">Royal Merge Kingdom v1.2.0</p>
                <p className="text-[10px] text-slate-600 mt-1">Created with Google GenAI</p>
            </div>
        </div>
      </div>
    </div>
  );
};
