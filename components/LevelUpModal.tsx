
import React from 'react';
import { Star, CheckCircle, X } from 'lucide-react';

interface LevelUpModalProps {
  level: number;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, onClose }) => {
  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.3)] p-6 text-center animate-pop-in">
        
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
           <div className="relative">
              <Star className="w-20 h-20 text-amber-400 fill-amber-400 animate-spin-slow drop-shadow-lg" />
              <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-amber-900">
                 {level}
              </div>
           </div>
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="text-3xl font-black text-white uppercase tracking-wide">Level Up!</h2>
          <p className="text-slate-300">Your kingdom grows stronger.</p>
          
          <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-700 space-y-2">
             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Max Energy</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">+5 <CheckCircle className="w-3 h-3"/></span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Gem Reward</span>
                <span className="text-fuchsia-400 font-bold flex items-center gap-1">+2 <CheckCircle className="w-3 h-3"/></span>
             </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full btn-3d bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl shadow-lg border-b-emerald-800 mt-4"
          >
            AWESOME!
          </button>
        </div>
      </div>
    </div>
  );
};
