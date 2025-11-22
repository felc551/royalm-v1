
import React from 'react';
import { X, Trophy, Lock, CheckCircle } from 'lucide-react';
import { Achievement } from '../types';

interface AchievementsModalProps {
  achievements: Achievement[];
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ achievements, onClose }) => {
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-amber-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">

        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
          <div className="flex items-center gap-2">
             <div className="p-2 bg-amber-500/20 rounded-lg border border-amber-500/30">
                <Trophy className="w-5 h-5 text-amber-400" />
             </div>
             <div>
                 <h2 className="text-xl font-black text-white uppercase tracking-wide">Achievements</h2>
                 <p className="text-xs text-slate-400 font-bold">{unlockedCount} / {achievements.length} Unlocked</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3">
           {achievements.map((achievement) => (
             <div
               key={achievement.id}
               className={`
                 p-4 rounded-xl border-2 transition-all
                 ${achievement.unlocked
                   ? 'bg-amber-900/20 border-amber-500/50 shadow-lg shadow-amber-900/20'
                   : 'bg-slate-800/50 border-slate-700/30 grayscale opacity-60'}
               `}
             >
                <div className="flex items-center gap-3">
                    <div className={`text-4xl ${achievement.unlocked ? 'animate-bounce' : ''}`}>
                        {achievement.unlocked ? achievement.icon : '🔒'}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-white font-bold text-sm flex items-center gap-2">
                            {achievement.title}
                            {achievement.unlocked && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                        </h3>
                        <p className="text-slate-400 text-xs mt-1">{achievement.description}</p>
                    </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
